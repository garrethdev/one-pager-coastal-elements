# 🚀 AWS Deployment Guide - Coastal Elements

Complete guide para i-deploy ang buong application sa AWS.

---

## 📋 DEPLOYMENT OPTIONS

### RECOMMENDED: Easy & Scalable ⭐

**Frontend:** AWS Amplify (Auto-deploy from Git!)  
**Backend:** AWS Elastic Beanstalk (Easy Node.js hosting)  
**Database:** Supabase (Already cloud-hosted!)  

**Cost:** ~$20-30/month  
**Setup Time:** 1-2 hours  
**Difficulty:** ⭐⭐☆☆☆ (Easy)

---

### ALTERNATIVE: Manual Control

**Frontend:** S3 + CloudFront (CDN)  
**Backend:** EC2 + PM2 (Full control)  
**Database:** Supabase  

**Cost:** ~$15-25/month  
**Setup Time:** 2-4 hours  
**Difficulty:** ⭐⭐⭐☆☆ (Medium)

---

## 🎯 RECOMMENDED SETUP (Amplify + Elastic Beanstalk)

---

## PART 1: BACKEND DEPLOYMENT (Elastic Beanstalk)

### Step 1: Prepare Backend for Deployment

#### 1.1 Update CORS Configuration

Ang CORS ay **ALREADY CONFIGURED** sa backend! Check:

```typescript
// src/main.ts (line 12)
app.enableCors({
  origin: '*', // In production, specify your domain
  credentials: true,
});
```

**For Production:** Update to specific domain:

```typescript
app.enableCors({
  origin: [
    'https://your-frontend-domain.com',
    'https://www.your-frontend-domain.com',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

#### 1.2 Create Production .env

```bash
# CE-one-pager-server/.env.production
NODE_ENV=production
PORT=8080
JWT_SECRET=your-production-secret-change-this

# Supabase
SUPABASE_URL=https://nkzkcikphsyehmuyzvgm.supabase.co
SUPABASE_ANON_KEY=your_actual_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_key
```

#### 1.3 Add Elastic Beanstalk Configuration

Create: `CE-one-pager-server/.ebextensions/nodecommand.config`

```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm run start:prod"
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    PORT: 8080
```

#### 1.4 Update package.json Scripts

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:prod": "node dist/main",
    "postinstall": "npm run build"
  }
}
```

### Step 2: Deploy to Elastic Beanstalk

#### Option A: Using AWS Console (Easy)

1. **Go to AWS Elastic Beanstalk Console**
   - https://console.aws.amazon.com/elasticbeanstalk

2. **Create Application**
   - Click "Create Application"
   - Application name: `coastal-elements-api`
   - Platform: Node.js
   - Platform branch: Node.js 20
   - Upload your code: Create `.zip` file

3. **Create ZIP File**
   ```bash
   cd CE-one-pager-server
   
   # Exclude node_modules and .git
   zip -r coastal-api.zip . -x "node_modules/*" -x ".git/*" -x "dist/*"
   
   # On Windows (PowerShell):
   Compress-Archive -Path * -DestinationPath coastal-api.zip -Force
   ```

4. **Upload & Deploy**
   - Upload `coastal-api.zip`
   - Click "Create environment"
   - Wait 5-10 minutes

5. **Configure Environment Variables**
   - Go to Configuration → Software
   - Add environment variables:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `JWT_SECRET`

6. **Get Your API URL**
   - Example: `http://coastal-elements-api.us-east-1.elasticbeanstalk.com`
   - Test: `http://your-url.com/api/health`

#### Option B: Using EB CLI (Advanced)

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd CE-one-pager-server
eb init

# Create environment
eb create coastal-api-prod

# Deploy
eb deploy

# Set environment variables
eb setenv SUPABASE_URL=xxx SUPABASE_ANON_KEY=xxx JWT_SECRET=xxx

# Open in browser
eb open
```

---

## PART 2: FRONTEND DEPLOYMENT (AWS Amplify)

### Step 1: Prepare Frontend

#### 1.1 Create Production Environment Variables

Create: `one-pager-coastal-elements/.env.production`

```bash
# Replace with your actual Elastic Beanstalk URL
NEXT_PUBLIC_API_URL=https://coastal-elements-api.us-east-1.elasticbeanstalk.com/api
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_ENV=production
```

#### 1.2 Update Supabase Redirect URLs

**Go to Supabase Dashboard:**
1. Project Settings → Authentication → URL Configuration
2. **Site URL:** `https://your-amplify-domain.amplifyapp.com`
3. **Redirect URLs:** Add:
   - `https://your-amplify-domain.amplifyapp.com/**`
   - `https://your-amplify-domain.amplifyapp.com/auth/callback`
   - `https://your-amplify-domain.amplifyapp.com/dashboard`

