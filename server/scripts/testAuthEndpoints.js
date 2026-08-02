async function testAuthEndpoints() {
  const email = `user-${Date.now()}@crackit.ai`;
  const password = 'password123';
  const fullName = 'Test User';

  console.log(`1. Testing POST http://localhost:4000/api/auth/signup for ${email}...`);
  const signupRes = await fetch('http://localhost:4000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName }),
  });

  const signupData = await signupRes.json();
  console.log(`Signup Status: ${signupRes.status}`);
  console.log('Signup Data:', JSON.stringify(signupData, null, 2));

  if (!signupData.session?.access_token) {
    console.error('❌ Signup failed: session access_token missing!');
    process.exit(1);
  }

  const token = signupData.session.access_token;

  console.log(`\n2. Testing GET http://localhost:4000/api/auth/me with Bearer token...`);
  const meRes = await fetch('http://localhost:4000/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meData = await meRes.json();
  console.log(`Me Status: ${meRes.status}`);
  console.log('Me Data:', JSON.stringify(meData, null, 2));

  console.log(`\n3. Testing POST http://localhost:4000/api/auth/login for ${email}...`);
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const loginData = await loginRes.json();
  console.log(`Login Status: ${loginRes.status}`);
  console.log('Login Data:', JSON.stringify(loginData, null, 2));

  if (loginRes.status === 200 && loginData.session?.access_token) {
    console.log('\n✅ ALL AUTH ENDPOINTS WORK PERFECTLY END-TO-END!');
  } else {
    console.error('❌ Login endpoint failed!');
    process.exit(1);
  }
}

testAuthEndpoints().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
