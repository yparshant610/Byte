import { Injectable, Logger } from '@nestjs/common';
import { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface PresignedUploadResult {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
  bucket: string;
  region: string;
}

export interface VerifyUploadResult {
  verified: boolean;
  fileKey: string;
  publicUrl: string;
  size?: number;
  contentType?: string;
  message: string;
}

@Injectable()
export class S3StorageService {
  private readonly logger = new Logger(S3StorageService.name);
  private s3Client: S3Client | null = null;
  private bucket: string;
  private region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.bucket = process.env.AWS_S3_BUCKET || 'food-byte';

    const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.SECRET_ACCESS_KEY;

    if (accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.logger.log(`Initialized AWS S3 Client for bucket "${this.bucket}" in region "${this.region}"`);
    } else {
      this.logger.warn('AWS S3 credentials not fully provided. Falling back to local storage simulation.');
    }
  }

  /**
   * Resolves an S3 raw URL or key into an authenticated presigned GET URL (7 days validity)
   */
  async resolveViewUrl(rawUrlOrKey: string): Promise<string> {
    if (!rawUrlOrKey) return rawUrlOrKey;

    let fileKey = rawUrlOrKey;
    if (rawUrlOrKey.includes('.amazonaws.com/')) {
      fileKey = rawUrlOrKey.split('.amazonaws.com/')[1];
    } else if (rawUrlOrKey.startsWith('http://') || rawUrlOrKey.startsWith('https://')) {
      return rawUrlOrKey;
    }

    if (!this.s3Client) {
      return rawUrlOrKey;
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      });
      return await getSignedUrl(this.s3Client, command, { expiresIn: 604800 });
    } catch (err: any) {
      this.logger.warn(`Could not sign S3 view URL for ${fileKey}: ${err.message}`);
      return rawUrlOrKey;
    }
  }

  /**
   * Step 1: Generate a presigned S3 PUT URL for uploading dish media
   */
  async generatePresignedUploadUrl(
    restaurantId: string,
    fileName: string,
    contentType: string,
  ): Promise<PresignedUploadResult> {
    const sanitizedFileName = (fileName || 'dish-image.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileKey = `restaurants/${restaurantId}/dishes/${Date.now()}-${sanitizedFileName}`;
    const publicUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileKey}`;

    if (this.s3Client) {
      try {
        const command = new PutObjectCommand({
          Bucket: this.bucket,
          Key: fileKey,
          ContentType: contentType || 'image/jpeg',
        });

        // 5-minute validity window
        const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 300 });

        return {
          uploadUrl,
          fileKey,
          publicUrl,
          bucket: this.bucket,
          region: this.region,
        };
      } catch (err: any) {
        this.logger.error(`Error generating S3 presigned URL: ${err.message}`);
      }
    }

    // Fallback URL if S3 client unavailable
    return {
      uploadUrl: publicUrl,
      fileKey,
      publicUrl,
      bucket: this.bucket,
      region: this.region,
    };
  }

  /**
   * Step 2 & 3: Verify that the uploaded object exists on AWS S3
   */
  async verifyUpload(
    restaurantId: string,
    fileKey: string,
  ): Promise<VerifyUploadResult> {
    const publicUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileKey}`;

    if (!this.s3Client) {
      return {
        verified: false,
        fileKey,
        publicUrl,
        message: 'AWS S3 credentials not configured on backend.',
      };
    }

    try {
      const headCommand = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
      });

      const response = await this.s3Client.send(headCommand);

      // Generate 7-day presigned GET URL for immediate viewing in browser
      let viewUrl = publicUrl;
      try {
        const getCmd = new GetObjectCommand({
          Bucket: this.bucket,
          Key: fileKey,
        });
        viewUrl = await getSignedUrl(this.s3Client, getCmd, { expiresIn: 604800 });
      } catch {}

      return {
        verified: true,
        fileKey,
        publicUrl: viewUrl,
        size: response.ContentLength,
        contentType: response.ContentType,
        message: 'Object verified successfully on AWS S3 bucket.',
      };
    } catch (err: any) {
      this.logger.warn(`S3 HeadObject verification note for ${fileKey}: ${err.message}`);
      const isAccessDenied = err.name === 'AccessDenied' || err.$metadata?.httpStatusCode === 403;
      const isNotFound = err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404;

      return {
        verified: false,
        fileKey,
        publicUrl,
        message: isAccessDenied
          ? `AWS S3 AccessDenied: IAM user deployement_user is not authorized for S3 actions on bucket "${this.bucket}". Please attach the "AmazonS3FullAccess" policy to user "deployement_user" in AWS IAM Console.`
          : isNotFound
            ? `Object not found on AWS S3 bucket "${this.bucket}". The file upload was not completed or failed.`
            : `AWS S3 verification error: ${err.message}`,
      };
    }
  }

  /**
   * Direct server-side upload to S3 (bypasses browser CORS)
   */
  async uploadDirectBuffer(
    restaurantId: string,
    fileName: string,
    contentType: string,
    buffer: Buffer,
  ): Promise<{ success: boolean; fileKey: string; publicUrl: string; message: string }> {
    const sanitizedFileName = (fileName || 'dish-image.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileKey = `restaurants/${restaurantId}/dishes/${Date.now()}-${sanitizedFileName}`;
    const publicUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileKey}`;

    if (!this.s3Client) {
      return {
        success: false,
        fileKey,
        publicUrl,
        message: 'AWS S3 credentials not configured on server.',
      };
    }

    try {
      await this.s3Client.send(new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
        Body: buffer,
        ContentType: contentType || 'image/jpeg',
      }));

      return {
        success: true,
        fileKey,
        publicUrl,
        message: 'Uploaded directly to S3 bucket.',
      };
    } catch (err: any) {
      this.logger.error(`Direct S3 upload failed for ${fileKey}: ${err.message}`);
      return {
        success: false,
        fileKey,
        publicUrl,
        message: err.name === 'AccessDenied'
          ? `AWS S3 AccessDenied: IAM user "deployement_user" lacks s3:PutObject on bucket "${this.bucket}". Please attach AmazonS3FullAccess in AWS IAM.`
          : err.message,
      };
    }
  }
}
