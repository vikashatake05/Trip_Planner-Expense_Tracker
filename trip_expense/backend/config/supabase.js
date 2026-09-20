const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn('SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY is not configured.');
}

const supabase = createClient(
  supabaseUrl || 'https://missing.supabase.co',
  supabasePublishableKey || 'missing-key'
);

module.exports = supabase;
