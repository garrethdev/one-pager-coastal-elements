# 🚀 Quick Start Guide - Frontend & Backend Integration

## Para sa Dev Environment

### Prerequisites
- ✅ Node.js v18+ installed
- ✅ Git installed
- ✅ Backend server running (CE-one-pager-server)
- ✅ Supabase account configured

---

## Step 1: Backend Setup

```bash
# Navigate to backend
cd CE-one-pager-server

# Install dependencies (kung hindi pa)
npm install

# Make sure .env is configured
# SUPABASE_URL=...
# SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=...
# JWT_SECRET=...

# Start backend server
npm run start:dev
```

✅ **Backend should be running at:** `http://localhost:3000`  
✅ **Swagger docs available at:** `http://localhost:3000/docs`

---

## Step 2: Frontend Setup

```bash
# Navigate to frontend
cd one-pager-coastal-elements

# Make sure you're on dev branch
git checkout dev

# Install dependencies
yarn install
# or: npm install

# Create .env.local file
cp env.example .env.local

# Edit .env.local with correct values:
# NEXT_PUBLIC_API_URL=http://localhost:3000/api
# NEXT_PUBLIC_API_TIMEOUT=10000
# NEXT_PUBLIC_ENV=development

# Start frontend server
yarn dev
# or: npm run dev
```

✅ **Frontend should be running at:** `http://localhost:3001`

---

## Step 3: Test Authentication Flow

### 3.1 Test Login Page

1. **Go to:** `http://localhost:3001/login`
2. **Enter email address** (any valid email)
3. **Click "Send Login Code"**
4. **Check email** for 6-digit OTP code
5. **Enter OTP** in verification form
6. **Should redirect** to dashboard

### 3.2 Test Protected Routes

1. **Clear browser storage** (Application > Local Storage > Clear)
2. **Try accessing:** `http://localhost:3001/dashboard`
3. **Should redirect** to `/login`

### 3.3 Test Dashboard

1. **Login successfully** (follow Step 3.1)
2. **Should see:**
   - User email
   - Credits (default 100)
   - Subscription plan (default "free")
   - Logout button

### 3.4 Test Logout

1. **On dashboard, click "Logout"**
2. **Should clear session** and redirect to `/login`
3. **Try accessing dashboard** again
4. **Should redirect** to login

---

## Step 4: Verify Backend Integration

### Check Backend Logs

Dapat makita mo sa backend console:
```
🚀 Server running on port 3000
📚 API Documentation available at http://localhost:3000/docs
🏥 Health check available at http://localhost:3000/api/health
```

### Check Frontend Console

Dapat walang errors sa browser console. Kung meron:
- Check if backend is running
- Verify CORS is enabled
- Check network tab for failed requests

---

## Common Issues & Solutions

### ❌ Issue: "Network Error" or CORS error

**Solution:**
```bash
# Backend - Check if CORS is enabled in main.ts
# Should have:
app.enableCors({
  origin: ['http://localhost:3001'],
  credentials: true,
});
```

### ❌ Issue: OTP not received

**Solution:**
- Check Supabase Email settings
- Verify SMTP configuration
- Check spam folder
- Test with Supabase dashboard first

### ❌ Issue: "Invalid token" or Authentication failed

**Solution:**
- Verify backend JWT_SECRET is set
- Check Supabase Service Role Key
- Clear localStorage and try again
- Check backend logs for errors

### ❌ Issue: Page not loading / white screen

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
yarn dev

# Or check browser console for errors
```

---

## Testing Checklist

- [ ] Backend server running at port 3000
- [ ] Swagger docs accessible at `/docs`
- [ ] Frontend server running at port 3001
- [ ] Login page loads correctly
- [ ] OTP request sends email
- [ ] OTP verification works
- [ ] Dashboard shows user data
- [ ] Protected routes redirect to login
- [ ] Logout clears session
- [ ] No console errors

---

## API Endpoints Being Used

### Authentication
- `POST /api/auth/otp/request` - Request OTP
- `POST /api/auth/otp/verify` - Verify OTP & Login
- `POST /api/auth/logout` - Logout

### User Profile
- `GET /api/users/profile` - Get user profile
- `POST /api/users/credits` - Update credits
- `POST /api/users/subscription` - Update subscription

### Search (TODO)
- `POST /api/search` - Search properties
- `GET /api/search/quick-lists` - Get quick lists

### Saved Searches (TODO)
- `GET /api/saved-searches` - Get saved searches
- `POST /api/saved-searches` - Save search
- `DELETE /api/saved-searches/:id` - Delete search

---

## Next Steps

1. **Test end-to-end flow** - Login → Dashboard → Logout
2. **Implement search functionality** - Connect to real search API
3. **Add saved searches UI** - List, save, delete searches
4. **Add export feature** - CSV download
5. **Deploy to staging** - Setup CI/CD

---

## Development Workflow

```bash
# Create feature branch from dev
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name

# Make changes...
# Test locally...

# Commit and push
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name

# Create PR to dev branch
# After review, merge to dev
# Dev auto-deploys to staging
```

---

## Environment URLs

| Environment | Frontend URL | Backend URL | Status |
|-------------|-------------|-------------|---------|
| **Local Dev** | http://localhost:3001 | http://localhost:3000 | ✅ Ready |
| **Staging** | TBD | TBD | 🚧 Setup |
| **Production** | TBD | TBD | 🚧 Setup |

---

## Support

Kung may issues:
1. Check this guide first
2. Check backend logs
3. Check browser console
4. Check AUTHENTICATION_SETUP.md for detailed docs
5. Contact: milan@arborvita.io

---

**Last Updated:** 2025-10-21  
**Version:** 1.0.0


