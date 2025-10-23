# 🔧 Environment Variables Explained

## Required for Authentication System ✅

Ang mga ito lang ang **KAILANGAN** para gumana ang OTP authentication:

```env
# Backend API - REQUIRED
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_ENV=development
```

**That's it!** Tatlo lang yan para gumana ang authentication! ✅

---

## Optional - For Waitlist Feature Only ⚠️

Ang variable na ito ay para sa **waitlist submission** lang (yung `/waitlist` page):

```env
# HubSpot Integration - OPTIONAL (for waitlist only)
HUBSPOT_PRIVATE_APP_TOKEN=your_hubspot_token_here
```

### Ano ang HUBSPOT_PRIVATE_APP_TOKEN?

- **Purpose:** Para mag-save ng emails sa HubSpot CRM
- **Used in:** `/app/api/submit-email/route.ts`
- **Feature:** Waitlist page (`/waitlist`)
- **For Authentication:** ❌ **HINDI KAILANGAN**

### Pag walang HubSpot Token:

✅ **Gumana pa rin ang:**
- Login/OTP authentication
- Dashboard
- Protected routes
- User profile
- Lahat ng authentication features

❌ **Hindi gagana ang:**
- Waitlist submission (`/waitlist` page)
- Email saving to HubSpot CRM

---

## Complete .env.local Setup

### Minimum Setup (Authentication Only)

```env
# This is all you need for auth to work!
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_ENV=development
```

### Full Setup (With Waitlist)

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_ENV=development

# HubSpot (optional - for waitlist only)
HUBSPOT_PRIVATE_APP_TOKEN=pat-na-1234567890abcdef
```

---

## Backend .env Requirements

Para sa backend (CE-one-pager-server), kailangan nito:

```env
# Supabase Configuration - REQUIRED
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Configuration - REQUIRED
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server Configuration - REQUIRED
PORT=3000
NODE_ENV=development

# Rate Limiting - OPTIONAL
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

---

## Paano Kumuha ng HubSpot Token (Kung kailangan mo)

1. **Go to HubSpot:** https://app.hubspot.com
2. **Navigate to:** Settings → Integrations → Private Apps
3. **Create Private App:**
   - Name: "Coastal Elements Waitlist"
   - Scopes: `crm.objects.contacts.write`
4. **Copy Access Token** - yan ang HUBSPOT_PRIVATE_APP_TOKEN

**Note:** Kailangan mo lang to kung gusto mo gumana ang waitlist feature!

---

## Testing Without HubSpot

Kung gusto mo i-test ang authentication **WALANG** HubSpot:

1. **Skip lang ang HUBSPOT_PRIVATE_APP_TOKEN**
2. **I-test ang login:**
   - Go to: http://localhost:3001/login
   - Enter email
   - Verify OTP
   - Check dashboard

3. **Huwag i-test ang waitlist:**
   - Yung `/waitlist` page lang hindi gagana
   - Lahat ng iba working! ✅

---

## Current Setup Check

### ✅ What's Working NOW (without HubSpot):
- Backend server (port 3000)
- Frontend server (port 3001)
- Login page (`/login`)
- OTP request/verification
- Dashboard (`/dashboard`)
- Protected routes
- JWT authentication
- Session management

### ⏸️ What Needs HubSpot (optional):
- Waitlist submission (`/waitlist`)
- Email saving to CRM

---

## Recommended: Test Authentication First!

**Suggestion:** I-test muna ang authentication system WITHOUT HubSpot token:

1. ✅ Login flow
2. ✅ Dashboard
3. ✅ Protected routes
4. ✅ Logout

**Then later**, kung kailangan ng waitlist feature, add HubSpot token.

---

## Summary

| Variable | Required For | Can Skip? |
|----------|-------------|-----------|
| `NEXT_PUBLIC_API_URL` | Authentication | ❌ No |
| `NEXT_PUBLIC_API_TIMEOUT` | API requests | ❌ No |
| `NEXT_PUBLIC_ENV` | Environment detection | ❌ No |
| `HUBSPOT_PRIVATE_APP_TOKEN` | Waitlist only | ✅ Yes! |

**Bottom line:** Pwede mo i-skip ang HubSpot token! Hindi kailangan para sa authentication! 🎉

---

**Last Updated:** 2025-10-21


