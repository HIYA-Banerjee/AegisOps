const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = (match[2] || '').trim();
      env[match[1]] = value;
    }
  });
  return env;
}

const env = loadEnv();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const testEmail = `test_${Date.now()}@aegisops.io`;
  const testPassword = 'TestPassword123!';

  console.log('\n--- Attempting Signup ---');
  console.log('Email:', testEmail);
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: { data: { name: 'TestUser', role: 'developer' } }
  });

  if (signupError) {
    console.error('❌ Signup Error:', signupError.message);
    console.error('   Status:', signupError.status);
    return;
  }

  const needsEmail = !signupData.session;
  if (needsEmail) {
    console.log('⚠️  Signup succeeded but needs email confirmation.');
    console.log('   Go to Supabase Dashboard → Authentication → Providers → Email → disable "Confirm email"');
    return;
  }

  console.log('✅ Signup successful! User ID:', signupData.user?.id);

  console.log('\n--- Attempting Login with same credentials ---');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (loginError) {
    console.error('❌ Login Error:', loginError.message);
    console.error('   Status:', loginError.status);
  } else {
    console.log('✅ Login Successful! Session user:', loginData.session?.user?.email);
  }

  console.log('\n--- Checking if "users" table exists (migration check) ---');
  const { data: usersData, error: usersError } = await supabase.from('users').select('*').limit(1);
  if (usersError) {
    console.error('❌ "users" table error:', usersError.message);
    console.error('   This means the SQL migrations have NOT been run in Supabase!');
    console.error('   Go to Supabase Dashboard → SQL Editor → paste contents of supabase/migrations/*.sql');
  } else {
    console.log('✅ "users" table exists. Data:', usersData);
  }
}

run().catch(console.error);
