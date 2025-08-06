# Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication with GitHub OAuth for your Next.js application.

## Prerequisites

1. A Supabase project (create one at [supabase.com](https://supabase.com))
2. A GitHub account
3. Node.js and npm installed

## Step 1: Set up Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Settings > API.

## Step 2: Configure GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the following details:
   - **Application name**: Your app name (e.g., "Work Study Sim")
   - **Homepage URL**: Your app's URL (e.g., `http://localhost:3000` for development)
   - **Authorization callback URL**: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
     - Replace `[YOUR-PROJECT-REF]` with your Supabase project reference
4. Click "Register application"
5. Copy the **Client ID** and **Client Secret**

## Step 3: Configure Supabase GitHub Provider

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Find GitHub in the list and click to expand
4. Enable GitHub authentication
5. Enter your GitHub **Client ID** and **Client Secret**
6. Click "Save"

## Step 4: Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/auth-test`

3. Click "Sign in with GitHub" to test the authentication flow

## Security Features Implemented

### 1. Server-Side Rendering (SSR) Support
- Uses `@supabase/ssr` for proper SSR authentication
- Handles session management on both client and server

### 2. Middleware Protection
- Automatic session refresh in middleware
- Route protection capabilities (can be enabled by uncommenting redirect logic)

### 3. Secure OAuth Flow
- PKCE (Proof Key for Code Exchange) flow for enhanced security
- Proper callback handling with code exchange
- Environment variable validation

### 4. Session Management
- Automatic session persistence
- Real-time auth state changes
- Secure cookie handling

### 5. Error Handling
- Comprehensive error handling for OAuth failures
- User-friendly error messages
- Fallback error pages

## File Structure

```
lib/supabase/
├── client.ts          # Browser client
├── server.ts          # Server-side client
└── middleware.ts      # Middleware utilities

app/
├── auth/
│   └── callback/
│       └── route.ts   # OAuth callback handler
└── auth-test/
    └── page.tsx       # Test page

middleware.ts          # Next.js middleware
```

## Usage

### Sign In
```typescript
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
})
```

### Sign Out
```typescript
const { error } = await supabase.auth.signOut()
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

### Listen to Auth Changes
```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  // Handle auth state changes
})
```

## Production Considerations

1. **Environment Variables**: Ensure all environment variables are set in your production environment
2. **Redirect URLs**: Update GitHub OAuth app with production callback URLs
3. **Domain Configuration**: Configure your domain in Supabase project settings
4. **Rate Limiting**: Consider implementing rate limiting for auth endpoints
5. **Monitoring**: Set up monitoring for authentication failures

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**: Ensure your callback URL matches exactly in GitHub OAuth app settings
2. **"Missing environment variables"**: Check that all required env vars are set
3. **"Session not found"**: Clear browser cookies and try again
4. **"Provider not enabled"**: Ensure GitHub provider is enabled in Supabase dashboard

### Debug Steps

1. Check browser console for errors
2. Verify environment variables are loaded
3. Test OAuth flow in incognito mode
4. Check Supabase logs in dashboard
5. Verify GitHub OAuth app configuration

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Next.js Middleware Documentation](https://nextjs.org/docs/app/building-your-application/routing/middleware) 