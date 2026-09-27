export interface GeoPoint {
  lat: number;
  lng: number;
}

export const EARTH_RADIUS_KM = 6371;

export function haversineDistanceKm(point1: GeoPoint, point2: GeoPoint): number {
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) *
      Math.cos(toRadians(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function isWithinRadius(origin: GeoPoint, target: GeoPoint, maxRadiusKm = 10): boolean {
  return haversineDistanceKm(origin, target) <= maxRadiusKm;
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}
