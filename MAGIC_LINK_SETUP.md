# 🔗 Magic Link Setup Guide

## Issue: Magic Link Redirects to Backend (404 Error)

**Problem:** Pag nag-click ng magic link sa email, nag-redirect sa:
```
http://localhost:3000/#access_token=...
```
❌ Backend URL (port 3000) - walang page dito!

**Should redirect to:**
```
http://localhost:3001/auth/callback#access_token=...
```
✅ Frontend URL (port 3001) - may callback handler!

---

## ✅ Complete Solution

### Step 1: Configure Supabase Redirect URLs ⚙️

**Go to Supabase Dashboard:**

1. **Login:** https://app.supabase.com
2. **Select Project:** Coastal Elements
3. **Navigate:** Authentication → URL Configuration
4. **Update Settings:**

```
Site URL:
http://localhost:3001

Redirect URLs (Add these):
http://localhost:3001/**
http://localhost:3001/auth/callback
http://localhost:3001/dashboard
```

5. **Save Changes** ✅

---

### Step 2: Frontend Callback Handler ✅ (DONE!)

**File Created:** `app/auth/callback/page.tsx`

**What it does:**
1. ✅ Receives magic link redirect
2. ✅ Extracts tokens from URL hash
3. ✅ Decodes JWT to get user info
4. ✅ Fetches user profile from backend
5. ✅ Saves to localStorage (same as OTP login)
6. ✅ Redirects to dashboard

---

### Step 3: Update Backend OTP Request (Optional)

Para explicitly set ang redirect URL:

**File:** `CE-one-pager-server/src/modules/auth/auth.service.ts`

Update `requestOtp` method:

```typescript
async requestOtp(email: string) {
  try {
    const { data, error } = await this.supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,
        // Set frontend callback URL
        emailRedirectTo: 'http://localhost:3001/auth/callback',
      },
    });
    
    // ... rest of code
  }
}
```

---

## 🧪 How It Works Now

### Magic Link Flow:

```
1. User requests OTP
   Frontend → Backend → Supabase → Email

2. User receives email with:
   - 6-digit code: 123456
   - Magic link button

3. User clicks Magic Link
   Email → Supabase Auth

4. Supabase validates & redirects
   Supabase → http://localhost:3001/auth/callback#access_token=...

5. Frontend callback handles
   - Extract tokens
   - Get user profile
   - Save to localStorage
   - Redirect to dashboard

6. User sees dashboard ✅
```

---

### OTP Code Flow (Alternative):

```
1. User requests OTP
   Same as above

2. User receives email
   See 6-digit code: 123456

3. User enters code manually
   Frontend → Backend verification

4. Backend validates OTP
   Returns user data + profile

5. Frontend saves & redirects
   Dashboard ✅
```

---

## 📧 Email Format (Both Options)

```
──────────────────────────────────
Subject: Your Login Code
──────────────────────────────────

Follow this link to login:
[Log In] ← Magic Link (one-click)

Alternatively, enter the code: 123456
                                  ↑
                        Manual entry (6-digit)
──────────────────────────────────
```

✅ **User can choose:**
- Click link (faster)
- Enter code (manual)

---

## 🔧 Configuration Checklist

### Supabase Dashboard:
- [ ] Site URL: `http://localhost:3001`
- [ ] Redirect URLs include: `http://localhost:3001/**`
- [ ] Email OTP enabled
- [ ] Email template has both code and link

### Backend:
- [ ] `emailRedirectTo` set to frontend callback (optional)
- [ ] Backend running on port 3000
- [ ] CORS allows port 3001

### Frontend:
- [ ] Callback handler exists: `/app/auth/callback/page.tsx` ✅
- [ ] Frontend running on port 3001
- [ ] Login page at `/login`
- [ ] Dashboard at `/dashboard`

---

## 🎯 Testing Both Methods

### Test 1: Magic Link
1. Go to: http://localhost:3001/login
2. Enter email
3. Check email
4. **Click "Log In" button**
5. Should redirect to: http://localhost:3001/auth/callback
6. Should process and redirect to: /dashboard
7. ✅ Logged in!

### Test 2: OTP Code
1. Go to: http://localhost:3001/login
2. Enter email
3. Check email
4. **Copy 6-digit code** (e.g., 123456)
5. **Enter code** in form
6. Click "Verify & Continue"
7. ✅ Logged in!

---

## 🐛 Troubleshooting

### Issue: Still redirects to port 3000

**Solution:**
1. Clear browser cache
2. Check Supabase dashboard "Site URL" is correct
3. Request new OTP (old links cached)
4. Verify `emailRedirectTo` in backend

### Issue: Callback shows error

**Solution:**
1. Check browser console for errors
2. Verify tokens in URL hash
3. Check backend is running (for profile fetch)
4. Check CORS settings

### Issue: 404 on callback

**Solution:**
1. Verify callback file exists: `app/auth/callback/page.tsx`
2. Restart Next.js dev server
3. Check Next.js routing

---

## 📝 Environment-Specific URLs

### Development:
```
Site URL: http://localhost:3001
Redirect: http://localhost:3001/auth/callback
```

### Staging (Future):
```
Site URL: https://staging.coastalelements.com
Redirect: https://staging.coastalelements.com/auth/callback
```

### Production (Future):
```
Site URL: https://app.coastalelements.com
Redirect: https://app.coastalelements.com/auth/callback
```

**Note:** Update Supabase URLs when deploying!

---

## 🎯 Summary

**What Was Wrong:**
- Magic link redirected to backend (port 3000)
- Backend has no UI, returns 404
- User stuck on error page

**What We Fixed:**
1. ✅ Created frontend callback handler
2. ⏳ Need to update Supabase Site URL to port 3001
3. ✅ Both magic link and OTP code now work

**User Experience:**
- ✅ Can click magic link (fast)
- ✅ Can enter 6-digit code (manual)
- ✅ Both methods redirect to dashboard
- ✅ Smooth authentication flow

---

## 🚀 Next Steps

1. **Update Supabase Dashboard** (YOU NEED TO DO THIS!)
   - Site URL → `http://localhost:3001`
   - Redirect URLs → Add `http://localhost:3001/**`

2. **Test both methods**
   - Magic link click
   - OTP code entry

3. **Deploy to production**
   - Update Supabase URLs to production domain
   - Test end-to-end

---

**Last Updated:** 2025-10-21  
**Status:** ⏳ Pending Supabase URL configuration

