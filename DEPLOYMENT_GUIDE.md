# 🚀 SECURE VERCEL DEPLOYMENT GUIDE

## Pre-Deployment Checklist

### 1. Code Security
- [ ] No sensitive data in code
- [ ] All secrets in environment variables
- [ ] `.env` files in `.gitignore`
- [ ] Database queries use parameterized statements

### 2. Environment Setup
- [ ] `.env.example` file created
- [ ] Production environment variables ready
- [ ] Supabase RLS policies tested

## Deployment Steps

### Step 1: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository

### Step 2: Configure Environment Variables
In Vercel dashboard:
1. Go to Project Settings > Environment Variables
2. Add these variables for **Production**:

```
NEXT_PUBLIC_SUPABASE_URL=https://kjbutgbpddsadvnbgblg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_OPENROUTE_API=5b3ce3597851110001cf62485619490820a246c49d46245083f01c4f
ADMIN_EMAIL=jamahcommunityapp@gmail.com
```

### Step 3: Domain Configuration
1. In Vercel dashboard, go to Domains
2. Add your custom domain (optional)
3. Configure DNS records as instructed

### Step 4: Supabase Production Settings
1. In Supabase dashboard:
   - Go to Authentication > URL Configuration
   - Add your Vercel domain to "Site URL"
   - Add your domain to "Redirect URLs"

### Step 5: Deploy
1. Push code to main branch
2. Vercel will auto-deploy
3. Monitor deployment logs

## Post-Deployment Security

### Monitoring
- [ ] Set up Vercel analytics
- [ ] Configure error tracking (Sentry)
- [ ] Monitor API usage in Supabase

### Performance
- [ ] Test page load speeds
- [ ] Check lighthouse scores
- [ ] Verify API response times

### Security Testing
- [ ] Test authentication flows
- [ ] Verify RLS policies work
- [ ] Check for data leaks in network tab
- [ ] Test with different user roles

## Emergency Procedures

### Rollback
```bash
# Revert to previous deployment
vercel rollback [deployment-url]
```

### Environment Variables Update
1. Update in Vercel dashboard
2. Redeploy automatically triggers

### Security Incident
1. Immediately rotate API keys
2. Check access logs in Supabase
3. Update RLS policies if needed
4. Notify users if data was compromised

## Useful Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from command line
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]
```