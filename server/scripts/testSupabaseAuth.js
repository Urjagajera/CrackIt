import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in env");
  process.exit(1);
}

console.log(`Configuring Supabase client with URL: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTest() {
  const email = `test-user-${Date.now()}@crackit.ai`;
  const password = "Password123!";

  console.log(`\n1. Attempting sign up for ${email}...`);
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signupError) {
    console.error("❌ Sign up failed:", signupError);
  } else {
    console.log("✅ Sign up response:", signupData);
  }

  console.log(`\n2. Attempting login for ${email}...`);
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    console.error("❌ Login failed:", loginError);
  } else {
    console.log("✅ Login response:", loginData);
  }
}

runTest().catch(console.error);
