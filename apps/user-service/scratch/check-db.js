const fs = require('fs');
const env = fs.readFileSync('apps/user-service/.env', 'utf-8');
const lines = env.split(/\r?\n/);
let url = '';
let key = '';
for (const line of lines) {
  if (line.startsWith('SUPABASE_URL=')) {
    url = line.split('=')[1].trim().replace(/^["']|["']$/g, '');
  }
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
    key = line.split('=')[1].trim().replace(/^["']|["']$/g, '');
  }
}

async function run() {
  const row = {
    id: 'a0000000-0000-0000-0000-000000000001',
    restaurant_id: '4fb048a4-4eb0-48da-9ee5-a8ccc6623236',
    name: 'parshant',
    description: 'specail',
    base_price: parseFloat('8000000000000000'),
    image_url: 'https://food-byte.s3.us-east-1.amazonaws.com/test.jpg'
  };
  const res = await fetch(`${url}/rest/v1/menu_items`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([row])
  });
  console.log('Status:', res.status, res.statusText);
  const text = await res.text();
  console.log('Response:', text);
}
run().catch(console.error);
