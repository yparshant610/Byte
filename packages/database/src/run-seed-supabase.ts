import * as fs from 'fs';
import * as path from 'path';
import { Client } from 'pg';

async function runSeed() {
  // Read .env file for connection string
  const envPath = path.resolve(__dirname, '../../../apps/user-service/.env');
  let dbUrl = 'postgresql://postgres:admin%409460734085@db.yrifetqxupbzrqpbivlg.supabase.co:5432/postgres';

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
    if (match && match[1]) {
      dbUrl = match[1];
    }
  }

  console.log(`Connecting to Supabase database...`);
  const client = new Client({
    connectionString: dbUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();
  console.log(`Connected to Supabase successfully!`);

  const sqlPath = path.resolve(__dirname, './seed.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  console.log(`Executing seed.sql...`);
  await client.query(sql);

  console.log(`\n======================================================`);
  console.log(`✅ LIVE SUPABASE SEEDING COMPLETED SUCCESSFULLY!`);
  console.log(`======================================================`);

  // Verify counts
  const tables = ['users', 'restaurants', 'menu_categories', 'menu_items', 'menu_item_options', 'drivers'];
  for (const t of tables) {
    const res = await client.query(`SELECT COUNT(*) FROM ${t}`);
    console.log(`- Table ${t.padEnd(20)}: ${res.rows[0].count} records`);
  }

  await client.end();
}

runSeed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