#### 1.3 Test Build Locally

```bash
cd one-pager-coastal-elements

# Build
yarn build

# Test production build
yarn start
```

### Step 2: Deploy to AWS Amplify

#### Option A: Connect to GitHub (RECOMMENDED! Auto-deploy on push!)

1. **Push to GitHub**
   ```bash
   # Make sure your code is on GitHub
   git push origin dev
   ```

2. **Go to AWS Amplify Console**
   - https://console.aws.amazon.com/amplify

3. **Create New App**
   - Click "New app" → "Host web app"
   - Connect to GitHub
   - Select repository: `CoastalAI`
   - Branch: `dev`
   - App name: `coastal-elements`

4. **Configure Build Settings**
   
   Amplify will auto-detect Next.js. Edit `amplify.yml`:
   
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd one-pager-coastal-elements
           - yarn install
       build:
         commands:
           - yarn build
     artifacts:
       baseDirectory: one-pager-coastal-elements/.next
       files:
         - '**/*'
     cache:
       paths:
         - one-pager-coastal-elements/node_modules/**/*
   ```

5. **Add Environment Variables**
   - Go to App settings → Environment variables
   - Add:
     - `NEXT_PUBLIC_API_URL`: `https://your-backend-url.com/api`
     - `NEXT_PUBLIC_API_TIMEOUT`: `30000`
     - `NEXT_PUBLIC_ENV`: `production`

6. **Deploy!**
   - Click "Save and deploy"
   - Wait 5-10 minutes
   - Your app will be at: `https://dev.xxxxx.amplifyapp.com`

7. **Custom Domain (Optional)**
   - Go to Domain management
   - Add your domain (e.g., coastalelements.com)
   - Follow DNS instructions
   - SSL auto-configured! ✅

#### Option B: Manual Deployment

```bash
# Build
cd one-pager-coastal-elements
yarn build

# Export static (if using static export)
yarn export

# Upload to S3
aws s3 sync out/ s3://your-bucket-name/
```

---

## PART 3: CORS CONFIGURATION (IMPORTANT!)

### Backend CORS Update

After deployment, update `CE-one-pager-server/src/main.ts`:

```typescript
const allowedOrigins = [
  'http://localhost:3001', // Development
  'https://dev.xxxxx.amplifyapp.com', // AWS Amplify dev
  'https://main.xxxxx.amplifyapp.com', // AWS Amplify main
  'https://coastalelements.com', // Your custom domain
  'https://www.coastalelements.com',
];

app.enableCors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
});
```

**Redeploy backend** after changes:
```bash
eb deploy
```

---

## PART 4: DATABASE (Supabase - Already Done!)

✅ **Supabase is already cloud-hosted!** No need to deploy database!

**Just update URLs:**
1. Update Supabase Redirect URLs (done in Step 1.2)
2. All backend environment variables stay the same!

---

## PART 5: CI/CD SETUP (Auto-deploy on Git Push!)

### Frontend (Amplify - Auto!)

✅ **Already configured!** Push to GitHub → Auto-deploy!

```bash
git push origin dev
# Amplify detects change → Builds → Deploys automatically!
```

### Backend (Elastic Beanstalk - Manual or GitHub Actions)

#### Option A: Manual Deploy

```bash
cd CE-one-pager-server
eb deploy
```

#### Option B: GitHub Actions (Auto-deploy!)

Create: `.github/workflows/deploy-backend.yml`

```yaml
name: Deploy Backend to AWS

on:
  push:
    branches: [ main, dev ]
    paths:
      - 'CE-one-pager-server/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Python
      uses: actions/setup-python@v2
      with:
        python-version: '3.x'
    
    - name: Install EB CLI
      run: pip install awsebcli
    
    - name: Deploy to Elastic Beanstalk
      working-directory: ./CE-one-pager-server
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      run: |
        eb init --region us-east-1 coastal-elements-api --platform node.js
        eb deploy coastal-api-prod
```

**Add GitHub Secrets:**
1. Go to GitHub → Settings → Secrets
2. Add:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

---

## 📊 DEPLOYMENT COSTS (Estimated)

### AWS Amplify (Frontend)
- **Free Tier:** First 1000 build minutes/month
- **After:** ~$0.01 per build minute
- **Hosting:** ~$0.15/GB stored + $0.15/GB served
- **Estimated:** $5-10/month

### AWS Elastic Beanstalk (Backend)
- **t3.micro (Free Tier eligible):** FREE for 1 year, then ~$10/month
- **t3.small (Recommended):** ~$15/month
- **Application Load Balancer (Optional):** ~$20/month
- **Estimated:** $10-25/month

