# Deployment Guide

This monorepo contains configuration files for deploying both the frontend and backend to Netlify.

## Configuration Files

### Root Configuration (`netlify.toml`)
- **Purpose**: Deploys the entire monorepo as a single site (frontend-focused)
- **Use case**: When you want to deploy just the frontend web app
- **Build command**: `pnpm install && pnpm build`
- **Publish directory**: `apps/web/dist`

### Frontend Configuration (`apps/web/netlify.toml`)
- **Purpose**: Deploys only the React/Vite frontend
- **Use case**: When you want to deploy the web app as a separate site
- **Build command**: `pnpm install && pnpm build --filter=web`
- **Publish directory**: `apps/web/dist`
- **Features**: SPA routing, security headers, caching optimization

### Backend Configuration (`apps/api/netlify.toml`)
- **Purpose**: Deploys the Express API as Netlify Functions
- **Use case**: When you want to deploy the API as a separate site
- **Build command**: `pnpm install && pnpm build --filter=api`
- **Publish directory**: `apps/api/dist`
- **Features**: API routing, function configuration

## Deployment Options

### Option 1: Single Site (Recommended)
1. Connect your repository to Netlify
2. Use the root `netlify.toml` configuration
3. The frontend will be deployed and can make API calls to a separate backend deployment

### Option 2: Separate Sites
1. Create two separate Netlify sites
2. For the frontend site: Use `apps/web/netlify.toml`
3. For the backend site: Use `apps/api/netlify.toml`
4. Update the API URL in the frontend configuration

### Option 3: Frontend + Backend Functions
1. Use the root `netlify.toml`
2. Modify the API deployment to use Netlify Functions
3. Both frontend and backend will be served from the same domain

## Environment Variables

Make sure to configure the following environment variables in Netlify:

### Frontend (if using separate backend)
- `VITE_API_URL`: URL of your backend API

### Backend
- `NODE_ENV`: Set to "production"
- Any other environment variables your API needs

## Build Settings

All configurations use:
- **Node.js Version**: 18
- **Package Manager**: pnpm
- **Build Process**: Monorepo-aware with workspace filtering

## Notes

- All configurations are designed for pnpm workspaces
- The `base` directory is set to `showmemymoney/` to match the monorepo structure
- SPA routing is configured for the frontend to handle client-side routing
- Security headers are included for production deployment
- Static asset caching is optimized for performance 