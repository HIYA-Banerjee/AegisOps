const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Basic parser for .env file
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found!');
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      env[match[1]] = value.trim();
    }
  });
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key (truncated):', supabaseAnonKey ? supabaseAnonKey.substring(0, 15) + '...' : 'undefined');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('URL or Key missing in .env!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log('\n--- Test 1: Querying "deployments" table ---');
  try {
    const { data, error } = await supabase.from('deployments').select('*').limit(1);
    if (error) {
      console.error('❌ Error:', error.message, 'Code:', error.code);
    } else {
      console.log('✅ Connection Successful! Deployments sample data:', data);
    }
  } catch (err) {
    console.error('❌ Thrown Exception:', err);
  }

  console.log('\n--- Test 2: Testing Auth API ---');
  try {
    // Attempting a mock login with incorrect credentials to see if Auth API resolves
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'nonexistent@aegisops.test',
      password: 'password123'
    });
    if (error) {
      console.log('✅ Auth API responded successfully (returned expected auth error):', error.message);
    } else {
      console.log('✅ Auth API responded successfully, logged in:', data);
    }
  } catch (err) {
    console.error('❌ Auth API failed or timed out:', err.message);
  }
}

run();
