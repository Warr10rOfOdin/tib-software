# Deployment Guide

## Deploying to Vercel

### Prerequisites

1. Vercel account ([vercel.com](https://vercel.com))
2. Firebase project set up and configured
3. GitHub repository

### Steps

1. **Push code to GitHub**

```bash
git add .
git commit -m "Initial deployment setup"
git push origin claude/game-lineup-analyzer-xYb11
```

2. **Connect to Vercel**

- Go to [vercel.com/new](https://vercel.com/new)
- Import your GitHub repository
- Select the `tib-software` project

3. **Configure Environment Variables**

In Vercel dashboard, go to Settings → Environment Variables and add:

**Client-side (Public)**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

**Server-side (Secret)**
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (remember to preserve newlines: use quotes)

4. **Deploy**

Click "Deploy" and wait for the build to complete.

### Post-Deployment

1. **Update Firebase Auth domain**

Add your Vercel domain to Firebase Auth authorized domains:
- Go to Firebase Console → Authentication → Settings
- Add your `*.vercel.app` domain

2. **Test the deployment**

- Visit your Vercel URL
- Test image upload (should work)
- Test navigation
- Check console for errors

3. **Custom Domain (Optional)**

In Vercel Settings → Domains, add your custom domain.

## Deploying Firebase Rules

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules

# Deploy both
firebase deploy --only firestore:rules,storage:rules
```

## CI/CD

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pushes to other branches (including your claude/* branch)

## Monitoring

- **Vercel Analytics**: Enable in project settings
- **Firebase Console**: Monitor usage, errors, and performance
- **Vercel Logs**: Check function logs for errors

## Troubleshooting

### Build Failures

1. Check environment variables are set correctly
2. Verify `package.json` scripts
3. Check Next.js version compatibility

### Runtime Errors

1. Check Vercel function logs
2. Verify Firebase credentials
3. Check Firestore/Storage rules

### CORS Issues

If you encounter CORS errors with Firebase Storage:
- Update Firebase Storage CORS configuration
- Add your Vercel domain to allowed origins

## Rollback

If a deployment breaks:
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## Performance Optimization

- Enable Vercel Analytics
- Use Next.js Image Optimization
- Implement caching strategies
- Monitor Firebase usage and costs

## Security Checklist

- ✅ Environment variables are secret (server-side only)
- ✅ Firestore rules restrict access by user
- ✅ Storage rules validate file types and sizes
- ✅ API routes validate authentication
- ✅ No sensitive data in client code
- ✅ Firebase Admin SDK credentials are secure

## Cost Estimation

### Vercel
- **Hobby**: Free (good for personal use)
- **Pro**: $20/mo (recommended for production)

### Firebase
- **Spark (Free)**:
  - 1GB storage
  - 10GB/month transfers
  - 50K reads, 20K writes, 20K deletes per day
- **Blaze (Pay as you go)**:
  - Scales with usage
  - Estimate: $5-20/month for moderate use

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Firebase: [firebase.google.com/support](https://firebase.google.com/support)
