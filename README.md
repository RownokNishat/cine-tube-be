# CineTube Backend API (a5-prisma)

Backend service for the Movie and Series Rating and Streaming Portal assignment.

## Overview

This service provides REST APIs for:

- Authentication (email/password, Google login, token refresh)
- User and role management (USER, ADMIN, SUPER_ADMIN)
- Media library management (admin)
- Genres and content management
- Reviews, likes, nested comments, moderation workflow
- Watchlist management
- Purchases, subscriptions, and admin payment analytics

Base API prefix: /api/v1

## Requirement Coverage

This backend supports the core requirement areas:

- Auth and password reset
- Browse/filter media and genres
- Review system with admin moderation
- Review likes and comment/reply interactions
- Watchlist
- Purchase/subscription and payment dashboard APIs
- Admin analytics and moderation endpoints

## Tech Stack

- Node.js + Express 5
- TypeScript
- Prisma ORM
- PostgreSQL
- Better Auth + JWT cookies
- Stripe
- Cloudinary
- Nodemailer

## Project Structure

- src/app/modules/auth
- src/app/modules/media
- src/app/modules/review
- src/app/modules/watchlist
- src/app/modules/purchase
- src/app/modules/subscription
- src/app/modules/user
- src/app/modules/genre
- src/app/modules/content
- prisma/schema.prisma

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL database

## Environment Setup

1. Copy .env.example to .env
2. Fill all required values in .env

Required keys are validated at startup in src/app/config/env.ts. Important keys include:

- PORT
- NODE_ENV
- DATABASE_URL
- BETTER_AUTH_SECRET
- BETTER_AUTH_URL
- ACCESS_TOKEN_SECRET
- REFRESH_TOKEN_SECRET
- ACCESS_TOKEN_EXPIRES_IN
- REFRESH_TOKEN_EXPIRES_IN
- EMAIL_SENDER_SMTP_USER
- EMAIL_SENDER_SMTP_PASS
- EMAIL_SENDER_SMTP_HOST
- EMAIL_SENDER_SMTP_PORT
- EMAIL_SENDER_SMTP_FROM
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- FRONTEND_URL
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- SUPER_ADMIN_EMAIL
- SUPER_ADMIN_PASSWORD

Security note: do not commit real secrets to .env.example or repository history.

## Installation and Local Run

1. Install dependencies
   npm install

2. Generate Prisma client
   npm run generate

3. Run migrations (recommended for local development)
   npm run migrate

4. Start dev server
   npm run dev

Server default: http://localhost:4000

## Scripts

- npm run dev -> start with hot reload
- npm run build -> generate prisma client and compile TypeScript
- npm run start -> run built server from dist
- npm run lint -> lint scripts folder
- npm run migrate -> prisma migrate dev
- npm run push -> prisma db push
- npm run studio -> prisma studio
- npm run vercel-build -> build entry for Vercel function

## API Modules

- /auth
- /users
- /media
- /genres
- /reviews
- /watchlist
- /subscriptions
- /admin/payments

For full endpoint details, request/response shape, and integration examples, see:

- API_DOCUMENTATION.md

## Admin Moderation Notes

Reviews and comments use moderation states.

- Normal users see published items on public endpoints.
- Admin endpoints support moderation actions (approve, unpublish, delete).

## Deployment

### Vercel

This project includes vercel.json and an API entrypoint in api/index.js.

Typical deployment flow:

1. Set all required environment variables in Vercel project settings
2. Ensure DATABASE_URL points to production PostgreSQL
3. Deploy

Important:

- Run migrations against production DB before or during deployment pipeline.
- Keep FRONTEND_URL and BETTER_AUTH_URL aligned with deployed domains.

## Quick Verification Checklist

- Auth register/login works
- Admin can create/edit media
- User can submit review
- Admin can approve/unpublish review and moderate comments
- User watchlist add/remove works
- Purchase/subscription flow creates payment records
- Admin payment dashboard returns metrics
