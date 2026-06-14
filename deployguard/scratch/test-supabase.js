const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://osggxuwknftbcrslgcyl.supabase.co';
const supabaseAnonKey = 'sb_publishable_7xTWNv2WRZWYaXVWCwVSbA_AaV8qOs2';

console.log('Initializing Supabase client...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTest() {
  console.log('Calling checkConnection / select...');
  try {
    const { data, error } = await supabase.from('deployments').select('id').limit(1);
    if (error) {
      console.error('Error fetching deployments:', error);
    } else {
      console.log('Success! Data:', data);
    }
  } catch (err) {
    console.error('Thrown exception:', err);
  }
}

runTest();
