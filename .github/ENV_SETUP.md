# Frontend Environment Variables Setup

## 🎯 Overview

The frontend (Next.js) is deployed via **AWS Amplify**, which has its own environment variable management system.

**Branch-Based Deployment:**
- **Push to `dev`** → Amplify deploys to dev environment
- **Push to `main`** → Amplify deploys to production environment

---

## 📝 Required Environment Variables

### All Environments

| Variable Name | Dev Example | Prod Example | Description |
|---------------|-------------|--------------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://coastal-api-dev.us-east-1.elasticbeanstalk.com/api` | `https://coastal-api-prod.us-east-1.elasticbeanstalk.com/api` | Backend API URL |
| `NEXT_PUBLIC_API_TIMEOUT` | `10000` | `30000` | API request timeout (ms) |
| `NEXT_PUBLIC_ENV` | `development` | `production` | Environment identifier |

### Optional

| Variable Name | Example | Description |
|---------------|---------|-------------|
| `HUBSPOT_PRIVATE_APP_TOKEN` | `pat-na1-xxxxx` | For waitlist email collection (optional) |

---

## 🔧 Setup Instructions

### Step 1: Access AWS Amplify Console

1. **Login to AWS Console**
   - https://console.aws.amazon.com/amplify/

2. **Select Your App**
   - Click on `one-pager-coastal-elements` (or your app name)

3. **Go to Environment Variables**
   - Left sidebar → App settings → Environment variables

---

### Step 2: Add Environment Variables

#### For Dev Environment

1. **Select `dev` branch** in Amplify
2. **Add these variables:**

```
NEXT_PUBLIC_API_URL
→ https://coastal-api-dev.us-east-1.elasticbeanstalk.com/api

NEXT_PUBLIC_API_TIMEOUT
→ 10000

NEXT_PUBLIC_ENV
→ development
```

#### For Production Environment

1. **Select `main` branch** in Amplify
2. **Add these variables:**

```
NEXT_PUBLIC_API_URL
→ https://coastal-api-prod.us-east-1.elasticbeanstalk.com/api

NEXT_PUBLIC_API_TIMEOUT
→ 30000

NEXT_PUBLIC_ENV
→ production
```

---

## 🚀 How to Add Variables in Amplify

### Method 1: Amplify Console (Recommended)

1. **Go to Amplify Console**
   - https://console.aws.amazon.com/amplify/

2. **Select App → Environment variables**

3. **Click "Manage variables"**

4. **For Each Branch:**
   - Click branch name (dev or main)
   - Add variable name
   - Add variable value
   - Click "Save"

5. **Redeploy**
   - Amplify will auto-redeploy on next push
   - Or manually trigger: "Redeploy this version"

---

### Method 2: Branch-Specific Variables

**Amplify supports different values per branch!**

```
Variable: NEXT_PUBLIC_API_URL

Branches:
├─ dev   → https://coastal-api-dev.elasticbeanstalk.com/api
└─ main  → https://coastal-api-prod.elasticbeanstalk.com/api
```

**How to set:**
1. Environment variables tab
2. Click "Manage variables"
3. Click branch dropdown
4. Select branch
5. Enter value for that branch
6. Repeat for other branch

---

## 🔄 Deployment Flow

### Dev Branch
```bash
git checkout dev
git add .
git commit -m "new feature"
git push origin dev

# → Amplify auto-detects push
# → Reads dev environment variables:
#    NEXT_PUBLIC_API_URL = dev backend URL
#    NEXT_PUBLIC_ENV = development
# → Builds with these variables
# → Deploys to dev.xxxxx.amplifyapp.com
# → ✅ Done!
```

### Main Branch
```bash
git checkout main
git merge dev
git push origin main

# → Amplify auto-detects push
# → Reads main environment variables:
#    NEXT_PUBLIC_API_URL = prod backend URL
#    NEXT_PUBLIC_ENV = production
# → Builds with these variables
# → Deploys to main.xxxxx.amplifyapp.com (or custom domain)
# → ✅ Done!
```

---

## 🔍 Verification

### Check Environment Variables

1. **Amplify Console**
   - App settings → Environment variables
   - Should see all variables listed
   - Each branch has different values

2. **Build Logs**
   - Amplify → Deployments → Click latest build
   - Look for: "Environment variables loaded"

3. **Test API Connection**
   ```bash
   # Open browser console on deployed site
   console.log(process.env.NEXT_PUBLIC_API_URL)
   # Should show correct backend URL
   ```

---

## 📊 Summary

| Branch | API URL | Timeout | Env |
|--------|---------|---------|-----|
| `dev` | coastal-api-dev | 10000 | development |
| `main` | coastal-api-prod | 30000 | production |

**Key Points:**
- ✅ Amplify manages environment variables (NOT GitHub Secrets)
- ✅ Different values per branch
- ✅ Variables are injected at build time
- ✅ Auto-redeploys when variables change

---

## 🔄 Updating Environment Variables

**To update any variable:**

1. Go to Amplify Console
2. App settings → Environment variables
3. Find the variable
4. Click "Edit"
5. Update value
6. Click "Save"
7. Trigger redeploy:
   - Push new code, OR
   - Manual: "Redeploy this version"

**Example: Update API URL**
```
1. Amplify Console → Environment variables
2. Find: NEXT_PUBLIC_API_URL
3. Branch: main
4. Update to new backend URL
5. Save
6. Redeploy
7. ✅ Frontend now uses new backend!
```

---

## ⚠️ Important Notes

### NEXT_PUBLIC_* Prefix

**All frontend environment variables MUST start with `NEXT_PUBLIC_`**

- ✅ `NEXT_PUBLIC_API_URL` → Available in browser
- ❌ `API_URL` → NOT available (will be undefined)

This is a Next.js security feature!

### Environment Variables vs Secrets

**Frontend variables are PUBLIC:**
- `NEXT_PUBLIC_*` variables are embedded in the JavaScript bundle
- Anyone can view them in browser DevTools
- **NEVER** put sensitive keys here!

**Safe to expose:**
- ✅ API URLs
- ✅ Timeouts
- ✅ Public configuration

**NOT safe to expose:**
- ❌ Service role keys
- ❌ Private API tokens
- ❌ Database credentials

---

## 🆘 Troubleshooting

### "Cannot read NEXT_PUBLIC_API_URL"

**Problem:** Variable not set or missing prefix

**Solution:**
1. Check variable name has `NEXT_PUBLIC_` prefix
2. Check it's added in Amplify Console
3. Redeploy the app

### API requests fail with CORS error

**Problem:** Backend CORS not allowing frontend domain

**Solution:**
1. Update backend `ALLOWED_ORIGINS_PROD` secret
2. Add Amplify domain: `https://main.xxxxx.amplifyapp.com`
3. Redeploy backend

### Changes not reflecting

**Problem:** Amplify cached old build

**Solution:**
1. Amplify Console → Deployments
2. Click "Redeploy this version"
3. Wait for new build
4. Hard refresh browser (Ctrl+Shift+R)

---

## 📋 Setup Checklist

### For Each Environment (dev and main):

- [ ] Add `NEXT_PUBLIC_API_URL` with correct backend URL
- [ ] Add `NEXT_PUBLIC_API_TIMEOUT` (10000 for dev, 30000 for prod)
- [ ] Add `NEXT_PUBLIC_ENV` (development or production)
- [ ] Verify variables in Amplify Console
- [ ] Push code to trigger deployment
- [ ] Test API connection in browser
- [ ] Verify CORS works (no errors in console)

---

**Created:** 2025-10-22  
**Last Updated:** 2025-10-22  
**For:** AWS Amplify Deployment

