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
  const res = await fetch(`${url}/rest/v1/users?select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  const data = await res.json();
  console.log('Users in Supabase:', data.map(u => ({ id: u.id, email: u.email, role: u.role, restId: u.restaurant_id })));
}
run().catch(console.error);
