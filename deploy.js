#!/usr/bin/env node

console.log('🚀 NeoRecruiter Deployment Helper');
console.log('================================');

const deploymentSteps = [
  {
    step: 1,
    title: 'MongoDB Atlas Setup',
    url: 'https://mongodb.com/atlas',
    instructions: [
      '1. Sign up for free account',
      '2. Create M0 Sandbox cluster (FREE)',
      '3. Create database user: neorecruiter / password123',
      '4. Network Access: Add 0.0.0.0/0',
      '5. Copy connection string'
    ]
  },
  {
    step: 2,
    title: 'Gmail App Password',
    url: 'https://myaccount.google.com/security',
    instructions: [
      '1. Enable 2-Step Verification',
      '2. Go to App passwords',
      '3. Generate password for "Mail"',
      '4. Copy 16-character password'
    ]
  },
  {
    step: 3,
    title: 'Gemini API Key',
    url: 'https://ai.google.dev',
    instructions: [
      '1. Sign in with Google account',
      '2. Create new API key',
      '3. Copy API key'
    ]
  },
  {
    step: 4,
    title: 'Render Backend Deploy',
    url: 'https://render.com',
    instructions: [
      '1. Sign up with GitHub',
      '2. New Web Service',
      '3. Connect: shivamshrma09/NeoRecruiter---AI-hr',
      '4. Root Directory: Backend',
      '5. Build: npm install',
      '6. Start: npm start',
      '7. Add environment variables (see below)'
    ]
  },
  {
    step: 5,
    title: 'Vercel Frontend Update',
    url: 'https://vercel.com',
    instructions: [
      '1. Update VITE_BASE_URL to your Render backend URL',
      '2. Redeploy'
    ]
  }
];

console.log('\n📋 DEPLOYMENT CHECKLIST:');
console.log('========================');

deploymentSteps.forEach(step => {
  console.log(`\n${step.step}. ${step.title}`);
  console.log(`   URL: ${step.url}`);
  step.instructions.forEach(instruction => {
    console.log(`   ${instruction}`);
  });
});

console.log('\n🔧 ENVIRONMENT VARIABLES FOR RENDER:');
console.log('====================================');

const envVars = {
  'PORT': '10000',
  'MONGO_URI': 'mongodb+srv://neorecruiter:password123@cluster0.mongodb.net/neorecruiter',
  'JWT_SECRET': 'neorecruiter-super-secret-jwt-key-2024-production-minimum-32-characters',
  'EMAIL_USER': 'shivamsharma27107@gmail.com',
  'EMAIL_PASS': 'YOUR-16-CHAR-GMAIL-APP-PASSWORD',
  'GEMINI_API_KEY': 'YOUR-GEMINI-API-KEY',
  'NODE_ENV': 'production'
};

Object.entries(envVars).forEach(([key, value]) => {
  console.log(`${key}=${value}`);
});

console.log('\n🌐 EXPECTED URLS AFTER DEPLOYMENT:');
console.log('==================================');
console.log('Frontend: https://neo-recruiter-ai-hr.vercel.app');
console.log('Backend: https://neorecruiter-backend.onrender.com');

console.log('\n✅ TESTING CHECKLIST:');
console.log('====================');
const testSteps = [
  'Frontend loads without errors',
  'HR can register/login',
  'Interview creation works',
  'Email invitations sent',
  'Candidate can complete interview',
  'AI analysis generates scores',
  'Dashboard shows real data'
];

testSteps.forEach((test, index) => {
  console.log(`${index + 1}. ${test}`);
});

console.log('\n🎉 Total Time: ~15-20 minutes');
console.log('💰 Total Cost: $0 (All free tiers)');
console.log('\nHappy Deploying! 🚀');