### Supabase (Database)
- **Free Tier:** Up to 500MB database, 2GB storage
- **Pro:** $25/month (8GB database, unlimited API requests)
- **Estimated:** $0-25/month

### TOTAL: ~$15-60/month
- **Minimal:** $15/month (Free tiers)
- **Recommended:** $30-40/month (Better performance)
- **Production:** $50-60/month (Pro tier + scaling)

---

## 🔒 SECURITY CHECKLIST

### Backend
- ✅ Use environment variables (not hardcoded secrets)
- ✅ Enable CORS with specific domains
- ✅ Use HTTPS only in production
- ✅ Rate limiting enabled (Throttler module)
- ✅ Helmet for security headers
- ✅ JWT token expiration
- ✅ Supabase RLS (Row Level Security)

### Frontend
- ✅ API URL from environment variable
- ✅ No sensitive data in client-side code
- ✅ HTTPS only
- ✅ Secure cookies for sessions
- ✅ Content Security Policy

### Database (Supabase)
- ✅ Enable Row Level Security (RLS)
- ✅ Proper user permissions
- ✅ Backup enabled
- ✅ 2FA on Supabase account

---

## 🧪 TESTING AFTER DEPLOYMENT

### 1. Test Backend

```bash
# Health check
curl https://your-backend-url.com/api/health

# Should return: {"status":"ok","timestamp":"..."}
```

### 2. Test Frontend

```bash
# Open in browser
https://your-frontend-url.amplifyapp.com

# Test login
# Test search
# Test saved searches
# Test export CSV
```

### 3. Test CORS

```bash
# From browser console on your frontend
fetch('https://your-backend-url.com/api/health', {
  headers: { 'Content-Type': 'application/json' }
})
.then(r => r.json())
.then(console.log)

# Should NOT show CORS error
```

---

## 🚨 TROUBLESHOOTING

### CORS Errors

**Error:** "Access to fetch has been blocked by CORS policy"

**Fix:**
1. Check backend CORS config includes your frontend domain
2. Redeploy backend
3. Clear browser cache
4. Test with `curl` to verify backend is accessible

### Build Failures (Amplify)

**Error:** "Build failed"

**Fix:**
1. Check build logs in Amplify console
2. Verify environment variables are set
3. Test `yarn build` locally
4. Check Next.js compatibility

### Backend Not Starting

**Error:** "502 Bad Gateway"

**Fix:**
1. Check Elastic Beanstalk logs
2. Verify environment variables
3. Check PORT is set to 8080
4. Verify database connection (Supabase)

---

## 📝 DEPLOYMENT CHECKLIST

### Pre-deployment
- [ ] Test locally (backend + frontend)
- [ ] All features working
- [ ] Environment variables documented
- [ ] CORS configured
- [ ] Build succeeds locally

### Backend Deployment
- [ ] Create .env.production
- [ ] Configure Elastic Beanstalk
- [ ] Deploy backend
- [ ] Test API endpoints
- [ ] Configure CORS with frontend URL

### Frontend Deployment
- [ ] Update NEXT_PUBLIC_API_URL
- [ ] Update Supabase redirect URLs
- [ ] Connect to GitHub
- [ ] Configure Amplify
- [ ] Deploy frontend
- [ ] Test all features

### Post-deployment
- [ ] Test authentication
- [ ] Test search functionality
- [ ] Test saved searches
- [ ] Test CSV export
- [ ] Configure custom domain (optional)
- [ ] Enable SSL (auto on Amplify)
- [ ] Set up monitoring
- [ ] Configure backups

---

## 🎯 QUICK START COMMANDS

### Backend (Elastic Beanstalk)

```bash
# Prepare
cd CE-one-pager-server
npm run build
zip -r coastal-api.zip . -x "node_modules/*" ".git/*"

# Upload to EB Console
# Set environment variables
# Test: https://your-eb-url.com/api/health
```

### Frontend (Amplify)

```bash
# Push to GitHub
git add .
git commit -m "Ready for production"
git push origin dev

# Connect GitHub to Amplify
# Configure environment variables
# Deploy automatically!
```

---

## 📞 SUPPORT

**Issues?**
1. Check Elastic Beanstalk logs
2. Check Amplify build logs
3. Check browser console
4. Check network tab

**Need help?**
- AWS Documentation
- NestJS Deployment Guide
- Next.js Deployment Guide
- Supabase Documentation

---

**Created:** 2025-10-21  
**Last Updated:** 2025-10-21  
**Version:** 1.0

