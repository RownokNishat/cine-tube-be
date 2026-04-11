var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import { toNodeHandler } from "better-auth/node";
import cookieParser from "cookie-parser";
import cors from "cors";
import express2 from "express";
import path3 from "path";
import qs from "qs";

// src/app/config/env.ts
import dotenv from "dotenv";
dotenv.config();
var loadEnvVariables = () => {
  const requiredEnvVariables = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD"
  ];
  requiredEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
      const msg = `Environment variable ${variable} is required but not set in .env file.`;
      console.error(`[env] MISSING ENV VAR: ${msg}`);
      throw new Error(msg);
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    FRONTEND_URL: process.env.FRONTEND_URL,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    },
    STRIPE: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET
    },
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD
  };
};
var envVars = loadEnvVariables();

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP } from "better-auth/plugins";

// src/generated/enums.ts
var Role = {
  USER: "USER",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var MediaType = {
  MOVIE: "MOVIE",
  SERIES: "SERIES"
};
var MediaStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED"
};
var PricingType = {
  FREE: "FREE",
  PREMIUM: "PREMIUM"
};
var ReviewStatus = {
  PENDING: "PENDING",
  PUBLISHED: "PUBLISHED",
  UNPUBLISHED: "UNPUBLISHED"
};
var CommentStatus = {
  PENDING: "PENDING",
  PUBLISHED: "PUBLISHED",
  UNPUBLISHED: "UNPUBLISHED"
};
var SubscriptionPlan = {
  FREE: "FREE",
  MONTHLY: "MONTHLY",
  YEARLY: "YEARLY"
};
var SubscriptionStatus = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED"
};
var ChatStatus = {
  OPEN: "OPEN",
  RESOLVED: "RESOLVED"
};
var PurchaseType = {
  PURCHASE: "PURCHASE",
  RENTAL: "RENTAL"
};

// src/app/utils/email.ts
import ejs from "ejs";
import status from "http-status";
import nodemailer from "nodemailer";
import path from "path";

// src/app/errorHelpers/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/app/utils/email.ts
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  },
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT)
});
var sendEmail = async ({ subject, templateData, templateName, to, attachments }) => {
  try {
    const templatePath = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
    console.log(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.log("Email Sending Error", msg);
    throw new AppError_default(status.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/client.ts
import * as path2 from "node:path";
import { fileURLToPath } from "node:url";

// src/generated/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.6.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "postgresql",
  "inlineSchema": '// CineTube - Movie and Series Rating & Streaming Portal\n// Prisma Schema\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../src/generated"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\n// ========== ENUMS ==========\n\nenum Role {\n  USER\n  ADMIN\n  SUPER_ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum MediaType {\n  MOVIE\n  SERIES\n}\n\nenum MediaStatus {\n  DRAFT\n  PUBLISHED\n}\n\nenum PricingType {\n  FREE\n  PREMIUM\n}\n\nenum ReviewStatus {\n  PENDING\n  PUBLISHED\n  UNPUBLISHED\n}\n\nenum CommentStatus {\n  PENDING\n  PUBLISHED\n  UNPUBLISHED\n}\n\nenum SubscriptionPlan {\n  FREE\n  MONTHLY\n  YEARLY\n}\n\nenum SubscriptionStatus {\n  ACTIVE\n  EXPIRED\n  CANCELLED\n}\n\nenum ChatStatus {\n  OPEN\n  RESOLVED\n}\n\nenum PurchaseStatus {\n  PENDING\n  COMPLETED\n  FAILED\n  REFUNDED\n  RENTAL_EXPIRED\n}\n\nenum PurchaseType {\n  PURCHASE\n  RENTAL\n}\n\n// ========== BETTER-AUTH REQUIRED MODELS ==========\n\nmodel User {\n  id                 String     @id\n  name               String\n  email              String\n  emailVerified      Boolean    @default(false)\n  role               Role       @default(USER)\n  status             UserStatus @default(ACTIVE)\n  needPasswordChange Boolean    @default(false)\n  isDeleted          Boolean    @default(false)\n  deletedAt          DateTime?\n  image              String?\n  createdAt          DateTime   @default(now())\n  updatedAt          DateTime   @updatedAt\n\n  sessions      Session[]\n  accounts      Account[]\n  profile       UserProfile?\n  adminProfile  AdminProfile?\n  reviews       Review[]\n  reviewLikes   ReviewLike[]\n  comments      ReviewComment[]\n  commentLikes  CommentLike[]\n  watchlist     Watchlist[]\n  subscriptions Subscription[]\n  purchases     Purchase[]\n  chatSessions  ChatSession[]\n  chatMessages  ChatMessage[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\n// ========== USER PROFILES ==========\n\nmodel UserProfile {\n  id        String   @id @default(uuid())\n  userId    String   @unique\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  bio       String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("user_profile")\n}\n\nmodel AdminProfile {\n  id        String   @id @default(uuid())\n  userId    String   @unique\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("admin_profile")\n}\n\n// ========== MEDIA LIBRARY ==========\n\nmodel Genre {\n  id          String       @id @default(uuid())\n  name        String       @unique\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n  mediaGenres MediaGenre[]\n\n  @@map("genre")\n}\n\nmodel Media {\n  id                String      @id @default(uuid())\n  title             String\n  synopsis          String      @db.Text\n  releaseYear       Int\n  director          String\n  cast              String[]\n  streamingPlatform String[]\n  pricingType       PricingType @default(FREE)\n  price             Float?      @default(9.99)\n  streamingLink     String?\n  posterUrl         String?\n  trailerUrl        String?\n  isFeatured        Boolean     @default(false)\n  isEditorPick      Boolean     @default(false)\n  mediaType         MediaType   @default(MOVIE)\n  status            MediaStatus @default(DRAFT)\n  createdAt         DateTime    @default(now())\n  updatedAt         DateTime    @updatedAt\n\n  genres           MediaGenre[]\n  reviews          Review[]\n  watchlistEntries Watchlist[]\n  purchases        Purchase[]\n\n  @@map("media")\n}\n\nmodel MediaGenre {\n  mediaId String\n  genreId String\n  media   Media  @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  genre   Genre  @relation(fields: [genreId], references: [id], onDelete: Cascade)\n\n  @@id([mediaId, genreId])\n  @@map("media_genre")\n}\n\n// ========== REVIEW SYSTEM ==========\n\nmodel Review {\n  id        String       @id @default(uuid())\n  userId    String\n  mediaId   String\n  rating    Int\n  content   String       @db.Text\n  isSpoiler Boolean      @default(false)\n  tags      String[]\n  status    ReviewStatus @default(PENDING)\n  createdAt DateTime     @default(now())\n  updatedAt DateTime     @updatedAt\n\n  user     User            @relation(fields: [userId], references: [id], onDelete: Cascade)\n  media    Media           @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n  likes    ReviewLike[]\n  comments ReviewComment[]\n\n  @@unique([userId, mediaId])\n  @@map("review")\n}\n\nmodel ReviewLike {\n  id        String   @id @default(uuid())\n  userId    String\n  reviewId  String\n  createdAt DateTime @default(now())\n\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n  review Review @relation(fields: [reviewId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, reviewId])\n  @@map("review_like")\n}\n\nmodel ReviewComment {\n  id        String        @id @default(uuid())\n  userId    String\n  reviewId  String\n  content   String\n  parentId  String?\n  status    CommentStatus @default(PENDING)\n  createdAt DateTime      @default(now())\n  updatedAt DateTime      @updatedAt\n\n  user    User            @relation(fields: [userId], references: [id], onDelete: Cascade)\n  review  Review          @relation(fields: [reviewId], references: [id], onDelete: Cascade)\n  parent  ReviewComment?  @relation("CommentReplies", fields: [parentId], references: [id])\n  replies ReviewComment[] @relation("CommentReplies")\n  likes   CommentLike[]\n\n  @@map("review_comment")\n}\n\nmodel CommentLike {\n  id        String   @id @default(uuid())\n  userId    String\n  commentId String\n  createdAt DateTime @default(now())\n\n  user    User          @relation(fields: [userId], references: [id], onDelete: Cascade)\n  comment ReviewComment @relation(fields: [commentId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, commentId])\n  @@map("comment_like")\n}\n\n// ========== WATCHLIST ==========\n\nmodel Watchlist {\n  id        String   @id @default(uuid())\n  userId    String\n  mediaId   String\n  createdAt DateTime @default(now())\n\n  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)\n  media Media @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, mediaId])\n  @@map("watchlist")\n}\n\n// ========== CONTACT PAGE ==========\n\nmodel ContactMessage {\n  id        String   @id @default(uuid())\n  name      String\n  email     String\n  subject   String\n  message   String   @db.Text\n  isRead    Boolean  @default(false)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("contact_message")\n}\n\n// ========== PURCHASES ==========\n\nmodel Purchase {\n  id              String         @id @default(uuid())\n  userId          String\n  mediaId         String\n  stripeSessionId String         @unique\n  stripePaymentId String?\n  amount          Float\n  currency        String         @default("usd")\n  status          PurchaseStatus @default(PENDING)\n  purchaseType    PurchaseType   @default(PURCHASE)\n  rentalDays      Int? // Days for rental (e.g., 7, 30)\n  rentalExpiresAt DateTime? // When rental access expires\n  createdAt       DateTime       @default(now())\n  updatedAt       DateTime       @updatedAt\n\n  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)\n  media Media @relation(fields: [mediaId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, mediaId])\n  @@map("purchase")\n}\n\n// ========== SUBSCRIPTIONS ==========\n\nmodel Subscription {\n  id               String             @id @default(uuid())\n  userId           String\n  plan             SubscriptionPlan   @default(FREE)\n  status           SubscriptionStatus @default(ACTIVE)\n  startDate        DateTime           @default(now())\n  endDate          DateTime?\n  stripeCustomerId String?\n  stripePaymentId  String?\n  amount           Float?\n  createdAt        DateTime           @default(now())\n  updatedAt        DateTime           @updatedAt\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map("subscription")\n}\n\nmodel SubscriptionPlanSetting {\n  id           String           @id @default(uuid())\n  plan         SubscriptionPlan @unique\n  label        String\n  price        Float\n  durationDays Int              @default(0)\n  currency     String           @default("usd")\n  features     String[]\n  isActive     Boolean          @default(true)\n  createdAt    DateTime         @default(now())\n  updatedAt    DateTime         @updatedAt\n\n  @@map("subscription_plan_setting")\n}\n\n// ========== CHAT SYSTEM ==========\n\nmodel ChatSession {\n  id        String     @id @default(uuid())\n  userId    String\n  status    ChatStatus @default(OPEN)\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n\n  user     User          @relation(fields: [userId], references: [id], onDelete: Cascade)\n  messages ChatMessage[]\n\n  @@map("chat_session")\n}\n\nmodel ChatMessage {\n  id            String   @id @default(uuid())\n  chatSessionId String\n  senderId      String\n  content       String?  @db.Text\n  imageUrl      String?\n  createdAt     DateTime @default(now())\n\n  chatSession ChatSession @relation(fields: [chatSessionId], references: [id], onDelete: Cascade)\n  sender      User        @relation(fields: [senderId], references: [id], onDelete: Cascade)\n\n  @@map("chat_message")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"profile","kind":"object","type":"UserProfile","relationName":"UserToUserProfile"},{"name":"adminProfile","kind":"object","type":"AdminProfile","relationName":"AdminProfileToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"reviewLikes","kind":"object","type":"ReviewLike","relationName":"ReviewLikeToUser"},{"name":"comments","kind":"object","type":"ReviewComment","relationName":"ReviewCommentToUser"},{"name":"commentLikes","kind":"object","type":"CommentLike","relationName":"CommentLikeToUser"},{"name":"watchlist","kind":"object","type":"Watchlist","relationName":"UserToWatchlist"},{"name":"subscriptions","kind":"object","type":"Subscription","relationName":"SubscriptionToUser"},{"name":"purchases","kind":"object","type":"Purchase","relationName":"PurchaseToUser"},{"name":"chatSessions","kind":"object","type":"ChatSession","relationName":"ChatSessionToUser"},{"name":"chatMessages","kind":"object","type":"ChatMessage","relationName":"ChatMessageToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"UserProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"UserToUserProfile"},{"name":"bio","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"user_profile"},"AdminProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminProfileToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"admin_profile"},"Genre":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"mediaGenres","kind":"object","type":"MediaGenre","relationName":"GenreToMediaGenre"}],"dbName":"genre"},"Media":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"synopsis","kind":"scalar","type":"String"},{"name":"releaseYear","kind":"scalar","type":"Int"},{"name":"director","kind":"scalar","type":"String"},{"name":"cast","kind":"scalar","type":"String"},{"name":"streamingPlatform","kind":"scalar","type":"String"},{"name":"pricingType","kind":"enum","type":"PricingType"},{"name":"price","kind":"scalar","type":"Float"},{"name":"streamingLink","kind":"scalar","type":"String"},{"name":"posterUrl","kind":"scalar","type":"String"},{"name":"trailerUrl","kind":"scalar","type":"String"},{"name":"isFeatured","kind":"scalar","type":"Boolean"},{"name":"isEditorPick","kind":"scalar","type":"Boolean"},{"name":"mediaType","kind":"enum","type":"MediaType"},{"name":"status","kind":"enum","type":"MediaStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"genres","kind":"object","type":"MediaGenre","relationName":"MediaToMediaGenre"},{"name":"reviews","kind":"object","type":"Review","relationName":"MediaToReview"},{"name":"watchlistEntries","kind":"object","type":"Watchlist","relationName":"MediaToWatchlist"},{"name":"purchases","kind":"object","type":"Purchase","relationName":"MediaToPurchase"}],"dbName":"media"},"MediaGenre":{"fields":[{"name":"mediaId","kind":"scalar","type":"String"},{"name":"genreId","kind":"scalar","type":"String"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToMediaGenre"},{"name":"genre","kind":"object","type":"Genre","relationName":"GenreToMediaGenre"}],"dbName":"media_genre"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"content","kind":"scalar","type":"String"},{"name":"isSpoiler","kind":"scalar","type":"Boolean"},{"name":"tags","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ReviewStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToReview"},{"name":"likes","kind":"object","type":"ReviewLike","relationName":"ReviewToReviewLike"},{"name":"comments","kind":"object","type":"ReviewComment","relationName":"ReviewToReviewComment"}],"dbName":"review"},"ReviewLike":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"reviewId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReviewLikeToUser"},{"name":"review","kind":"object","type":"Review","relationName":"ReviewToReviewLike"}],"dbName":"review_like"},"ReviewComment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"reviewId","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"parentId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"CommentStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ReviewCommentToUser"},{"name":"review","kind":"object","type":"Review","relationName":"ReviewToReviewComment"},{"name":"parent","kind":"object","type":"ReviewComment","relationName":"CommentReplies"},{"name":"replies","kind":"object","type":"ReviewComment","relationName":"CommentReplies"},{"name":"likes","kind":"object","type":"CommentLike","relationName":"CommentLikeToReviewComment"}],"dbName":"review_comment"},"CommentLike":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"commentId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"CommentLikeToUser"},{"name":"comment","kind":"object","type":"ReviewComment","relationName":"CommentLikeToReviewComment"}],"dbName":"comment_like"},"Watchlist":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"UserToWatchlist"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToWatchlist"}],"dbName":"watchlist"},"ContactMessage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"subject","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"contact_message"},"Purchase":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"mediaId","kind":"scalar","type":"String"},{"name":"stripeSessionId","kind":"scalar","type":"String"},{"name":"stripePaymentId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"currency","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PurchaseStatus"},{"name":"purchaseType","kind":"enum","type":"PurchaseType"},{"name":"rentalDays","kind":"scalar","type":"Int"},{"name":"rentalExpiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"PurchaseToUser"},{"name":"media","kind":"object","type":"Media","relationName":"MediaToPurchase"}],"dbName":"purchase"},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"plan","kind":"enum","type":"SubscriptionPlan"},{"name":"status","kind":"enum","type":"SubscriptionStatus"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"stripeCustomerId","kind":"scalar","type":"String"},{"name":"stripePaymentId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"SubscriptionToUser"}],"dbName":"subscription"},"SubscriptionPlanSetting":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"plan","kind":"enum","type":"SubscriptionPlan"},{"name":"label","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"durationDays","kind":"scalar","type":"Int"},{"name":"currency","kind":"scalar","type":"String"},{"name":"features","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"subscription_plan_setting"},"ChatSession":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ChatStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"ChatSessionToUser"},{"name":"messages","kind":"object","type":"ChatMessage","relationName":"ChatMessageToChatSession"}],"dbName":"chat_session"},"ChatMessage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"chatSessionId","kind":"scalar","type":"String"},{"name":"senderId","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"chatSession","kind":"object","type":"ChatSession","relationName":"ChatMessageToChatSession"},{"name":"sender","kind":"object","type":"User","relationName":"ChatMessageToUser"}],"dbName":"chat_message"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","profile","adminProfile","media","mediaGenres","_count","genre","genres","reviews","watchlistEntries","purchases","review","likes","parent","replies","comment","comments","reviewLikes","commentLikes","watchlist","subscriptions","chatSession","sender","messages","chatSessions","chatMessages","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","UserProfile.findUnique","UserProfile.findUniqueOrThrow","UserProfile.findFirst","UserProfile.findFirstOrThrow","UserProfile.findMany","UserProfile.createOne","UserProfile.createMany","UserProfile.createManyAndReturn","UserProfile.updateOne","UserProfile.updateMany","UserProfile.updateManyAndReturn","UserProfile.upsertOne","UserProfile.deleteOne","UserProfile.deleteMany","UserProfile.groupBy","UserProfile.aggregate","AdminProfile.findUnique","AdminProfile.findUniqueOrThrow","AdminProfile.findFirst","AdminProfile.findFirstOrThrow","AdminProfile.findMany","AdminProfile.createOne","AdminProfile.createMany","AdminProfile.createManyAndReturn","AdminProfile.updateOne","AdminProfile.updateMany","AdminProfile.updateManyAndReturn","AdminProfile.upsertOne","AdminProfile.deleteOne","AdminProfile.deleteMany","AdminProfile.groupBy","AdminProfile.aggregate","Genre.findUnique","Genre.findUniqueOrThrow","Genre.findFirst","Genre.findFirstOrThrow","Genre.findMany","Genre.createOne","Genre.createMany","Genre.createManyAndReturn","Genre.updateOne","Genre.updateMany","Genre.updateManyAndReturn","Genre.upsertOne","Genre.deleteOne","Genre.deleteMany","Genre.groupBy","Genre.aggregate","Media.findUnique","Media.findUniqueOrThrow","Media.findFirst","Media.findFirstOrThrow","Media.findMany","Media.createOne","Media.createMany","Media.createManyAndReturn","Media.updateOne","Media.updateMany","Media.updateManyAndReturn","Media.upsertOne","Media.deleteOne","Media.deleteMany","_avg","_sum","Media.groupBy","Media.aggregate","MediaGenre.findUnique","MediaGenre.findUniqueOrThrow","MediaGenre.findFirst","MediaGenre.findFirstOrThrow","MediaGenre.findMany","MediaGenre.createOne","MediaGenre.createMany","MediaGenre.createManyAndReturn","MediaGenre.updateOne","MediaGenre.updateMany","MediaGenre.updateManyAndReturn","MediaGenre.upsertOne","MediaGenre.deleteOne","MediaGenre.deleteMany","MediaGenre.groupBy","MediaGenre.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","ReviewLike.findUnique","ReviewLike.findUniqueOrThrow","ReviewLike.findFirst","ReviewLike.findFirstOrThrow","ReviewLike.findMany","ReviewLike.createOne","ReviewLike.createMany","ReviewLike.createManyAndReturn","ReviewLike.updateOne","ReviewLike.updateMany","ReviewLike.updateManyAndReturn","ReviewLike.upsertOne","ReviewLike.deleteOne","ReviewLike.deleteMany","ReviewLike.groupBy","ReviewLike.aggregate","ReviewComment.findUnique","ReviewComment.findUniqueOrThrow","ReviewComment.findFirst","ReviewComment.findFirstOrThrow","ReviewComment.findMany","ReviewComment.createOne","ReviewComment.createMany","ReviewComment.createManyAndReturn","ReviewComment.updateOne","ReviewComment.updateMany","ReviewComment.updateManyAndReturn","ReviewComment.upsertOne","ReviewComment.deleteOne","ReviewComment.deleteMany","ReviewComment.groupBy","ReviewComment.aggregate","CommentLike.findUnique","CommentLike.findUniqueOrThrow","CommentLike.findFirst","CommentLike.findFirstOrThrow","CommentLike.findMany","CommentLike.createOne","CommentLike.createMany","CommentLike.createManyAndReturn","CommentLike.updateOne","CommentLike.updateMany","CommentLike.updateManyAndReturn","CommentLike.upsertOne","CommentLike.deleteOne","CommentLike.deleteMany","CommentLike.groupBy","CommentLike.aggregate","Watchlist.findUnique","Watchlist.findUniqueOrThrow","Watchlist.findFirst","Watchlist.findFirstOrThrow","Watchlist.findMany","Watchlist.createOne","Watchlist.createMany","Watchlist.createManyAndReturn","Watchlist.updateOne","Watchlist.updateMany","Watchlist.updateManyAndReturn","Watchlist.upsertOne","Watchlist.deleteOne","Watchlist.deleteMany","Watchlist.groupBy","Watchlist.aggregate","ContactMessage.findUnique","ContactMessage.findUniqueOrThrow","ContactMessage.findFirst","ContactMessage.findFirstOrThrow","ContactMessage.findMany","ContactMessage.createOne","ContactMessage.createMany","ContactMessage.createManyAndReturn","ContactMessage.updateOne","ContactMessage.updateMany","ContactMessage.updateManyAndReturn","ContactMessage.upsertOne","ContactMessage.deleteOne","ContactMessage.deleteMany","ContactMessage.groupBy","ContactMessage.aggregate","Purchase.findUnique","Purchase.findUniqueOrThrow","Purchase.findFirst","Purchase.findFirstOrThrow","Purchase.findMany","Purchase.createOne","Purchase.createMany","Purchase.createManyAndReturn","Purchase.updateOne","Purchase.updateMany","Purchase.updateManyAndReturn","Purchase.upsertOne","Purchase.deleteOne","Purchase.deleteMany","Purchase.groupBy","Purchase.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","Subscription.groupBy","Subscription.aggregate","SubscriptionPlanSetting.findUnique","SubscriptionPlanSetting.findUniqueOrThrow","SubscriptionPlanSetting.findFirst","SubscriptionPlanSetting.findFirstOrThrow","SubscriptionPlanSetting.findMany","SubscriptionPlanSetting.createOne","SubscriptionPlanSetting.createMany","SubscriptionPlanSetting.createManyAndReturn","SubscriptionPlanSetting.updateOne","SubscriptionPlanSetting.updateMany","SubscriptionPlanSetting.updateManyAndReturn","SubscriptionPlanSetting.upsertOne","SubscriptionPlanSetting.deleteOne","SubscriptionPlanSetting.deleteMany","SubscriptionPlanSetting.groupBy","SubscriptionPlanSetting.aggregate","ChatSession.findUnique","ChatSession.findUniqueOrThrow","ChatSession.findFirst","ChatSession.findFirstOrThrow","ChatSession.findMany","ChatSession.createOne","ChatSession.createMany","ChatSession.createManyAndReturn","ChatSession.updateOne","ChatSession.updateMany","ChatSession.updateManyAndReturn","ChatSession.upsertOne","ChatSession.deleteOne","ChatSession.deleteMany","ChatSession.groupBy","ChatSession.aggregate","ChatMessage.findUnique","ChatMessage.findUniqueOrThrow","ChatMessage.findFirst","ChatMessage.findFirstOrThrow","ChatMessage.findMany","ChatMessage.createOne","ChatMessage.createMany","ChatMessage.createManyAndReturn","ChatMessage.updateOne","ChatMessage.updateMany","ChatMessage.updateManyAndReturn","ChatMessage.upsertOne","ChatMessage.deleteOne","ChatMessage.deleteMany","ChatMessage.groupBy","ChatMessage.aggregate","AND","OR","NOT","id","chatSessionId","senderId","content","imageUrl","createdAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","userId","ChatStatus","status","updatedAt","SubscriptionPlan","plan","label","price","durationDays","currency","features","isActive","has","hasEvery","hasSome","SubscriptionStatus","startDate","endDate","stripeCustomerId","stripePaymentId","amount","mediaId","stripeSessionId","PurchaseStatus","PurchaseType","purchaseType","rentalDays","rentalExpiresAt","name","email","subject","message","isRead","commentId","reviewId","parentId","CommentStatus","rating","isSpoiler","tags","ReviewStatus","genreId","title","synopsis","releaseYear","director","cast","streamingPlatform","PricingType","pricingType","streamingLink","posterUrl","trailerUrl","isFeatured","isEditorPick","MediaType","mediaType","MediaStatus","every","some","none","bio","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","Role","role","UserStatus","needPasswordChange","isDeleted","deletedAt","image","userId_commentId","userId_reviewId","userId_mediaId","mediaId_genreId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","push","increment","decrement","multiply","divide"]'),
  graph: "ggqxAcACHAQAAJMFACAFAACUBQAgBgAAlQUAIAcAAJYFACANAAD6BAAgDwAA_AQAIBUAAJgFACAWAACXBQAgFwAAmQUAIBgAAPsEACAZAACaBQAgHQAAmwUAIB4AAJwFACDnAgAAjwUAMOgCAABXABDpAgAAjwUAMOoCAQAAAAHvAkAAxwQAIf0CAACRBcwDIv4CQADHBAAhlwMBAMIEACGYAwEAAAAByAMgAMYEACHKAwAAkAXKAyLMAyAAxgQAIc0DIADGBAAhzgNAAJIFACHPAwEA9gQAIQEAAAABACAMAwAAgQUAIOcCAAC7BQAw6AIAAAMAEOkCAAC7BQAw6gIBAMIEACHvAkAAxwQAIfsCAQDCBAAh_gJAAMcEACG7A0AAxwQAIcUDAQDCBAAhxgMBAPYEACHHAwEA9gQAIQMDAADBBwAgxgMAALwFACDHAwAAvAUAIAwDAACBBQAg5wIAALsFADDoAgAAAwAQ6QIAALsFADDqAgEAAAAB7wJAAMcEACH7AgEAwgQAIf4CQADHBAAhuwNAAMcEACHFAwEAAAABxgMBAPYEACHHAwEA9gQAIQMAAAADACABAAAEADACAAAFACARAwAAgQUAIOcCAAC6BQAw6AIAAAcAEOkCAAC6BQAw6gIBAMIEACHvAkAAxwQAIfsCAQDCBAAh_gJAAMcEACG8AwEAwgQAIb0DAQDCBAAhvgMBAPYEACG_AwEA9gQAIcADAQD2BAAhwQNAAJIFACHCA0AAkgUAIcMDAQD2BAAhxAMBAPYEACEIAwAAwQcAIL4DAAC8BQAgvwMAALwFACDAAwAAvAUAIMEDAAC8BQAgwgMAALwFACDDAwAAvAUAIMQDAAC8BQAgEQMAAIEFACDnAgAAugUAMOgCAAAHABDpAgAAugUAMOoCAQAAAAHvAkAAxwQAIfsCAQDCBAAh_gJAAMcEACG8AwEAwgQAIb0DAQDCBAAhvgMBAPYEACG_AwEA9gQAIcADAQD2BAAhwQNAAJIFACHCA0AAkgUAIcMDAQD2BAAhxAMBAPYEACEDAAAABwAgAQAACAAwAgAACQAgCQMAAIEFACDnAgAAgwUAMOgCAAALABDpAgAAgwUAMOoCAQDCBAAh7wJAAMcEACH7AgEAwgQAIf4CQADHBAAhuAMBAPYEACEBAAAACwAgCAMAAIEFACDnAgAAgAUAMOgCAAANABDpAgAAgAUAMOoCAQDCBAAh7wJAAMcEACH7AgEAwgQAIf4CQADHBAAhAQAAAA0AIBEDAACBBQAgCAAAsQUAIBEAAJcFACAVAACYBQAg5wIAALgFADDoAgAADwAQ6QIAALgFADDqAgEAwgQAIe0CAQDCBAAh7wJAAMcEACH7AgEAwgQAIf0CAAC5BaQDIv4CQADHBAAhkAMBAMIEACGgAwIAxQQAIaEDIADGBAAhogMAALgEACAEAwAAwQcAIAgAAPkIACARAADwCAAgFQAA8QgAIBIDAACBBQAgCAAAsQUAIBEAAJcFACAVAACYBQAg5wIAALgFADDoAgAADwAQ6QIAALgFADDqAgEAAAAB7QIBAMIEACHvAkAAxwQAIfsCAQDCBAAh_QIAALkFpAMi_gJAAMcEACGQAwEAwgQAIaADAgDFBAAhoQMgAMYEACGiAwAAuAQAINIDAAC3BQAgAwAAAA8AIAEAABAAMAIAABEAIAcIAACxBQAgCwAAtgUAIOcCAAC1BQAw6AIAABMAEOkCAAC1BQAwkAMBAMIEACGkAwEAwgQAIQIIAAD5CAAgCwAA-ggAIAgIAACxBQAgCwAAtgUAIOcCAAC1BQAw6AIAABMAEOkCAAC1BQAwkAMBAMIEACGkAwEAwgQAIdMDAAC0BQAgAwAAABMAIAEAABQAMAIAABUAIAMAAAATACABAAAUADACAAAVACABAAAAEwAgAwAAAA8AIAEAABAAMAIAABEAIAkDAACBBQAgCAAAsQUAIOcCAACzBQAw6AIAABoAEOkCAACzBQAw6gIBAMIEACHvAkAAxwQAIfsCAQDCBAAhkAMBAMIEACECAwAAwQcAIAgAAPkIACAKAwAAgQUAIAgAALEFACDnAgAAswUAMOgCAAAaABDpAgAAswUAMOoCAQAAAAHvAkAAxwQAIfsCAQDCBAAhkAMBAMIEACHSAwAAsgUAIAMAAAAaACABAAAbADACAAAcACASAwAAgQUAIAgAALEFACDnAgAArQUAMOgCAAAeABDpAgAArQUAMOoCAQDCBAAh7wJAAMcEACH7AgEAwgQAIf0CAACuBZMDIv4CQADHBAAhhAMBAMIEACGOAwEA9gQAIY8DCADEBAAhkAMBAMIEACGRAwEAwgQAIZQDAACvBZQDIpUDAgCwBQAhlgNAAJIFACEFAwAAwQcAIAgAAPkIACCOAwAAvAUAIJUDAAC8BQAglgMAALwFACATAwAAgQUAIAgAALEFACDnAgAArQUAMOgCAAAeABDpAgAArQUAMOoCAQAAAAHvAkAAxwQAIfsCAQDCBAAh_QIAAK4FkwMi_gJAAMcEACGEAwEAwgQAIY4DAQD2BAAhjwMIAMQEACGQAwEAwgQAIZEDAQAAAAGUAwAArwWUAyKVAwIAsAUAIZYDQACSBQAh0gMAAKwFACADAAAAHgAgAQAAHwAwAgAAIAAgAQAAABMAIAEAAAAPACABAAAAGgAgAQAAAB4AIAkDAACBBQAgEAAAqAUAIOcCAACrBQAw6AIAACYAEOkCAACrBQAw6gIBAMIEACHvAkAAxwQAIfsCAQDCBAAhnQMBAMIEACECAwAAwQcAIBAAAPgIACAKAwAAgQUAIBAAAKgFACDnAgAAqwUAMOgCAAAmABDpAgAAqwUAMOoCAQAAAAHvAkAAxwQAIfsCAQDCBAAhnQMBAMIEACHRAwAAqgUAIAMAAAAmACABAAAnADACAAAoACAQAwAAgQUAIBAAAKgFACARAACZBQAgEgAAqQUAIBMAAJgFACDnAgAApgUAMOgCAAAqABDpAgAApgUAMOoCAQDCBAAh7QIBAMIEACHvAkAAxwQAIfsCAQDCBAAh_QIAAKcFoAMi_gJAAMcEACGdAwEAwgQAIZ4DAQD2BAAhBgMAAMEHACAQAAD4CAAgEQAA8ggAIBIAAPcIACATAADxCAAgngMAALwFACAQAwAAgQUAIBAAAKgFACARAACZBQAgEgAAqQUAIBMAAJgFACDnAgAApgUAMOgCAAAqABDpAgAApgUAMOoCAQAAAAHtAgEAwgQAIe8CQADHBAAh-wIBAMIEACH9AgAApwWgAyL-AkAAxwQAIZ0DAQDCBAAhngMBAPYEACEDAAAAKgAgAQAAKwAwAgAALAAgAQAAACoAIAMAAAAqACABAAArADACAAAsACAJAwAAgQUAIBQAAKUFACDnAgAApAUAMOgCAAAwABDpAgAApAUAMOoCAQDCBAAh7wJAAMcEACH7AgEAwgQAIZwDAQDCBAAhAgMAAMEHACAUAAD3CAAgCgMAAIEFACAUAAClBQAg5wIAAKQFADDoAgAAMAAQ6QIAAKQFADDqAgEAAAAB7wJAAMcEACH7AgEAwgQAIZwDAQDCBAAh0AMAAKMFACADAAAAMAAgAQAAMQAwAgAAMgAgAQAAACoAIAEAAAAwACABAAAAJgAgAQAAACoAIAMAAAAmACABAAAnADACAAAoACADAAAAKgAgAQAAKwAwAgAALAAgAwAAADAAIAEAADEAMAIAADIAIAMAAAAaACABAAAbADACAAAcACAPAwAAgQUAIOcCAAChBQAw6AIAADwAEOkCAAChBQAw6gIBAMIEACHvAkAAxwQAIfsCAQDCBAAh_QIAAKIFiwMi_gJAAMcEACGAAwAAwwSAAyKLA0AAxwQAIYwDQACSBQAhjQMBAPYEACGOAwEA9gQAIY8DCAD1BAAhBQMAAMEHACCMAwAAvAUAII0DAAC8BQAgjgMAALwFACCPAwAAvAUAIA8DAACBBQAg5wIAAKEFADDoAgAAPAAQ6QIAAKEFADDqAgEAAAAB7wJAAMcEACH7AgEAwgQAIf0CAACiBYsDIv4CQADHBAAhgAMAAMMEgAMiiwNAAMcEACGMA0AAkgUAIY0DAQD2BAAhjgMBAPYEACGPAwgA9QQAIQMAAAA8ACABAAA9ADACAAA-ACADAAAAHgAgAQAAHwAwAgAAIAAgCgMAAIEFACAcAACcBQAg5wIAAJ8FADDoAgAAQQAQ6QIAAJ8FADDqAgEAwgQAIe8CQADHBAAh-wIBAMIEACH9AgAAoAX9AiL-AkAAxwQAIQIDAADBBwAgHAAA9QgAIAoDAACBBQAgHAAAnAUAIOcCAACfBQAw6AIAAEEAEOkCAACfBQAw6gIBAAAAAe8CQADHBAAh-wIBAMIEACH9AgAAoAX9AiL-AkAAxwQAIQMAAABBACABAABCADACAABDACALGgAAngUAIBsAAIEFACDnAgAAnQUAMOgCAABFABDpAgAAnQUAMOoCAQDCBAAh6wIBAMIEACHsAgEAwgQAIe0CAQD2BAAh7gIBAPYEACHvAkAAxwQAIQQaAAD2CAAgGwAAwQcAIO0CAAC8BQAg7gIAALwFACALGgAAngUAIBsAAIEFACDnAgAAnQUAMOgCAABFABDpAgAAnQUAMOoCAQAAAAHrAgEAwgQAIewCAQDCBAAh7QIBAPYEACHuAgEA9gQAIe8CQADHBAAhAwAAAEUAIAEAAEYAMAIAAEcAIAEAAABFACADAAAARQAgAQAARgAwAgAARwAgAQAAAAMAIAEAAAAHACABAAAADwAgAQAAACYAIAEAAAAqACABAAAAMAAgAQAAABoAIAEAAAA8ACABAAAAHgAgAQAAAEEAIAEAAABFACABAAAAAQAgHAQAAJMFACAFAACUBQAgBgAAlQUAIAcAAJYFACANAAD6BAAgDwAA_AQAIBUAAJgFACAWAACXBQAgFwAAmQUAIBgAAPsEACAZAACaBQAgHQAAmwUAIB4AAJwFACDnAgAAjwUAMOgCAABXABDpAgAAjwUAMOoCAQDCBAAh7wJAAMcEACH9AgAAkQXMAyL-AkAAxwQAIZcDAQDCBAAhmAMBAMIEACHIAyAAxgQAIcoDAACQBcoDIswDIADGBAAhzQMgAMYEACHOA0AAkgUAIc8DAQD2BAAhDwQAAOwIACAFAADtCAAgBgAA7ggAIAcAAO8IACANAACrBwAgDwAArQcAIBUAAPEIACAWAADwCAAgFwAA8ggAIBgAAKwHACAZAADzCAAgHQAA9AgAIB4AAPUIACDOAwAAvAUAIM8DAAC8BQAgAwAAAFcAIAEAAFgAMAIAAAEAIAMAAABXACABAABYADACAAABACADAAAAVwAgAQAAWAAwAgAAAQAgGQQAAN8IACAFAADgCAAgBgAA4QgAIAcAAOIIACANAADjCAAgDwAA6QgAIBUAAOUIACAWAADkCAAgFwAA5ggAIBgAAOcIACAZAADoCAAgHQAA6ggAIB4AAOsIACDqAgEAAAAB7wJAAAAAAf0CAAAAzAMC_gJAAAAAAZcDAQAAAAGYAwEAAAAByAMgAAAAAcoDAAAAygMCzAMgAAAAAc0DIAAAAAHOA0AAAAABzwMBAAAAAQEkAABcACAM6gIBAAAAAe8CQAAAAAH9AgAAAMwDAv4CQAAAAAGXAwEAAAABmAMBAAAAAcgDIAAAAAHKAwAAAMoDAswDIAAAAAHNAyAAAAABzgNAAAAAAc8DAQAAAAEBJAAAXgAwASQAAF4AMBkEAADZBwAgBQAA2gcAIAYAANsHACAHAADcBwAgDQAA3QcAIA8AAOMHACAVAADfBwAgFgAA3gcAIBcAAOAHACAYAADhBwAgGQAA4gcAIB0AAOQHACAeAADlBwAg6gIBAMAFACHvAkAAwgUAIf0CAADYB8wDIv4CQADCBQAhlwMBAMAFACGYAwEAwAUAIcgDIADkBQAhygMAANcHygMizAMgAOQFACHNAyAA5AUAIc4DQADsBQAhzwMBAMEFACECAAAAAQAgJAAAYQAgDOoCAQDABQAh7wJAAMIFACH9AgAA2AfMAyL-AkAAwgUAIZcDAQDABQAhmAMBAMAFACHIAyAA5AUAIcoDAADXB8oDIswDIADkBQAhzQMgAOQFACHOA0AA7AUAIc8DAQDBBQAhAgAAAFcAICQAAGMAIAIAAABXACAkAABjACADAAAAAQAgKwAAXAAgLAAAYQAgAQAAAAEAIAEAAABXACAFCgAA1AcAIDEAANYHACAyAADVBwAgzgMAALwFACDPAwAAvAUAIA_nAgAAiAUAMOgCAABqABDpAgAAiAUAMOoCAQClBAAh7wJAAKcEACH9AgAAigXMAyL-AkAApwQAIZcDAQClBAAhmAMBAKUEACHIAyAAuQQAIcoDAACJBcoDIswDIAC5BAAhzQMgALkEACHOA0AAygQAIc8DAQCmBAAhAwAAAFcAIAEAAGkAMDAAAGoAIAMAAABXACABAABYADACAAABACABAAAABQAgAQAAAAUAIAMAAAADACABAAAEADACAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAkDAADTBwAg6gIBAAAAAe8CQAAAAAH7AgEAAAAB_gJAAAAAAbsDQAAAAAHFAwEAAAABxgMBAAAAAccDAQAAAAEBJAAAcgAgCOoCAQAAAAHvAkAAAAAB-wIBAAAAAf4CQAAAAAG7A0AAAAABxQMBAAAAAcYDAQAAAAHHAwEAAAABASQAAHQAMAEkAAB0ADAJAwAA0gcAIOoCAQDABQAh7wJAAMIFACH7AgEAwAUAIf4CQADCBQAhuwNAAMIFACHFAwEAwAUAIcYDAQDBBQAhxwMBAMEFACECAAAABQAgJAAAdwAgCOoCAQDABQAh7wJAAMIFACH7AgEAwAUAIf4CQADCBQAhuwNAAMIFACHFAwEAwAUAIcYDAQDBBQAhxwMBAMEFACECAAAAAwAgJAAAeQAgAgAAAAMAICQAAHkAIAMAAAAFACArAAByACAsAAB3ACABAAAABQAgAQAAAAMAIAUKAADPBwAgMQAA0QcAIDIAANAHACDGAwAAvAUAIMcDAAC8BQAgC-cCAACHBQAw6AIAAIABABDpAgAAhwUAMOoCAQClBAAh7wJAAKcEACH7AgEApQQAIf4CQACnBAAhuwNAAKcEACHFAwEApQQAIcYDAQCmBAAhxwMBAKYEACEDAAAAAwAgAQAAfwAwMAAAgAEAIAMAAAADACABAAAEADACAAAFACABAAAACQAgAQAAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIA4DAADOBwAg6gIBAAAAAe8CQAAAAAH7AgEAAAAB_gJAAAAAAbwDAQAAAAG9AwEAAAABvgMBAAAAAb8DAQAAAAHAAwEAAAABwQNAAAAAAcIDQAAAAAHDAwEAAAABxAMBAAAAAQEkAACIAQAgDeoCAQAAAAHvAkAAAAAB-wIBAAAAAf4CQAAAAAG8AwEAAAABvQMBAAAAAb4DAQAAAAG_AwEAAAABwAMBAAAAAcEDQAAAAAHCA0AAAAABwwMBAAAAAcQDAQAAAAEBJAAAigEAMAEkAACKAQAwDgMAAM0HACDqAgEAwAUAIe8CQADCBQAh-wIBAMAFACH-AkAAwgUAIbwDAQDABQAhvQMBAMAFACG-AwEAwQUAIb8DAQDBBQAhwAMBAMEFACHBA0AA7AUAIcIDQADsBQAhwwMBAMEFACHEAwEAwQUAIQIAAAAJACAkAACNAQAgDeoCAQDABQAh7wJAAMIFACH7AgEAwAUAIf4CQADCBQAhvAMBAMAFACG9AwEAwAUAIb4DAQDBBQAhvwMBAMEFACHAAwEAwQUAIcEDQADsBQAhwgNAAOwFACHDAwEAwQUAIcQDAQDBBQAhAgAAAAcAICQAAI8BACACAAAABwAgJAAAjwEAIAMAAAAJACArAACIAQAgLAAAjQEAIAEAAAAJACABAAAABwAgCgoAAMoHACAxAADMBwAgMgAAywcAIL4DAAC8BQAgvwMAALwFACDAAwAAvAUAIMEDAAC8BQAgwgMAALwFACDDAwAAvAUAIMQDAAC8BQAgEOcCAACGBQAw6AIAAJYBABDpAgAAhgUAMOoCAQClBAAh7wJAAKcEACH7AgEApQQAIf4CQACnBAAhvAMBAKUEACG9AwEApQQAIb4DAQCmBAAhvwMBAKYEACHAAwEApgQAIcEDQADKBAAhwgNAAMoEACHDAwEApgQAIcQDAQCmBAAhAwAAAAcAIAEAAJUBADAwAACWAQAgAwAAAAcAIAEAAAgAMAIAAAkAIAnnAgAAhQUAMOgCAACcAQAQ6QIAAIUFADDqAgEAAAAB7wJAAMcEACH-AkAAxwQAIbkDAQDCBAAhugMBAMIEACG7A0AAxwQAIQEAAACZAQAgAQAAAJkBACAJ5wIAAIUFADDoAgAAnAEAEOkCAACFBQAw6gIBAMIEACHvAkAAxwQAIf4CQADHBAAhuQMBAMIEACG6AwEAwgQAIbsDQADHBAAhAAMAAACcAQAgAQAAnQEAMAIAAJkBACADAAAAnAEAIAEAAJ0BADACAACZAQAgAwAAAJwBACABAACdAQAwAgAAmQEAIAbqAgEAAAAB7wJAAAAAAf4CQAAAAAG5AwEAAAABugMBAAAAAbsDQAAAAAEBJAAAoQEAIAbqAgEAAAAB7wJAAAAAAf4CQAAAAAG5AwEAAAABugMBAAAAAbsDQAAAAAEBJAAAowEAMAEkAACjAQAwBuoCAQDABQAh7wJAAMIFACH-AkAAwgUAIbkDAQDABQAhugMBAMAFACG7A0AAwgUAIQIAAACZAQAgJAAApgEAIAbqAgEAwAUAIe8CQADCBQAh_gJAAMIFACG5AwEAwAUAIboDAQDABQAhuwNAAMIFACECAAAAnAEAICQAAKgBACACAAAAnAEAICQAAKgBACADAAAAmQEAICsAAKEBACAsAACmAQAgAQAAAJkBACABAAAAnAEAIAMKAADHBwAgMQAAyQcAIDIAAMgHACAJ5wIAAIQFADDoAgAArwEAEOkCAACEBQAw6gIBAKUEACHvAkAApwQAIf4CQACnBAAhuQMBAKUEACG6AwEApQQAIbsDQACnBAAhAwAAAJwBACABAACuAQAwMAAArwEAIAMAAACcAQAgAQAAnQEAMAIAAJkBACAJAwAAgQUAIOcCAACDBQAw6AIAAAsAEOkCAACDBQAw6gIBAAAAAe8CQADHBAAh-wIBAAAAAf4CQADHBAAhuAMBAPYEACEBAAAAsgEAIAEAAACyAQAgAgMAAMEHACC4AwAAvAUAIAMAAAALACABAAC1AQAwAgAAsgEAIAMAAAALACABAAC1AQAwAgAAsgEAIAMAAAALACABAAC1AQAwAgAAsgEAIAYDAADGBwAg6gIBAAAAAe8CQAAAAAH7AgEAAAAB_gJAAAAAAbgDAQAAAAEBJAAAuQEAIAXqAgEAAAAB7wJAAAAAAfsCAQAAAAH-AkAAAAABuAMBAAAAAQEkAAC7AQAwASQAALsBADAGAwAAxQcAIOoCAQDABQAh7wJAAMIFACH7AgEAwAUAIf4CQADCBQAhuAMBAMEFACECAAAAsgEAICQAAL4BACAF6gIBAMAFACHvAkAAwgUAIfsCAQDABQAh_gJAAMIFACG4AwEAwQUAIQIAAAALACAkAADAAQAgAgAAAAsAICQAAMABACADAAAAsgEAICsAALkBACAsAAC-AQAgAQAAALIBACABAAAACwAgBAoAAMIHACAxAADEBwAgMgAAwwcAILgDAAC8BQAgCOcCAACCBQAw6AIAAMcBABDpAgAAggUAMOoCAQClBAAh7wJAAKcEACH7AgEApQQAIf4CQACnBAAhuAMBAKYEACEDAAAACwAgAQAAxgEAMDAAAMcBACADAAAACwAgAQAAtQEAMAIAALIBACAIAwAAgQUAIOcCAACABQAw6AIAAA0AEOkCAACABQAw6gIBAAAAAe8CQADHBAAh-wIBAAAAAf4CQADHBAAhAQAAAMoBACABAAAAygEAIAEDAADBBwAgAwAAAA0AIAEAAM0BADACAADKAQAgAwAAAA0AIAEAAM0BADACAADKAQAgAwAAAA0AIAEAAM0BADACAADKAQAgBQMAAMAHACDqAgEAAAAB7wJAAAAAAfsCAQAAAAH-AkAAAAABASQAANEBACAE6gIBAAAAAe8CQAAAAAH7AgEAAAAB_gJAAAAAAQEkAADTAQAwASQAANMBADAFAwAAvwcAIOoCAQDABQAh7wJAAMIFACH7AgEAwAUAIf4CQADCBQAhAgAAAMoBACAkAADWAQAgBOoCAQDABQAh7wJAAMIFACH7AgEAwAUAIf4CQADCBQAhAgAAAA0AICQAANgBACACAAAADQAgJAAA2AEAIAMAAADKAQAgKwAA0QEAICwAANYBACABAAAAygEAIAEAAAANACADCgAAvAcAIDEAAL4HACAyAAC9BwAgB-cCAAD_BAAw6AIAAN8BABDpAgAA_wQAMOoCAQClBAAh7wJAAKcEACH7AgEApQQAIf4CQACnBAAhAwAAAA0AIAEAAN4BADAwAADfAQAgAwAAAA0AIAEAAM0BADACAADKAQAgCAkAAPkEACDnAgAA_gQAMOgCAADlAQAQ6QIAAP4EADDqAgEAAAAB7wJAAMcEACH-AkAAxwQAIZcDAQAAAAEBAAAA4gEAIAEAAADiAQAgCAkAAPkEACDnAgAA_gQAMOgCAADlAQAQ6QIAAP4EADDqAgEAwgQAIe8CQADHBAAh_gJAAMcEACGXAwEAwgQAIQEJAACqBwAgAwAAAOUBACABAADmAQAwAgAA4gEAIAMAAADlAQAgAQAA5gEAMAIAAOIBACADAAAA5QEAIAEAAOYBADACAADiAQAgBQkAALsHACDqAgEAAAAB7wJAAAAAAf4CQAAAAAGXAwEAAAABASQAAOoBACAE6gIBAAAAAe8CQAAAAAH-AkAAAAABlwMBAAAAAQEkAADsAQAwASQAAOwBADAFCQAAsQcAIOoCAQDABQAh7wJAAMIFACH-AkAAwgUAIZcDAQDABQAhAgAAAOIBACAkAADvAQAgBOoCAQDABQAh7wJAAMIFACH-AkAAwgUAIZcDAQDABQAhAgAAAOUBACAkAADxAQAgAgAAAOUBACAkAADxAQAgAwAAAOIBACArAADqAQAgLAAA7wEAIAEAAADiAQAgAQAAAOUBACADCgAArgcAIDEAALAHACAyAACvBwAgB-cCAAD9BAAw6AIAAPgBABDpAgAA_QQAMOoCAQClBAAh7wJAAKcEACH-AkAApwQAIZcDAQClBAAhAwAAAOUBACABAAD3AQAwMAAA-AEAIAMAAADlAQAgAQAA5gEAMAIAAOIBACAZDAAA-QQAIA0AAPoEACAOAAD7BAAgDwAA_AQAIOcCAADzBAAw6AIAAP4BABDpAgAA8wQAMOoCAQAAAAHvAkAAxwQAIf0CAAD4BLUDIv4CQADHBAAhggMIAPUEACGlAwEAwgQAIaYDAQDCBAAhpwMCAMUEACGoAwEAwgQAIakDAAC4BAAgqgMAALgEACCsAwAA9ASsAyKtAwEA9gQAIa4DAQD2BAAhrwMBAPYEACGwAyAAxgQAIbEDIADGBAAhswMAAPcEswMiAQAAAPsBACABAAAA-wEAIBkMAAD5BAAgDQAA-gQAIA4AAPsEACAPAAD8BAAg5wIAAPMEADDoAgAA_gEAEOkCAADzBAAw6gIBAMIEACHvAkAAxwQAIf0CAAD4BLUDIv4CQADHBAAhggMIAPUEACGlAwEAwgQAIaYDAQDCBAAhpwMCAMUEACGoAwEAwgQAIakDAAC4BAAgqgMAALgEACCsAwAA9ASsAyKtAwEA9gQAIa4DAQD2BAAhrwMBAPYEACGwAyAAxgQAIbEDIADGBAAhswMAAPcEswMiCAwAAKoHACANAACrBwAgDgAArAcAIA8AAK0HACCCAwAAvAUAIK0DAAC8BQAgrgMAALwFACCvAwAAvAUAIAMAAAD-AQAgAQAA_wEAMAIAAPsBACADAAAA_gEAIAEAAP8BADACAAD7AQAgAwAAAP4BACABAAD_AQAwAgAA-wEAIBYMAACmBwAgDQAApwcAIA4AAKgHACAPAACpBwAg6gIBAAAAAe8CQAAAAAH9AgAAALUDAv4CQAAAAAGCAwgAAAABpQMBAAAAAaYDAQAAAAGnAwIAAAABqAMBAAAAAakDAACkBwAgqgMAAKUHACCsAwAAAKwDAq0DAQAAAAGuAwEAAAABrwMBAAAAAbADIAAAAAGxAyAAAAABswMAAACzAwIBJAAAgwIAIBLqAgEAAAAB7wJAAAAAAf0CAAAAtQMC_gJAAAAAAYIDCAAAAAGlAwEAAAABpgMBAAAAAacDAgAAAAGoAwEAAAABqQMAAKQHACCqAwAApQcAIKwDAAAArAMCrQMBAAAAAa4DAQAAAAGvAwEAAAABsAMgAAAAAbEDIAAAAAGzAwAAALMDAgEkAACFAgAwASQAAIUCADAWDAAA8AYAIA0AAPEGACAOAADyBgAgDwAA8wYAIOoCAQDABQAh7wJAAMIFACH9AgAA7wa1AyL-AkAAwgUAIYIDCADtBQAhpQMBAMAFACGmAwEAwAUAIacDAgDiBQAhqAMBAMAFACGpAwAA6wYAIKoDAADsBgAgrAMAAO0GrAMirQMBAMEFACGuAwEAwQUAIa8DAQDBBQAhsAMgAOQFACGxAyAA5AUAIbMDAADuBrMDIgIAAAD7AQAgJAAAiAIAIBLqAgEAwAUAIe8CQADCBQAh_QIAAO8GtQMi_gJAAMIFACGCAwgA7QUAIaUDAQDABQAhpgMBAMAFACGnAwIA4gUAIagDAQDABQAhqQMAAOsGACCqAwAA7AYAIKwDAADtBqwDIq0DAQDBBQAhrgMBAMEFACGvAwEAwQUAIbADIADkBQAhsQMgAOQFACGzAwAA7gazAyICAAAA_gEAICQAAIoCACACAAAA_gEAICQAAIoCACADAAAA-wEAICsAAIMCACAsAACIAgAgAQAAAPsBACABAAAA_gEAIAkKAADmBgAgMQAA6QYAIDIAAOgGACCjAQAA5wYAIKQBAADqBgAgggMAALwFACCtAwAAvAUAIK4DAAC8BQAgrwMAALwFACAV5wIAAOkEADDoAgAAkQIAEOkCAADpBAAw6gIBAKUEACHvAkAApwQAIf0CAADsBLUDIv4CQACnBAAhggMIAMsEACGlAwEApQQAIaYDAQClBAAhpwMCALcEACGoAwEApQQAIakDAAC4BAAgqgMAALgEACCsAwAA6gSsAyKtAwEApgQAIa4DAQCmBAAhrwMBAKYEACGwAyAAuQQAIbEDIAC5BAAhswMAAOsEswMiAwAAAP4BACABAACQAgAwMAAAkQIAIAMAAAD-AQAgAQAA_wEAMAIAAPsBACABAAAAFQAgAQAAABUAIAMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgAwAAABMAIAEAABQAMAIAABUAIAQIAADkBgAgCwAA5QYAIJADAQAAAAGkAwEAAAABASQAAJkCACACkAMBAAAAAaQDAQAAAAEBJAAAmwIAMAEkAACbAgAwBAgAAOIGACALAADjBgAgkAMBAMAFACGkAwEAwAUAIQIAAAAVACAkAACeAgAgApADAQDABQAhpAMBAMAFACECAAAAEwAgJAAAoAIAIAIAAAATACAkAACgAgAgAwAAABUAICsAAJkCACAsAACeAgAgAQAAABUAIAEAAAATACADCgAA3wYAIDEAAOEGACAyAADgBgAgBecCAADoBAAw6AIAAKcCABDpAgAA6AQAMJADAQClBAAhpAMBAKUEACEDAAAAEwAgAQAApgIAMDAAAKcCACADAAAAEwAgAQAAFAAwAgAAFQAgAQAAABEAIAEAAAARACADAAAADwAgAQAAEAAwAgAAEQAgAwAAAA8AIAEAABAAMAIAABEAIAMAAAAPACABAAAQADACAAARACAOAwAA2wYAIAgAANwGACARAADdBgAgFQAA3gYAIOoCAQAAAAHtAgEAAAAB7wJAAAAAAfsCAQAAAAH9AgAAAKQDAv4CQAAAAAGQAwEAAAABoAMCAAAAAaEDIAAAAAGiAwAA2gYAIAEkAACvAgAgCuoCAQAAAAHtAgEAAAAB7wJAAAAAAfsCAQAAAAH9AgAAAKQDAv4CQAAAAAGQAwEAAAABoAMCAAAAAaEDIAAAAAGiAwAA2gYAIAEkAACxAgAwASQAALECADAOAwAAwQYAIAgAAMIGACARAADDBgAgFQAAxAYAIOoCAQDABQAh7QIBAMAFACHvAkAAwgUAIfsCAQDABQAh_QIAAMAGpAMi_gJAAMIFACGQAwEAwAUAIaADAgDiBQAhoQMgAOQFACGiAwAAvwYAIAIAAAARACAkAAC0AgAgCuoCAQDABQAh7QIBAMAFACHvAkAAwgUAIfsCAQDABQAh_QIAAMAGpAMi_gJAAMIFACGQAwEAwAUAIaADAgDiBQAhoQMgAOQFACGiAwAAvwYAIAIAAAAPACAkAAC2AgAgAgAAAA8AICQAALYCACADAAAAEQAgKwAArwIAICwAALQCACABAAAAEQAgAQAAAA8AIAUKAAC6BgAgMQAAvQYAIDIAALwGACCjAQAAuwYAIKQBAAC-BgAgDecCAADkBAAw6AIAAL0CABDpAgAA5AQAMOoCAQClBAAh7QIBAKUEACHvAkAApwQAIfsCAQClBAAh_QIAAOUEpAMi_gJAAKcEACGQAwEApQQAIaADAgC3BAAhoQMgALkEACGiAwAAuAQAIAMAAAAPACABAAC8AgAwMAAAvQIAIAMAAAAPACABAAAQADACAAARACABAAAAKAAgAQAAACgAIAMAAAAmACABAAAnADACAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAACYAIAEAACcAMAIAACgAIAYDAAC4BgAgEAAAuQYAIOoCAQAAAAHvAkAAAAAB-wIBAAAAAZ0DAQAAAAEBJAAAxQIAIATqAgEAAAAB7wJAAAAAAfsCAQAAAAGdAwEAAAABASQAAMcCADABJAAAxwIAMAYDAAC2BgAgEAAAtwYAIOoCAQDABQAh7wJAAMIFACH7AgEAwAUAIZ0DAQDABQAhAgAAACgAICQAAMoCACAE6gIBAMAFACHvAkAAwgUAIfsCAQDABQAhnQMBAMAFACECAAAAJgAgJAAAzAIAIAIAAAAmACAkAADMAgAgAwAAACgAICsAAMUCACAsAADKAgAgAQAAACgAIAEAAAAmACADCgAAswYAIDEAALUGACAyAAC0BgAgB-cCAADjBAAw6AIAANMCABDpAgAA4wQAMOoCAQClBAAh7wJAAKcEACH7AgEApQQAIZ0DAQClBAAhAwAAACYAIAEAANICADAwAADTAgAgAwAAACYAIAEAACcAMAIAACgAIAEAAAAsACABAAAALAAgAwAAACoAIAEAACsAMAIAACwAIAMAAAAqACABAAArADACAAAsACADAAAAKgAgAQAAKwAwAgAALAAgDQMAAK4GACAQAACvBgAgEQAAsQYAIBIAALIGACATAACwBgAg6gIBAAAAAe0CAQAAAAHvAkAAAAAB-wIBAAAAAf0CAAAAoAMC_gJAAAAAAZ0DAQAAAAGeAwEAAAABASQAANsCACAI6gIBAAAAAe0CAQAAAAHvAkAAAAAB-wIBAAAAAf0CAAAAoAMC_gJAAAAAAZ0DAQAAAAGeAwEAAAABASQAAN0CADABJAAA3QIAMAEAAAAqACANAwAAkQYAIBAAAJIGACARAACVBgAgEgAAkwYAIBMAAJQGACDqAgEAwAUAIe0CAQDABQAh7wJAAMIFACH7AgEAwAUAIf0CAACQBqADIv4CQADCBQAhnQMBAMAFACGeAwEAwQUAIQIAAAAsACAkAADhAgAgCOoCAQDABQAh7QIBAMAFACHvAkAAwgUAIfsCAQDABQAh_QIAAJAGoAMi_gJAAMIFACGdAwEAwAUAIZ4DAQDBBQAhAgAAACoAICQAAOMCACACAAAAKgAgJAAA4wIAIAEAAAAqACADAAAALAAgKwAA2wIAICwAAOECACABAAAALAAgAQAAACoAIAQKAACNBgAgMQAAjwYAIDIAAI4GACCeAwAAvAUAIAvnAgAA3wQAMOgCAADrAgAQ6QIAAN8EADDqAgEApQQAIe0CAQClBAAh7wJAAKcEACH7AgEApQQAIf0CAADgBKADIv4CQACnBAAhnQMBAKUEACGeAwEApgQAIQMAAAAqACABAADqAgAwMAAA6wIAIAMAAAAqACABAAArADACAAAsACABAAAAMgAgAQAAADIAIAMAAAAwACABAAAxADACAAAyACADAAAAMAAgAQAAMQAwAgAAMgAgAwAAADAAIAEAADEAMAIAADIAIAYDAACLBgAgFAAAjAYAIOoCAQAAAAHvAkAAAAAB-wIBAAAAAZwDAQAAAAEBJAAA8wIAIATqAgEAAAAB7wJAAAAAAfsCAQAAAAGcAwEAAAABASQAAPUCADABJAAA9QIAMAYDAACJBgAgFAAAigYAIOoCAQDABQAh7wJAAMIFACH7AgEAwAUAIZwDAQDABQAhAgAAADIAICQAAPgCACAE6gIBAMAFACHvAkAAwgUAIfsCAQDABQAhnAMBAMAFACECAAAAMAAgJAAA-gIAIAIAAAAwACAkAAD6AgAgAwAAADIAICsAAPMCACAsAAD4AgAgAQAAADIAIAEAAAAwACADCgAAhgYAIDEAAIgGACAyAACHBgAgB-cCAADeBAAw6AIAAIEDABDpAgAA3gQAMOoCAQClBAAh7wJAAKcEACH7AgEApQQAIZwDAQClBAAhAwAAADAAIAEAAIADADAwAACBAwAgAwAAADAAIAEAADEAMAIAADIAIAEAAAAcACABAAAAHAAgAwAAABoAIAEAABsAMAIAABwAIAMAAAAaACABAAAbADACAAAcACADAAAAGgAgAQAAGwAwAgAAHAAgBgMAAIQGACAIAACFBgAg6gIBAAAAAe8CQAAAAAH7AgEAAAABkAMBAAAAAQEkAACJAwAgBOoCAQAAAAHvAkAAAAAB-wIBAAAAAZADAQAAAAEBJAAAiwMAMAEkAACLAwAwBgMAAIIGACAIAACDBgAg6gIBAMAFACHvAkAAwgUAIfsCAQDABQAhkAMBAMAFACECAAAAHAAgJAAAjgMAIATqAgEAwAUAIe8CQADCBQAh-wIBAMAFACGQAwEAwAUAIQIAAAAaACAkAACQAwAgAgAAABoAICQAAJADACADAAAAHAAgKwAAiQMAICwAAI4DACABAAAAHAAgAQAAABoAIAMKAAD_BQAgMQAAgQYAIDIAAIAGACAH5wIAAN0EADDoAgAAlwMAEOkCAADdBAAw6gIBAKUEACHvAkAApwQAIfsCAQClBAAhkAMBAKUEACEDAAAAGgAgAQAAlgMAMDAAAJcDACADAAAAGgAgAQAAGwAwAgAAHAAgC-cCAADcBAAw6AIAAJ0DABDpAgAA3AQAMOoCAQAAAAHvAkAAxwQAIf4CQADHBAAhlwMBAMIEACGYAwEAwgQAIZkDAQDCBAAhmgMBAMIEACGbAyAAxgQAIQEAAACaAwAgAQAAAJoDACAL5wIAANwEADDoAgAAnQMAEOkCAADcBAAw6gIBAMIEACHvAkAAxwQAIf4CQADHBAAhlwMBAMIEACGYAwEAwgQAIZkDAQDCBAAhmgMBAMIEACGbAyAAxgQAIQADAAAAnQMAIAEAAJ4DADACAACaAwAgAwAAAJ0DACABAACeAwAwAgAAmgMAIAMAAACdAwAgAQAAngMAMAIAAJoDACAI6gIBAAAAAe8CQAAAAAH-AkAAAAABlwMBAAAAAZgDAQAAAAGZAwEAAAABmgMBAAAAAZsDIAAAAAEBJAAAogMAIAjqAgEAAAAB7wJAAAAAAf4CQAAAAAGXAwEAAAABmAMBAAAAAZkDAQAAAAGaAwEAAAABmwMgAAAAAQEkAACkAwAwASQAAKQDADAI6gIBAMAFACHvAkAAwgUAIf4CQADCBQAhlwMBAMAFACGYAwEAwAUAIZkDAQDABQAhmgMBAMAFACGbAyAA5AUAIQIAAACaAwAgJAAApwMAIAjqAgEAwAUAIe8CQADCBQAh_gJAAMIFACGXAwEAwAUAIZgDAQDABQAhmQMBAMAFACGaAwEAwAUAIZsDIADkBQAhAgAAAJ0DACAkAACpAwAgAgAAAJ0DACAkAACpAwAgAwAAAJoDACArAACiAwAgLAAApwMAIAEAAACaAwAgAQAAAJ0DACADCgAA_AUAIDEAAP4FACAyAAD9BQAgC-cCAADbBAAw6AIAALADABDpAgAA2wQAMOoCAQClBAAh7wJAAKcEACH-AkAApwQAIZcDAQClBAAhmAMBAKUEACGZAwEApQQAIZoDAQClBAAhmwMgALkEACEDAAAAnQMAIAEAAK8DADAwAACwAwAgAwAAAJ0DACABAACeAwAwAgAAmgMAIAEAAAAgACABAAAAIAAgAwAAAB4AIAEAAB8AMAIAACAAIAMAAAAeACABAAAfADACAAAgACADAAAAHgAgAQAAHwAwAgAAIAAgDwMAAPoFACAIAAD7BQAg6gIBAAAAAe8CQAAAAAH7AgEAAAAB_QIAAACTAwL-AkAAAAABhAMBAAAAAY4DAQAAAAGPAwgAAAABkAMBAAAAAZEDAQAAAAGUAwAAAJQDApUDAgAAAAGWA0AAAAABASQAALgDACAN6gIBAAAAAe8CQAAAAAH7AgEAAAAB_QIAAACTAwL-AkAAAAABhAMBAAAAAY4DAQAAAAGPAwgAAAABkAMBAAAAAZEDAQAAAAGUAwAAAJQDApUDAgAAAAGWA0AAAAABASQAALoDADABJAAAugMAMA8DAAD4BQAgCAAA-QUAIOoCAQDABQAh7wJAAMIFACH7AgEAwAUAIf0CAAD1BZMDIv4CQADCBQAhhAMBAMAFACGOAwEAwQUAIY8DCADhBQAhkAMBAMAFACGRAwEAwAUAIZQDAAD2BZQDIpUDAgD3BQAhlgNAAOwFACECAAAAIAAgJAAAvQMAIA3qAgEAwAUAIe8CQADCBQAh-wIBAMAFACH9AgAA9QWTAyL-AkAAwgUAIYQDAQDABQAhjgMBAMEFACGPAwgA4QUAIZADAQDABQAhkQMBAMAFACGUAwAA9gWUAyKVAwIA9wUAIZYDQADsBQAhAgAAAB4AICQAAL8DACACAAAAHgAgJAAAvwMAIAMAAAAgACArAAC4AwAgLAAAvQMAIAEAAAAgACABAAAAHgAgCAoAAPAFACAxAADzBQAgMgAA8gUAIKMBAADxBQAgpAEAAPQFACCOAwAAvAUAIJUDAAC8BQAglgMAALwFACAQ5wIAANIEADDoAgAAxgMAEOkCAADSBAAw6gIBAKUEACHvAkAApwQAIfsCAQClBAAh_QIAANMEkwMi_gJAAKcEACGEAwEApQQAIY4DAQCmBAAhjwMIALYEACGQAwEApQQAIZEDAQClBAAhlAMAANQElAMilQMCANUEACGWA0AAygQAIQMAAAAeACABAADFAwAwMAAAxgMAIAMAAAAeACABAAAfADACAAAgACABAAAAPgAgAQAAAD4AIAMAAAA8ACABAAA9ADACAAA-ACADAAAAPAAgAQAAPQAwAgAAPgAgAwAAADwAIAEAAD0AMAIAAD4AIAwDAADvBQAg6gIBAAAAAe8CQAAAAAH7AgEAAAAB_QIAAACLAwL-AkAAAAABgAMAAACAAwKLA0AAAAABjANAAAAAAY0DAQAAAAGOAwEAAAABjwMIAAAAAQEkAADOAwAgC-oCAQAAAAHvAkAAAAAB-wIBAAAAAf0CAAAAiwMC_gJAAAAAAYADAAAAgAMCiwNAAAAAAYwDQAAAAAGNAwEAAAABjgMBAAAAAY8DCAAAAAEBJAAA0AMAMAEkAADQAwAwDAMAAO4FACDqAgEAwAUAIe8CQADCBQAh-wIBAMAFACH9AgAA6wWLAyL-AkAAwgUAIYADAADgBYADIosDQADCBQAhjANAAOwFACGNAwEAwQUAIY4DAQDBBQAhjwMIAO0FACECAAAAPgAgJAAA0wMAIAvqAgEAwAUAIe8CQADCBQAh-wIBAMAFACH9AgAA6wWLAyL-AkAAwgUAIYADAADgBYADIosDQADCBQAhjANAAOwFACGNAwEAwQUAIY4DAQDBBQAhjwMIAO0FACECAAAAPAAgJAAA1QMAIAIAAAA8ACAkAADVAwAgAwAAAD4AICsAAM4DACAsAADTAwAgAQAAAD4AIAEAAAA8ACAJCgAA5gUAIDEAAOkFACAyAADoBQAgowEAAOcFACCkAQAA6gUAIIwDAAC8BQAgjQMAALwFACCOAwAAvAUAII8DAAC8BQAgDucCAADIBAAw6AIAANwDABDpAgAAyAQAMOoCAQClBAAh7wJAAKcEACH7AgEApQQAIf0CAADJBIsDIv4CQACnBAAhgAMAALUEgAMiiwNAAKcEACGMA0AAygQAIY0DAQCmBAAhjgMBAKYEACGPAwgAywQAIQMAAAA8ACABAADbAwAwMAAA3AMAIAMAAAA8ACABAAA9ADACAAA-ACAN5wIAAMEEADDoAgAA4gMAEOkCAADBBAAw6gIBAAAAAe8CQADHBAAh_gJAAMcEACGAAwAAAIADAoEDAQDCBAAhggMIAMQEACGDAwIAxQQAIYQDAQDCBAAhhQMAALgEACCGAyAAxgQAIQEAAADfAwAgAQAAAN8DACAN5wIAAMEEADDoAgAA4gMAEOkCAADBBAAw6gIBAMIEACHvAkAAxwQAIf4CQADHBAAhgAMAAMMEgAMigQMBAMIEACGCAwgAxAQAIYMDAgDFBAAhhAMBAMIEACGFAwAAuAQAIIYDIADGBAAhAAMAAADiAwAgAQAA4wMAMAIAAN8DACADAAAA4gMAIAEAAOMDADACAADfAwAgAwAAAOIDACABAADjAwAwAgAA3wMAIArqAgEAAAAB7wJAAAAAAf4CQAAAAAGAAwAAAIADAoEDAQAAAAGCAwgAAAABgwMCAAAAAYQDAQAAAAGFAwAA5QUAIIYDIAAAAAEBJAAA5wMAIArqAgEAAAAB7wJAAAAAAf4CQAAAAAGAAwAAAIADAoEDAQAAAAGCAwgAAAABgwMCAAAAAYQDAQAAAAGFAwAA5QUAIIYDIAAAAAEBJAAA6QMAMAEkAADpAwAwCuoCAQDABQAh7wJAAMIFACH-AkAAwgUAIYADAADgBYADIoEDAQDABQAhggMIAOEFACGDAwIA4gUAIYQDAQDABQAhhQMAAOMFACCGAyAA5AUAIQIAAADfAwAgJAAA7AMAIArqAgEAwAUAIe8CQADCBQAh_gJAAMIFACGAAwAA4AWAAyKBAwEAwAUAIYIDCADhBQAhgwMCAOIFACGEAwEAwAUAIYUDAADjBQAghgMgAOQFACECAAAA4gMAICQAAO4DACACAAAA4gMAICQAAO4DACADAAAA3wMAICsAAOcDACAsAADsAwAgAQAAAN8DACABAAAA4gMAIAUKAADbBQAgMQAA3gUAIDIAAN0FACCjAQAA3AUAIKQBAADfBQAgDecCAAC0BAAw6AIAAPUDABDpAgAAtAQAMOoCAQClBAAh7wJAAKcEACH-AkAApwQAIYADAAC1BIADIoEDAQClBAAhggMIALYEACGDAwIAtwQAIYQDAQClBAAhhQMAALgEACCGAyAAuQQAIQMAAADiAwAgAQAA9AMAMDAAAPUDACADAAAA4gMAIAEAAOMDADACAADfAwAgAQAAAEMAIAEAAABDACADAAAAQQAgAQAAQgAwAgAAQwAgAwAAAEEAIAEAAEIAMAIAAEMAIAMAAABBACABAABCADACAABDACAHAwAA2QUAIBwAANoFACDqAgEAAAAB7wJAAAAAAfsCAQAAAAH9AgAAAP0CAv4CQAAAAAEBJAAA_QMAIAXqAgEAAAAB7wJAAAAAAfsCAQAAAAH9AgAAAP0CAv4CQAAAAAEBJAAA_wMAMAEkAAD_AwAwBwMAAMsFACAcAADMBQAg6gIBAMAFACHvAkAAwgUAIfsCAQDABQAh_QIAAMoF_QIi_gJAAMIFACECAAAAQwAgJAAAggQAIAXqAgEAwAUAIe8CQADCBQAh-wIBAMAFACH9AgAAygX9AiL-AkAAwgUAIQIAAABBACAkAACEBAAgAgAAAEEAICQAAIQEACADAAAAQwAgKwAA_QMAICwAAIIEACABAAAAQwAgAQAAAEEAIAMKAADHBQAgMQAAyQUAIDIAAMgFACAI5wIAALAEADDoAgAAiwQAEOkCAACwBAAw6gIBAKUEACHvAkAApwQAIfsCAQClBAAh_QIAALEE_QIi_gJAAKcEACEDAAAAQQAgAQAAigQAMDAAAIsEACADAAAAQQAgAQAAQgAwAgAAQwAgAQAAAEcAIAEAAABHACADAAAARQAgAQAARgAwAgAARwAgAwAAAEUAIAEAAEYAMAIAAEcAIAMAAABFACABAABGADACAABHACAIGgAAxQUAIBsAAMYFACDqAgEAAAAB6wIBAAAAAewCAQAAAAHtAgEAAAAB7gIBAAAAAe8CQAAAAAEBJAAAkwQAIAbqAgEAAAAB6wIBAAAAAewCAQAAAAHtAgEAAAAB7gIBAAAAAe8CQAAAAAEBJAAAlQQAMAEkAACVBAAwCBoAAMMFACAbAADEBQAg6gIBAMAFACHrAgEAwAUAIewCAQDABQAh7QIBAMEFACHuAgEAwQUAIe8CQADCBQAhAgAAAEcAICQAAJgEACAG6gIBAMAFACHrAgEAwAUAIewCAQDABQAh7QIBAMEFACHuAgEAwQUAIe8CQADCBQAhAgAAAEUAICQAAJoEACACAAAARQAgJAAAmgQAIAMAAABHACArAACTBAAgLAAAmAQAIAEAAABHACABAAAARQAgBQoAAL0FACAxAAC_BQAgMgAAvgUAIO0CAAC8BQAg7gIAALwFACAJ5wIAAKQEADDoAgAAoQQAEOkCAACkBAAw6gIBAKUEACHrAgEApQQAIewCAQClBAAh7QIBAKYEACHuAgEApgQAIe8CQACnBAAhAwAAAEUAIAEAAKAEADAwAAChBAAgAwAAAEUAIAEAAEYAMAIAAEcAIAnnAgAApAQAMOgCAAChBAAQ6QIAAKQEADDqAgEApQQAIesCAQClBAAh7AIBAKUEACHtAgEApgQAIe4CAQCmBAAh7wJAAKcEACEOCgAAqQQAIDEAAK8EACAyAACvBAAg8AIBAAAAAfECAQAAAATyAgEAAAAE8wIBAAAAAfQCAQAAAAH1AgEAAAAB9gIBAAAAAfcCAQCuBAAh-AIBAAAAAfkCAQAAAAH6AgEAAAABDgoAAKwEACAxAACtBAAgMgAArQQAIPACAQAAAAHxAgEAAAAF8gIBAAAABfMCAQAAAAH0AgEAAAAB9QIBAAAAAfYCAQAAAAH3AgEAqwQAIfgCAQAAAAH5AgEAAAAB-gIBAAAAAQsKAACpBAAgMQAAqgQAIDIAAKoEACDwAkAAAAAB8QJAAAAABPICQAAAAATzAkAAAAAB9AJAAAAAAfUCQAAAAAH2AkAAAAAB9wJAAKgEACELCgAAqQQAIDEAAKoEACAyAACqBAAg8AJAAAAAAfECQAAAAATyAkAAAAAE8wJAAAAAAfQCQAAAAAH1AkAAAAAB9gJAAAAAAfcCQACoBAAhCPACAgAAAAHxAgIAAAAE8gICAAAABPMCAgAAAAH0AgIAAAAB9QICAAAAAfYCAgAAAAH3AgIAqQQAIQjwAkAAAAAB8QJAAAAABPICQAAAAATzAkAAAAAB9AJAAAAAAfUCQAAAAAH2AkAAAAAB9wJAAKoEACEOCgAArAQAIDEAAK0EACAyAACtBAAg8AIBAAAAAfECAQAAAAXyAgEAAAAF8wIBAAAAAfQCAQAAAAH1AgEAAAAB9gIBAAAAAfcCAQCrBAAh-AIBAAAAAfkCAQAAAAH6AgEAAAABCPACAgAAAAHxAgIAAAAF8gICAAAABfMCAgAAAAH0AgIAAAAB9QICAAAAAfYCAgAAAAH3AgIArAQAIQvwAgEAAAAB8QIBAAAABfICAQAAAAXzAgEAAAAB9AIBAAAAAfUCAQAAAAH2AgEAAAAB9wIBAK0EACH4AgEAAAAB-QIBAAAAAfoCAQAAAAEOCgAAqQQAIDEAAK8EACAyAACvBAAg8AIBAAAAAfECAQAAAATyAgEAAAAE8wIBAAAAAfQCAQAAAAH1AgEAAAAB9gIBAAAAAfcCAQCuBAAh-AIBAAAAAfkCAQAAAAH6AgEAAAABC_ACAQAAAAHxAgEAAAAE8gIBAAAABPMCAQAAAAH0AgEAAAAB9QIBAAAAAfYCAQAAAAH3AgEArwQAIfgCAQAAAAH5AgEAAAAB-gIBAAAAAQjnAgAAsAQAMOgCAACLBAAQ6QIAALAEADDqAgEApQQAIe8CQACnBAAh-wIBAKUEACH9AgAAsQT9AiL-AkAApwQAIQcKAACpBAAgMQAAswQAIDIAALMEACDwAgAAAP0CAvECAAAA_QII8gIAAAD9Agj3AgAAsgT9AiIHCgAAqQQAIDEAALMEACAyAACzBAAg8AIAAAD9AgLxAgAAAP0CCPICAAAA_QII9wIAALIE_QIiBPACAAAA_QIC8QIAAAD9AgjyAgAAAP0CCPcCAACzBP0CIg3nAgAAtAQAMOgCAAD1AwAQ6QIAALQEADDqAgEApQQAIe8CQACnBAAh_gJAAKcEACGAAwAAtQSAAyKBAwEApQQAIYIDCAC2BAAhgwMCALcEACGEAwEApQQAIYUDAAC4BAAghgMgALkEACEHCgAAqQQAIDEAAMAEACAyAADABAAg8AIAAACAAwLxAgAAAIADCPICAAAAgAMI9wIAAL8EgAMiDQoAAKkEACAxAAC9BAAgMgAAvQQAIKMBAAC9BAAgpAEAAL0EACDwAggAAAAB8QIIAAAABPICCAAAAATzAggAAAAB9AIIAAAAAfUCCAAAAAH2AggAAAAB9wIIAL4EACENCgAAqQQAIDEAAKkEACAyAACpBAAgowEAAL0EACCkAQAAqQQAIPACAgAAAAHxAgIAAAAE8gICAAAABPMCAgAAAAH0AgIAAAAB9QICAAAAAfYCAgAAAAH3AgIAvAQAIQTwAgEAAAAFhwMBAAAAAYgDAQAAAASJAwEAAAAEBQoAAKkEACAxAAC7BAAgMgAAuwQAIPACIAAAAAH3AiAAugQAIQUKAACpBAAgMQAAuwQAIDIAALsEACDwAiAAAAAB9wIgALoEACEC8AIgAAAAAfcCIAC7BAAhDQoAAKkEACAxAACpBAAgMgAAqQQAIKMBAAC9BAAgpAEAAKkEACDwAgIAAAAB8QICAAAABPICAgAAAATzAgIAAAAB9AICAAAAAfUCAgAAAAH2AgIAAAAB9wICALwEACEI8AIIAAAAAfECCAAAAATyAggAAAAE8wIIAAAAAfQCCAAAAAH1AggAAAAB9gIIAAAAAfcCCAC9BAAhDQoAAKkEACAxAAC9BAAgMgAAvQQAIKMBAAC9BAAgpAEAAL0EACDwAggAAAAB8QIIAAAABPICCAAAAATzAggAAAAB9AIIAAAAAfUCCAAAAAH2AggAAAAB9wIIAL4EACEHCgAAqQQAIDEAAMAEACAyAADABAAg8AIAAACAAwLxAgAAAIADCPICAAAAgAMI9wIAAL8EgAMiBPACAAAAgAMC8QIAAACAAwjyAgAAAIADCPcCAADABIADIg3nAgAAwQQAMOgCAADiAwAQ6QIAAMEEADDqAgEAwgQAIe8CQADHBAAh_gJAAMcEACGAAwAAwwSAAyKBAwEAwgQAIYIDCADEBAAhgwMCAMUEACGEAwEAwgQAIYUDAAC4BAAghgMgAMYEACEL8AIBAAAAAfECAQAAAATyAgEAAAAE8wIBAAAAAfQCAQAAAAH1AgEAAAAB9gIBAAAAAfcCAQCvBAAh-AIBAAAAAfkCAQAAAAH6AgEAAAABBPACAAAAgAMC8QIAAACAAwjyAgAAAIADCPcCAADABIADIgjwAggAAAAB8QIIAAAABPICCAAAAATzAggAAAAB9AIIAAAAAfUCCAAAAAH2AggAAAAB9wIIAL0EACEI8AICAAAAAfECAgAAAATyAgIAAAAE8wICAAAAAfQCAgAAAAH1AgIAAAAB9gICAAAAAfcCAgCpBAAhAvACIAAAAAH3AiAAuwQAIQjwAkAAAAAB8QJAAAAABPICQAAAAATzAkAAAAAB9AJAAAAAAfUCQAAAAAH2AkAAAAAB9wJAAKoEACEO5wIAAMgEADDoAgAA3AMAEOkCAADIBAAw6gIBAKUEACHvAkAApwQAIfsCAQClBAAh_QIAAMkEiwMi_gJAAKcEACGAAwAAtQSAAyKLA0AApwQAIYwDQADKBAAhjQMBAKYEACGOAwEApgQAIY8DCADLBAAhBwoAAKkEACAxAADRBAAgMgAA0QQAIPACAAAAiwMC8QIAAACLAwjyAgAAAIsDCPcCAADQBIsDIgsKAACsBAAgMQAAzwQAIDIAAM8EACDwAkAAAAAB8QJAAAAABfICQAAAAAXzAkAAAAAB9AJAAAAAAfUCQAAAAAH2AkAAAAAB9wJAAM4EACENCgAArAQAIDEAAM0EACAyAADNBAAgowEAAM0EACCkAQAAzQQAIPACCAAAAAHxAggAAAAF8gIIAAAABfMCCAAAAAH0AggAAAAB9QIIAAAAAfYCCAAAAAH3AggAzAQAIQ0KAACsBAAgMQAAzQQAIDIAAM0EACCjAQAAzQQAIKQBAADNBAAg8AIIAAAAAfECCAAAAAXyAggAAAAF8wIIAAAAAfQCCAAAAAH1AggAAAAB9gIIAAAAAfcCCADMBAAhCPACCAAAAAHxAggAAAAF8gIIAAAABfMCCAAAAAH0AggAAAAB9QIIAAAAAfYCCAAAAAH3AggAzQQAIQsKAACsBAAgMQAAzwQAIDIAAM8EACDwAkAAAAAB8QJAAAAABfICQAAAAAXzAkAAAAAB9AJAAAAAAfUCQAAAAAH2AkAAAAAB9wJAAM4EACEI8AJAAAAAAfECQAAAAAXyAkAAAAAF8wJAAAAAAfQCQAAAAAH1AkAAAAAB9gJAAAAAAfcCQADPBAAhBwoAAKkEACAxAADRBAAgMgAA0QQAIPACAAAAiwMC8QIAAACLAwjyAgAAAIsDCPcCAADQBIsDIgTwAgAAAIsDAvECAAAAiwMI8gIAAACLAwj3AgAA0QSLAyIQ5wIAANIEADDoAgAAxgMAEOkCAADSBAAw6gIBAKUEACHvAkAApwQAIfsCAQClBAAh_QIAANMEkwMi_gJAAKcEACGEAwEApQQAIY4DAQCmBAAhjwMIALYEACGQAwEApQQAIZEDAQClBAAhlAMAANQElAMilQMCANUEACGWA0AAygQAIQcKAACpBAAgMQAA2gQAIDIAANoEACDwAgAAAJMDAvECAAAAkwMI8gIAAACTAwj3AgAA2QSTAyIHCgAAqQQAIDEAANgEACAyAADYBAAg8AIAAACUAwLxAgAAAJQDCPICAAAAlAMI9wIAANcElAMiDQoAAKwEACAxAACsBAAgMgAArAQAIKMBAADNBAAgpAEAAKwEACDwAgIAAAAB8QICAAAABfICAgAAAAXzAgIAAAAB9AICAAAAAfUCAgAAAAH2AgIAAAAB9wICANYEACENCgAArAQAIDEAAKwEACAyAACsBAAgowEAAM0EACCkAQAArAQAIPACAgAAAAHxAgIAAAAF8gICAAAABfMCAgAAAAH0AgIAAAAB9QICAAAAAfYCAgAAAAH3AgIA1gQAIQcKAACpBAAgMQAA2AQAIDIAANgEACDwAgAAAJQDAvECAAAAlAMI8gIAAACUAwj3AgAA1wSUAyIE8AIAAACUAwLxAgAAAJQDCPICAAAAlAMI9wIAANgElAMiBwoAAKkEACAxAADaBAAgMgAA2gQAIPACAAAAkwMC8QIAAACTAwjyAgAAAJMDCPcCAADZBJMDIgTwAgAAAJMDAvECAAAAkwMI8gIAAACTAwj3AgAA2gSTAyIL5wIAANsEADDoAgAAsAMAEOkCAADbBAAw6gIBAKUEACHvAkAApwQAIf4CQACnBAAhlwMBAKUEACGYAwEApQQAIZkDAQClBAAhmgMBAKUEACGbAyAAuQQAIQvnAgAA3AQAMOgCAACdAwAQ6QIAANwEADDqAgEAwgQAIe8CQADHBAAh_gJAAMcEACGXAwEAwgQAIZgDAQDCBAAhmQMBAMIEACGaAwEAwgQAIZsDIADGBAAhB-cCAADdBAAw6AIAAJcDABDpAgAA3QQAMOoCAQClBAAh7wJAAKcEACH7AgEApQQAIZADAQClBAAhB-cCAADeBAAw6AIAAIEDABDpAgAA3gQAMOoCAQClBAAh7wJAAKcEACH7AgEApQQAIZwDAQClBAAhC-cCAADfBAAw6AIAAOsCABDpAgAA3wQAMOoCAQClBAAh7QIBAKUEACHvAkAApwQAIfsCAQClBAAh_QIAAOAEoAMi_gJAAKcEACGdAwEApQQAIZ4DAQCmBAAhBwoAAKkEACAxAADiBAAgMgAA4gQAIPACAAAAoAMC8QIAAACgAwjyAgAAAKADCPcCAADhBKADIgcKAACpBAAgMQAA4gQAIDIAAOIEACDwAgAAAKADAvECAAAAoAMI8gIAAACgAwj3AgAA4QSgAyIE8AIAAACgAwLxAgAAAKADCPICAAAAoAMI9wIAAOIEoAMiB-cCAADjBAAw6AIAANMCABDpAgAA4wQAMOoCAQClBAAh7wJAAKcEACH7AgEApQQAIZ0DAQClBAAhDecCAADkBAAw6AIAAL0CABDpAgAA5AQAMOoCAQClBAAh7QIBAKUEACHvAkAApwQAIfsCAQClBAAh_QIAAOUEpAMi_gJAAKcEACGQAwEApQQAIaADAgC3BAAhoQMgALkEACGiAwAAuAQAIAcKAACpBAAgMQAA5wQAIDIAAOcEACDwAgAAAKQDAvECAAAApAMI8gIAAACkAwj3AgAA5gSkAyIHCgAAqQQAIDEAAOcEACAyAADnBAAg8AIAAACkAwLxAgAAAKQDCPICAAAApAMI9wIAAOYEpAMiBPACAAAApAMC8QIAAACkAwjyAgAAAKQDCPcCAADnBKQDIgXnAgAA6AQAMOgCAACnAgAQ6QIAAOgEADCQAwEApQQAIaQDAQClBAAhFecCAADpBAAw6AIAAJECABDpAgAA6QQAMOoCAQClBAAh7wJAAKcEACH9AgAA7AS1AyL-AkAApwQAIYIDCADLBAAhpQMBAKUEACGmAwEApQQAIacDAgC3BAAhqAMBAKUEACGpAwAAuAQAIKoDAAC4BAAgrAMAAOoErAMirQMBAKYEACGuAwEApgQAIa8DAQCmBAAhsAMgALkEACGxAyAAuQQAIbMDAADrBLMDIgcKAACpBAAgMQAA8gQAIDIAAPIEACDwAgAAAKwDAvECAAAArAMI8gIAAACsAwj3AgAA8QSsAyIHCgAAqQQAIDEAAPAEACAyAADwBAAg8AIAAACzAwLxAgAAALMDCPICAAAAswMI9wIAAO8EswMiBwoAAKkEACAxAADuBAAgMgAA7gQAIPACAAAAtQMC8QIAAAC1AwjyAgAAALUDCPcCAADtBLUDIgcKAACpBAAgMQAA7gQAIDIAAO4EACDwAgAAALUDAvECAAAAtQMI8gIAAAC1Awj3AgAA7QS1AyIE8AIAAAC1AwLxAgAAALUDCPICAAAAtQMI9wIAAO4EtQMiBwoAAKkEACAxAADwBAAgMgAA8AQAIPACAAAAswMC8QIAAACzAwjyAgAAALMDCPcCAADvBLMDIgTwAgAAALMDAvECAAAAswMI8gIAAACzAwj3AgAA8ASzAyIHCgAAqQQAIDEAAPIEACAyAADyBAAg8AIAAACsAwLxAgAAAKwDCPICAAAArAMI9wIAAPEErAMiBPACAAAArAMC8QIAAACsAwjyAgAAAKwDCPcCAADyBKwDIhkMAAD5BAAgDQAA-gQAIA4AAPsEACAPAAD8BAAg5wIAAPMEADDoAgAA_gEAEOkCAADzBAAw6gIBAMIEACHvAkAAxwQAIf0CAAD4BLUDIv4CQADHBAAhggMIAPUEACGlAwEAwgQAIaYDAQDCBAAhpwMCAMUEACGoAwEAwgQAIakDAAC4BAAgqgMAALgEACCsAwAA9ASsAyKtAwEA9gQAIa4DAQD2BAAhrwMBAPYEACGwAyAAxgQAIbEDIADGBAAhswMAAPcEswMiBPACAAAArAMC8QIAAACsAwjyAgAAAKwDCPcCAADyBKwDIgjwAggAAAAB8QIIAAAABfICCAAAAAXzAggAAAAB9AIIAAAAAfUCCAAAAAH2AggAAAAB9wIIAM0EACEL8AIBAAAAAfECAQAAAAXyAgEAAAAF8wIBAAAAAfQCAQAAAAH1AgEAAAAB9gIBAAAAAfcCAQCtBAAh-AIBAAAAAfkCAQAAAAH6AgEAAAABBPACAAAAswMC8QIAAACzAwjyAgAAALMDCPcCAADwBLMDIgTwAgAAALUDAvECAAAAtQMI8gIAAAC1Awj3AgAA7gS1AyIDtQMAABMAILYDAAATACC3AwAAEwAgA7UDAAAPACC2AwAADwAgtwMAAA8AIAO1AwAAGgAgtgMAABoAILcDAAAaACADtQMAAB4AILYDAAAeACC3AwAAHgAgB-cCAAD9BAAw6AIAAPgBABDpAgAA_QQAMOoCAQClBAAh7wJAAKcEACH-AkAApwQAIZcDAQClBAAhCAkAAPkEACDnAgAA_gQAMOgCAADlAQAQ6QIAAP4EADDqAgEAwgQAIe8CQADHBAAh_gJAAMcEACGXAwEAwgQAIQfnAgAA_wQAMOgCAADfAQAQ6QIAAP8EADDqAgEApQQAIe8CQACnBAAh-wIBAKUEACH-AkAApwQAIQgDAACBBQAg5wIAAIAFADDoAgAADQAQ6QIAAIAFADDqAgEAwgQAIe8CQADHBAAh-wIBAMIEACH-AkAAxwQAIR4EAACTBQAgBQAAlAUAIAYAAJUFACAHAACWBQAgDQAA-gQAIA8AAPwEACAVAACYBQAgFgAAlwUAIBcAAJkFACAYAAD7BAAgGQAAmgUAIB0AAJsFACAeAACcBQAg5wIAAI8FADDoAgAAVwAQ6QIAAI8FADDqAgEAwgQAIe8CQADHBAAh_QIAAJEFzAMi_gJAAMcEACGXAwEAwgQAIZgDAQDCBAAhyAMgAMYEACHKAwAAkAXKAyLMAyAAxgQAIc0DIADGBAAhzgNAAJIFACHPAwEA9gQAIdQDAABXACDVAwAAVwAgCOcCAACCBQAw6AIAAMcBABDpAgAAggUAMOoCAQClBAAh7wJAAKcEACH7AgEApQQAIf4CQACnBAAhuAMBAKYEACEJAwAAgQUAIOcCAACDBQAw6AIAAAsAEOkCAACDBQAw6gIBAMIEACHvAkAAxwQAIfsCAQDCBAAh_gJAAMcEACG4AwEA9gQAIQnnAgAAhAUAMOgCAACvAQAQ6QIAAIQFADDqAgEApQQAIe8CQACnBAAh_gJAAKcEACG5AwEApQQAIboDAQClBAAhuwNAAKcEACEJ5wIAAIUFADDoAgAAnAEAEOkCAACFBQAw6gIBAMIEACHvAkAAxwQAIf4CQADHBAAhuQMBAMIEACG6AwEAwgQAIbsDQADHBAAhEOcCAACGBQAw6AIAAJYBABDpAgAAhgUAMOoCAQClBAAh7wJAAKcEACH7AgEApQQAIf4CQACnBAAhvAMBAKUEACG9AwEApQQAIb4DAQCmBAAhvwMBAKYEACHAAwEApgQAIcEDQADKBAAhwgNAAMoEACHDAwEApgQAIcQDAQCmBAAhC-cCAACHBQAw6AIAAIABABDpAgAAhwUAMOoCAQClBAAh7wJAAKcEACH7AgEApQQAIf4CQACnBAAhuwNAAKcEACHFAwEApQQAIcYDAQCmBAAhxwMBAKYEACEP5wIAAIgFADDoAgAAagAQ6QIAAIgFADDqAgEApQQAIe8CQACnBAAh_QIAAIoFzAMi_gJAAKcEACGXAwEApQQAIZgDAQClBAAhyAMgALkEACHKAwAAiQXKAyLMAyAAuQQAIc0DIAC5BAAhzgNAAMoEACHPAwEApgQAIQcKAACpBAAgMQAAjgUAIDIAAI4FACDwAgAAAMoDAvECAAAAygMI8gIAAADKAwj3AgAAjQXKAyIHCgAAqQQAIDEAAIwFACAyAACMBQAg8AIAAADMAwLxAgAAAMwDCPICAAAAzAMI9wIAAIsFzAMiBwoAAKkEACAxAACMBQAgMgAAjAUAIPACAAAAzAMC8QIAAADMAwjyAgAAAMwDCPcCAACLBcwDIgTwAgAAAMwDAvECAAAAzAMI8gIAAADMAwj3AgAAjAXMAyIHCgAAqQQAIDEAAI4FACAyAACOBQAg8AIAAADKAwLxAgAAAMoDCPICAAAAygMI9wIAAI0FygMiBPACAAAAygMC8QIAAADKAwjyAgAAAMoDCPcCAACOBcoDIhwEAACTBQAgBQAAlAUAIAYAAJUFACAHAACWBQAgDQAA-gQAIA8AAPwEACAVAACYBQAgFgAAlwUAIBcAAJkFACAYAAD7BAAgGQAAmgUAIB0AAJsFACAeAACcBQAg5wIAAI8FADDoAgAAVwAQ6QIAAI8FADDqAgEAwgQAIe8CQADHBAAh_QIAAJEFzAMi_gJAAMcEACGXAwEAwgQAIZgDAQDCBAAhyAMgAMYEACHKAwAAkAXKAyLMAyAAxgQAIc0DIADGBAAhzgNAAJIFACHPAwEA9gQAIQTwAgAAAMoDAvECAAAAygMI8gIAAADKAwj3AgAAjgXKAyIE8AIAAADMAwLxAgAAAMwDCPICAAAAzAMI9wIAAIwFzAMiCPACQAAAAAHxAkAAAAAF8gJAAAAABfMCQAAAAAH0AkAAAAAB9QJAAAAAAfYCQAAAAAH3AkAAzwQAIQO1AwAAAwAgtgMAAAMAILcDAAADACADtQMAAAcAILYDAAAHACC3AwAABwAgCwMAAIEFACDnAgAAgwUAMOgCAAALABDpAgAAgwUAMOoCAQDCBAAh7wJAAMcEACH7AgEAwgQAIf4CQADHBAAhuAMBAPYEACHUAwAACwAg1QMAAAsAIAoDAACBBQAg5wIAAIAFADDoAgAADQAQ6QIAAIAFADDqAgEAwgQAIe8CQADHBAAh-wIBAMIEACH-AkAAxwQAIdQDAAANACDVAwAADQAgA7UDAAAmACC2AwAAJgAgtwMAACYAIAO1AwAAKgAgtgMAACoAILcDAAAqACADtQMAADAAILYDAAAwACC3AwAAMAAgA7UDAAA8ACC2AwAAPAAgtwMAADwAIAO1AwAAQQAgtgMAAEEAILcDAABBACADtQMAAEUAILYDAABFACC3AwAARQAgCxoAAJ4FACAbAACBBQAg5wIAAJ0FADDoAgAARQAQ6QIAAJ0FADDqAgEAwgQAIesCAQDCBAAh7AIBAMIEACHtAgEA9gQAIe4CAQD2BAAh7wJAAMcEACEMAwAAgQUAIBwAAJwFACDnAgAAnwUAMOgCAABBABDpAgAAnwUAMOoCAQDCBAAh7wJAAMcEACH7AgEAwgQAIf0CAACgBf0CIv4CQADHBAAh1AMAAEEAINUDAABBACAKAwAAgQUAIBwAAJwFACDnAgAAnwUAMOgCAABBABDpAgAAnwUAMOoCAQDCBAAh7wJAAMcEACH7AgEAwgQAIf0CAACgBf0CIv4CQADHBAAhBPACAAAA_QIC8QIAAAD9AgjyAgAAAP0CCPcCAACzBP0CIg8DAACBBQAg5wIAAKEFADDoAgAAPAAQ6QIAAKEFADDqAgEAwgQAIe8CQADHBAAh-wIBAMIEACH9AgAAogWLAyL-AkAAxwQAIYADAADDBIADIosDQADHBAAhjANAAJIFACGNAwEA9gQAIY4DAQD2BAAhjwMIAPUEACEE8AIAAACLAwLxAgAAAIsDCPICAAAAiwMI9wIAANEEiwMiAvsCAQAAAAGcAwEAAAABCQMAAIEFACAUAAClBQAg5wIAAKQFADDoAgAAMAAQ6QIAAKQFADDqAgEAwgQAIe8CQADHBAAh-wIBAMIEACGcAwEAwgQAIRIDAACBBQAgEAAAqAUAIBEAAJkFACASAACpBQAgEwAAmAUAIOcCAACmBQAw6AIAACoAEOkCAACmBQAw6gIBAMIEACHtAgEAwgQAIe8CQADHBAAh-wIBAMIEACH9AgAApwWgAyL-AkAAxwQAIZ0DAQDCBAAhngMBAPYEACHUAwAAKgAg1QMAACoAIBADAACBBQAgEAAAqAUAIBEAAJkFACASAACpBQAgEwAAmAUAIOcCAACmBQAw6AIAACoAEOkCAACmBQAw6gIBAMIEACHtAgEAwgQAIe8CQADHBAAh-wIBAMIEACH9AgAApwWgAyL-AkAAxwQAIZ0DAQDCBAAhngMBAPYEACEE8AIAAACgAwLxAgAAAKADCPICAAAAoAMI9wIAAOIEoAMiEwMAAIEFACAIAACxBQAgEQAAlwUAIBUAAJgFACDnAgAAuAUAMOgCAAAPABDpAgAAuAUAMOoCAQDCBAAh7QIBAMIEACHvAkAAxwQAIfsCAQDCBAAh_QIAALkFpAMi_gJAAMcEACGQAwEAwgQAIaADAgDFBAAhoQMgAMYEACGiAwAAuAQAINQDAAAPACDVAwAADwAgEgMAAIEFACAQAACoBQAgEQAAmQUAIBIAAKkFACATAACYBQAg5wIAAKYFADDoAgAAKgAQ6QIAAKYFADDqAgEAwgQAIe0CAQDCBAAh7wJAAMcEACH7AgEAwgQAIf0CAACnBaADIv4CQADHBAAhnQMBAMIEACGeAwEA9gQAIdQDAAAqACDVAwAAKgAgAvsCAQAAAAGdAwEAAAABCQMAAIEFACAQAACoBQAg5wIAAKsFADDoAgAAJgAQ6QIAAKsFADDqAgEAwgQAIe8CQADHBAAh-wIBAMIEACGdAwEAwgQAIQL7AgEAAAABkAMBAAAAARIDAACBBQAgCAAAsQUAIOcCAACtBQAw6AIAAB4AEOkCAACtBQAw6gIBAMIEACHvAkAAxwQAIfsCAQDCBAAh_QIAAK4FkwMi_gJAAMcEACGEAwEAwgQAIY4DAQD2BAAhjwMIAMQEACGQAwEAwgQAIZEDAQDCBAAhlAMAAK8FlAMilQMCALAFACGWA0AAkgUAIQTwAgAAAJMDAvECAAAAkwMI8gIAAACTAwj3AgAA2gSTAyIE8AIAAACUAwLxAgAAAJQDCPICAAAAlAMI9wIAANgElAMiCPACAgAAAAHxAgIAAAAF8gICAAAABfMCAgAAAAH0AgIAAAAB9QICAAAAAfYCAgAAAAH3AgIArAQAIRsMAAD5BAAgDQAA-gQAIA4AAPsEACAPAAD8BAAg5wIAAPMEADDoAgAA_gEAEOkCAADzBAAw6gIBAMIEACHvAkAAxwQAIf0CAAD4BLUDIv4CQADHBAAhggMIAPUEACGlAwEAwgQAIaYDAQDCBAAhpwMCAMUEACGoAwEAwgQAIakDAAC4BAAgqgMAALgEACCsAwAA9ASsAyKtAwEA9gQAIa4DAQD2BAAhrwMBAPYEACGwAyAAxgQAIbEDIADGBAAhswMAAPcEswMi1AMAAP4BACDVAwAA_gEAIAL7AgEAAAABkAMBAAAAAQkDAACBBQAgCAAAsQUAIOcCAACzBQAw6AIAABoAEOkCAACzBQAw6gIBAMIEACHvAkAAxwQAIfsCAQDCBAAhkAMBAMIEACECkAMBAAAAAaQDAQAAAAEHCAAAsQUAIAsAALYFACDnAgAAtQUAMOgCAAATABDpAgAAtQUAMJADAQDCBAAhpAMBAMIEACEKCQAA-QQAIOcCAAD-BAAw6AIAAOUBABDpAgAA_gQAMOoCAQDCBAAh7wJAAMcEACH-AkAAxwQAIZcDAQDCBAAh1AMAAOUBACDVAwAA5QEAIAL7AgEAAAABkAMBAAAAAREDAACBBQAgCAAAsQUAIBEAAJcFACAVAACYBQAg5wIAALgFADDoAgAADwAQ6QIAALgFADDqAgEAwgQAIe0CAQDCBAAh7wJAAMcEACH7AgEAwgQAIf0CAAC5BaQDIv4CQADHBAAhkAMBAMIEACGgAwIAxQQAIaEDIADGBAAhogMAALgEACAE8AIAAACkAwLxAgAAAKQDCPICAAAApAMI9wIAAOcEpAMiEQMAAIEFACDnAgAAugUAMOgCAAAHABDpAgAAugUAMOoCAQDCBAAh7wJAAMcEACH7AgEAwgQAIf4CQADHBAAhvAMBAMIEACG9AwEAwgQAIb4DAQD2BAAhvwMBAPYEACHAAwEA9gQAIcEDQACSBQAhwgNAAJIFACHDAwEA9gQAIcQDAQD2BAAhDAMAAIEFACDnAgAAuwUAMOgCAAADABDpAgAAuwUAMOoCAQDCBAAh7wJAAMcEACH7AgEAwgQAIf4CQADHBAAhuwNAAMcEACHFAwEAwgQAIcYDAQD2BAAhxwMBAPYEACEAAAAAAdkDAQAAAAEB2QMBAAAAAQHZA0AAAAABBSsAAPsJACAsAACBCgAg1gMAAPwJACDXAwAAgAoAINwDAABDACAFKwAA-QkAICwAAP4JACDWAwAA-gkAINcDAAD9CQAg3AMAAAEAIAMrAAD7CQAg1gMAAPwJACDcAwAAQwAgAysAAPkJACDWAwAA-gkAINwDAAABACAAAAAB2QMAAAD9AgIFKwAA8wkAICwAAPcJACDWAwAA9AkAINcDAAD2CQAg3AMAAAEAIAsrAADNBQAwLAAA0gUAMNYDAADOBQAw1wMAAM8FADDYAwAA0AUAINkDAADRBQAw2gMAANEFADDbAwAA0QUAMNwDAADRBQAw3QMAANMFADDeAwAA1AUAMAYbAADGBQAg6gIBAAAAAewCAQAAAAHtAgEAAAAB7gIBAAAAAe8CQAAAAAECAAAARwAgKwAA2AUAIAMAAABHACArAADYBQAgLAAA1wUAIAEkAAD1CQAwCxoAAJ4FACAbAACBBQAg5wIAAJ0FADDoAgAARQAQ6QIAAJ0FADDqAgEAAAAB6wIBAMIEACHsAgEAwgQAIe0CAQD2BAAh7gIBAPYEACHvAkAAxwQAIQIAAABHACAkAADXBQAgAgAAANUFACAkAADWBQAgCecCAADUBQAw6AIAANUFABDpAgAA1AUAMOoCAQDCBAAh6wIBAMIEACHsAgEAwgQAIe0CAQD2BAAh7gIBAPYEACHvAkAAxwQAIQnnAgAA1AUAMOgCAADVBQAQ6QIAANQFADDqAgEAwgQAIesCAQDCBAAh7AIBAMIEACHtAgEA9gQAIe4CAQD2BAAh7wJAAMcEACEF6gIBAMAFACHsAgEAwAUAIe0CAQDBBQAh7gIBAMEFACHvAkAAwgUAIQYbAADEBQAg6gIBAMAFACHsAgEAwAUAIe0CAQDBBQAh7gIBAMEFACHvAkAAwgUAIQYbAADGBQAg6gIBAAAAAewCAQAAAAHtAgEAAAAB7gIBAAAAAe8CQAAAAAEDKwAA8wkAINYDAAD0CQAg3AMAAAEAIAQrAADNBQAw1gMAAM4FADDYAwAA0AUAINwDAADRBQAwAAAAAAAB2QMAAACAAwIF2QMIAAAAAeADCAAAAAHhAwgAAAAB4gMIAAAAAeMDCAAAAAEF2QMCAAAAAeADAgAAAAHhAwIAAAAB4gMCAAAAAeMDAgAAAAEC2QMBAAAABN8DAQAAAAUB2QMgAAAAAQHZAwEAAAAEAAAAAAAB2QMAAACLAwIB2QNAAAAAAQXZAwgAAAAB4AMIAAAAAeEDCAAAAAHiAwgAAAAB4wMIAAAAAQUrAADuCQAgLAAA8QkAINYDAADvCQAg1wMAAPAJACDcAwAAAQAgAysAAO4JACDWAwAA7wkAINwDAAABACAAAAAAAAHZAwAAAJMDAgHZAwAAAJQDAgXZAwIAAAAB4AMCAAAAAeEDAgAAAAHiAwIAAAAB4wMCAAAAAQUrAADmCQAgLAAA7AkAINYDAADnCQAg1wMAAOsJACDcAwAAAQAgBSsAAOQJACAsAADpCQAg1gMAAOUJACDXAwAA6AkAINwDAAD7AQAgAysAAOYJACDWAwAA5wkAINwDAAABACADKwAA5AkAINYDAADlCQAg3AMAAPsBACAAAAAAAAAFKwAA3AkAICwAAOIJACDWAwAA3QkAINcDAADhCQAg3AMAAAEAIAUrAADaCQAgLAAA3wkAINYDAADbCQAg1wMAAN4JACDcAwAA-wEAIAMrAADcCQAg1gMAAN0JACDcAwAAAQAgAysAANoJACDWAwAA2wkAINwDAAD7AQAgAAAABSsAANIJACAsAADYCQAg1gMAANMJACDXAwAA1wkAINwDAAABACAFKwAA0AkAICwAANUJACDWAwAA0QkAINcDAADUCQAg3AMAACwAIAMrAADSCQAg1gMAANMJACDcAwAAAQAgAysAANAJACDWAwAA0QkAINwDAAAsACAAAAAB2QMAAACgAwIFKwAAwwkAICwAAM4JACDWAwAAxAkAINcDAADNCQAg3AMAAAEAIAUrAADBCQAgLAAAywkAINYDAADCCQAg1wMAAMoJACDcAwAAEQAgBysAAL8JACAsAADICQAg1gMAAMAJACDXAwAAxwkAINoDAAAqACDbAwAAKgAg3AMAACwAIAsrAACiBgAwLAAApwYAMNYDAACjBgAw1wMAAKQGADDYAwAApQYAINkDAACmBgAw2gMAAKYGADDbAwAApgYAMNwDAACmBgAw3QMAAKgGADDeAwAAqQYAMAsrAACWBgAwLAAAmwYAMNYDAACXBgAw1wMAAJgGADDYAwAAmQYAINkDAACaBgAw2gMAAJoGADDbAwAAmgYAMNwDAACaBgAw3QMAAJwGADDeAwAAnQYAMAQDAACLBgAg6gIBAAAAAe8CQAAAAAH7AgEAAAABAgAAADIAICsAAKEGACADAAAAMgAgKwAAoQYAICwAAKAGACABJAAAxgkAMAoDAACBBQAgFAAApQUAIOcCAACkBQAw6AIAADAAEOkCAACkBQAw6gIBAAAAAe8CQADHBAAh-wIBAMIEACGcAwEAwgQAIdADAACjBQAgAgAAADIAICQAAKAGACACAAAAngYAICQAAJ8GACAH5wIAAJ0GADDoAgAAngYAEOkCAACdBgAw6gIBAMIEACHvAkAAxwQAIfsCAQDCBAAhnAMBAMIEACEH5wIAAJ0GADDoAgAAngYAEOkCAACdBgAw6gIBAMIEACHvAkAAxwQAIfsCAQDCBAAhnAMBAMIEACED6gIBAMAFACHvAkAAwgUAIfsCAQDABQAhBAMAAIkGACDqAgEAwAUAIe8CQADCBQAh-wIBAMAFACEEAwAAiwYAIOoCAQAAAAHvAkAAAAAB-wIBAAAAAQsDAACuBgAgEAAArwYAIBEAALEGACATAACwBgAg6gIBAAAAAe0CAQAAAAHvAkAAAAAB-wIBAAAAAf0CAAAAoAMC_gJAAAAAAZ0DAQAAAAECAAAALAAgKwAArQYAIAMAAAAsACArAACtBgAgLAAArAYAIAEkAADFCQAwEAMAAIEFACAQAACoBQAgEQAAmQUAIBIAAKkFACATAACYBQAg5wIAAKYFADDoAgAAKgAQ6QIAAKYFADDqAgEAAAAB7QIBAMIEACHvAkAAxwQAIfsCAQDCBAAh_QIAAKcFoAMi_gJAAMcEACGdAwEAwgQAIZ4DAQD2BAAhAgAAACwAICQAAKwGACACAAAAqgYAICQAAKsGACAL5wIAAKkGADDoAgAAqgYAEOkCAACpBgAw6gIBAMIEACHtAgEAwgQAIe8CQADHBAAh-wIBAMIEACH9AgAApwWgAyL-AkAAxwQAIZ0DAQDCBAAhngMBAPYEACEL5wIAAKkGADDoAgAAqgYAEOkCAACpBgAw6gIBAMIEACHtAgEAwgQAIe8CQADHBAAh-wIBAMIEACH9AgAApwWgAyL-AkAAxwQAIZ0DAQDCBAAhngMBAPYEACEH6gIBAMAFACHtAgEAwAUAIe8CQADCBQAh-wIBAMAFACH9AgAAkAagAyL-AkAAwgUAIZ0DAQDABQAhCwMAAJEGACAQAACSBgAgEQAAlQYAIBMAAJQGACDqAgEAwAUAIe0CAQDABQAh7wJAAMIFACH7AgEAwAUAIf0CAACQBqADIv4CQADCBQAhnQMBAMAFACELAwAArgYAIBAAAK8GACARAACxBgAgEwAAsAYAIOoCAQAAAAHtAgEAAAAB7wJAAAAAAfsCAQAAAAH9AgAAAKADAv4CQAAAAAGdAwEAAAABAysAAMMJACDWAwAAxAkAINwDAAABACADKwAAwQkAINYDAADCCQAg3AMAABEAIAQrAACiBgAw1gMAAKMGADDYAwAApQYAINwDAACmBgAwBCsAAJYGADDWAwAAlwYAMNgDAACZBgAg3AMAAJoGADADKwAAvwkAINYDAADACQAg3AMAACwAIAAAAAUrAAC3CQAgLAAAvQkAINYDAAC4CQAg1wMAALwJACDcAwAAAQAgBSsAALUJACAsAAC6CQAg1gMAALYJACDXAwAAuQkAINwDAAARACADKwAAtwkAINYDAAC4CQAg3AMAAAEAIAMrAAC1CQAg1gMAALYJACDcAwAAEQAgAAAAAAAC2QMBAAAABN8DAQAAAAUB2QMAAACkAwIFKwAAqwkAICwAALMJACDWAwAArAkAINcDAACyCQAg3AMAAAEAIAUrAACpCQAgLAAAsAkAINYDAACqCQAg1wMAAK8JACDcAwAA-wEAIAsrAADOBgAwLAAA0wYAMNYDAADPBgAw1wMAANAGADDYAwAA0QYAINkDAADSBgAw2gMAANIGADDbAwAA0gYAMNwDAADSBgAw3QMAANQGADDeAwAA1QYAMAsrAADFBgAwLAAAyQYAMNYDAADGBgAw1wMAAMcGADDYAwAAyAYAINkDAACmBgAw2gMAAKYGADDbAwAApgYAMNwDAACmBgAw3QMAAMoGADDeAwAAqQYAMAsDAACuBgAgEQAAsQYAIBIAALIGACATAACwBgAg6gIBAAAAAe0CAQAAAAHvAkAAAAAB-wIBAAAAAf0CAAAAoAMC_gJAAAAAAZ4DAQAAAAECAAAALAAgKwAAzQYAIAMAAAAsACArAADNBgAgLAAAzAYAIAEkAACuCQAwAgAAACwAICQAAMwGACACAAAAqgYAICQAAMsGACAH6gIBAMAFACHtAgEAwAUAIe8CQADCBQAh-wIBAMAFACH9AgAAkAagAyL-AkAAwgUAIZ4DAQDBBQAhCwMAAJEGACARAACVBgAgEgAAkwYAIBMAAJQGACDqAgEAwAUAIe0CAQDABQAh7wJAAMIFACH7AgEAwAUAIf0CAACQBqADIv4CQADCBQAhngMBAMEFACELAwAArgYAIBEAALEGACASAACyBgAgEwAAsAYAIOoCAQAAAAHtAgEAAAAB7wJAAAAAAfsCAQAAAAH9AgAAAKADAv4CQAAAAAGeAwEAAAABBAMAALgGACDqAgEAAAAB7wJAAAAAAfsCAQAAAAECAAAAKAAgKwAA2QYAIAMAAAAoACArAADZBgAgLAAA2AYAIAEkAACtCQAwCgMAAIEFACAQAACoBQAg5wIAAKsFADDoAgAAJgAQ6QIAAKsFADDqAgEAAAAB7wJAAMcEACH7AgEAwgQAIZ0DAQDCBAAh0QMAAKoFACACAAAAKAAgJAAA2AYAIAIAAADWBgAgJAAA1wYAIAfnAgAA1QYAMOgCAADWBgAQ6QIAANUGADDqAgEAwgQAIe8CQADHBAAh-wIBAMIEACGdAwEAwgQAIQfnAgAA1QYAMOgCAADWBgAQ6QIAANUGADDqAgEAwgQAIe8CQADHBAAh-wIBAMIEACGdAwEAwgQAIQPqAgEAwAUAIe8CQADCBQAh-wIBAMAFACEEAwAAtgYAIOoCAQDABQAh7wJAAMIFACH7AgEAwAUAIQQDAAC4BgAg6gIBAAAAAe8CQAAAAAH7AgEAAAABAdkDAQAAAAQDKwAAqwkAINYDAACsCQAg3AMAAAEAIAMrAACpCQAg1gMAAKoJACDcAwAA-wEAIAQrAADOBgAw1gMAAM8GADDYAwAA0QYAINwDAADSBgAwBCsAAMUGADDWAwAAxgYAMNgDAADIBgAg3AMAAKYGADAAAAAFKwAAoQkAICwAAKcJACDWAwAAogkAINcDAACmCQAg3AMAAPsBACAFKwAAnwkAICwAAKQJACDWAwAAoAkAINcDAACjCQAg3AMAAOIBACADKwAAoQkAINYDAACiCQAg3AMAAPsBACADKwAAnwkAINYDAACgCQAg3AMAAOIBACAAAAAAAALZAwEAAAAE3wMBAAAABQLZAwEAAAAE3wMBAAAABQHZAwAAAKwDAgHZAwAAALMDAgHZAwAAALUDAgsrAACYBwAwLAAAnQcAMNYDAACZBwAw1wMAAJoHADDYAwAAmwcAINkDAACcBwAw2gMAAJwHADDbAwAAnAcAMNwDAACcBwAw3QMAAJ4HADDeAwAAnwcAMAsrAACMBwAwLAAAkQcAMNYDAACNBwAw1wMAAI4HADDYAwAAjwcAINkDAACQBwAw2gMAAJAHADDbAwAAkAcAMNwDAACQBwAw3QMAAJIHADDeAwAAkwcAMAsrAACABwAwLAAAhQcAMNYDAACBBwAw1wMAAIIHADDYAwAAgwcAINkDAACEBwAw2gMAAIQHADDbAwAAhAcAMNwDAACEBwAw3QMAAIYHADDeAwAAhwcAMAsrAAD0BgAwLAAA-QYAMNYDAAD1BgAw1wMAAPYGADDYAwAA9wYAINkDAAD4BgAw2gMAAPgGADDbAwAA-AYAMNwDAAD4BgAw3QMAAPoGADDeAwAA-wYAMA0DAAD6BQAg6gIBAAAAAe8CQAAAAAH7AgEAAAAB_QIAAACTAwL-AkAAAAABhAMBAAAAAY4DAQAAAAGPAwgAAAABkQMBAAAAAZQDAAAAlAMClQMCAAAAAZYDQAAAAAECAAAAIAAgKwAA_wYAIAMAAAAgACArAAD_BgAgLAAA_gYAIAEkAACeCQAwEwMAAIEFACAIAACxBQAg5wIAAK0FADDoAgAAHgAQ6QIAAK0FADDqAgEAAAAB7wJAAMcEACH7AgEAwgQAIf0CAACuBZMDIv4CQADHBAAhhAMBAMIEACGOAwEA9gQAIY8DCADEBAAhkAMBAMIEACGRAwEAAAABlAMAAK8FlAMilQMCALAFACGWA0AAkgUAIdIDAACsBQAgAgAAACAAICQAAP4GACACAAAA_AYAICQAAP0GACAQ5wIAAPsGADDoAgAA_AYAEOkCAAD7BgAw6gIBAMIEACHvAkAAxwQAIfsCAQDCBAAh_QIAAK4FkwMi_gJAAMcEACGEAwEAwgQAIY4DAQD2BAAhjwMIAMQEACGQAwEAwgQAIZEDAQDCBAAhlAMAAK8FlAMilQMCALAFACGWA0AAkgUAIRDnAgAA-wYAMOgCAAD8BgAQ6QIAAPsGADDqAgEAwgQAIe8CQADHBAAh-wIBAMIEACH9AgAArgWTAyL-AkAAxwQAIYQDAQDCBAAhjgMBAPYEACGPAwgAxAQAIZADAQDCBAAhkQMBAMIEACGUAwAArwWUAyKVAwIAsAUAIZYDQACSBQAhDOoCAQDABQAh7wJAAMIFACH7AgEAwAUAIf0CAAD1BZMDIv4CQADCBQAhhAMBAMAFACGOAwEAwQUAIY8DCADhBQAhkQMBAMAFACGUAwAA9gWUAyKVAwIA9wUAIZYDQADsBQAhDQMAAPgFACDqAgEAwAUAIe8CQADCBQAh-wIBAMAFACH9AgAA9QWTAyL-AkAAwgUAIYQDAQDABQAhjgMBAMEFACGPAwgA4QUAIZEDAQDABQAhlAMAAPYFlAMilQMCAPcFACGWA0AA7AUAIQ0DAAD6BQAg6gIBAAAAAe8CQAAAAAH7AgEAAAAB_QIAAACTAwL-AkAAAAABhAMBAAAAAY4DAQAAAAGPAwgAAAABkQMBAAAAAZQDAAAAlAMClQMCAAAAAZYDQAAAAAEEAwAAhAYAIOoCAQAAAAHvAkAAAAAB-wIBAAAAAQIAAAAcACArAACLBwAgAwAAABwAICsAAIsHACAsAACKBwAgASQAAJ0JADAKAwAAgQUAIAgAALEFACDnAgAAswUAMOgCAAAaABDpAgAAswUAMOoCAQAAAAHvAkAAxwQAIfsCAQDCBAAhkAMBAMIEACHSAwAAsgUAIAIAAAAcACAkAACKBwAgAgAAAIgHACAkAACJBwAgB-cCAACHBwAw6AIAAIgHABDpAgAAhwcAMOoCAQDCBAAh7wJAAMcEACH7AgEAwgQAIZADAQDCBAAhB-cCAACHBwAw6AIAAIgHABDpAgAAhwcAMOoCAQDCBAAh7wJAAMcEACH7AgEAwgQAIZADAQDCBAAhA-oCAQDABQAh7wJAAMIFACH7AgEAwAUAIQQDAACCBgAg6gIBAMAFACHvAkAAwgUAIfsCAQDABQAhBAMAAIQGACDqAgEAAAAB7wJAAAAAAfsCAQAAAAEMAwAA2wYAIBEAAN0GACAVAADeBgAg6gIBAAAAAe0CAQAAAAHvAkAAAAAB-wIBAAAAAf0CAAAApAMC_gJAAAAAAaADAgAAAAGhAyAAAAABogMAANoGACACAAAAEQAgKwAAlwcAIAMAAAARACArAACXBwAgLAAAlgcAIAEkAACcCQAwEgMAAIEFACAIAACxBQAgEQAAlwUAIBUAAJgFACDnAgAAuAUAMOgCAAAPABDpAgAAuAUAMOoCAQAAAAHtAgEAwgQAIe8CQADHBAAh-wIBAMIEACH9AgAAuQWkAyL-AkAAxwQAIZADAQDCBAAhoAMCAMUEACGhAyAAxgQAIaIDAAC4BAAg0gMAALcFACACAAAAEQAgJAAAlgcAIAIAAACUBwAgJAAAlQcAIA3nAgAAkwcAMOgCAACUBwAQ6QIAAJMHADDqAgEAwgQAIe0CAQDCBAAh7wJAAMcEACH7AgEAwgQAIf0CAAC5BaQDIv4CQADHBAAhkAMBAMIEACGgAwIAxQQAIaEDIADGBAAhogMAALgEACAN5wIAAJMHADDoAgAAlAcAEOkCAACTBwAw6gIBAMIEACHtAgEAwgQAIe8CQADHBAAh-wIBAMIEACH9AgAAuQWkAyL-AkAAxwQAIZADAQDCBAAhoAMCAMUEACGhAyAAxgQAIaIDAAC4BAAgCeoCAQDABQAh7QIBAMAFACHvAkAAwgUAIfsCAQDABQAh_QIAAMAGpAMi_gJAAMIFACGgAwIA4gUAIaEDIADkBQAhogMAAL8GACAMAwAAwQYAIBEAAMMGACAVAADEBgAg6gIBAMAFACHtAgEAwAUAIe8CQADCBQAh-wIBAMAFACH9AgAAwAakAyL-AkAAwgUAIaADAgDiBQAhoQMgAOQFACGiAwAAvwYAIAwDAADbBgAgEQAA3QYAIBUAAN4GACDqAgEAAAAB7QIBAAAAAe8CQAAAAAH7AgEAAAAB_QIAAACkAwL-AkAAAAABoAMCAAAAAaEDIAAAAAGiAwAA2gYAIAILAADlBgAgpAMBAAAAAQIAAAAVACArAACjBwAgAwAAABUAICsAAKMHACAsAACiBwAgASQAAJsJADAICAAAsQUAIAsAALYFACDnAgAAtQUAMOgCAAATABDpAgAAtQUAMJADAQDCBAAhpAMBAMIEACHTAwAAtAUAIAIAAAAVACAkAACiBwAgAgAAAKAHACAkAAChBwAgBecCAACfBwAw6AIAAKAHABDpAgAAnwcAMJADAQDCBAAhpAMBAMIEACEF5wIAAJ8HADDoAgAAoAcAEOkCAACfBwAwkAMBAMIEACGkAwEAwgQAIQGkAwEAwAUAIQILAADjBgAgpAMBAMAFACECCwAA5QYAIKQDAQAAAAEB2QMBAAAABAHZAwEAAAAEBCsAAJgHADDWAwAAmQcAMNgDAACbBwAg3AMAAJwHADAEKwAAjAcAMNYDAACNBwAw2AMAAI8HACDcAwAAkAcAMAQrAACABwAw1gMAAIEHADDYAwAAgwcAINwDAACEBwAwBCsAAPQGADDWAwAA9QYAMNgDAAD3BgAg3AMAAPgGADAAAAAAAAAACysAALIHADAsAAC2BwAw1gMAALMHADDXAwAAtAcAMNgDAAC1BwAg2QMAAJwHADDaAwAAnAcAMNsDAACcBwAw3AMAAJwHADDdAwAAtwcAMN4DAACfBwAwAggAAOQGACCQAwEAAAABAgAAABUAICsAALoHACADAAAAFQAgKwAAugcAICwAALkHACABJAAAmgkAMAIAAAAVACAkAAC5BwAgAgAAAKAHACAkAAC4BwAgAZADAQDABQAhAggAAOIGACCQAwEAwAUAIQIIAADkBgAgkAMBAAAAAQQrAACyBwAw1gMAALMHADDYAwAAtQcAINwDAACcBwAwAAAABSsAAJUJACAsAACYCQAg1gMAAJYJACDXAwAAlwkAINwDAAABACADKwAAlQkAINYDAACWCQAg3AMAAAEAIA8EAADsCAAgBQAA7QgAIAYAAO4IACAHAADvCAAgDQAAqwcAIA8AAK0HACAVAADxCAAgFgAA8AgAIBcAAPIIACAYAACsBwAgGQAA8wgAIB0AAPQIACAeAAD1CAAgzgMAALwFACDPAwAAvAUAIAAAAAUrAACQCQAgLAAAkwkAINYDAACRCQAg1wMAAJIJACDcAwAAAQAgAysAAJAJACDWAwAAkQkAINwDAAABACAAAAAAAAAFKwAAiwkAICwAAI4JACDWAwAAjAkAINcDAACNCQAg3AMAAAEAIAMrAACLCQAg1gMAAIwJACDcAwAAAQAgAAAABSsAAIYJACAsAACJCQAg1gMAAIcJACDXAwAAiAkAINwDAAABACADKwAAhgkAINYDAACHCQAg3AMAAAEAIAAAAAHZAwAAAMoDAgHZAwAAAMwDAgsrAADTCAAwLAAA2AgAMNYDAADUCAAw1wMAANUIADDYAwAA1ggAINkDAADXCAAw2gMAANcIADDbAwAA1wgAMNwDAADXCAAw3QMAANkIADDeAwAA2ggAMAsrAADHCAAwLAAAzAgAMNYDAADICAAw1wMAAMkIADDYAwAAyggAINkDAADLCAAw2gMAAMsIADDbAwAAywgAMNwDAADLCAAw3QMAAM0IADDeAwAAzggAMAcrAADCCAAgLAAAxQgAINYDAADDCAAg1wMAAMQIACDaAwAACwAg2wMAAAsAINwDAACyAQAgBysAAL0IACAsAADACAAg1gMAAL4IACDXAwAAvwgAINoDAAANACDbAwAADQAg3AMAAMoBACALKwAAtAgAMCwAALgIADDWAwAAtQgAMNcDAAC2CAAw2AMAALcIACDZAwAAkAcAMNoDAACQBwAw2wMAAJAHADDcAwAAkAcAMN0DAAC5CAAw3gMAAJMHADALKwAAqwgAMCwAAK8IADDWAwAArAgAMNcDAACtCAAw2AMAAK4IACDZAwAA0gYAMNoDAADSBgAw2wMAANIGADDcAwAA0gYAMN0DAACwCAAw3gMAANUGADALKwAAoggAMCwAAKYIADDWAwAAowgAMNcDAACkCAAw2AMAAKUIACDZAwAApgYAMNoDAACmBgAw2wMAAKYGADDcAwAApgYAMN0DAACnCAAw3gMAAKkGADALKwAAmQgAMCwAAJ0IADDWAwAAmggAMNcDAACbCAAw2AMAAJwIACDZAwAAmgYAMNoDAACaBgAw2wMAAJoGADDcAwAAmgYAMN0DAACeCAAw3gMAAJ0GADALKwAAkAgAMCwAAJQIADDWAwAAkQgAMNcDAACSCAAw2AMAAJMIACDZAwAAhAcAMNoDAACEBwAw2wMAAIQHADDcAwAAhAcAMN0DAACVCAAw3gMAAIcHADALKwAAhAgAMCwAAIkIADDWAwAAhQgAMNcDAACGCAAw2AMAAIcIACDZAwAAiAgAMNoDAACICAAw2wMAAIgIADDcAwAAiAgAMN0DAACKCAAw3gMAAIsIADALKwAA-wcAMCwAAP8HADDWAwAA_AcAMNcDAAD9BwAw2AMAAP4HACDZAwAA-AYAMNoDAAD4BgAw2wMAAPgGADDcAwAA-AYAMN0DAACACAAw3gMAAPsGADALKwAA7wcAMCwAAPQHADDWAwAA8AcAMNcDAADxBwAw2AMAAPIHACDZAwAA8wcAMNoDAADzBwAw2wMAAPMHADDcAwAA8wcAMN0DAAD1BwAw3gMAAPYHADALKwAA5gcAMCwAAOoHADDWAwAA5wcAMNcDAADoBwAw2AMAAOkHACDZAwAA0QUAMNoDAADRBQAw2wMAANEFADDcAwAA0QUAMN0DAADrBwAw3gMAANQFADAGGgAAxQUAIOoCAQAAAAHrAgEAAAAB7QIBAAAAAe4CAQAAAAHvAkAAAAABAgAAAEcAICsAAO4HACADAAAARwAgKwAA7gcAICwAAO0HACABJAAAhQkAMAIAAABHACAkAADtBwAgAgAAANUFACAkAADsBwAgBeoCAQDABQAh6wIBAMAFACHtAgEAwQUAIe4CAQDBBQAh7wJAAMIFACEGGgAAwwUAIOoCAQDABQAh6wIBAMAFACHtAgEAwQUAIe4CAQDBBQAh7wJAAMIFACEGGgAAxQUAIOoCAQAAAAHrAgEAAAAB7QIBAAAAAe4CAQAAAAHvAkAAAAABBRwAANoFACDqAgEAAAAB7wJAAAAAAf0CAAAA_QIC_gJAAAAAAQIAAABDACArAAD6BwAgAwAAAEMAICsAAPoHACAsAAD5BwAgASQAAIQJADAKAwAAgQUAIBwAAJwFACDnAgAAnwUAMOgCAABBABDpAgAAnwUAMOoCAQAAAAHvAkAAxwQAIfsCAQDCBAAh_QIAAKAF_QIi_gJAAMcEACECAAAAQwAgJAAA-QcAIAIAAAD3BwAgJAAA-AcAIAjnAgAA9gcAMOgCAAD3BwAQ6QIAAPYHADDqAgEAwgQAIe8CQADHBAAh-wIBAMIEACH9AgAAoAX9AiL-AkAAxwQAIQjnAgAA9gcAMOgCAAD3BwAQ6QIAAPYHADDqAgEAwgQAIe8CQADHBAAh-wIBAMIEACH9AgAAoAX9AiL-AkAAxwQAIQTqAgEAwAUAIe8CQADCBQAh_QIAAMoF_QIi_gJAAMIFACEFHAAAzAUAIOoCAQDABQAh7wJAAMIFACH9AgAAygX9AiL-AkAAwgUAIQUcAADaBQAg6gIBAAAAAe8CQAAAAAH9AgAAAP0CAv4CQAAAAAENCAAA-wUAIOoCAQAAAAHvAkAAAAAB_QIAAACTAwL-AkAAAAABhAMBAAAAAY4DAQAAAAGPAwgAAAABkAMBAAAAAZEDAQAAAAGUAwAAAJQDApUDAgAAAAGWA0AAAAABAgAAACAAICsAAIMIACADAAAAIAAgKwAAgwgAICwAAIIIACABJAAAgwkAMAIAAAAgACAkAACCCAAgAgAAAPwGACAkAACBCAAgDOoCAQDABQAh7wJAAMIFACH9AgAA9QWTAyL-AkAAwgUAIYQDAQDABQAhjgMBAMEFACGPAwgA4QUAIZADAQDABQAhkQMBAMAFACGUAwAA9gWUAyKVAwIA9wUAIZYDQADsBQAhDQgAAPkFACDqAgEAwAUAIe8CQADCBQAh_QIAAPUFkwMi_gJAAMIFACGEAwEAwAUAIY4DAQDBBQAhjwMIAOEFACGQAwEAwAUAIZEDAQDABQAhlAMAAPYFlAMilQMCAPcFACGWA0AA7AUAIQ0IAAD7BQAg6gIBAAAAAe8CQAAAAAH9AgAAAJMDAv4CQAAAAAGEAwEAAAABjgMBAAAAAY8DCAAAAAGQAwEAAAABkQMBAAAAAZQDAAAAlAMClQMCAAAAAZYDQAAAAAEK6gIBAAAAAe8CQAAAAAH9AgAAAIsDAv4CQAAAAAGAAwAAAIADAosDQAAAAAGMA0AAAAABjQMBAAAAAY4DAQAAAAGPAwgAAAABAgAAAD4AICsAAI8IACADAAAAPgAgKwAAjwgAICwAAI4IACABJAAAggkAMA8DAACBBQAg5wIAAKEFADDoAgAAPAAQ6QIAAKEFADDqAgEAAAAB7wJAAMcEACH7AgEAwgQAIf0CAACiBYsDIv4CQADHBAAhgAMAAMMEgAMiiwNAAMcEACGMA0AAkgUAIY0DAQD2BAAhjgMBAPYEACGPAwgA9QQAIQIAAAA-ACAkAACOCAAgAgAAAIwIACAkAACNCAAgDucCAACLCAAw6AIAAIwIABDpAgAAiwgAMOoCAQDCBAAh7wJAAMcEACH7AgEAwgQAIf0CAACiBYsDIv4CQADHBAAhgAMAAMMEgAMiiwNAAMcEACGMA0AAkgUAIY0DAQD2BAAhjgMBAPYEACGPAwgA9QQAIQ7nAgAAiwgAMOgCAACMCAAQ6QIAAIsIADDqAgEAwgQAIe8CQADHBAAh-wIBAMIEACH9AgAAogWLAyL-AkAAxwQAIYADAADDBIADIosDQADHBAAhjANAAJIFACGNAwEA9gQAIY4DAQD2BAAhjwMIAPUEACEK6gIBAMAFACHvAkAAwgUAIf0CAADrBYsDIv4CQADCBQAhgAMAAOAFgAMiiwNAAMIFACGMA0AA7AUAIY0DAQDBBQAhjgMBAMEFACGPAwgA7QUAIQrqAgEAwAUAIe8CQADCBQAh_QIAAOsFiwMi_gJAAMIFACGAAwAA4AWAAyKLA0AAwgUAIYwDQADsBQAhjQMBAMEFACGOAwEAwQUAIY8DCADtBQAhCuoCAQAAAAHvAkAAAAAB_QIAAACLAwL-AkAAAAABgAMAAACAAwKLA0AAAAABjANAAAAAAY0DAQAAAAGOAwEAAAABjwMIAAAAAQQIAACFBgAg6gIBAAAAAe8CQAAAAAGQAwEAAAABAgAAABwAICsAAJgIACADAAAAHAAgKwAAmAgAICwAAJcIACABJAAAgQkAMAIAAAAcACAkAACXCAAgAgAAAIgHACAkAACWCAAgA-oCAQDABQAh7wJAAMIFACGQAwEAwAUAIQQIAACDBgAg6gIBAMAFACHvAkAAwgUAIZADAQDABQAhBAgAAIUGACDqAgEAAAAB7wJAAAAAAZADAQAAAAEEFAAAjAYAIOoCAQAAAAHvAkAAAAABnAMBAAAAAQIAAAAyACArAAChCAAgAwAAADIAICsAAKEIACAsAACgCAAgASQAAIAJADACAAAAMgAgJAAAoAgAIAIAAACeBgAgJAAAnwgAIAPqAgEAwAUAIe8CQADCBQAhnAMBAMAFACEEFAAAigYAIOoCAQDABQAh7wJAAMIFACGcAwEAwAUAIQQUAACMBgAg6gIBAAAAAe8CQAAAAAGcAwEAAAABCxAAAK8GACARAACxBgAgEgAAsgYAIBMAALAGACDqAgEAAAAB7QIBAAAAAe8CQAAAAAH9AgAAAKADAv4CQAAAAAGdAwEAAAABngMBAAAAAQIAAAAsACArAACqCAAgAwAAACwAICsAAKoIACAsAACpCAAgASQAAP8IADACAAAALAAgJAAAqQgAIAIAAACqBgAgJAAAqAgAIAfqAgEAwAUAIe0CAQDABQAh7wJAAMIFACH9AgAAkAagAyL-AkAAwgUAIZ0DAQDABQAhngMBAMEFACELEAAAkgYAIBEAAJUGACASAACTBgAgEwAAlAYAIOoCAQDABQAh7QIBAMAFACHvAkAAwgUAIf0CAACQBqADIv4CQADCBQAhnQMBAMAFACGeAwEAwQUAIQsQAACvBgAgEQAAsQYAIBIAALIGACATAACwBgAg6gIBAAAAAe0CAQAAAAHvAkAAAAAB_QIAAACgAwL-AkAAAAABnQMBAAAAAZ4DAQAAAAEEEAAAuQYAIOoCAQAAAAHvAkAAAAABnQMBAAAAAQIAAAAoACArAACzCAAgAwAAACgAICsAALMIACAsAACyCAAgASQAAP4IADACAAAAKAAgJAAAsggAIAIAAADWBgAgJAAAsQgAIAPqAgEAwAUAIe8CQADCBQAhnQMBAMAFACEEEAAAtwYAIOoCAQDABQAh7wJAAMIFACGdAwEAwAUAIQQQAAC5BgAg6gIBAAAAAe8CQAAAAAGdAwEAAAABDAgAANwGACARAADdBgAgFQAA3gYAIOoCAQAAAAHtAgEAAAAB7wJAAAAAAf0CAAAApAMC_gJAAAAAAZADAQAAAAGgAwIAAAABoQMgAAAAAaIDAADaBgAgAgAAABEAICsAALwIACADAAAAEQAgKwAAvAgAICwAALsIACABJAAA_QgAMAIAAAARACAkAAC7CAAgAgAAAJQHACAkAAC6CAAgCeoCAQDABQAh7QIBAMAFACHvAkAAwgUAIf0CAADABqQDIv4CQADCBQAhkAMBAMAFACGgAwIA4gUAIaEDIADkBQAhogMAAL8GACAMCAAAwgYAIBEAAMMGACAVAADEBgAg6gIBAMAFACHtAgEAwAUAIe8CQADCBQAh_QIAAMAGpAMi_gJAAMIFACGQAwEAwAUAIaADAgDiBQAhoQMgAOQFACGiAwAAvwYAIAwIAADcBgAgEQAA3QYAIBUAAN4GACDqAgEAAAAB7QIBAAAAAe8CQAAAAAH9AgAAAKQDAv4CQAAAAAGQAwEAAAABoAMCAAAAAaEDIAAAAAGiAwAA2gYAIAPqAgEAAAAB7wJAAAAAAf4CQAAAAAECAAAAygEAICsAAL0IACADAAAADQAgKwAAvQgAICwAAMEIACAFAAAADQAgJAAAwQgAIOoCAQDABQAh7wJAAMIFACH-AkAAwgUAIQPqAgEAwAUAIe8CQADCBQAh_gJAAMIFACEE6gIBAAAAAe8CQAAAAAH-AkAAAAABuAMBAAAAAQIAAACyAQAgKwAAwggAIAMAAAALACArAADCCAAgLAAAxggAIAYAAAALACAkAADGCAAg6gIBAMAFACHvAkAAwgUAIf4CQADCBQAhuAMBAMEFACEE6gIBAMAFACHvAkAAwgUAIf4CQADCBQAhuAMBAMEFACEM6gIBAAAAAe8CQAAAAAH-AkAAAAABvAMBAAAAAb0DAQAAAAG-AwEAAAABvwMBAAAAAcADAQAAAAHBA0AAAAABwgNAAAAAAcMDAQAAAAHEAwEAAAABAgAAAAkAICsAANIIACADAAAACQAgKwAA0ggAICwAANEIACABJAAA_AgAMBEDAACBBQAg5wIAALoFADDoAgAABwAQ6QIAALoFADDqAgEAAAAB7wJAAMcEACH7AgEAwgQAIf4CQADHBAAhvAMBAMIEACG9AwEAwgQAIb4DAQD2BAAhvwMBAPYEACHAAwEA9gQAIcEDQACSBQAhwgNAAJIFACHDAwEA9gQAIcQDAQD2BAAhAgAAAAkAICQAANEIACACAAAAzwgAICQAANAIACAQ5wIAAM4IADDoAgAAzwgAEOkCAADOCAAw6gIBAMIEACHvAkAAxwQAIfsCAQDCBAAh_gJAAMcEACG8AwEAwgQAIb0DAQDCBAAhvgMBAPYEACG_AwEA9gQAIcADAQD2BAAhwQNAAJIFACHCA0AAkgUAIcMDAQD2BAAhxAMBAPYEACEQ5wIAAM4IADDoAgAAzwgAEOkCAADOCAAw6gIBAMIEACHvAkAAxwQAIfsCAQDCBAAh_gJAAMcEACG8AwEAwgQAIb0DAQDCBAAhvgMBAPYEACG_AwEA9gQAIcADAQD2BAAhwQNAAJIFACHCA0AAkgUAIcMDAQD2BAAhxAMBAPYEACEM6gIBAMAFACHvAkAAwgUAIf4CQADCBQAhvAMBAMAFACG9AwEAwAUAIb4DAQDBBQAhvwMBAMEFACHAAwEAwQUAIcEDQADsBQAhwgNAAOwFACHDAwEAwQUAIcQDAQDBBQAhDOoCAQDABQAh7wJAAMIFACH-AkAAwgUAIbwDAQDABQAhvQMBAMAFACG-AwEAwQUAIb8DAQDBBQAhwAMBAMEFACHBA0AA7AUAIcIDQADsBQAhwwMBAMEFACHEAwEAwQUAIQzqAgEAAAAB7wJAAAAAAf4CQAAAAAG8AwEAAAABvQMBAAAAAb4DAQAAAAG_AwEAAAABwAMBAAAAAcEDQAAAAAHCA0AAAAABwwMBAAAAAcQDAQAAAAEH6gIBAAAAAe8CQAAAAAH-AkAAAAABuwNAAAAAAcUDAQAAAAHGAwEAAAABxwMBAAAAAQIAAAAFACArAADeCAAgAwAAAAUAICsAAN4IACAsAADdCAAgASQAAPsIADAMAwAAgQUAIOcCAAC7BQAw6AIAAAMAEOkCAAC7BQAw6gIBAAAAAe8CQADHBAAh-wIBAMIEACH-AkAAxwQAIbsDQADHBAAhxQMBAAAAAcYDAQD2BAAhxwMBAPYEACECAAAABQAgJAAA3QgAIAIAAADbCAAgJAAA3AgAIAvnAgAA2ggAMOgCAADbCAAQ6QIAANoIADDqAgEAwgQAIe8CQADHBAAh-wIBAMIEACH-AkAAxwQAIbsDQADHBAAhxQMBAMIEACHGAwEA9gQAIccDAQD2BAAhC-cCAADaCAAw6AIAANsIABDpAgAA2ggAMOoCAQDCBAAh7wJAAMcEACH7AgEAwgQAIf4CQADHBAAhuwNAAMcEACHFAwEAwgQAIcYDAQD2BAAhxwMBAPYEACEH6gIBAMAFACHvAkAAwgUAIf4CQADCBQAhuwNAAMIFACHFAwEAwAUAIcYDAQDBBQAhxwMBAMEFACEH6gIBAMAFACHvAkAAwgUAIf4CQADCBQAhuwNAAMIFACHFAwEAwAUAIcYDAQDBBQAhxwMBAMEFACEH6gIBAAAAAe8CQAAAAAH-AkAAAAABuwNAAAAAAcUDAQAAAAHGAwEAAAABxwMBAAAAAQQrAADTCAAw1gMAANQIADDYAwAA1ggAINwDAADXCAAwBCsAAMcIADDWAwAAyAgAMNgDAADKCAAg3AMAAMsIADADKwAAwggAINYDAADDCAAg3AMAALIBACADKwAAvQgAINYDAAC-CAAg3AMAAMoBACAEKwAAtAgAMNYDAAC1CAAw2AMAALcIACDcAwAAkAcAMAQrAACrCAAw1gMAAKwIADDYAwAArggAINwDAADSBgAwBCsAAKIIADDWAwAAowgAMNgDAAClCAAg3AMAAKYGADAEKwAAmQgAMNYDAACaCAAw2AMAAJwIACDcAwAAmgYAMAQrAACQCAAw1gMAAJEIADDYAwAAkwgAINwDAACEBwAwBCsAAIQIADDWAwAAhQgAMNgDAACHCAAg3AMAAIgIADAEKwAA-wcAMNYDAAD8BwAw2AMAAP4HACDcAwAA-AYAMAQrAADvBwAw1gMAAPAHADDYAwAA8gcAINwDAADzBwAwBCsAAOYHADDWAwAA5wcAMNgDAADpBwAg3AMAANEFADAAAAIDAADBBwAguAMAALwFACABAwAAwQcAIAAAAAAAAAIDAADBBwAgHAAA9QgAIAYDAADBBwAgEAAA-AgAIBEAAPIIACASAAD3CAAgEwAA8QgAIJ4DAAC8BQAgBAMAAMEHACAIAAD5CAAgEQAA8AgAIBUAAPEIACAIDAAAqgcAIA0AAKsHACAOAACsBwAgDwAArQcAIIIDAAC8BQAgrQMAALwFACCuAwAAvAUAIK8DAAC8BQAgAQkAAKoHACAH6gIBAAAAAe8CQAAAAAH-AkAAAAABuwNAAAAAAcUDAQAAAAHGAwEAAAABxwMBAAAAAQzqAgEAAAAB7wJAAAAAAf4CQAAAAAG8AwEAAAABvQMBAAAAAb4DAQAAAAG_AwEAAAABwAMBAAAAAcEDQAAAAAHCA0AAAAABwwMBAAAAAcQDAQAAAAEJ6gIBAAAAAe0CAQAAAAHvAkAAAAAB_QIAAACkAwL-AkAAAAABkAMBAAAAAaADAgAAAAGhAyAAAAABogMAANoGACAD6gIBAAAAAe8CQAAAAAGdAwEAAAABB-oCAQAAAAHtAgEAAAAB7wJAAAAAAf0CAAAAoAMC_gJAAAAAAZ0DAQAAAAGeAwEAAAABA-oCAQAAAAHvAkAAAAABnAMBAAAAAQPqAgEAAAAB7wJAAAAAAZADAQAAAAEK6gIBAAAAAe8CQAAAAAH9AgAAAIsDAv4CQAAAAAGAAwAAAIADAosDQAAAAAGMA0AAAAABjQMBAAAAAY4DAQAAAAGPAwgAAAABDOoCAQAAAAHvAkAAAAAB_QIAAACTAwL-AkAAAAABhAMBAAAAAY4DAQAAAAGPAwgAAAABkAMBAAAAAZEDAQAAAAGUAwAAAJQDApUDAgAAAAGWA0AAAAABBOoCAQAAAAHvAkAAAAAB_QIAAAD9AgL-AkAAAAABBeoCAQAAAAHrAgEAAAAB7QIBAAAAAe4CAQAAAAHvAkAAAAABGAUAAOAIACAGAADhCAAgBwAA4ggAIA0AAOMIACAPAADpCAAgFQAA5QgAIBYAAOQIACAXAADmCAAgGAAA5wgAIBkAAOgIACAdAADqCAAgHgAA6wgAIOoCAQAAAAHvAkAAAAAB_QIAAADMAwL-AkAAAAABlwMBAAAAAZgDAQAAAAHIAyAAAAABygMAAADKAwLMAyAAAAABzQMgAAAAAc4DQAAAAAHPAwEAAAABAgAAAAEAICsAAIYJACADAAAAVwAgKwAAhgkAICwAAIoJACAaAAAAVwAgBQAA2gcAIAYAANsHACAHAADcBwAgDQAA3QcAIA8AAOMHACAVAADfBwAgFgAA3gcAIBcAAOAHACAYAADhBwAgGQAA4gcAIB0AAOQHACAeAADlBwAgJAAAigkAIOoCAQDABQAh7wJAAMIFACH9AgAA2AfMAyL-AkAAwgUAIZcDAQDABQAhmAMBAMAFACHIAyAA5AUAIcoDAADXB8oDIswDIADkBQAhzQMgAOQFACHOA0AA7AUAIc8DAQDBBQAhGAUAANoHACAGAADbBwAgBwAA3AcAIA0AAN0HACAPAADjBwAgFQAA3wcAIBYAAN4HACAXAADgBwAgGAAA4QcAIBkAAOIHACAdAADkBwAgHgAA5QcAIOoCAQDABQAh7wJAAMIFACH9AgAA2AfMAyL-AkAAwgUAIZcDAQDABQAhmAMBAMAFACHIAyAA5AUAIcoDAADXB8oDIswDIADkBQAhzQMgAOQFACHOA0AA7AUAIc8DAQDBBQAhGAQAAN8IACAGAADhCAAgBwAA4ggAIA0AAOMIACAPAADpCAAgFQAA5QgAIBYAAOQIACAXAADmCAAgGAAA5wgAIBkAAOgIACAdAADqCAAgHgAA6wgAIOoCAQAAAAHvAkAAAAAB_QIAAADMAwL-AkAAAAABlwMBAAAAAZgDAQAAAAHIAyAAAAABygMAAADKAwLMAyAAAAABzQMgAAAAAc4DQAAAAAHPAwEAAAABAgAAAAEAICsAAIsJACADAAAAVwAgKwAAiwkAICwAAI8JACAaAAAAVwAgBAAA2QcAIAYAANsHACAHAADcBwAgDQAA3QcAIA8AAOMHACAVAADfBwAgFgAA3gcAIBcAAOAHACAYAADhBwAgGQAA4gcAIB0AAOQHACAeAADlBwAgJAAAjwkAIOoCAQDABQAh7wJAAMIFACH9AgAA2AfMAyL-AkAAwgUAIZcDAQDABQAhmAMBAMAFACHIAyAA5AUAIcoDAADXB8oDIswDIADkBQAhzQMgAOQFACHOA0AA7AUAIc8DAQDBBQAhGAQAANkHACAGAADbBwAgBwAA3AcAIA0AAN0HACAPAADjBwAgFQAA3wcAIBYAAN4HACAXAADgBwAgGAAA4QcAIBkAAOIHACAdAADkBwAgHgAA5QcAIOoCAQDABQAh7wJAAMIFACH9AgAA2AfMAyL-AkAAwgUAIZcDAQDABQAhmAMBAMAFACHIAyAA5AUAIcoDAADXB8oDIswDIADkBQAhzQMgAOQFACHOA0AA7AUAIc8DAQDBBQAhGAQAAN8IACAFAADgCAAgBwAA4ggAIA0AAOMIACAPAADpCAAgFQAA5QgAIBYAAOQIACAXAADmCAAgGAAA5wgAIBkAAOgIACAdAADqCAAgHgAA6wgAIOoCAQAAAAHvAkAAAAAB_QIAAADMAwL-AkAAAAABlwMBAAAAAZgDAQAAAAHIAyAAAAABygMAAADKAwLMAyAAAAABzQMgAAAAAc4DQAAAAAHPAwEAAAABAgAAAAEAICsAAJAJACADAAAAVwAgKwAAkAkAICwAAJQJACAaAAAAVwAgBAAA2QcAIAUAANoHACAHAADcBwAgDQAA3QcAIA8AAOMHACAVAADfBwAgFgAA3gcAIBcAAOAHACAYAADhBwAgGQAA4gcAIB0AAOQHACAeAADlBwAgJAAAlAkAIOoCAQDABQAh7wJAAMIFACH9AgAA2AfMAyL-AkAAwgUAIZcDAQDABQAhmAMBAMAFACHIAyAA5AUAIcoDAADXB8oDIswDIADkBQAhzQMgAOQFACHOA0AA7AUAIc8DAQDBBQAhGAQAANkHACAFAADaBwAgBwAA3AcAIA0AAN0HACAPAADjBwAgFQAA3wcAIBYAAN4HACAXAADgBwAgGAAA4QcAIBkAAOIHACAdAADkBwAgHgAA5QcAIOoCAQDABQAh7wJAAMIFACH9AgAA2AfMAyL-AkAAwgUAIZcDAQDABQAhmAMBAMAFACHIAyAA5AUAIcoDAADXB8oDIswDIADkBQAhzQMgAOQFACHOA0AA7AUAIc8DAQDBBQAhGAQAAN8IACAFAADgCAAgBgAA4QgAIA0AAOMIACAPAADpCAAgFQAA5QgAIBYAAOQIACAXAADmCAAgGAAA5wgAIBkAAOgIACAdAADqCAAgHgAA6wgAIOoCAQAAAAHvAkAAAAAB_QIAAADMAwL-AkAAAAABlwMBAAAAAZgDAQAAAAHIAyAAAAABygMAAADKAwLMAyAAAAABzQMgAAAAAc4DQAAAAAHPAwEAAAABAgAAAAEAICsAAJUJACADAAAAVwAgKwAAlQkAICwAAJkJACAaAAAAVwAgBAAA2QcAIAUAANoHACAGAADbBwAgDQAA3QcAIA8AAOMHACAVAADfBwAgFgAA3gcAIBcAAOAHACAYAADhBwAgGQAA4gcAIB0AAOQHACAeAADlBwAgJAAAmQkAIOoCAQDABQAh7wJAAMIFACH9AgAA2AfMAyL-AkAAwgUAIZcDAQDABQAhmAMBAMAFACHIAyAA5AUAIcoDAADXB8oDIswDIADkBQAhzQMgAOQFACHOA0AA7AUAIc8DAQDBBQAhGAQAANkHACAFAADaBwAgBgAA2wcAIA0AAN0HACAPAADjBwAgFQAA3wcAIBYAAN4HACAXAADgBwAgGAAA4QcAIBkAAOIHACAdAADkBwAgHgAA5QcAIOoCAQDABQAh7wJAAMIFACH9AgAA2AfMAyL-AkAAwgUAIZcDAQDABQAhmAMBAMAFACHIAyAA5AUAIcoDAADXB8oDIswDIADkBQAhzQMgAOQFACHOA0AA7AUAIc8DAQDBBQAhAZADAQAAAAEBpAMBAAAAAQnqAgEAAAAB7QIBAAAAAe8CQAAAAAH7AgEAAAAB_QIAAACkAwL-AkAAAAABoAMCAAAAAaEDIAAAAAGiAwAA2gYAIAPqAgEAAAAB7wJAAAAAAfsCAQAAAAEM6gIBAAAAAe8CQAAAAAH7AgEAAAAB_QIAAACTAwL-AkAAAAABhAMBAAAAAY4DAQAAAAGPAwgAAAABkQMBAAAAAZQDAAAAlAMClQMCAAAAAZYDQAAAAAEE6gIBAAAAAe8CQAAAAAH-AkAAAAABlwMBAAAAAQIAAADiAQAgKwAAnwkAIBUNAACnBwAgDgAAqAcAIA8AAKkHACDqAgEAAAAB7wJAAAAAAf0CAAAAtQMC_gJAAAAAAYIDCAAAAAGlAwEAAAABpgMBAAAAAacDAgAAAAGoAwEAAAABqQMAAKQHACCqAwAApQcAIKwDAAAArAMCrQMBAAAAAa4DAQAAAAGvAwEAAAABsAMgAAAAAbEDIAAAAAGzAwAAALMDAgIAAAD7AQAgKwAAoQkAIAMAAADlAQAgKwAAnwkAICwAAKUJACAGAAAA5QEAICQAAKUJACDqAgEAwAUAIe8CQADCBQAh_gJAAMIFACGXAwEAwAUAIQTqAgEAwAUAIe8CQADCBQAh_gJAAMIFACGXAwEAwAUAIQMAAAD-AQAgKwAAoQkAICwAAKgJACAXAAAA_gEAIA0AAPEGACAOAADyBgAgDwAA8wYAICQAAKgJACDqAgEAwAUAIe8CQADCBQAh_QIAAO8GtQMi_gJAAMIFACGCAwgA7QUAIaUDAQDABQAhpgMBAMAFACGnAwIA4gUAIagDAQDABQAhqQMAAOsGACCqAwAA7AYAIKwDAADtBqwDIq0DAQDBBQAhrgMBAMEFACGvAwEAwQUAIbADIADkBQAhsQMgAOQFACGzAwAA7gazAyIVDQAA8QYAIA4AAPIGACAPAADzBgAg6gIBAMAFACHvAkAAwgUAIf0CAADvBrUDIv4CQADCBQAhggMIAO0FACGlAwEAwAUAIaYDAQDABQAhpwMCAOIFACGoAwEAwAUAIakDAADrBgAgqgMAAOwGACCsAwAA7QasAyKtAwEAwQUAIa4DAQDBBQAhrwMBAMEFACGwAyAA5AUAIbEDIADkBQAhswMAAO4GswMiFQwAAKYHACAOAACoBwAgDwAAqQcAIOoCAQAAAAHvAkAAAAAB_QIAAAC1AwL-AkAAAAABggMIAAAAAaUDAQAAAAGmAwEAAAABpwMCAAAAAagDAQAAAAGpAwAApAcAIKoDAAClBwAgrAMAAACsAwKtAwEAAAABrgMBAAAAAa8DAQAAAAGwAyAAAAABsQMgAAAAAbMDAAAAswMCAgAAAPsBACArAACpCQAgGAQAAN8IACAFAADgCAAgBgAA4QgAIAcAAOIIACAPAADpCAAgFQAA5QgAIBYAAOQIACAXAADmCAAgGAAA5wgAIBkAAOgIACAdAADqCAAgHgAA6wgAIOoCAQAAAAHvAkAAAAAB_QIAAADMAwL-AkAAAAABlwMBAAAAAZgDAQAAAAHIAyAAAAABygMAAADKAwLMAyAAAAABzQMgAAAAAc4DQAAAAAHPAwEAAAABAgAAAAEAICsAAKsJACAD6gIBAAAAAe8CQAAAAAH7AgEAAAABB-oCAQAAAAHtAgEAAAAB7wJAAAAAAfsCAQAAAAH9AgAAAKADAv4CQAAAAAGeAwEAAAABAwAAAP4BACArAACpCQAgLAAAsQkAIBcAAAD-AQAgDAAA8AYAIA4AAPIGACAPAADzBgAgJAAAsQkAIOoCAQDABQAh7wJAAMIFACH9AgAA7wa1AyL-AkAAwgUAIYIDCADtBQAhpQMBAMAFACGmAwEAwAUAIacDAgDiBQAhqAMBAMAFACGpAwAA6wYAIKoDAADsBgAgrAMAAO0GrAMirQMBAMEFACGuAwEAwQUAIa8DAQDBBQAhsAMgAOQFACGxAyAA5AUAIbMDAADuBrMDIhUMAADwBgAgDgAA8gYAIA8AAPMGACDqAgEAwAUAIe8CQADCBQAh_QIAAO8GtQMi_gJAAMIFACGCAwgA7QUAIaUDAQDABQAhpgMBAMAFACGnAwIA4gUAIagDAQDABQAhqQMAAOsGACCqAwAA7AYAIKwDAADtBqwDIq0DAQDBBQAhrgMBAMEFACGvAwEAwQUAIbADIADkBQAhsQMgAOQFACGzAwAA7gazAyIDAAAAVwAgKwAAqwkAICwAALQJACAaAAAAVwAgBAAA2QcAIAUAANoHACAGAADbBwAgBwAA3AcAIA8AAOMHACAVAADfBwAgFgAA3gcAIBcAAOAHACAYAADhBwAgGQAA4gcAIB0AAOQHACAeAADlBwAgJAAAtAkAIOoCAQDABQAh7wJAAMIFACH9AgAA2AfMAyL-AkAAwgUAIZcDAQDABQAhmAMBAMAFACHIAyAA5AUAIcoDAADXB8oDIswDIADkBQAhzQMgAOQFACHOA0AA7AUAIc8DAQDBBQAhGAQAANkHACAFAADaBwAgBgAA2wcAIAcAANwHACAPAADjBwAgFQAA3wcAIBYAAN4HACAXAADgBwAgGAAA4QcAIBkAAOIHACAdAADkBwAgHgAA5QcAIOoCAQDABQAh7wJAAMIFACH9AgAA2AfMAyL-AkAAwgUAIZcDAQDABQAhmAMBAMAFACHIAyAA5AUAIcoDAADXB8oDIswDIADkBQAhzQMgAOQFACHOA0AA7AUAIc8DAQDBBQAhDQMAANsGACAIAADcBgAgFQAA3gYAIOoCAQAAAAHtAgEAAAAB7wJAAAAAAfsCAQAAAAH9AgAAAKQDAv4CQAAAAAGQAwEAAAABoAMCAAAAAaEDIAAAAAGiAwAA2gYAIAIAAAARACArAAC1CQAgGAQAAN8IACAFAADgCAAgBgAA4QgAIAcAAOIIACANAADjCAAgDwAA6QgAIBUAAOUIACAXAADmCAAgGAAA5wgAIBkAAOgIACAdAADqCAAgHgAA6wgAIOoCAQAAAAHvAkAAAAAB_QIAAADMAwL-AkAAAAABlwMBAAAAAZgDAQAAAAHIAyAAAAABygMAAADKAwLMAyAAAAABzQMgAAAAAc4DQAAAAAHPAwEAAAABAgAAAAEAICsAALcJACADAAAADwAgKwAAtQkAICwAALsJACAPAAAADwAgAwAAwQYAIAgAAMIGACAVAADEBgAgJAAAuwkAIOoCAQDABQAh7QIBAMAFACHvAkAAwgUAIfsCAQDABQAh_QIAAMAGpAMi_gJAAMIFACGQAwEAwAUAIaADAgDiBQAhoQMgAOQFACGiAwAAvwYAIA0DAADBBgAgCAAAwgYAIBUAAMQGACDqAgEAwAUAIe0CAQDABQAh7wJAAMIFACH7AgEAwAUAIf0CAADABqQDIv4CQADCBQAhkAMBAMAFACGgAwIA4gUAIaEDIADkBQAhogMAAL8GACADAAAAVwAgKwAAtwkAICwAAL4JACAaAAAAVwAgBAAA2QcAIAUAANoHACAGAADbBwAgBwAA3AcAIA0AAN0HACAPAADjBwAgFQAA3wcAIBcAAOAHACAYAADhBwAgGQAA4gcAIB0AAOQHACAeAADlBwAgJAAAvgkAIOoCAQDABQAh7wJAAMIFACH9AgAA2AfMAyL-AkAAwgUAIZcDAQDABQAhmAMBAMAFACHIAyAA5AUAIcoDAADXB8oDIswDIADkBQAhzQMgAOQFACHOA0AA7AUAIc8DAQDBBQAhGAQAANkHACAFAADaBwAgBgAA2wcAIAcAANwHACANAADdBwAgDwAA4wcAIBUAAN8HACAXAADgBwAgGAAA4QcAIBkAAOIHACAdAADkBwAgHgAA5QcAIOoCAQDABQAh7wJAAMIFACH9AgAA2AfMAyL-AkAAwgUAIZcDAQDABQAhmAMBAMAFACHIAyAA5AUAIcoDAADXB8oDIswDIADkBQAhzQMgAOQFACHOA0AA7AUAIc8DAQDBBQAhDAMAAK4GACAQAACvBgAgEQAAsQYAIBIAALIGACDqAgEAAAAB7QIBAAAAAe8CQAAAAAH7AgEAAAAB_QIAAACgAwL-AkAAAAABnQMBAAAAAZ4DAQAAAAECAAAALAAgKwAAvwkAIA0DAADbBgAgCAAA3AYAIBEAAN0GACDqAgEAAAAB7QIBAAAAAe8CQAAAAAH7AgEAAAAB_QIAAACkAwL-AkAAAAABkAMBAAAAAaADAgAAAAGhAyAAAAABogMAANoGACACAAAAEQAgKwAAwQkAIBgEAADfCAAgBQAA4AgAIAYAAOEIACAHAADiCAAgDQAA4wgAIA8AAOkIACAWAADkCAAgFwAA5ggAIBgAAOcIACAZAADoCAAgHQAA6ggAIB4AAOsIACDqAgEAAAAB7wJAAAAAAf0CAAAAzAMC_gJAAAAAAZcDAQAAAAGYAwEAAAAByAMgAAAAAcoDAAAAygMCzAMgAAAAAc0DIAAAAAHOA0AAAAABzwMBAAAAAQIAAAABACArAADDCQAgB-oCAQAAAAHtAgEAAAAB7wJAAAAAAfsCAQAAAAH9AgAAAKADAv4CQAAAAAGdAwEAAAABA-oCAQAAAAHvAkAAAAAB-wIBAAAAAQMAAAAqACArAAC_CQAgLAAAyQkAIA4AAAAqACADAACRBgAgEAAAkgYAIBEAAJUGACASAACTBgAgJAAAyQkAIOoCAQDABQAh7QIBAMAFACHvAkAAwgUAIfsCAQDABQAh_QIAAJAGoAMi_gJAAMIFACGdAwEAwAUAIZ4DAQDBBQAhDAMAAJEGACAQAACSBgAgEQAAlQYAIBIAAJMGACDqAgEAwAUAIe0CAQDABQAh7wJAAMIFACH7AgEAwAUAIf0CAACQBqADIv4CQADCBQAhnQMBAMAFACGeAwEAwQUAIQMAAAAPACArAADBCQAgLAAAzAkAIA8AAAAPACADAADBBgAgCAAAwgYAIBEAAMMGACAkAADMCQAg6gIBAMAFACHtAgEAwAUAIe8CQADCBQAh-wIBAMAFACH9AgAAwAakAyL-AkAAwgUAIZADAQDABQAhoAMCAOIFACGhAyAA5AUAIaIDAAC_BgAgDQMAAMEGACAIAADCBgAgEQAAwwYAIOoCAQDABQAh7QIBAMAFACHvAkAAwgUAIfsCAQDABQAh_QIAAMAGpAMi_gJAAMIFACGQAwEAwAUAIaADAgDiBQAhoQMgAOQFACGiAwAAvwYAIAMAAABXACArAADDCQAgLAAAzwkAIBoAAABXACAEAADZBwAgBQAA2gcAIAYAANsHACAHAADcBwAgDQAA3QcAIA8AAOMHACAWAADeBwAgFwAA4AcAIBgAAOEHACAZAADiBwAgHQAA5AcAIB4AAOUHACAkAADPCQAg6gIBAMAFACHvAkAAwgUAIf0CAADYB8wDIv4CQADCBQAhlwMBAMAFACGYAwEAwAUAIcgDIADkBQAhygMAANcHygMizAMgAOQFACHNAyAA5AUAIc4DQADsBQAhzwMBAMEFACEYBAAA2QcAIAUAANoHACAGAADbBwAgBwAA3AcAIA0AAN0HACAPAADjBwAgFgAA3gcAIBcAAOAHACAYAADhBwAgGQAA4gcAIB0AAOQHACAeAADlBwAg6gIBAMAFACHvAkAAwgUAIf0CAADYB8wDIv4CQADCBQAhlwMBAMAFACGYAwEAwAUAIcgDIADkBQAhygMAANcHygMizAMgAOQFACHNAyAA5AUAIc4DQADsBQAhzwMBAMEFACEMAwAArgYAIBAAAK8GACASAACyBgAgEwAAsAYAIOoCAQAAAAHtAgEAAAAB7wJAAAAAAfsCAQAAAAH9AgAAAKADAv4CQAAAAAGdAwEAAAABngMBAAAAAQIAAAAsACArAADQCQAgGAQAAN8IACAFAADgCAAgBgAA4QgAIAcAAOIIACANAADjCAAgDwAA6QgAIBUAAOUIACAWAADkCAAgGAAA5wgAIBkAAOgIACAdAADqCAAgHgAA6wgAIOoCAQAAAAHvAkAAAAAB_QIAAADMAwL-AkAAAAABlwMBAAAAAZgDAQAAAAHIAyAAAAABygMAAADKAwLMAyAAAAABzQMgAAAAAc4DQAAAAAHPAwEAAAABAgAAAAEAICsAANIJACADAAAAKgAgKwAA0AkAICwAANYJACAOAAAAKgAgAwAAkQYAIBAAAJIGACASAACTBgAgEwAAlAYAICQAANYJACDqAgEAwAUAIe0CAQDABQAh7wJAAMIFACH7AgEAwAUAIf0CAACQBqADIv4CQADCBQAhnQMBAMAFACGeAwEAwQUAIQwDAACRBgAgEAAAkgYAIBIAAJMGACATAACUBgAg6gIBAMAFACHtAgEAwAUAIe8CQADCBQAh-wIBAMAFACH9AgAAkAagAyL-AkAAwgUAIZ0DAQDABQAhngMBAMEFACEDAAAAVwAgKwAA0gkAICwAANkJACAaAAAAVwAgBAAA2QcAIAUAANoHACAGAADbBwAgBwAA3AcAIA0AAN0HACAPAADjBwAgFQAA3wcAIBYAAN4HACAYAADhBwAgGQAA4gcAIB0AAOQHACAeAADlBwAgJAAA2QkAIOoCAQDABQAh7wJAAMIFACH9AgAA2AfMAyL-AkAAwgUAIZcDAQDABQAhmAMBAMAFACHIAyAA5AUAIcoDAADXB8oDIswDIADkBQAhzQMgAOQFACHOA0AA7AUAIc8DAQDBBQAhGAQAANkHACAFAADaBwAgBgAA2wcAIAcAANwHACANAADdBwAgDwAA4wcAIBUAAN8HACAWAADeBwAgGAAA4QcAIBkAAOIHACAdAADkBwAgHgAA5QcAIOoCAQDABQAh7wJAAMIFACH9AgAA2AfMAyL-AkAAwgUAIZcDAQDABQAhmAMBAMAFACHIAyAA5AUAIcoDAADXB8oDIswDIADkBQAhzQMgAOQFACHOA0AA7AUAIc8DAQDBBQAhFQwAAKYHACANAACnBwAgDwAAqQcAIOoCAQAAAAHvAkAAAAAB_QIAAAC1AwL-AkAAAAABggMIAAAAAaUDAQAAAAGmAwEAAAABpwMCAAAAAagDAQAAAAGpAwAApAcAIKoDAAClBwAgrAMAAACsAwKtAwEAAAABrgMBAAAAAa8DAQAAAAGwAyAAAAABsQMgAAAAAbMDAAAAswMCAgAAAPsBACArAADaCQAgGAQAAN8IACAFAADgCAAgBgAA4QgAIAcAAOIIACANAADjCAAgDwAA6QgAIBUAAOUIACAWAADkCAAgFwAA5ggAIBkAAOgIACAdAADqCAAgHgAA6wgAIOoCAQAAAAHvAkAAAAAB_QIAAADMAwL-AkAAAAABlwMBAAAAAZgDAQAAAAHIAyAAAAABygMAAADKAwLMAyAAAAABzQMgAAAAAc4DQAAAAAHPAwEAAAABAgAAAAEAICsAANwJACADAAAA_gEAICsAANoJACAsAADgCQAgFwAAAP4BACAMAADwBgAgDQAA8QYAIA8AAPMGACAkAADgCQAg6gIBAMAFACHvAkAAwgUAIf0CAADvBrUDIv4CQADCBQAhggMIAO0FACGlAwEAwAUAIaYDAQDABQAhpwMCAOIFACGoAwEAwAUAIakDAADrBgAgqgMAAOwGACCsAwAA7QasAyKtAwEAwQUAIa4DAQDBBQAhrwMBAMEFACGwAyAA5AUAIbEDIADkBQAhswMAAO4GswMiFQwAAPAGACANAADxBgAgDwAA8wYAIOoCAQDABQAh7wJAAMIFACH9AgAA7wa1AyL-AkAAwgUAIYIDCADtBQAhpQMBAMAFACGmAwEAwAUAIacDAgDiBQAhqAMBAMAFACGpAwAA6wYAIKoDAADsBgAgrAMAAO0GrAMirQMBAMEFACGuAwEAwQUAIa8DAQDBBQAhsAMgAOQFACGxAyAA5AUAIbMDAADuBrMDIgMAAABXACArAADcCQAgLAAA4wkAIBoAAABXACAEAADZBwAgBQAA2gcAIAYAANsHACAHAADcBwAgDQAA3QcAIA8AAOMHACAVAADfBwAgFgAA3gcAIBcAAOAHACAZAADiBwAgHQAA5AcAIB4AAOUHACAkAADjCQAg6gIBAMAFACHvAkAAwgUAIf0CAADYB8wDIv4CQADCBQAhlwMBAMAFACGYAwEAwAUAIcgDIADkBQAhygMAANcHygMizAMgAOQFACHNAyAA5AUAIc4DQADsBQAhzwMBAMEFACEYBAAA2QcAIAUAANoHACAGAADbBwAgBwAA3AcAIA0AAN0HACAPAADjBwAgFQAA3wcAIBYAAN4HACAXAADgBwAgGQAA4gcAIB0AAOQHACAeAADlBwAg6gIBAMAFACHvAkAAwgUAIf0CAADYB8wDIv4CQADCBQAhlwMBAMAFACGYAwEAwAUAIcgDIADkBQAhygMAANcHygMizAMgAOQFACHNAyAA5AUAIc4DQADsBQAhzwMBAMEFACEVDAAApgcAIA0AAKcHACAOAACoBwAg6gIBAAAAAe8CQAAAAAH9AgAAALUDAv4CQAAAAAGCAwgAAAABpQMBAAAAAaYDAQAAAAGnAwIAAAABqAMBAAAAAakDAACkBwAgqgMAAKUHACCsAwAAAKwDAq0DAQAAAAGuAwEAAAABrwMBAAAAAbADIAAAAAGxAyAAAAABswMAAACzAwICAAAA-wEAICsAAOQJACAYBAAA3wgAIAUAAOAIACAGAADhCAAgBwAA4ggAIA0AAOMIACAVAADlCAAgFgAA5AgAIBcAAOYIACAYAADnCAAgGQAA6AgAIB0AAOoIACAeAADrCAAg6gIBAAAAAe8CQAAAAAH9AgAAAMwDAv4CQAAAAAGXAwEAAAABmAMBAAAAAcgDIAAAAAHKAwAAAMoDAswDIAAAAAHNAyAAAAABzgNAAAAAAc8DAQAAAAECAAAAAQAgKwAA5gkAIAMAAAD-AQAgKwAA5AkAICwAAOoJACAXAAAA_gEAIAwAAPAGACANAADxBgAgDgAA8gYAICQAAOoJACDqAgEAwAUAIe8CQADCBQAh_QIAAO8GtQMi_gJAAMIFACGCAwgA7QUAIaUDAQDABQAhpgMBAMAFACGnAwIA4gUAIagDAQDABQAhqQMAAOsGACCqAwAA7AYAIKwDAADtBqwDIq0DAQDBBQAhrgMBAMEFACGvAwEAwQUAIbADIADkBQAhsQMgAOQFACGzAwAA7gazAyIVDAAA8AYAIA0AAPEGACAOAADyBgAg6gIBAMAFACHvAkAAwgUAIf0CAADvBrUDIv4CQADCBQAhggMIAO0FACGlAwEAwAUAIaYDAQDABQAhpwMCAOIFACGoAwEAwAUAIakDAADrBgAgqgMAAOwGACCsAwAA7QasAyKtAwEAwQUAIa4DAQDBBQAhrwMBAMEFACGwAyAA5AUAIbEDIADkBQAhswMAAO4GswMiAwAAAFcAICsAAOYJACAsAADtCQAgGgAAAFcAIAQAANkHACAFAADaBwAgBgAA2wcAIAcAANwHACANAADdBwAgFQAA3wcAIBYAAN4HACAXAADgBwAgGAAA4QcAIBkAAOIHACAdAADkBwAgHgAA5QcAICQAAO0JACDqAgEAwAUAIe8CQADCBQAh_QIAANgHzAMi_gJAAMIFACGXAwEAwAUAIZgDAQDABQAhyAMgAOQFACHKAwAA1wfKAyLMAyAA5AUAIc0DIADkBQAhzgNAAOwFACHPAwEAwQUAIRgEAADZBwAgBQAA2gcAIAYAANsHACAHAADcBwAgDQAA3QcAIBUAAN8HACAWAADeBwAgFwAA4AcAIBgAAOEHACAZAADiBwAgHQAA5AcAIB4AAOUHACDqAgEAwAUAIe8CQADCBQAh_QIAANgHzAMi_gJAAMIFACGXAwEAwAUAIZgDAQDABQAhyAMgAOQFACHKAwAA1wfKAyLMAyAA5AUAIc0DIADkBQAhzgNAAOwFACHPAwEAwQUAIRgEAADfCAAgBQAA4AgAIAYAAOEIACAHAADiCAAgDQAA4wgAIA8AAOkIACAVAADlCAAgFgAA5AgAIBcAAOYIACAYAADnCAAgHQAA6ggAIB4AAOsIACDqAgEAAAAB7wJAAAAAAf0CAAAAzAMC_gJAAAAAAZcDAQAAAAGYAwEAAAAByAMgAAAAAcoDAAAAygMCzAMgAAAAAc0DIAAAAAHOA0AAAAABzwMBAAAAAQIAAAABACArAADuCQAgAwAAAFcAICsAAO4JACAsAADyCQAgGgAAAFcAIAQAANkHACAFAADaBwAgBgAA2wcAIAcAANwHACANAADdBwAgDwAA4wcAIBUAAN8HACAWAADeBwAgFwAA4AcAIBgAAOEHACAdAADkBwAgHgAA5QcAICQAAPIJACDqAgEAwAUAIe8CQADCBQAh_QIAANgHzAMi_gJAAMIFACGXAwEAwAUAIZgDAQDABQAhyAMgAOQFACHKAwAA1wfKAyLMAyAA5AUAIc0DIADkBQAhzgNAAOwFACHPAwEAwQUAIRgEAADZBwAgBQAA2gcAIAYAANsHACAHAADcBwAgDQAA3QcAIA8AAOMHACAVAADfBwAgFgAA3gcAIBcAAOAHACAYAADhBwAgHQAA5AcAIB4AAOUHACDqAgEAwAUAIe8CQADCBQAh_QIAANgHzAMi_gJAAMIFACGXAwEAwAUAIZgDAQDABQAhyAMgAOQFACHKAwAA1wfKAyLMAyAA5AUAIc0DIADkBQAhzgNAAOwFACHPAwEAwQUAIRgEAADfCAAgBQAA4AgAIAYAAOEIACAHAADiCAAgDQAA4wgAIA8AAOkIACAVAADlCAAgFgAA5AgAIBcAAOYIACAYAADnCAAgGQAA6AgAIB4AAOsIACDqAgEAAAAB7wJAAAAAAf0CAAAAzAMC_gJAAAAAAZcDAQAAAAGYAwEAAAAByAMgAAAAAcoDAAAAygMCzAMgAAAAAc0DIAAAAAHOA0AAAAABzwMBAAAAAQIAAAABACArAADzCQAgBeoCAQAAAAHsAgEAAAAB7QIBAAAAAe4CAQAAAAHvAkAAAAABAwAAAFcAICsAAPMJACAsAAD4CQAgGgAAAFcAIAQAANkHACAFAADaBwAgBgAA2wcAIAcAANwHACANAADdBwAgDwAA4wcAIBUAAN8HACAWAADeBwAgFwAA4AcAIBgAAOEHACAZAADiBwAgHgAA5QcAICQAAPgJACDqAgEAwAUAIe8CQADCBQAh_QIAANgHzAMi_gJAAMIFACGXAwEAwAUAIZgDAQDABQAhyAMgAOQFACHKAwAA1wfKAyLMAyAA5AUAIc0DIADkBQAhzgNAAOwFACHPAwEAwQUAIRgEAADZBwAgBQAA2gcAIAYAANsHACAHAADcBwAgDQAA3QcAIA8AAOMHACAVAADfBwAgFgAA3gcAIBcAAOAHACAYAADhBwAgGQAA4gcAIB4AAOUHACDqAgEAwAUAIe8CQADCBQAh_QIAANgHzAMi_gJAAMIFACGXAwEAwAUAIZgDAQDABQAhyAMgAOQFACHKAwAA1wfKAyLMAyAA5AUAIc0DIADkBQAhzgNAAOwFACHPAwEAwQUAIRgEAADfCAAgBQAA4AgAIAYAAOEIACAHAADiCAAgDQAA4wgAIA8AAOkIACAVAADlCAAgFgAA5AgAIBcAAOYIACAYAADnCAAgGQAA6AgAIB0AAOoIACDqAgEAAAAB7wJAAAAAAf0CAAAAzAMC_gJAAAAAAZcDAQAAAAGYAwEAAAAByAMgAAAAAcoDAAAAygMCzAMgAAAAAc0DIAAAAAHOA0AAAAABzwMBAAAAAQIAAAABACArAAD5CQAgBgMAANkFACDqAgEAAAAB7wJAAAAAAfsCAQAAAAH9AgAAAP0CAv4CQAAAAAECAAAAQwAgKwAA-wkAIAMAAABXACArAAD5CQAgLAAA_wkAIBoAAABXACAEAADZBwAgBQAA2gcAIAYAANsHACAHAADcBwAgDQAA3QcAIA8AAOMHACAVAADfBwAgFgAA3gcAIBcAAOAHACAYAADhBwAgGQAA4gcAIB0AAOQHACAkAAD_CQAg6gIBAMAFACHvAkAAwgUAIf0CAADYB8wDIv4CQADCBQAhlwMBAMAFACGYAwEAwAUAIcgDIADkBQAhygMAANcHygMizAMgAOQFACHNAyAA5AUAIc4DQADsBQAhzwMBAMEFACEYBAAA2QcAIAUAANoHACAGAADbBwAgBwAA3AcAIA0AAN0HACAPAADjBwAgFQAA3wcAIBYAAN4HACAXAADgBwAgGAAA4QcAIBkAAOIHACAdAADkBwAg6gIBAMAFACHvAkAAwgUAIf0CAADYB8wDIv4CQADCBQAhlwMBAMAFACGYAwEAwAUAIcgDIADkBQAhygMAANcHygMizAMgAOQFACHNAyAA5AUAIc4DQADsBQAhzwMBAMEFACEDAAAAQQAgKwAA-wkAICwAAIIKACAIAAAAQQAgAwAAywUAICQAAIIKACDqAgEAwAUAIe8CQADCBQAh-wIBAMAFACH9AgAAygX9AiL-AkAAwgUAIQYDAADLBQAg6gIBAMAFACHvAkAAwgUAIfsCAQDABQAh_QIAAMoF_QIi_gJAAMIFACEOBAYCBQoDBgwEBw4FCgAXDRIGD0AMFTkPFjgOFzoQGDsLGT8THUQUHkoVAQMAAQEDAAEBAwABAQMAAQUDAAEIAAcKABIRKQ4VLQ8FCgANDBYIDRkGDh0LDyEMAggABwsACQIJFwgKAAoBCRgAAgMAAQgABwIDAAEIAAcEDCIADSMADiQADyUAAgMAARAABgYDAAEKABEQAAYRMxASLg8TLw8CAwABFAAPAhE1ABM0AAIRNgAVNwABAwABAwMAAQoAFhxIFQIaABQbAAEBHEkACwRLAAVMAA1NAA9TABVPABZOABdQABhRABlSAB1UAB5VAAAAAAMKABwxAB0yAB4AAAADCgAcMQAdMgAeAQMAAQEDAAEDCgAjMQAkMgAlAAAAAwoAIzEAJDIAJQEDAAEBAwABAwoAKjEAKzIALAAAAAMKACoxACsyACwAAAADCgAyMQAzMgA0AAAAAwoAMjEAMzIANAEDAAEBAwABAwoAOTEAOjIAOwAAAAMKADkxADoyADsBAwABAQMAAQMKAEAxAEEyAEIAAAADCgBAMQBBMgBCAAADCgBHMQBIMgBJAAAAAwoARzEASDIASQAABQoATjEAUTIAUqMBAE-kAQBQAAAAAAAFCgBOMQBRMgBSowEAT6QBAFACCAAHCwAJAggABwsACQMKAFcxAFgyAFkAAAADCgBXMQBYMgBZAgMAAQgABwIDAAEIAAcFCgBeMQBhMgBiowEAX6QBAGAAAAAAAAUKAF4xAGEyAGKjAQBfpAEAYAIDAAEQAAYCAwABEAAGAwoAZzEAaDIAaQAAAAMKAGcxAGgyAGkDAwABEAAGEuACDwMDAAEQAAYS5gIPAwoAbjEAbzIAcAAAAAMKAG4xAG8yAHACAwABFAAPAgMAARQADwMKAHUxAHYyAHcAAAADCgB1MQB2MgB3AgMAAQgABwIDAAEIAAcDCgB8MQB9MgB-AAAAAwoAfDEAfTIAfgAAAAMKAIQBMQCFATIAhgEAAAADCgCEATEAhQEyAIYBAgMAAQgABwIDAAEIAAcFCgCLATEAjgEyAI8BowEAjAGkAQCNAQAAAAAABQoAiwExAI4BMgCPAaMBAIwBpAEAjQEBAwABAQMAAQUKAJQBMQCXATIAmAGjAQCVAaQBAJYBAAAAAAAFCgCUATEAlwEyAJgBowEAlQGkAQCWAQAAAAUKAJ4BMQChATIAogGjAQCfAaQBAKABAAAAAAAFCgCeATEAoQEyAKIBowEAnwGkAQCgAQEDAAEBAwABAwoApwExAKgBMgCpAQAAAAMKAKcBMQCoATIAqQECGgAUGwABAhoAFBsAAQMKAK4BMQCvATIAsAEAAAADCgCuATEArwEyALABHwIBIFYBIVkBIloBI1sBJV0BJl8YJ2AZKGIBKWQYKmUaLWYBLmcBL2gYM2sbNGwfNW0CNm4CN28COHACOXECOnMCO3UYPHYgPXgCPnoYP3shQHwCQX0CQn4YQ4EBIkSCASZFgwEDRoQBA0eFAQNIhgEDSYcBA0qJAQNLiwEYTIwBJ02OAQNOkAEYT5EBKFCSAQNRkwEDUpQBGFOXASlUmAEtVZoBLlabAS5XngEuWJ8BLlmgAS5aogEuW6QBGFylAS9dpwEuXqkBGF-qATBgqwEuYawBLmKtARhjsAExZLEBNWWzAQRmtAEEZ7YBBGi3AQRpuAEEaroBBGu8ARhsvQE2bb8BBG7BARhvwgE3cMMBBHHEAQRyxQEYc8gBOHTJATx1ywEFdswBBXfOAQV4zwEFedABBXrSAQV71AEYfNUBPX3XAQV-2QEYf9oBPoAB2wEFgQHcAQWCAd0BGIMB4AE_hAHhAUOFAeMBCYYB5AEJhwHnAQmIAegBCYkB6QEJigHrAQmLAe0BGIwB7gFEjQHwAQmOAfIBGI8B8wFFkAH0AQmRAfUBCZIB9gEYkwH5AUaUAfoBSpUB_AEHlgH9AQeXAYACB5gBgQIHmQGCAgeaAYQCB5sBhgIYnAGHAkudAYkCB54BiwIYnwGMAkygAY0CB6EBjgIHogGPAhilAZICTaYBkwJTpwGUAgioAZUCCKkBlgIIqgGXAgirAZgCCKwBmgIIrQGcAhiuAZ0CVK8BnwIIsAGhAhixAaICVbIBowIIswGkAgi0AaUCGLUBqAJWtgGpAlq3AaoCBrgBqwIGuQGsAga6Aa0CBrsBrgIGvAGwAga9AbICGL4BswJbvwG1AgbAAbcCGMEBuAJcwgG5AgbDAboCBsQBuwIYxQG-Al3GAb8CY8cBwAIOyAHBAg7JAcICDsoBwwIOywHEAg7MAcYCDs0ByAIYzgHJAmTPAcsCDtABzQIY0QHOAmXSAc8CDtMB0AIO1AHRAhjVAdQCZtYB1QJq1wHWAg_YAdcCD9kB2AIP2gHZAg_bAdoCD9wB3AIP3QHeAhjeAd8Ca98B4gIP4AHkAhjhAeUCbOIB5wIP4wHoAg_kAekCGOUB7AJt5gHtAnHnAe4CEOgB7wIQ6QHwAhDqAfECEOsB8gIQ7AH0AhDtAfYCGO4B9wJy7wH5AhDwAfsCGPEB_AJz8gH9AhDzAf4CEPQB_wIY9QGCA3T2AYMDePcBhAML-AGFAwv5AYYDC_oBhwML-wGIAwv8AYoDC_0BjAMY_gGNA3n_AY8DC4ACkQMYgQKSA3qCApMDC4MClAMLhAKVAxiFApgDe4YCmQN_hwKbA4ABiAKcA4ABiQKfA4ABigKgA4ABiwKhA4ABjAKjA4ABjQKlAxiOAqYDgQGPAqgDgAGQAqoDGJECqwOCAZICrAOAAZMCrQOAAZQCrgMYlQKxA4MBlgKyA4cBlwKzAwyYArQDDJkCtQMMmgK2AwybArcDDJwCuQMMnQK7AxieArwDiAGfAr4DDKACwAMYoQLBA4kBogLCAwyjAsMDDKQCxAMYpQLHA4oBpgLIA5ABpwLJAxOoAsoDE6kCywMTqgLMAxOrAs0DE6wCzwMTrQLRAxiuAtIDkQGvAtQDE7AC1gMYsQLXA5IBsgLYAxOzAtkDE7QC2gMYtQLdA5MBtgLeA5kBtwLgA5oBuALhA5oBuQLkA5oBugLlA5oBuwLmA5oBvALoA5oBvQLqAxi-AusDmwG_Au0DmgHAAu8DGMEC8AOcAcIC8QOaAcMC8gOaAcQC8wMYxQL2A50BxgL3A6MBxwL4AxTIAvkDFMkC-gMUygL7AxTLAvwDFMwC_gMUzQKABBjOAoEEpAHPAoMEFNAChQQY0QKGBKUB0gKHBBTTAogEFNQCiQQY1QKMBKYB1gKNBKoB1wKOBBXYAo8EFdkCkAQV2gKRBBXbApIEFdwClAQV3QKWBBjeApcEqwHfApkEFeACmwQY4QKcBKwB4gKdBBXjAp4EFeQCnwQY5QKiBK0B5gKjBLEB"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("node:buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AdminProfileScalarFieldEnum: () => AdminProfileScalarFieldEnum,
  AnyNull: () => AnyNull2,
  ChatMessageScalarFieldEnum: () => ChatMessageScalarFieldEnum,
  ChatSessionScalarFieldEnum: () => ChatSessionScalarFieldEnum,
  CommentLikeScalarFieldEnum: () => CommentLikeScalarFieldEnum,
  ContactMessageScalarFieldEnum: () => ContactMessageScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  GenreScalarFieldEnum: () => GenreScalarFieldEnum,
  JsonNull: () => JsonNull2,
  MediaGenreScalarFieldEnum: () => MediaGenreScalarFieldEnum,
  MediaScalarFieldEnum: () => MediaScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  PurchaseScalarFieldEnum: () => PurchaseScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewCommentScalarFieldEnum: () => ReviewCommentScalarFieldEnum,
  ReviewLikeScalarFieldEnum: () => ReviewLikeScalarFieldEnum,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  SubscriptionPlanSettingScalarFieldEnum: () => SubscriptionPlanSettingScalarFieldEnum,
  SubscriptionScalarFieldEnum: () => SubscriptionScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserProfileScalarFieldEnum: () => UserProfileScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  WatchlistScalarFieldEnum: () => WatchlistScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.6.0",
  engine: "75cbdc1eb7150937890ad5465d861175c6624711"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  UserProfile: "UserProfile",
  AdminProfile: "AdminProfile",
  Genre: "Genre",
  Media: "Media",
  MediaGenre: "MediaGenre",
  Review: "Review",
  ReviewLike: "ReviewLike",
  ReviewComment: "ReviewComment",
  CommentLike: "CommentLike",
  Watchlist: "Watchlist",
  ContactMessage: "ContactMessage",
  Purchase: "Purchase",
  Subscription: "Subscription",
  SubscriptionPlanSetting: "SubscriptionPlanSetting",
  ChatSession: "ChatSession",
  ChatMessage: "ChatMessage"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  role: "role",
  status: "status",
  needPasswordChange: "needPasswordChange",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  bio: "bio",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AdminProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var GenreScalarFieldEnum = {
  id: "id",
  name: "name",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MediaScalarFieldEnum = {
  id: "id",
  title: "title",
  synopsis: "synopsis",
  releaseYear: "releaseYear",
  director: "director",
  cast: "cast",
  streamingPlatform: "streamingPlatform",
  pricingType: "pricingType",
  price: "price",
  streamingLink: "streamingLink",
  posterUrl: "posterUrl",
  trailerUrl: "trailerUrl",
  isFeatured: "isFeatured",
  isEditorPick: "isEditorPick",
  mediaType: "mediaType",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MediaGenreScalarFieldEnum = {
  mediaId: "mediaId",
  genreId: "genreId"
};
var ReviewScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mediaId: "mediaId",
  rating: "rating",
  content: "content",
  isSpoiler: "isSpoiler",
  tags: "tags",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewLikeScalarFieldEnum = {
  id: "id",
  userId: "userId",
  reviewId: "reviewId",
  createdAt: "createdAt"
};
var ReviewCommentScalarFieldEnum = {
  id: "id",
  userId: "userId",
  reviewId: "reviewId",
  content: "content",
  parentId: "parentId",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CommentLikeScalarFieldEnum = {
  id: "id",
  userId: "userId",
  commentId: "commentId",
  createdAt: "createdAt"
};
var WatchlistScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mediaId: "mediaId",
  createdAt: "createdAt"
};
var ContactMessageScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  subject: "subject",
  message: "message",
  isRead: "isRead",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PurchaseScalarFieldEnum = {
  id: "id",
  userId: "userId",
  mediaId: "mediaId",
  stripeSessionId: "stripeSessionId",
  stripePaymentId: "stripePaymentId",
  amount: "amount",
  currency: "currency",
  status: "status",
  purchaseType: "purchaseType",
  rentalDays: "rentalDays",
  rentalExpiresAt: "rentalExpiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SubscriptionScalarFieldEnum = {
  id: "id",
  userId: "userId",
  plan: "plan",
  status: "status",
  startDate: "startDate",
  endDate: "endDate",
  stripeCustomerId: "stripeCustomerId",
  stripePaymentId: "stripePaymentId",
  amount: "amount",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SubscriptionPlanSettingScalarFieldEnum = {
  id: "id",
  plan: "plan",
  label: "label",
  price: "price",
  durationDays: "durationDays",
  currency: "currency",
  features: "features",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ChatSessionScalarFieldEnum = {
  id: "id",
  userId: "userId",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ChatMessageScalarFieldEnum = {
  id: "id",
  chatSessionId: "chatSessionId",
  senderId: "senderId",
  content: "content",
  imageUrl: "imageUrl",
  createdAt: "createdAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = process.env.DATABASE_URL;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
var auth = betterAuth({
  baseURL: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true
  },
  socialProviders: {
    google: {
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: () => ({
        role: Role.USER,
        status: UserStatus.ACTIVE,
        needPasswordChange: false,
        emailVerified: true,
        isDeleted: false,
        deletedAt: null
      })
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.USER
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null
      }
    }
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            console.error(`User with email ${email} not found.`);
            return;
          }
          if (user.role === Role.SUPER_ADMIN) {
            console.log(`Super admin ${email}: skipping OTP email.`);
            return;
          }
          if (user && !user.emailVerified) {
            await sendEmail({
              to: email,
              subject: "Verify your CineTube account",
              templateName: "otp",
              templateData: { name: user.name, otp }
            }).catch((err) => console.error("Failed to send verification email:", err));
          }
        } else if (type === "forget-password") {
          const user = await prisma.user.findUnique({ where: { email } });
          if (user) {
            await sendEmail({
              to: email,
              subject: "CineTube - Password Reset OTP",
              templateName: "otp",
              templateData: { name: user.name, otp }
            }).catch((err) => console.error("Failed to send password reset email:", err));
          }
        }
      },
      expiresIn: 2 * 60,
      otpLength: 6
    })
  ],
  session: {
    expiresIn: 60 * 60 * 24,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24
    }
  },
  redirectURLs: {
    signIn: `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success`
  },
  trustedOrigins: [envVars.BETTER_AUTH_URL, envVars.FRONTEND_URL, "http://localhost:3000", "http://localhost:5000"],
  advanced: {
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      },
      sessionToken: {
        attributes: {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          path: "/"
        }
      }
    }
  }
});

// src/app/modules/purchase/purchase.controller.ts
import httpStatus2 from "http-status";

// src/app/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({ success, message, data, meta });
};

// src/app/modules/purchase/purchase.service.ts
import httpStatus from "http-status";
var RENTAL_PRICES = {
  "7": 2.99,
  // 7-day rental
  "30": 5.99
  // 30-day rental
};
var RENTAL_DURATIONS = [7, 30];
var createCheckoutSession = async (userId, mediaId, purchaseType = "PURCHASE", rentalDays) => {
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) {
    throw new AppError_default(httpStatus.NOT_FOUND, "Media not found");
  }
  if (media.pricingType !== PricingType.PREMIUM) {
    throw new AppError_default(httpStatus.BAD_REQUEST, "This media is free and does not require purchase");
  }
  if (purchaseType === "PURCHASE") {
    const existingPurchase = await prisma.purchase.findFirst({
      where: { userId, mediaId, status: "COMPLETED", purchaseType: "PURCHASE" }
    });
    if (existingPurchase) {
      throw new AppError_default(httpStatus.CONFLICT, "You have already purchased this media");
    }
  }
  let amount;
  let productName;
  let description;
  if (purchaseType === "RENTAL") {
    if (!rentalDays || !RENTAL_DURATIONS.includes(rentalDays)) {
      throw new AppError_default(httpStatus.BAD_REQUEST, `Invalid rental duration. Allowed: ${RENTAL_DURATIONS.join(", ")} days`);
    }
    amount = RENTAL_PRICES[rentalDays.toString()] ?? 3.99;
    productName = `${media.title} (${rentalDays}-day Rental)`;
    description = `Rent ${media.title} for ${rentalDays} days`;
  } else {
    amount = media.price ?? 9.99;
    productName = media.title;
    description = media.synopsis.slice(0, 255);
  }
  const unitAmount = Math.round(amount * 100);
  const frontendUrl = envVars.FRONTEND_URL;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: productName,
            description,
            images: media.posterUrl ? [media.posterUrl] : []
          },
          unit_amount: unitAmount
        },
        quantity: 1
      }
    ],
    mode: "payment",
    success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${frontendUrl}/media/${mediaId}`,
    metadata: { userId, mediaId, purchaseType, rentalDays: rentalDays?.toString() || "" }
  });
  const rentalDaysValue = purchaseType === "RENTAL" ? rentalDays ?? null : null;
  await prisma.purchase.upsert({
    where: { userId_mediaId: { userId, mediaId } },
    create: {
      userId,
      mediaId,
      stripeSessionId: session.id,
      amount,
      currency: "usd",
      status: "PENDING",
      purchaseType,
      rentalDays: rentalDaysValue
    },
    update: {
      stripeSessionId: session.id,
      status: "PENDING",
      stripePaymentId: null,
      purchaseType,
      rentalDays: rentalDaysValue
    }
  });
  return { checkoutUrl: session.url, sessionId: session.id };
};
var getMyPurchases = async (userId) => {
  const purchases = await prisma.purchase.findMany({
    where: { userId, status: "COMPLETED" },
    orderBy: { createdAt: "desc" },
    include: {
      media: {
        include: {
          genres: { include: { genre: true } }
        }
      }
    }
  });
  return purchases.map((p) => ({
    id: p.id,
    amount: p.amount,
    currency: p.currency,
    purchasedAt: p.createdAt,
    media: {
      ...p.media,
      genres: p.media.genres.map((mg) => mg.genre)
    }
  }));
};
var handleWebhookEvent = async (event) => {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const metadataType = session.metadata?.type;
    if (metadataType === "subscription") {
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;
      const amount = Number(session.metadata?.amount || 0);
      const durationDays = Number(session.metadata?.durationDays || 0);
      if (userId && plan && (plan === SubscriptionPlan.MONTHLY || plan === SubscriptionPlan.YEARLY)) {
        const startDate = /* @__PURE__ */ new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + durationDays);
        await prisma.subscription.create({
          data: {
            userId,
            plan,
            status: SubscriptionStatus.ACTIVE,
            amount,
            stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
            stripePaymentId: session.payment_intent,
            startDate,
            endDate
          }
        });
      }
      return;
    }
    const purchase = await prisma.purchase.findFirst({
      where: { stripeSessionId: session.id }
    });
    if (purchase) {
      let updateData = {
        status: "COMPLETED",
        stripePaymentId: session.payment_intent
      };
      if (purchase.purchaseType === "RENTAL" && purchase.rentalDays) {
        const rentalExpiresAt = /* @__PURE__ */ new Date();
        rentalExpiresAt.setDate(rentalExpiresAt.getDate() + purchase.rentalDays);
        updateData.rentalExpiresAt = rentalExpiresAt;
      }
      await prisma.purchase.update({
        where: { id: purchase.id },
        data: updateData
      });
    }
  }
  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    await prisma.purchase.updateMany({
      where: { stripeSessionId: session.id, status: "PENDING" },
      data: { status: "FAILED" }
    });
  }
};
var checkAccessBySession = async (sessionId) => {
  console.log(`[Purchase] Verifying session: ${sessionId}`);
  if (!sessionId || typeof sessionId !== "string" || sessionId.trim() === "") {
    return { hasAccess: false, purchase: null, debug: "Invalid sessionId" };
  }
  let purchase = await prisma.purchase.findUnique({
    where: { stripeSessionId: sessionId },
    include: {
      media: {
        include: { genres: { include: { genre: true } } }
      }
    }
  });
  console.log(`[Purchase] DB result: ${purchase ? `Found (status: ${purchase.status})` : "Not found"}`);
  if (!purchase || purchase.status !== "COMPLETED") {
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
      console.log(`[Purchase] Stripe session retrieved. Payment status: ${stripeSession.payment_status}`);
      if (stripeSession.payment_status === "paid") {
        const updated = await prisma.purchase.updateMany({
          where: { stripeSessionId: sessionId, status: { not: "COMPLETED" } },
          data: {
            status: "COMPLETED",
            stripePaymentId: stripeSession.payment_intent
          }
        });
        console.log(`[Purchase] Marked as COMPLETED. Updated ${updated.count} record(s).`);
        purchase = await prisma.purchase.findUnique({
          where: { stripeSessionId: sessionId },
          include: {
            media: {
              include: { genres: { include: { genre: true } } }
            }
          }
        });
      } else {
        console.log(`[Purchase] Stripe payment_status not 'paid': ${stripeSession.payment_status}`);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[Purchase] Stripe API error: ${msg}`);
    }
  }
  if (!purchase || purchase.status !== "COMPLETED") {
    return { hasAccess: false, purchase: null };
  }
  return {
    hasAccess: true,
    purchase: {
      ...purchase,
      media: {
        ...purchase.media,
        genres: purchase.media.genres.map((mg) => mg.genre)
      }
    }
  };
};
var normalizePeriodDays = (periodDays) => {
  const allowed = [7, 30, 90, 365];
  return allowed.includes(periodDays) ? periodDays : 30;
};
var getDashboardAnalytics = async (periodDays = 30) => {
  const normalizedPeriodDays = normalizePeriodDays(periodDays);
  const periodStart = /* @__PURE__ */ new Date();
  periodStart.setDate(periodStart.getDate() - normalizedPeriodDays);
  const [
    periodCompletedPurchases,
    periodCompletedSubscriptions,
    purchaseStatusCounts,
    subscriptionStatusCounts
  ] = await Promise.all([
    prisma.purchase.findMany({
      where: {
        status: "COMPLETED",
        createdAt: { gte: periodStart }
      },
      include: {
        media: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.subscription.findMany({
      where: {
        status: "ACTIVE",
        createdAt: { gte: periodStart }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.purchase.groupBy({
      by: ["status"],
      _count: { status: true }
    }),
    prisma.subscription.groupBy({
      by: ["status"],
      _count: { status: true }
    })
  ]);
  const purchaseRevenue = periodCompletedPurchases.reduce((sum, p) => sum + (p.amount || 0), 0);
  const subscriptionRevenue = periodCompletedSubscriptions.reduce((sum, s) => sum + (s.amount || 0), 0);
  const rentalRevenue = periodCompletedPurchases.filter((purchase) => purchase.purchaseType === PurchaseType.RENTAL).reduce((sum, purchase) => sum + (purchase.amount || 0), 0);
  const totalRevenue = purchaseRevenue + subscriptionRevenue;
  const distinctUserIds = /* @__PURE__ */ new Set();
  periodCompletedPurchases.forEach((purchase) => distinctUserIds.add(purchase.userId));
  periodCompletedSubscriptions.forEach((subscription) => distinctUserIds.add(subscription.userId));
  const dailyMap = /* @__PURE__ */ new Map();
  periodCompletedPurchases.forEach((purchase) => {
    const key = purchase.createdAt.toISOString().split("T")[0];
    const existing = dailyMap.get(key) || { revenue: 0, count: 0 };
    dailyMap.set(key, {
      revenue: existing.revenue + (purchase.amount || 0),
      count: existing.count + 1
    });
  });
  periodCompletedSubscriptions.forEach((subscription) => {
    const key = subscription.createdAt.toISOString().split("T")[0];
    const existing = dailyMap.get(key) || { revenue: 0, count: 0 };
    dailyMap.set(key, {
      revenue: existing.revenue + (subscription.amount || 0),
      count: existing.count + 1
    });
  });
  const barChartData = Array.from(dailyMap.entries()).map(([day, value]) => ({ day, ...value })).sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
  const mediaMap = /* @__PURE__ */ new Map();
  periodCompletedPurchases.forEach((purchase) => {
    const mediaId = purchase.media.id;
    const existing = mediaMap.get(mediaId) || {
      mediaId,
      title: purchase.media.title,
      purchases: 0,
      revenue: 0
    };
    mediaMap.set(mediaId, {
      ...existing,
      purchases: existing.purchases + 1,
      revenue: existing.revenue + (purchase.amount || 0)
    });
  });
  const topMedia = Array.from(mediaMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const purchaseStatusBreakdown = purchaseStatusCounts.map((item) => ({
    status: item.status,
    count: item._count.status
  }));
  const subscriptionStatusBreakdown = subscriptionStatusCounts.map((item) => ({
    status: item.status,
    count: item._count.status
  }));
  return {
    overview: {
      periodDays: normalizedPeriodDays,
      paymentCount: periodCompletedPurchases.length + periodCompletedSubscriptions.length,
      userCount: distinctUserIds.size,
      purchaseRevenue,
      subscriptionRevenue,
      rentalRevenue,
      totalRevenue
    },
    barChartData,
    topMedia,
    purchaseStatusBreakdown,
    subscriptionStatusBreakdown
  };
};
var getPaymentTransactions = async ({
  page = 1,
  limit = 20,
  searchTerm,
  type,
  status: status14
}) => {
  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const skip = (safePage - 1) * safeLimit;
  const normalizedSearchTerm = searchTerm?.trim().toLowerCase();
  const normalizedType = type?.trim().toUpperCase();
  const normalizedStatus = status14?.trim().toUpperCase();
  const includePurchases = !normalizedType || normalizedType === "PURCHASE";
  const includeSubscriptions = !normalizedType || normalizedType === "SUBSCRIPTION";
  const purchaseWhere = normalizedStatus ? { status: normalizedStatus } : {};
  const subscriptionWhere = normalizedStatus ? { status: normalizedStatus } : {};
  const [purchases, subscriptions] = await Promise.all([
    includePurchases ? prisma.purchase.findMany({
      where: purchaseWhere,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        media: { select: { id: true, title: true } }
      }
    }) : Promise.resolve([]),
    includeSubscriptions ? prisma.subscription.findMany({
      where: subscriptionWhere,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    }) : Promise.resolve([])
  ]);
  const purchaseTransactions = purchases.map((purchase) => ({
    id: purchase.id,
    type: "PURCHASE",
    status: purchase.status,
    amount: purchase.amount,
    currency: purchase.currency,
    createdAt: purchase.createdAt,
    user: purchase.user,
    media: purchase.media,
    purchaseType: purchase.purchaseType
  }));
  const subscriptionTransactions = subscriptions.map((subscription) => ({
    id: subscription.id,
    type: "SUBSCRIPTION",
    status: subscription.status,
    amount: subscription.amount,
    currency: "usd",
    createdAt: subscription.createdAt,
    user: subscription.user,
    plan: subscription.plan
  }));
  const merged = [...purchaseTransactions, ...subscriptionTransactions].filter((transaction) => {
    if (!normalizedSearchTerm) {
      return true;
    }
    const mediaTitle = "media" in transaction ? transaction.media?.title : void 0;
    const plan = "plan" in transaction ? transaction.plan : void 0;
    const purchaseType = "purchaseType" in transaction ? transaction.purchaseType : void 0;
    const haystack = [
      transaction.user?.name,
      transaction.user?.email,
      mediaTitle,
      plan,
      transaction.type,
      purchaseType,
      transaction.status
    ].filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(normalizedSearchTerm);
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const total = merged.length;
  const data = merged.slice(skip, skip + safeLimit);
  return {
    data,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit)
    }
  };
};
var PurchaseService = {
  createCheckoutSession,
  getMyPurchases,
  handleWebhookEvent,
  checkAccessBySession,
  getDashboardAnalytics,
  getPaymentTransactions
};

// src/app/modules/purchase/purchase.controller.ts
var createCheckoutSession2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const { mediaId, purchaseType = "PURCHASE", rentalDays } = req.body;
  if (!mediaId) {
    throw new AppError_default(httpStatus2.BAD_REQUEST, "mediaId is required");
  }
  const result = await PurchaseService.createCheckoutSession(userId, mediaId, purchaseType, rentalDays);
  sendResponse(res, {
    httpStatusCode: httpStatus2.CREATED,
    success: true,
    message: "Checkout session created",
    data: result
  });
});
var getMyPurchases2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await PurchaseService.getMyPurchases(userId);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Purchases fetched successfully",
    data: result
  });
});
var verifyPaymentSuccess = catchAsync(async (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) {
    throw new AppError_default(httpStatus2.BAD_REQUEST, "sessionId query param is required");
  }
  try {
    const result = await PurchaseService.checkAccessBySession(sessionId);
    sendResponse(res, {
      httpStatusCode: httpStatus2.OK,
      success: true,
      message: result.hasAccess ? "Payment verified" : "Payment not completed yet",
      data: result
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Verify] Error: ${msg}`);
    throw error;
  }
});
var stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  if (!sig) {
    res.status(400).json({ success: false, message: "Missing stripe-signature header" });
    return;
  }
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      envVars.STRIPE.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    res.status(400).json({ success: false, message });
    return;
  }
  try {
    await PurchaseService.handleWebhookEvent(event);
    res.status(200).json({ received: true });
  } catch {
    res.status(500).json({ success: false, message: "Webhook handler failed" });
  }
};
var getDashboardAnalytics2 = catchAsync(async (req, res) => {
  const periodDays = Number(req.query.periodDays) || 30;
  const data = await PurchaseService.getDashboardAnalytics(periodDays);
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Payment dashboard fetched successfully",
    data
  });
});
var getPaymentTransactions2 = catchAsync(async (req, res) => {
  const query = req.query;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const result = await PurchaseService.getPaymentTransactions({
    page,
    limit,
    ...query.searchTerm ? { searchTerm: query.searchTerm } : {},
    ...query.type ? { type: query.type } : {},
    ...query.status ? { status: query.status } : {}
  });
  sendResponse(res, {
    httpStatusCode: httpStatus2.OK,
    success: true,
    message: "Payment transactions fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var PurchaseController = {
  createCheckoutSession: createCheckoutSession2,
  getMyPurchases: getMyPurchases2,
  verifyPaymentSuccess,
  stripeWebhook,
  getDashboardAnalytics: getDashboardAnalytics2,
  getPaymentTransactions: getPaymentTransactions2
};

// src/app/middleware/globalErrorHandler.ts
import status5 from "http-status";
import z from "zod";

// src/app/errorHelpers/handlePrismaErrors.ts
import status2 from "http-status";
var getStatusCodeFromPrismaError = (errorCode) => {
  if (errorCode === "P2002") return status2.CONFLICT;
  if (["P2025", "P2001", "P2015", "P2018"].includes(errorCode)) return status2.NOT_FOUND;
  if (["P1000", "P6002"].includes(errorCode)) return status2.UNAUTHORIZED;
  if (["P1010", "P6010"].includes(errorCode)) return status2.FORBIDDEN;
  if (errorCode === "P6003") return status2.PAYMENT_REQUIRED;
  if (["P1008", "P2004", "P6004"].includes(errorCode)) return status2.GATEWAY_TIMEOUT;
  if (errorCode === "P5011") return status2.TOO_MANY_REQUESTS;
  if (errorCode === "P6009") return 413;
  if (errorCode.startsWith("P1") || ["P2024", "P2037", "P6008"].includes(errorCode)) return status2.SERVICE_UNAVAILABLE;
  if (errorCode.startsWith("P2")) return status2.BAD_REQUEST;
  if (errorCode.startsWith("P3") || errorCode.startsWith("P4")) return status2.INTERNAL_SERVER_ERROR;
  return status2.INTERNAL_SERVER_ERROR;
};
var formatErrorMeta = (meta) => {
  if (!meta) return "";
  const parts = [];
  if (meta.target) parts.push(`Field(s): ${String(meta.target)}`);
  if (meta.field_name) parts.push(`Field: ${String(meta.field_name)}`);
  if (meta.column_name) parts.push(`Column: ${String(meta.column_name)}`);
  if (meta.table) parts.push(`Table: ${String(meta.table)}`);
  if (meta.model_name) parts.push(`Model: ${String(meta.model_name)}`);
  if (meta.relation_name) parts.push(`Relation: ${String(meta.relation_name)}`);
  if (meta.constraint) parts.push(`Constraint: ${String(meta.constraint)}`);
  if (meta.database_error) parts.push(`Database Error: ${String(meta.database_error)}`);
  return parts.length > 0 ? parts.join(" |") : "";
};
var handlePrismaClientKnownRequestError = (error) => {
  const statusCode = getStatusCodeFromPrismaError(error.code);
  const metaInfo = formatErrorMeta(error.meta);
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred with the database operation.";
  const errorSources = [{ path: error.code ?? "Unknown", message: metaInfo ? `${mainMessage} | ${metaInfo}` : mainMessage }];
  if (error.meta?.cause) {
    errorSources.push({ path: "cause", message: String(error.meta.cause) });
  }
  return { success: false, statusCode, message: `Prisma Client Known Request Error: ${mainMessage}`, errorSources };
};
var handlePrismaClientUnknownError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An unknown error occurred with the database operation.";
  const errorSources = [{ path: "Unknown Prisma Error", message: mainMessage }];
  return { success: false, statusCode: status2.INTERNAL_SERVER_ERROR, message: `Prisma Client Unknown Request Error: ${mainMessage}`, errorSources };
};
var handlePrismaClientValidationError = (error) => {
  let cleanMessage = error.message;
  cleanMessage = cleanMessage.replace(/Invalid `.*?` invocation:?\s*/i, "");
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const errorSources = [];
  const fieldMatch = cleanMessage.match(/Argument `(\w+)`/i);
  const fieldName = fieldMatch?.[1] ?? "Unknown Field";
  const mainMessage = lines.find((line) => !line.includes("Argument") && !line.includes("\u2192") && line.length > 10) ?? lines[0] ?? "Invalid query parameters provided.";
  errorSources.push({ path: fieldName, message: mainMessage });
  return { success: false, statusCode: status2.BAD_REQUEST, message: `Prisma Client Validation Error: ${mainMessage}`, errorSources };
};
var handlerPrismaClientInitializationError = (error) => {
  const statusCode = error.errorCode ? getStatusCodeFromPrismaError(error.errorCode) : status2.SERVICE_UNAVAILABLE;
  const cleanMessage = error.message;
  const lines = cleanMessage.split("\n").filter((line) => line.trim());
  const mainMessage = lines[0] || "An error occurred while initializing the Prisma Client.";
  const errorSources = [{ path: error.errorCode || "Initialization Error", message: mainMessage }];
  return { success: false, statusCode, message: `Prisma Client Initialization Error: ${mainMessage}`, errorSources };
};
var handlerPrismaClientRustPanicError = () => {
  const errorSources = [{
    path: "Rust Engine Crashed",
    message: "The database engine encountered a fatal error and crashed. Please check the Prisma logs for more details."
  }];
  return { success: false, statusCode: status2.INTERNAL_SERVER_ERROR, message: "Prisma Client Rust Panic Error: The database engine crashed due to a fatal error.", errorSources };
};

// src/app/errorHelpers/handleZodError.ts
import status3 from "http-status";
var handleZodError = (err) => {
  const statusCode = status3.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources = [];
  err.issues.forEach((issue) => {
    errorSources.push({
      path: issue.path.join(" => "),
      message: issue.message
    });
  });
  return { success: false, message, errorSources, statusCode };
};

// src/app/config/cloudinary.config.ts
import { v2 as cloudinary } from "cloudinary";
import status4 from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
});
var uploadFileToCloudinary = async (buffer, fileName) => {
  if (!buffer || !fileName) {
    throw new AppError_default(status4.BAD_REQUEST, "File buffer and file name are required for upload");
  }
  const extension = fileName.split(".").pop()?.toLocaleLowerCase();
  const fileNameWithoutExtension = fileName.split(".").slice(0, -1).join(".").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
  const folder = extension === "pdf" ? "pdfs" : "images";
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: `cinetube/${folder}/${uniqueName}`,
        folder: `cinetube/${folder}`
      },
      (error, result) => {
        if (error) {
          return reject(new AppError_default(status4.INTERNAL_SERVER_ERROR, "Failed to upload file to Cloudinary"));
        }
        resolve(result);
      }
    ).end(buffer);
  });
};
var deleteFileFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      console.log(`File ${publicId} deleted from cloudinary`);
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
    throw new AppError_default(status4.INTERNAL_SERVER_ERROR, "Failed to delete file from Cloudinary");
  }
};

// src/app/utils/deleteUploadedFiles.ts
var deleteUploadedFilesFromGlobalErrorHandler = async (req) => {
  try {
    const filesToDelete = [];
    if (req.file && req.file?.path) {
      filesToDelete.push(req.file.path);
    } else if (req.files && typeof req.files === "object" && !Array.isArray(req.files)) {
      Object.values(req.files).forEach((fileArray) => {
        if (Array.isArray(fileArray)) {
          fileArray.forEach((file) => {
            if (file.path) {
              filesToDelete.push(file.path);
            }
          });
        }
      });
    } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.path) {
          filesToDelete.push(file.path);
        }
      });
    }
    if (filesToDelete.length > 0) {
      await Promise.all(filesToDelete.map((url) => deleteFileFromCloudinary(url)));
      console.log(`Deleted ${filesToDelete.length} uploaded file(s) from Cloudinary due to an error.`);
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Error deleting uploaded files from Global Error Handler", msg);
  }
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, _next) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from Global Error Handler", err);
  }
  await deleteUploadedFilesFromGlobalErrorHandler(req);
  let errorSources = [];
  let statusCode = status5.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    const simplifiedError = handlePrismaClientUnknownError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    const simplifiedError = handlePrismaClientValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    const simplifiedError = handlerPrismaClientRustPanicError();
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    const simplifiedError = handlerPrismaClientInitializationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: "", message: err.message }];
  } else if (err instanceof Error) {
    statusCode = status5.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [{ path: "", message: err.message }];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    error: envVars.NODE_ENV === "development" ? err : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/app/middleware/notFound.ts
import status6 from "http-status";
var notFound = (req, res) => {
  res.status(status6.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} Not Found`
  });
};

// src/app/routes/index.ts
import { Router as Router11 } from "express";

// src/app/modules/auth/auth.route.ts
import { Router } from "express";

// src/app/middleware/auth.ts
import status7 from "http-status";

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, options) => {
  return jwt.sign(payload, secret, options);
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return { success: true, data: decoded };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Invalid token";
    return { success: false, message: msg, error };
  }
};
var decodeToken = (token) => {
  return jwt.decode(token);
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/middleware/auth.ts
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token");
    if (!sessionToken) {
      throw new AppError_default(status7.UNAUTHORIZED, "Unauthorized access! No session token provided.");
    }
    const sessionExists = await prisma.session.findFirst({
      where: {
        token: sessionToken,
        expiresAt: { gt: /* @__PURE__ */ new Date() }
      },
      include: { user: true }
    });
    if (sessionExists && sessionExists.user) {
      const user = sessionExists.user;
      if (user.status === UserStatus.BLOCKED || user.status === UserStatus.DELETED) {
        throw new AppError_default(status7.UNAUTHORIZED, "Unauthorized access! User is not active.");
      }
      if (user.isDeleted) {
        throw new AppError_default(status7.UNAUTHORIZED, "Unauthorized access! User is deleted.");
      }
      if (authRoles.length > 0 && !authRoles.includes(user.role)) {
        throw new AppError_default(status7.FORBIDDEN, "Forbidden access! You do not have permission to access this resource.");
      }
      req.user = {
        userId: user.id,
        role: user.role,
        email: user.email
      };
    }
    const accessToken = CookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(status7.UNAUTHORIZED, "Unauthorized access! No access token provided.");
    }
    const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
    if (!verifiedToken.success) {
      throw new AppError_default(status7.UNAUTHORIZED, "Unauthorized access! Invalid access token.");
    }
    if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data.role)) {
      throw new AppError_default(status7.FORBIDDEN, "Forbidden access! You do not have permission to access this resource.");
    }
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    const parsedResult = zodSchema.safeParse(req.body);
    if (!parsedResult.success) {
      next(parsedResult.error);
      return;
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/app/modules/auth/auth.controller.ts
import status9 from "http-status";

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  return jwtUtils.createToken(payload, envVars.ACCESS_TOKEN_SECRET, { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN });
};
var getRefreshToken = (payload) => {
  return jwtUtils.createToken(payload, envVars.REFRESH_TOKEN_SECRET, { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN });
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3 * 7
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/modules/auth/auth.service.ts
import status8 from "http-status";
var registerUser = async (payload) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: { name, email, password }
  });
  if (!data.user) {
    throw new AppError_default(status8.BAD_REQUEST, "Failed to register user");
  }
  try {
    const profile = await prisma.$transaction(async (tx) => {
      return await tx.userProfile.create({
        data: {
          userId: data.user.id
        }
      });
    });
    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email
    });
    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      role: data.user.role,
      name: data.user.name,
      email: data.user.email
    });
    return { ...data, accessToken, refreshToken, profile };
  } catch (error) {
    console.log("Transaction error:", error);
    await prisma.user.delete({ where: { id: data.user.id } });
    throw error;
  }
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const data = await auth.api.signInEmail({ body: { email, password } });
  const user = data.user;
  if (user.status === UserStatus.BLOCKED) {
    throw new AppError_default(status8.FORBIDDEN, "User is blocked");
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError_default(status8.NOT_FOUND, "User is deleted");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    role: user.role,
    name: data.user.name,
    email: data.user.email,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    role: user.role,
    name: data.user.name,
    email: data.user.email,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: data.user.emailVerified
  });
  return { ...data, accessToken, refreshToken };
};
var getMe = async (requestUser) => {
  const isUserExists = await prisma.user.findUnique({
    where: { id: requestUser.userId },
    include: {
      profile: true,
      adminProfile: true,
      subscriptions: true
    }
  });
  if (!isUserExists) {
    throw new AppError_default(status8.NOT_FOUND, "User not found");
  }
  return isUserExists;
};
var getNewToken = async (refreshToken, sessionToken) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: { token: sessionToken },
    include: { user: true }
  });
  if (!isSessionTokenExists) {
    throw new AppError_default(status8.UNAUTHORIZED, "Invalid session token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET);
  if (!verifiedRefreshToken.success) {
    throw new AppError_default(status8.UNAUTHORIZED, "Invalid refresh token");
  }
  const decoded = verifiedRefreshToken.data;
  const newAccessToken = tokenUtils.getAccessToken({
    userId: decoded.userId,
    role: decoded.role,
    name: decoded.name,
    email: decoded.email,
    status: decoded.status,
    isDeleted: decoded.isDeleted,
    emailVerified: decoded.emailVerified
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: decoded.userId,
    role: decoded.role,
    name: decoded.name,
    email: decoded.email,
    status: decoded.status,
    isDeleted: decoded.isDeleted,
    emailVerified: decoded.emailVerified
  });
  const { token } = await prisma.session.update({
    where: { token: sessionToken },
    data: {
      expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1e3),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token
  };
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({ Authorization: `Bearer ${sessionToken}` })
  });
  if (!session) {
    throw new AppError_default(status8.UNAUTHORIZED, "Invalid session token");
  }
  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: { currentPassword, newPassword, revokeOtherSessions: true },
    headers: new Headers({ Authorization: `Bearer ${sessionToken}` })
  });
  const user = session.user;
  if (user.needPasswordChange) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { needPasswordChange: false }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: user.role,
    name: session.user.name,
    email: session.user.email,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: user.role,
    name: session.user.name,
    email: session.user.email,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  return { ...result, accessToken, refreshToken };
};
var adminResetPassword = async (payload) => {
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new AppError_default(status8.NOT_FOUND, "User not found");
  }
  await prisma.$transaction(async (tx) => {
    await tx.session.deleteMany({ where: { userId: user.id } });
    await tx.user.update({
      where: { id: user.id },
      data: { needPasswordChange: true }
    });
  });
  await auth.api.requestPasswordResetEmailOTP({
    body: { email: user.email }
  });
  return {
    userId: user.id,
    resetInitiated: true
  };
};
var logoutUser = async (sessionToken) => {
  return await auth.api.signOut({
    headers: new Headers({ Authorization: `Bearer ${sessionToken}` })
  });
};
var verifyEmail = async (email, otp) => {
  const result = await auth.api.verifyEmailOTP({ body: { email, otp } });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true }
    });
  }
};
var forgetPassword = async (email) => {
  const isUserExist = await prisma.user.findUnique({ where: { email } });
  if (!isUserExist) {
    throw new AppError_default(status8.NOT_FOUND, "User not found");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError_default(status8.BAD_REQUEST, "Email not verified");
  }
  if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
    throw new AppError_default(status8.NOT_FOUND, "User not found");
  }
  await auth.api.requestPasswordResetEmailOTP({ body: { email } });
};
var resetPassword = async (email, otp, newPassword) => {
  const isUserExist = await prisma.user.findUnique({ where: { email } });
  if (!isUserExist) {
    throw new AppError_default(status8.NOT_FOUND, "User not found");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError_default(status8.BAD_REQUEST, "Email not verified");
  }
  if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
    throw new AppError_default(status8.NOT_FOUND, "User not found");
  }
  await auth.api.resetPasswordEmailOTP({ body: { email, otp, password: newPassword } });
  if (isUserExist.needPasswordChange) {
    await prisma.user.update({
      where: { id: isUserExist.id },
      data: { needPasswordChange: false }
    });
  }
  await prisma.session.deleteMany({ where: { userId: isUserExist.id } });
};
var googleLoginSuccess = async (session) => {
  const sessionUser = session.user;
  const isProfileExists = await prisma.userProfile.findUnique({
    where: { userId: sessionUser.id }
  });
  if (!isProfileExists) {
    await prisma.userProfile.create({
      data: { userId: sessionUser.id }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: sessionUser.id,
    role: sessionUser.role,
    name: sessionUser.name,
    email: sessionUser.email
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: sessionUser.id,
    role: sessionUser.role,
    name: sessionUser.name,
    email: sessionUser.email
  });
  return { accessToken, refreshToken };
};
var AuthService = {
  registerUser,
  loginUser,
  getMe,
  getNewToken,
  changePassword,
  adminResetPassword,
  logoutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  googleLoginSuccess
};

// src/app/modules/auth/auth.controller.ts
var registerUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.registerUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status9.CREATED,
    success: true,
    message: "User registered successfully",
    data: { token, accessToken, refreshToken, ...rest }
  });
});
var loginUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.loginUser(payload);
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "User logged in successfully",
    data: { token, accessToken, refreshToken, ...rest }
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await AuthService.getMe(user);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "User profile fetched successfully",
    data: result
  });
});
var getNewToken2 = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  if (!refreshToken) {
    throw new AppError_default(status9.UNAUTHORIZED, "Refresh token is missing");
  }
  const result = await AuthService.getNewToken(refreshToken, betterAuthSessionToken);
  const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "New tokens generated successfully",
    data: { accessToken, refreshToken: newRefreshToken, sessionToken }
  });
});
var changePassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.changePassword(payload, betterAuthSessionToken);
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Password changed successfully",
    data: result
  });
});
var adminResetPassword2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.adminResetPassword(payload);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Password reset initiated and reset OTP sent to user email",
    data: result
  });
});
var logoutUser2 = catchAsync(async (req, res) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await AuthService.logoutUser(betterAuthSessionToken);
  CookieUtils.clearCookie(res, "accessToken", { httpOnly: true, secure: true, sameSite: "none" });
  CookieUtils.clearCookie(res, "refreshToken", { httpOnly: true, secure: true, sameSite: "none" });
  CookieUtils.clearCookie(res, "better-auth.session_token", { httpOnly: true, secure: true, sameSite: "none" });
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "User logged out successfully",
    data: result
  });
});
var verifyEmail2 = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await AuthService.verifyEmail(email, otp);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Email verified successfully"
  });
});
var forgetPassword2 = catchAsync(async (req, res) => {
  const { email } = req.body;
  await AuthService.forgetPassword(email);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Password reset OTP sent to email successfully"
  });
});
var resetPassword2 = catchAsync(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await AuthService.resetPassword(email, otp, newPassword);
  sendResponse(res, {
    httpStatusCode: status9.OK,
    success: true,
    message: "Password reset successfully"
  });
});
var googleLogin = catchAsync((req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath);
  const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackURL,
    betterAuthUrl: envVars.BETTER_AUTH_URL
  });
});
var googleLoginSuccess2 = catchAsync(async (req, res) => {
  const redirectPath = req.query.redirect || "/dashboard";
  const sessionToken = req.cookies["better-auth.session_token"];
  if (!sessionToken) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
  }
  const session = await auth.api.getSession({
    headers: {
      Cookie: `better-auth.session_token=${sessionToken}`
    }
  });
  if (!session) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
  }
  if (session && !session.user) {
    return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
  }
  const result = await AuthService.googleLoginSuccess(session);
  const { accessToken, refreshToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
  return res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
});
var handleOAuthError = catchAsync((req, res) => {
  const error = req.query.error || "oauth_failed";
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`);
});
var AuthController = {
  registerUser: registerUser2,
  loginUser: loginUser2,
  getMe: getMe2,
  getNewToken: getNewToken2,
  changePassword: changePassword2,
  adminResetPassword: adminResetPassword2,
  logoutUser: logoutUser2,
  verifyEmail: verifyEmail2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  googleLogin,
  googleLoginSuccess: googleLoginSuccess2,
  handleOAuthError
};

// src/app/modules/auth/auth.validation.ts
import z2 from "zod";
var strongPasswordSchema = z2.string().min(8, "Password must be at least 8 characters long").regex(new RegExp("\\p{Lu}", "u"), "Password must contain at least one uppercase letter").regex(new RegExp("\\p{Nd}", "u"), "Password must contain at least one number").regex(/[\p{P}\p{S}]/u, "Password must contain at least one special character");
var registerUserZodSchema = z2.object({
  name: z2.string().min(2, "Name must be at least 2 characters"),
  email: z2.email("Invalid email address"),
  password: strongPasswordSchema
});
var loginUserZodSchema = z2.object({
  email: z2.email("Invalid email address"),
  password: z2.string().min(1, "Password is required")
});
var changePasswordZodSchema = z2.object({
  currentPassword: z2.string().min(8, "Current password must be at least 8 characters"),
  newPassword: strongPasswordSchema
});
var forgetPasswordZodSchema = z2.object({
  email: z2.email("Invalid email address")
});
var verifyEmailZodSchema = z2.object({
  email: z2.email("Invalid email address"),
  otp: z2.string().length(6, "OTP must be 6 digits")
});
var resetPasswordZodSchema = z2.object({
  email: z2.email("Invalid email address"),
  otp: z2.string().length(6, "OTP must be 6 digits"),
  newPassword: strongPasswordSchema
});

// src/app/modules/auth/auth.route.ts
var router = Router();
router.post("/register", validateRequest(registerUserZodSchema), AuthController.registerUser);
router.post("/login", validateRequest(loginUserZodSchema), AuthController.loginUser);
router.get("/me", checkAuth(Role.ADMIN, Role.USER, Role.SUPER_ADMIN), AuthController.getMe);
router.post("/refresh-token", AuthController.getNewToken);
router.post("/change-password", checkAuth(Role.ADMIN, Role.USER, Role.SUPER_ADMIN), validateRequest(changePasswordZodSchema), AuthController.changePassword);
router.post("/admin/reset-password", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), AuthController.adminResetPassword);
router.post("/logout", checkAuth(Role.ADMIN, Role.USER, Role.SUPER_ADMIN), AuthController.logoutUser);
router.post("/verify-email", validateRequest(verifyEmailZodSchema), AuthController.verifyEmail);
router.post("/forget-password", validateRequest(forgetPasswordZodSchema), AuthController.forgetPassword);
router.post("/reset-password", validateRequest(resetPasswordZodSchema), AuthController.resetPassword);
router.get("/login/google", AuthController.googleLogin);
router.get("/google/success", AuthController.googleLoginSuccess);
router.get("/oauth/error", AuthController.handleOAuthError);
var AuthRoutes = router;

// src/app/modules/content/content.route.ts
import { Router as Router2 } from "express";

// src/app/modules/content/content.controller.ts
import httpStatus4 from "http-status";

// src/app/modules/content/content.service.ts
import httpStatus3 from "http-status";
var getAboutContent = async () => {
  return {
    title: "About CineTube",
    mission: "CineTube helps people discover, rate, and discuss movies and series while giving admins tools to moderate high-quality content.",
    highlights: [
      "Explore movies and series with rich filters",
      "Rate titles on a 1-10 scale and share thoughtful reviews",
      "Save favorites to your watchlist",
      "Subscribe or purchase premium content securely"
    ]
  };
};
var getFaqContent = async () => {
  return [
    {
      question: "How do ratings work?",
      answer: "You can rate any title from 1 to 10 and optionally add a written review."
    },
    {
      question: "Why is my review not visible yet?",
      answer: "Reviews may require moderation before being published."
    },
    {
      question: "Can I edit or delete my review?",
      answer: "Yes. You can edit or delete your own review while it is unpublished."
    },
    {
      question: "How do rentals work?",
      answer: "Rental access is time-limited (for example, 7 or 30 days) and expires automatically."
    }
  ];
};
var createContactMessage = async (payload) => {
  const created = await prisma.contactMessage.create({
    data: payload
  });
  return created;
};
var getContactMessages = async (queryParams) => {
  const page = Math.max(Number(queryParams.page) || 1, 1);
  const limit = Math.min(Math.max(Number(queryParams.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const isReadParam = typeof queryParams.isRead === "string" ? queryParams.isRead.toLowerCase() : void 0;
  const where = isReadParam === "true" ? { isRead: true } : isReadParam === "false" ? { isRead: false } : {};
  const [data, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.contactMessage.count({ where })
  ]);
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var markContactMessageRead = async (id) => {
  const existing = await prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError_default(httpStatus3.NOT_FOUND, "Contact message not found");
  }
  return prisma.contactMessage.update({
    where: { id },
    data: { isRead: true }
  });
};
var ContentService = {
  getAboutContent,
  getFaqContent,
  createContactMessage,
  getContactMessages,
  markContactMessageRead
};

// src/app/modules/content/content.controller.ts
var getAbout = catchAsync(async (_req, res) => {
  const result = await ContentService.getAboutContent();
  sendResponse(res, {
    httpStatusCode: httpStatus4.OK,
    success: true,
    message: "About content fetched successfully",
    data: result
  });
});
var getFaq = catchAsync(async (_req, res) => {
  const result = await ContentService.getFaqContent();
  sendResponse(res, {
    httpStatusCode: httpStatus4.OK,
    success: true,
    message: "FAQ content fetched successfully",
    data: result
  });
});
var createContactMessage2 = catchAsync(async (req, res) => {
  const result = await ContentService.createContactMessage(req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus4.CREATED,
    success: true,
    message: "Contact message sent successfully",
    data: result
  });
});
var getContactMessages2 = catchAsync(async (req, res) => {
  const result = await ContentService.getContactMessages(req.query);
  sendResponse(res, {
    httpStatusCode: httpStatus4.OK,
    success: true,
    message: "Contact messages fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var markContactMessageRead2 = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await ContentService.markContactMessageRead(id);
  sendResponse(res, {
    httpStatusCode: httpStatus4.OK,
    success: true,
    message: "Contact message marked as read",
    data: result
  });
});
var ContentController = {
  getAbout,
  getFaq,
  createContactMessage: createContactMessage2,
  getContactMessages: getContactMessages2,
  markContactMessageRead: markContactMessageRead2
};

// src/app/modules/content/content.validation.ts
import z3 from "zod";
var createContactMessageSchema = z3.object({
  name: z3.string().min(2, "Name must be at least 2 characters").max(100),
  email: z3.email("A valid email is required"),
  subject: z3.string().min(3, "Subject must be at least 3 characters").max(150),
  message: z3.string().min(10, "Message must be at least 10 characters").max(2e3)
});

// src/app/modules/content/content.route.ts
var router2 = Router2();
router2.get("/about", ContentController.getAbout);
router2.get("/faq", ContentController.getFaq);
router2.post("/contact", validateRequest(createContactMessageSchema), ContentController.createContactMessage);
router2.get(
  "/contact-messages",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ContentController.getContactMessages
);
router2.patch(
  "/contact-messages/:id/read",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ContentController.markContactMessageRead
);
var ContentRoutes = router2;

// src/app/modules/genre/genre.route.ts
import { Router as Router3 } from "express";

// src/app/modules/genre/genre.controller.ts
import httpStatus5 from "http-status";

// src/app/modules/genre/genre.service.ts
import status10 from "http-status";
var getAllGenres = async () => {
  return prisma.genre.findMany({ orderBy: { name: "asc" } });
};
var createGenre = async (name) => {
  const existing = await prisma.genre.findUnique({ where: { name } });
  if (existing) {
    throw new AppError_default(status10.CONFLICT, "Genre already exists");
  }
  return prisma.genre.create({ data: { name } });
};
var deleteGenre = async (id) => {
  const existing = await prisma.genre.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError_default(status10.NOT_FOUND, "Genre not found");
  }
  await prisma.genre.delete({ where: { id } });
};
var GenreService = { getAllGenres, createGenre, deleteGenre };

// src/app/modules/genre/genre.controller.ts
var getAllGenres2 = catchAsync(async (_req, res) => {
  const result = await GenreService.getAllGenres();
  sendResponse(res, {
    httpStatusCode: httpStatus5.OK,
    success: true,
    message: "Genres fetched successfully",
    data: result
  });
});
var createGenre2 = catchAsync(async (req, res) => {
  const name = String(req.body.name);
  const result = await GenreService.createGenre(name);
  sendResponse(res, {
    httpStatusCode: httpStatus5.CREATED,
    success: true,
    message: "Genre created successfully",
    data: result
  });
});
var deleteGenre2 = catchAsync(async (req, res) => {
  await GenreService.deleteGenre(String(req.params.id));
  sendResponse(res, {
    httpStatusCode: httpStatus5.OK,
    success: true,
    message: "Genre deleted successfully"
  });
});
var GenreController = { getAllGenres: getAllGenres2, createGenre: createGenre2, deleteGenre: deleteGenre2 };

// src/app/modules/genre/genre.route.ts
var router3 = Router3();
router3.get("/", GenreController.getAllGenres);
router3.post("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), GenreController.createGenre);
router3.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), GenreController.deleteGenre);
var GenreRoutes = router3;

// src/app/modules/media/media.route.ts
import { Router as Router4 } from "express";

// src/app/config/multer.config.ts
import multer from "multer";
var multerUpload = multer({ storage: multer.memoryStorage() });

// src/app/modules/media/media.controller.ts
import httpStatus6 from "http-status";

// src/app/modules/media/media.service.ts
import status11 from "http-status";
var DEFAULT_PAGE = 1;
var DEFAULT_LIMIT = 10;
var parseOptionalBoolean = (value) => {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  return void 0;
};
var calculatePopularityScore = (media) => media._count.reviews + media._count.likes + media.watchlistCount + media.purchaseCount;
var matchesSearchTerm = (media, searchTerm) => {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (!normalizedSearch) {
    return true;
  }
  const searchableValues = [
    media.title,
    media.synopsis,
    media.director,
    ...media.cast
  ];
  return searchableValues.some((value) => value.toLowerCase().includes(normalizedSearch));
};
var transformMediaRecord = (media) => {
  const reviewCount = media.reviews.length;
  const totalRating = media.reviews.reduce((sum, review) => sum + review.rating, 0);
  const totalLikes = media.reviews.reduce((sum, review) => sum + review._count.likes, 0);
  const averageRating = reviewCount > 0 ? Number((totalRating / reviewCount).toFixed(1)) : 0;
  return {
    ...media,
    genres: media.genres.map((mediaGenre) => mediaGenre.genre),
    averageRating,
    watchlistCount: media._count.watchlistEntries,
    purchaseCount: media._count.purchases,
    _count: {
      reviews: reviewCount,
      likes: totalLikes
    }
  };
};
var sortMediaRecords = (mediaRecords, sortBy, sortOrder) => {
  const direction = sortOrder === "asc" ? 1 : -1;
  return [...mediaRecords].sort((first, second) => {
    let firstValue = 0;
    let secondValue = 0;
    switch (sortBy) {
      case "averageRating":
        firstValue = first.averageRating ?? 0;
        secondValue = second.averageRating ?? 0;
        break;
      case "reviewCount":
        firstValue = first._count.reviews ?? 0;
        secondValue = second._count.reviews ?? 0;
        break;
      case "mostLiked":
        firstValue = first._count.likes ?? 0;
        secondValue = second._count.likes ?? 0;
        break;
      case "popularity":
        firstValue = calculatePopularityScore(first);
        secondValue = calculatePopularityScore(second);
        break;
      case "releaseYear":
        firstValue = first.releaseYear;
        secondValue = second.releaseYear;
        break;
      case "title":
        firstValue = first.title.toLowerCase();
        secondValue = second.title.toLowerCase();
        break;
      case "createdAt":
      default:
        firstValue = new Date(first.createdAt);
        secondValue = new Date(second.createdAt);
        break;
    }
    if (firstValue < secondValue) {
      return -1 * direction;
    }
    if (firstValue > secondValue) {
      return 1 * direction;
    }
    return 0;
  });
};
var getMediaBaseWhere = (queryParams) => {
  const baseWhere = {};
  if (queryParams.mediaType) {
    baseWhere.mediaType = queryParams.mediaType;
  }
  if (queryParams.pricingType) {
    baseWhere.pricingType = queryParams.pricingType;
  }
  if (queryParams.status) {
    baseWhere.status = queryParams.status;
  }
  if (queryParams.releaseYear) {
    baseWhere.releaseYear = Number(queryParams.releaseYear);
  }
  const featured = parseOptionalBoolean(queryParams.featured);
  if (featured !== void 0) {
    baseWhere.isFeatured = featured;
  }
  const editorPick = parseOptionalBoolean(queryParams.editorPick);
  if (editorPick !== void 0) {
    baseWhere.isEditorPick = editorPick;
  }
  if (queryParams.genre) {
    baseWhere.genres = {
      some: {
        genre: {
          name: { contains: queryParams.genre, mode: "insensitive" }
        }
      }
    };
  }
  return baseWhere;
};
var listMediaRecords = async (queryParams) => {
  const baseWhere = getMediaBaseWhere(queryParams);
  return prisma.media.findMany({
    where: baseWhere,
    include: {
      genres: { include: { genre: true } },
      reviews: {
        where: { status: ReviewStatus.PUBLISHED },
        select: {
          rating: true,
          _count: { select: { likes: true } }
        }
      },
      _count: {
        select: {
          reviews: true,
          watchlistEntries: true,
          purchases: true
        }
      }
    }
  });
};
var getAllMedia = async (queryParams) => {
  const page = Math.max(Number(queryParams.page) || DEFAULT_PAGE, 1);
  const limit = Math.max(Number(queryParams.limit) || DEFAULT_LIMIT, 1);
  const skip = (page - 1) * limit;
  const sortBy = queryParams.sortBy || "createdAt";
  const sortOrder = queryParams.sortOrder === "asc" ? "asc" : "desc";
  const minRating = queryParams.minRating ? Number(queryParams.minRating) : void 0;
  const streamingPlatform = queryParams.streamingPlatform?.trim().toLowerCase();
  const popularity = queryParams.popularity?.trim().toLowerCase();
  const searchTerm = queryParams.searchTerm?.trim();
  const mediaRecords = await listMediaRecords(queryParams);
  const filteredMedia = mediaRecords.filter((media) => {
    if (searchTerm && !matchesSearchTerm(media, searchTerm)) {
      return false;
    }
    if (streamingPlatform && !media.streamingPlatform.some((platform) => platform.toLowerCase().includes(streamingPlatform))) {
      return false;
    }
    return true;
  }).map(transformMediaRecord).filter((media) => {
    if (minRating !== void 0 && media.averageRating < minRating) {
      return false;
    }
    if (popularity === "high") {
      return calculatePopularityScore(media) >= 20;
    }
    if (popularity === "medium") {
      const score = calculatePopularityScore(media);
      return score >= 8 && score < 20;
    }
    if (popularity === "low") {
      return calculatePopularityScore(media) < 8;
    }
    return true;
  });
  const sortedMedia = sortMediaRecords(filteredMedia, sortBy, sortOrder);
  const data = sortedMedia.slice(skip, skip + limit);
  const total = sortedMedia.length;
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getMediaById = async (id) => {
  const media = await prisma.media.findUnique({
    where: { id },
    include: {
      genres: { include: { genre: true } },
      reviews: {
        where: { status: ReviewStatus.PUBLISHED },
        select: {
          rating: true,
          _count: { select: { likes: true } }
        }
      },
      _count: {
        select: {
          reviews: true,
          watchlistEntries: true,
          purchases: true
        }
      }
    }
  });
  if (!media) {
    throw new AppError_default(status11.NOT_FOUND, "Media not found");
  }
  return transformMediaRecord(media);
};
var createMedia = async (payload, posterFile) => {
  const {
    title,
    synopsis,
    releaseYear,
    price,
    director,
    cast,
    streamingPlatform,
    pricingType,
    streamingLink,
    trailerUrl,
    isFeatured,
    isEditorPick,
    mediaType,
    status: mediaStatus,
    genreIds
  } = payload;
  let posterUrl;
  if (posterFile) {
    const uploaded = await uploadFileToCloudinary(posterFile.buffer, posterFile.originalname);
    posterUrl = uploaded.secure_url;
  }
  if (genreIds && genreIds.length > 0) {
    const foundGenres = await prisma.genre.findMany({
      where: { id: { in: genreIds } }
    });
    if (foundGenres.length !== genreIds.length) {
      throw new AppError_default(status11.BAD_REQUEST, "One or more genre IDs are invalid");
    }
  }
  const normalizedPrice = pricingType === PricingType.PREMIUM ? Number(price) : 0;
  if (pricingType === PricingType.PREMIUM && (!Number.isFinite(normalizedPrice) || normalizedPrice <= 0)) {
    throw new AppError_default(status11.BAD_REQUEST, "Premium media requires a valid price greater than 0");
  }
  const media = await prisma.media.create({
    data: {
      title,
      synopsis,
      releaseYear: Number(releaseYear),
      price: normalizedPrice,
      director: director ?? "",
      cast: cast ?? [],
      streamingPlatform: streamingPlatform ?? [],
      pricingType: pricingType ?? PricingType.FREE,
      streamingLink: streamingLink ?? null,
      posterUrl: posterUrl ?? null,
      trailerUrl: trailerUrl ?? null,
      isFeatured: isFeatured ?? false,
      isEditorPick: isEditorPick ?? false,
      mediaType: mediaType ?? MediaType.MOVIE,
      status: mediaStatus ?? MediaStatus.PUBLISHED,
      ...genreIds && genreIds.length > 0 ? { genres: { create: genreIds.map((genreId) => ({ genreId })) } } : {}
    },
    include: {
      genres: { include: { genre: true } }
    }
  });
  return getMediaById(media.id);
};
var updateMedia = async (id, payload, posterFile) => {
  const existing = await prisma.media.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError_default(status11.NOT_FOUND, "Media not found");
  }
  let posterUrl = existing.posterUrl;
  if (posterFile) {
    if (existing.posterUrl) {
      await deleteFileFromCloudinary(existing.posterUrl);
    }
    const uploaded = await uploadFileToCloudinary(posterFile.buffer, posterFile.originalname);
    posterUrl = uploaded.secure_url;
  }
  const { genreIds, releaseYear, ...rest } = payload;
  const nextPricingType = rest.pricingType ?? existing.pricingType;
  let nextPrice = rest.price;
  if (nextPricingType === PricingType.FREE) {
    nextPrice = 0;
  } else if (nextPrice !== void 0) {
    const normalized = Number(nextPrice);
    if (!Number.isFinite(normalized) || normalized <= 0) {
      throw new AppError_default(status11.BAD_REQUEST, "Premium media requires a valid price greater than 0");
    }
    nextPrice = normalized;
  }
  await prisma.$transaction(async (tx) => {
    if (genreIds !== void 0) {
      await tx.mediaGenre.deleteMany({ where: { mediaId: id } });
      if (genreIds.length > 0) {
        await tx.mediaGenre.createMany({
          data: genreIds.map((genreId) => ({ mediaId: id, genreId }))
        });
      }
    }
    await tx.media.update({
      where: { id },
      data: {
        ...rest,
        ...nextPrice !== void 0 && { price: nextPrice },
        ...releaseYear !== void 0 && { releaseYear: Number(releaseYear) },
        posterUrl
      }
    });
  });
  return getMediaById(id);
};
var deleteMedia = async (id) => {
  const existing = await prisma.media.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError_default(status11.NOT_FOUND, "Media not found");
  }
  if (existing.posterUrl) {
    await deleteFileFromCloudinary(existing.posterUrl);
  }
  await prisma.media.delete({ where: { id } });
};
var checkAccess = async (userId, mediaId) => {
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) {
    throw new AppError_default(status11.NOT_FOUND, "Media not found");
  }
  if (media.pricingType === "FREE") {
    return { hasAccess: true, reason: "free" };
  }
  const now = /* @__PURE__ */ new Date();
  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      userId,
      plan: { in: [SubscriptionPlan.MONTHLY, SubscriptionPlan.YEARLY] },
      status: SubscriptionStatus.ACTIVE,
      endDate: { gt: now }
    }
  });
  if (activeSubscription) {
    return { hasAccess: true, reason: "subscription" };
  }
  const purchase = await prisma.purchase.findFirst({
    where: { userId, mediaId, status: "COMPLETED" },
    orderBy: { createdAt: "desc" }
  });
  if (purchase) {
    if (purchase.purchaseType === "RENTAL") {
      if (!purchase.rentalExpiresAt || purchase.rentalExpiresAt <= now) {
        return { hasAccess: false, reason: "rental_expired" };
      }
      return { hasAccess: true, reason: "rented" };
    }
    return { hasAccess: true, reason: "purchased" };
  }
  return { hasAccess: false, reason: "purchase_required" };
};
var MediaService = {
  getAllMedia,
  getMediaById,
  createMedia,
  updateMedia,
  deleteMedia,
  checkAccess
};

// src/app/modules/media/media.controller.ts
var parseOptionalBoolean2 = (value) => {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
  }
  return void 0;
};
var getAllMedia2 = catchAsync(async (req, res) => {
  const result = await MediaService.getAllMedia(req.query);
  sendResponse(res, {
    httpStatusCode: httpStatus6.OK,
    success: true,
    message: "Media fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getMediaById2 = catchAsync(async (req, res) => {
  const result = await MediaService.getMediaById(String(req.params.id));
  sendResponse(res, {
    httpStatusCode: httpStatus6.OK,
    success: true,
    message: "Media fetched successfully",
    data: result
  });
});
var createMedia2 = catchAsync(async (req, res) => {
  const payload = req.body;
  if (typeof payload.cast === "string") {
    payload.cast = payload.cast.split(",").map((s) => s.trim()).filter(Boolean);
  }
  if (typeof payload.streamingPlatform === "string") {
    payload.streamingPlatform = payload.streamingPlatform.split(",").map((s) => s.trim()).filter(Boolean);
  }
  if (typeof payload.genreIds === "string") {
    payload.genreIds = payload.genreIds.split(",").map((s) => s.trim()).filter(Boolean);
  }
  const isFeatured = parseOptionalBoolean2(payload.isFeatured);
  if (isFeatured !== void 0) {
    payload.isFeatured = isFeatured;
  }
  const isEditorPick = parseOptionalBoolean2(payload.isEditorPick);
  if (isEditorPick !== void 0) {
    payload.isEditorPick = isEditorPick;
  }
  if (payload.price !== void 0) {
    payload.price = Number(payload.price);
  }
  const result = await MediaService.createMedia(payload, req.file);
  sendResponse(res, {
    httpStatusCode: httpStatus6.CREATED,
    success: true,
    message: "Media created successfully",
    data: result
  });
});
var updateMedia2 = catchAsync(async (req, res) => {
  const payload = req.body;
  if (typeof payload.cast === "string") {
    payload.cast = payload.cast.split(",").map((s) => s.trim()).filter(Boolean);
  }
  if (typeof payload.streamingPlatform === "string") {
    payload.streamingPlatform = payload.streamingPlatform.split(",").map((s) => s.trim()).filter(Boolean);
  }
  if (typeof payload.genreIds === "string") {
    payload.genreIds = payload.genreIds.split(",").map((s) => s.trim()).filter(Boolean);
  }
  const isFeatured = parseOptionalBoolean2(payload.isFeatured);
  if (isFeatured !== void 0) {
    payload.isFeatured = isFeatured;
  }
  const isEditorPick = parseOptionalBoolean2(payload.isEditorPick);
  if (isEditorPick !== void 0) {
    payload.isEditorPick = isEditorPick;
  }
  if (payload.price !== void 0) {
    payload.price = Number(payload.price);
  }
  const result = await MediaService.updateMedia(String(req.params.id), payload, req.file);
  sendResponse(res, {
    httpStatusCode: httpStatus6.OK,
    success: true,
    message: "Media updated successfully",
    data: result
  });
});
var deleteMedia2 = catchAsync(async (req, res) => {
  await MediaService.deleteMedia(String(req.params.id));
  sendResponse(res, {
    httpStatusCode: httpStatus6.OK,
    success: true,
    message: "Media deleted successfully"
  });
});
var checkAccess2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await MediaService.checkAccess(userId, String(req.params.id));
  sendResponse(res, {
    httpStatusCode: httpStatus6.OK,
    success: true,
    message: result.hasAccess ? "Access granted" : "Access denied",
    data: result
  });
});
var MediaController = {
  getAllMedia: getAllMedia2,
  getMediaById: getMediaById2,
  createMedia: createMedia2,
  updateMedia: updateMedia2,
  deleteMedia: deleteMedia2,
  checkAccess: checkAccess2
};

// src/app/modules/media/media.route.ts
var router4 = Router4();
router4.get("/", MediaController.getAllMedia);
router4.get("/:id", MediaController.getMediaById);
router4.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("poster"),
  MediaController.createMedia
);
router4.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.single("poster"),
  MediaController.updateMedia
);
router4.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  MediaController.deleteMedia
);
router4.get(
  "/:id/access",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  MediaController.checkAccess
);
var MediaRoutes = router4;

// src/app/modules/purchase/purchase.route.ts
import { Router as Router5 } from "express";
var router5 = Router5();
router5.post(
  "/purchase/checkout",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  PurchaseController.createCheckoutSession
);
router5.get(
  "/purchases/my-purchases",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  PurchaseController.getMyPurchases
);
router5.get(
  "/purchases/verify",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  PurchaseController.verifyPaymentSuccess
);
var PurchaseRoutes = router5;

// src/app/modules/purchase/admin-payment.route.ts
import { Router as Router6 } from "express";
var router6 = Router6();
router6.get(
  "/dashboard",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  PurchaseController.getDashboardAnalytics
);
router6.get(
  "/transactions",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  PurchaseController.getPaymentTransactions
);
var AdminPaymentRoutes = router6;

// src/app/modules/review/review.route.ts
import { Router as Router7 } from "express";

// src/app/modules/review/review.controller.ts
import httpStatus8 from "http-status";

// src/app/modules/review/review.service.ts
import httpStatus7 from "http-status";

// src/app/utils/QueryBuilder.ts
var QueryBuilder = class {
  constructor(model, queryParams, config2 = {}) {
    this.model = model;
    this.queryParams = queryParams;
    this.config = config2;
    this.query = { where: {}, include: {}, orderBy: {}, skip: 0, take: 10 };
    this.countQuery = { where: {} };
  }
  query;
  countQuery;
  page = 1;
  limit = 10;
  skip = 0;
  sortBy = "createdAt";
  sortOrder = "desc";
  selectFields;
  search() {
    const { searchTerm } = this.queryParams;
    const { searchableFields } = this.config;
    if (searchTerm && searchableFields && searchableFields.length > 0) {
      const searchConditions = searchableFields.map((field) => {
        if (field.includes(".")) {
          const parts = field.split(".");
          if (parts.length === 2) {
            const [relation, nestedField] = parts;
            const stringFilter2 = { contains: searchTerm, mode: "insensitive" };
            return { [relation]: { [nestedField]: stringFilter2 } };
          } else if (parts.length === 3) {
            const [relation, nestedRelation, nestedField] = parts;
            const stringFilter2 = { contains: searchTerm, mode: "insensitive" };
            return { [relation]: { some: { [nestedRelation]: { [nestedField]: stringFilter2 } } } };
          }
        }
        const stringFilter = { contains: searchTerm, mode: "insensitive" };
        return { [field]: stringFilter };
      });
      const whereConditions = this.query.where;
      whereConditions.OR = searchConditions;
      const countWhereConditions = this.countQuery.where;
      countWhereConditions.OR = searchConditions;
    }
    return this;
  }
  filter() {
    const { filterableFields } = this.config;
    const excludedField = ["searchTerm", "page", "limit", "sortBy", "sortOrder", "fields", "include"];
    const filterParams = {};
    Object.keys(this.queryParams).forEach((key) => {
      if (!excludedField.includes(key)) {
        filterParams[key] = this.queryParams[key];
      }
    });
    const queryWhere = this.query.where;
    const countQueryWhere = this.countQuery.where;
    Object.keys(filterParams).forEach((key) => {
      const value = filterParams[key];
      if (value === void 0 || value === "") return;
      const isAllowedField = !filterableFields || filterableFields.length === 0 || filterableFields.includes(key);
      if (key.includes(".")) {
        const parts = key.split(".");
        if (filterableFields && !filterableFields.includes(key)) return;
        if (parts.length === 2) {
          const [relation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = {};
            countQueryWhere[relation] = {};
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          queryRelation[nestedField] = this.parseFilterValue(value);
          countRelation[nestedField] = this.parseFilterValue(value);
          return;
        } else if (parts.length === 3) {
          const [relation, nestedRelation, nestedField] = parts;
          if (!queryWhere[relation]) {
            queryWhere[relation] = { some: {} };
            countQueryWhere[relation] = { some: {} };
          }
          const queryRelation = queryWhere[relation];
          const countRelation = countQueryWhere[relation];
          if (!queryRelation.some) {
            queryRelation.some = {};
          }
          if (!countRelation.some) {
            countRelation.some = {};
          }
          const querySome = queryRelation.some;
          const countSome = countRelation.some;
          if (!querySome[nestedRelation]) {
            querySome[nestedRelation] = {};
          }
          if (!countSome[nestedRelation]) {
            countSome[nestedRelation] = {};
          }
          const queryNestedRelation = querySome[nestedRelation];
          const countNestedRelation = countSome[nestedRelation];
          queryNestedRelation[nestedField] = this.parseFilterValue(value);
          countNestedRelation[nestedField] = this.parseFilterValue(value);
          return;
        }
      }
      if (!isAllowedField) return;
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        queryWhere[key] = this.parseRangeFilter(value);
        countQueryWhere[key] = this.parseRangeFilter(value);
        return;
      }
      queryWhere[key] = this.parseFilterValue(value);
      countQueryWhere[key] = this.parseFilterValue(value);
    });
    return this;
  }
  paginate() {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;
    this.page = page;
    this.limit = limit;
    this.skip = (page - 1) * limit;
    this.query.skip = this.skip;
    this.query.take = this.limit;
    return this;
  }
  sort() {
    const sortBy = this.queryParams.sortBy || "createdAt";
    const sortOrder = this.queryParams.sortOrder === "asc" ? "asc" : "desc";
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
    if (sortBy.includes(".")) {
      const parts = sortBy.split(".");
      if (parts.length === 2) {
        const [relation, nestedField] = parts;
        this.query.orderBy = { [relation]: { [nestedField]: sortOrder } };
      } else if (parts.length === 3) {
        const [relation, nestedRelation, nestedField] = parts;
        this.query.orderBy = { [relation]: { [nestedRelation]: { [nestedField]: sortOrder } } };
      } else {
        this.query.orderBy = { [sortBy]: sortOrder };
      }
    } else {
      this.query.orderBy = { [sortBy]: sortOrder };
    }
    return this;
  }
  fields() {
    const fieldsParam = this.queryParams.fields;
    if (fieldsParam && typeof fieldsParam === "string") {
      const fieldsArray = fieldsParam.split(",").map((field) => field.trim());
      this.selectFields = {};
      fieldsArray.forEach((field) => {
        if (this.selectFields) {
          this.selectFields[field] = true;
        }
      });
      this.query.select = this.selectFields;
      delete this.query.include;
    }
    return this;
  }
  include(relation) {
    if (this.selectFields) {
      return this;
    }
    this.query.include = { ...this.query.include, ...relation };
    return this;
  }
  dynamicInclude(includeConfig, defaultInclude) {
    if (this.selectFields) {
      return this;
    }
    const result = {};
    defaultInclude?.forEach((field) => {
      if (includeConfig[field]) {
        result[field] = includeConfig[field];
      }
    });
    const includeParam = this.queryParams.include;
    if (includeParam && typeof includeParam === "string") {
      const requestedRelations = includeParam.split(",").map((relation) => relation.trim());
      requestedRelations.forEach((relation) => {
        if (includeConfig[relation]) {
          result[relation] = includeConfig[relation];
        }
      });
    }
    this.query.include = { ...this.query.include, ...result };
    return this;
  }
  where(condition) {
    this.query.where = this.deepMerge(this.query.where, condition);
    this.countQuery.where = this.deepMerge(this.countQuery.where, condition);
    return this;
  }
  async execute() {
    const [total, data] = await Promise.all([
      this.model.count(this.countQuery),
      this.model.findMany(this.query)
    ]);
    const totalPages = Math.ceil(total / this.limit);
    return { data, meta: { page: this.page, limit: this.limit, total, totalPages } };
  }
  async count() {
    return await this.model.count(this.countQuery);
  }
  getQuery() {
    return this.query;
  }
  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        if (result[key] && typeof result[key] === "object" && !Array.isArray(result[key])) {
          result[key] = this.deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
  parseFilterValue(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    if (typeof value === "string" && !isNaN(Number(value)) && value !== "") return Number(value);
    if (Array.isArray(value)) return { in: value.map((item) => this.parseFilterValue(item)) };
    return value;
  }
  parseRangeFilter(value) {
    const rangeQuery = {};
    Object.keys(value).forEach((operator) => {
      const operatorValue = value[operator];
      const parsedValue = typeof operatorValue === "string" && !isNaN(Number(operatorValue)) ? Number(operatorValue) : operatorValue;
      switch (operator) {
        case "lt":
        case "lte":
        case "gt":
        case "gte":
        case "equals":
        case "not":
        case "contains":
        case "startsWith":
        case "endsWith":
          rangeQuery[operator] = parsedValue;
          break;
        case "in":
        case "notIn":
          rangeQuery[operator] = Array.isArray(operatorValue) ? operatorValue : [parsedValue];
          break;
        default:
          break;
      }
    });
    return Object.keys(rangeQuery).length > 0 ? rangeQuery : value;
  }
};

// src/app/modules/review/review.service.ts
var getReviewPermissionsForUser = (review, userId) => {
  if (review.userId !== userId) {
    return {
      canEdit: false,
      canDelete: false,
      reason: "You can only manage your own reviews"
    };
  }
  if (review.status === ReviewStatus.PUBLISHED) {
    return {
      canEdit: false,
      canDelete: false,
      reason: "Published reviews cannot be edited or deleted by users"
    };
  }
  return {
    canEdit: true,
    canDelete: true,
    reason: null
  };
};
var attachLikedByMeToReviews = async (reviews, currentUserId) => {
  if (!currentUserId || reviews.length === 0) {
    return reviews.map((review) => ({ ...review, likedByMe: false }));
  }
  const reviewIds = reviews.map((review) => String(review.id));
  const likes = await prisma.reviewLike.findMany({
    where: {
      userId: currentUserId,
      reviewId: { in: reviewIds }
    },
    select: { reviewId: true }
  });
  const likedReviewIds = new Set(likes.map((like) => like.reviewId));
  return reviews.map((review) => ({
    ...review,
    likedByMe: likedReviewIds.has(String(review.id))
  }));
};
var attachLikedByMeToComments = async (comments, currentUserId) => {
  if (!currentUserId || comments.length === 0) {
    return comments.map((comment) => ({
      ...comment,
      likedByMe: false,
      replies: Array.isArray(comment.replies) ? comment.replies.map((reply) => ({ ...reply, likedByMe: false })) : []
    }));
  }
  const topLevelIds = comments.map((comment) => String(comment.id));
  const replyIds = comments.flatMap(
    (comment) => Array.isArray(comment.replies) ? comment.replies.map((reply) => String(reply.id)) : []
  );
  const allCommentIds = [...topLevelIds, ...replyIds];
  const likes = await prisma.commentLike.findMany({
    where: {
      userId: currentUserId,
      commentId: { in: allCommentIds }
    },
    select: { commentId: true }
  });
  const likedCommentIds = new Set(likes.map((like) => like.commentId));
  return comments.map((comment) => ({
    ...comment,
    likedByMe: likedCommentIds.has(String(comment.id)),
    replies: Array.isArray(comment.replies) ? comment.replies.map((reply) => ({
      ...reply,
      likedByMe: likedCommentIds.has(String(reply.id))
    })) : []
  }));
};
var createReview = async (userId, mediaId, payload) => {
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Media not found");
  }
  const existingReview = await prisma.review.findUnique({
    where: { userId_mediaId: { userId, mediaId } }
  });
  if (existingReview) {
    throw new AppError_default(httpStatus7.CONFLICT, "You have already reviewed this media");
  }
  if (payload.rating < 1 || payload.rating > 10) {
    throw new AppError_default(httpStatus7.BAD_REQUEST, "Rating must be between 1 and 10");
  }
  const review = await prisma.review.create({
    data: {
      userId,
      mediaId,
      rating: payload.rating,
      content: payload.content,
      isSpoiler: payload.isSpoiler ?? false,
      tags: payload.tags ?? [],
      status: ReviewStatus.PENDING
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      },
      _count: {
        select: { likes: true, comments: true }
      }
    }
  });
  return review;
};
var getMediaReviews = async (mediaId, queryParams, options, currentUserId) => {
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Media not found");
  }
  const allowStatusFilter = options?.allowStatusFilter === true;
  const requestedStatus = typeof queryParams.status === "string" ? queryParams.status.toUpperCase() : void 0;
  const normalizedStatus = requestedStatus === ReviewStatus.PENDING || requestedStatus === ReviewStatus.PUBLISHED || requestedStatus === ReviewStatus.UNPUBLISHED ? requestedStatus : void 0;
  const baseWhere = allowStatusFilter ? { mediaId } : { mediaId, status: ReviewStatus.PUBLISHED };
  const builder = new QueryBuilder(prisma.review, queryParams, {
    searchableFields: ["content"],
    filterableFields: ["rating", "isSpoiler", ...allowStatusFilter ? ["status"] : []]
  });
  const result = await builder.search().filter().where(allowStatusFilter && normalizedStatus ? { status: normalizedStatus } : {}).where(baseWhere).sort().paginate().include({
    user: {
      select: { id: true, name: true, email: true, image: true }
    },
    _count: {
      select: { likes: true, comments: true }
    }
  }).execute();
  return {
    data: await attachLikedByMeToReviews(result.data, currentUserId),
    meta: result.meta
  };
};
var getReviewById = async (reviewId, currentUserId) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      },
      _count: {
        select: { likes: true, comments: true }
      }
    }
  });
  if (!review) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Review not found");
  }
  const [decoratedReview] = await attachLikedByMeToReviews(
    [review],
    currentUserId
  );
  const permissions = currentUserId && review.userId === currentUserId ? getReviewPermissionsForUser(review, currentUserId) : null;
  const baseReview = decoratedReview ?? { ...review, likedByMe: false };
  return {
    ...baseReview,
    permissions
  };
};
var updateReview = async (userId, reviewId, payload) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Review not found");
  }
  if (review.userId !== userId) {
    throw new AppError_default(httpStatus7.FORBIDDEN, "You can only update your own review");
  }
  if (review.status === ReviewStatus.PUBLISHED) {
    throw new AppError_default(httpStatus7.BAD_REQUEST, "You can only edit unpublished reviews");
  }
  if (payload.rating && (payload.rating < 1 || payload.rating > 10)) {
    throw new AppError_default(httpStatus7.BAD_REQUEST, "Rating must be between 1 and 10");
  }
  const updated = await prisma.review.update({
    where: { id: reviewId },
    data: {
      ...payload.rating !== void 0 && { rating: payload.rating },
      ...payload.content !== void 0 && { content: payload.content },
      ...payload.isSpoiler !== void 0 && { isSpoiler: payload.isSpoiler },
      ...payload.tags !== void 0 && { tags: payload.tags }
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      },
      _count: {
        select: { likes: true, comments: true }
      }
    }
  });
  return updated;
};
var deleteReview = async (userId, reviewId) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Review not found");
  }
  if (review.userId !== userId) {
    throw new AppError_default(httpStatus7.FORBIDDEN, "You can only delete your own review");
  }
  if (review.status === ReviewStatus.PUBLISHED) {
    throw new AppError_default(httpStatus7.BAD_REQUEST, "You can only delete unpublished reviews");
  }
  await prisma.review.delete({ where: { id: reviewId } });
};
var getReviewPermissions = async (userId, reviewId) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Review not found");
  }
  return {
    reviewId,
    status: review.status,
    ...getReviewPermissionsForUser(review, userId)
  };
};
var getMyReviews = async (userId, queryParams) => {
  const builder = new QueryBuilder(prisma.review, queryParams, {
    searchableFields: ["content"],
    filterableFields: ["status", "mediaId", "rating"]
  });
  const result = await builder.search().filter().where({ userId }).sort().paginate().include({
    media: {
      select: {
        id: true,
        title: true,
        posterUrl: true,
        releaseYear: true,
        mediaType: true
      }
    },
    _count: {
      select: { likes: true, comments: true }
    }
  }).execute();
  const dataWithPermissions = result.data.map(
    (review) => ({
      ...review,
      permissions: getReviewPermissionsForUser(review, userId)
    })
  );
  return {
    data: dataWithPermissions,
    meta: result.meta
  };
};
var likeReview = async (userId, reviewId) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Review not found");
  }
  const existingLike = await prisma.reviewLike.findUnique({
    where: { userId_reviewId: { userId, reviewId } }
  });
  if (existingLike) {
    throw new AppError_default(httpStatus7.CONFLICT, "You have already liked this review");
  }
  await prisma.reviewLike.create({
    data: { userId, reviewId }
  });
  return { liked: true };
};
var unlikeReview = async (userId, reviewId) => {
  const like = await prisma.reviewLike.findUnique({
    where: { userId_reviewId: { userId, reviewId } }
  });
  if (!like) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "You have not liked this review");
  }
  await prisma.reviewLike.delete({
    where: { userId_reviewId: { userId, reviewId } }
  });
  return { liked: false };
};
var addComment = async (userId, reviewId, content) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Review not found");
  }
  const comment = await prisma.reviewComment.create({
    data: { userId, reviewId, content, status: CommentStatus.PENDING },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      },
      _count: {
        select: { likes: true, replies: true }
      }
    }
  });
  return comment;
};
var getReviewComments = async (reviewId, queryParams, currentUserId, options) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Review not found");
  }
  const allowAllStatuses = options?.allowAllStatuses === true;
  const builder = new QueryBuilder(
    prisma.reviewComment,
    queryParams,
    {
      searchableFields: ["content"],
      filterableFields: []
    }
  );
  const result = await builder.search().where(
    allowAllStatuses ? { reviewId, parentId: null } : { reviewId, parentId: null, status: CommentStatus.PUBLISHED }
  ).sort().paginate().include({
    user: {
      select: { id: true, name: true, image: true }
    },
    replies: {
      orderBy: { createdAt: "asc" },
      ...allowAllStatuses ? {} : { where: { status: CommentStatus.PUBLISHED } },
      include: {
        user: {
          select: { id: true, name: true, image: true }
        },
        _count: {
          select: { likes: true, replies: true }
        }
      }
    },
    _count: {
      select: { likes: true, replies: true }
    }
  }).execute();
  return {
    data: await attachLikedByMeToComments(result.data, currentUserId),
    meta: result.meta
  };
};
var updateComment = async (userId, commentId, content) => {
  const comment = await prisma.reviewComment.findUnique({ where: { id: commentId } });
  if (!comment) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Comment not found");
  }
  if (comment.userId !== userId) {
    throw new AppError_default(httpStatus7.FORBIDDEN, "You can only edit your own comment");
  }
  if (comment.status === CommentStatus.PUBLISHED) {
    throw new AppError_default(httpStatus7.BAD_REQUEST, "You can only edit unpublished comments");
  }
  const updated = await prisma.reviewComment.update({
    where: { id: commentId },
    data: { content },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      },
      _count: {
        select: { likes: true, replies: true }
      }
    }
  });
  return updated;
};
var deleteComment = async (userId, commentId) => {
  const comment = await prisma.reviewComment.findUnique({ where: { id: commentId } });
  if (!comment) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Comment not found");
  }
  if (comment.userId !== userId) {
    throw new AppError_default(httpStatus7.FORBIDDEN, "You can only delete your own comment");
  }
  await prisma.commentLike.deleteMany({
    where: {
      comment: {
        parentId: commentId
      }
    }
  });
  await prisma.reviewComment.deleteMany({
    where: { parentId: commentId }
  });
  await prisma.commentLike.deleteMany({
    where: { commentId }
  });
  await prisma.reviewComment.delete({ where: { id: commentId } });
};
var replyToComment = async (userId, commentId, content) => {
  const parentComment = await prisma.reviewComment.findUnique({ where: { id: commentId } });
  if (!parentComment) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Parent comment not found");
  }
  const reply = await prisma.reviewComment.create({
    data: {
      userId,
      reviewId: parentComment.reviewId,
      content,
      status: CommentStatus.PENDING,
      parentId: commentId
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      },
      _count: {
        select: { likes: true }
      }
    }
  });
  return reply;
};
var likeComment = async (userId, commentId) => {
  const comment = await prisma.reviewComment.findUnique({ where: { id: commentId } });
  if (!comment) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Comment not found");
  }
  const existingLike = await prisma.commentLike.findUnique({
    where: { userId_commentId: { userId, commentId } }
  });
  if (existingLike) {
    throw new AppError_default(httpStatus7.CONFLICT, "You have already liked this comment");
  }
  await prisma.commentLike.create({
    data: { userId, commentId }
  });
  return { liked: true };
};
var unlikeComment = async (userId, commentId) => {
  const like = await prisma.commentLike.findUnique({
    where: { userId_commentId: { userId, commentId } }
  });
  if (!like) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "You have not liked this comment");
  }
  await prisma.commentLike.delete({
    where: { userId_commentId: { userId, commentId } }
  });
  return { liked: false };
};
var approveReview = async (reviewId) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Review not found");
  }
  return await prisma.review.update({
    where: { id: reviewId },
    data: { status: ReviewStatus.PUBLISHED },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      },
      _count: {
        select: { likes: true, comments: true }
      }
    }
  });
};
var unpublishReview = async (reviewId) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Review not found");
  }
  return await prisma.review.update({
    where: { id: reviewId },
    data: { status: ReviewStatus.UNPUBLISHED },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      },
      _count: {
        select: { likes: true, comments: true }
      }
    }
  });
};
var deleteReviewAsAdmin = async (reviewId) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Review not found");
  }
  await prisma.commentLike.deleteMany({
    where: {
      comment: {
        reviewId
      }
    }
  });
  await prisma.reviewComment.deleteMany({ where: { reviewId } });
  await prisma.reviewLike.deleteMany({ where: { reviewId } });
  await prisma.review.delete({ where: { id: reviewId } });
};
var deleteCommentAsAdmin = async (commentId) => {
  const comment = await prisma.reviewComment.findUnique({ where: { id: commentId } });
  if (!comment) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Comment not found");
  }
  await prisma.commentLike.deleteMany({
    where: {
      comment: {
        parentId: commentId
      }
    }
  });
  await prisma.reviewComment.deleteMany({ where: { parentId: commentId } });
  await prisma.commentLike.deleteMany({ where: { commentId } });
  await prisma.reviewComment.delete({ where: { id: commentId } });
};
var getMediaStats = async (mediaId) => {
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Media not found");
  }
  const reviews = await prisma.review.findMany({
    where: { mediaId, status: ReviewStatus.PUBLISHED }
  });
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? Math.round(
    reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews * 10
  ) / 10 : 0;
  const ratingDistribution = {
    "1": reviews.filter((r) => r.rating === 1).length,
    "2": reviews.filter((r) => r.rating === 2).length,
    "3": reviews.filter((r) => r.rating === 3).length,
    "4": reviews.filter((r) => r.rating === 4).length,
    "5": reviews.filter((r) => r.rating === 5).length,
    "6": reviews.filter((r) => r.rating === 6).length,
    "7": reviews.filter((r) => r.rating === 7).length,
    "8": reviews.filter((r) => r.rating === 8).length,
    "9": reviews.filter((r) => r.rating === 9).length,
    "10": reviews.filter((r) => r.rating === 10).length
  };
  const pendingReviews = await prisma.review.findMany({
    where: { mediaId, status: ReviewStatus.PENDING },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      rating: true,
      content: true,
      isSpoiler: true,
      tags: true,
      status: true,
      createdAt: true,
      user: { select: { id: true, name: true, image: true } }
    }
  });
  return {
    mediaId,
    title: media.title,
    totalReviews,
    averageRating,
    ratingDistribution,
    pendingReviewsCount: pendingReviews.length,
    pendingReviews
  };
};
var getAdminStats = async () => {
  const [totalReviews, pendingReviewsCount, recentReviews] = await Promise.all([
    prisma.review.count(),
    prisma.review.count({ where: { status: ReviewStatus.PENDING } }),
    prisma.review.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        rating: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        media: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })
  ]);
  return {
    totalReviews,
    pendingReviewsCount,
    recentReviews
  };
};
var getAllPublishedReviews = async (queryParams, currentUserId) => {
  const builder = new QueryBuilder(prisma.review, queryParams, {
    searchableFields: ["content"],
    filterableFields: ["rating", "isSpoiler", "mediaId"]
  });
  const result = await builder.search().filter().where({ status: ReviewStatus.PUBLISHED }).sort().paginate().include({
    user: {
      select: { id: true, name: true, email: true, image: true }
    },
    media: {
      select: { id: true, title: true, posterUrl: true }
    },
    _count: {
      select: { likes: true, comments: true }
    }
  }).execute();
  const reviews = await attachLikedByMeToReviews(result.data, currentUserId);
  return {
    data: reviews,
    meta: result.meta
  };
};
var getAdminComments = async (queryParams) => {
  const builder = new QueryBuilder(
    prisma.reviewComment,
    queryParams,
    {
      searchableFields: ["content", "user.name", "review.media.title"],
      filterableFields: ["status", "reviewId"]
    }
  );
  const result = await builder.search().filter().sort().paginate().include({
    user: {
      select: { id: true, name: true, image: true }
    },
    review: {
      select: {
        id: true,
        media: {
          select: { id: true, title: true, posterUrl: true }
        }
      }
    },
    _count: {
      select: { likes: true, replies: true }
    }
  }).execute();
  return result;
};
var approveComment = async (commentId) => {
  const comment = await prisma.reviewComment.findUnique({ where: { id: commentId } });
  if (!comment) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Comment not found");
  }
  return await prisma.reviewComment.update({
    where: { id: commentId },
    data: { status: CommentStatus.PUBLISHED },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      },
      _count: {
        select: { likes: true, replies: true }
      }
    }
  });
};
var unpublishComment = async (commentId) => {
  const comment = await prisma.reviewComment.findUnique({ where: { id: commentId } });
  if (!comment) {
    throw new AppError_default(httpStatus7.NOT_FOUND, "Comment not found");
  }
  return await prisma.reviewComment.update({
    where: { id: commentId },
    data: { status: CommentStatus.UNPUBLISHED },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true }
      },
      _count: {
        select: { likes: true, replies: true }
      }
    }
  });
};
var ReviewService = {
  // User actions
  createReview,
  getMediaReviews,
  getReviewById,
  getMyReviews,
  getReviewPermissions,
  updateReview,
  deleteReview,
  likeReview,
  unlikeReview,
  addComment,
  getReviewComments,
  updateComment,
  deleteComment,
  replyToComment,
  likeComment,
  unlikeComment,
  // Admin actions
  approveReview,
  unpublishReview,
  deleteReviewAsAdmin,
  deleteCommentAsAdmin,
  getMediaStats,
  getAdminStats,
  getAllPublishedReviews,
  getAdminComments,
  approveComment,
  unpublishComment
};

// src/app/modules/review/review.controller.ts
var resolveOptionalViewer = (req) => {
  if (req.user?.userId) {
    return {
      userId: req.user.userId,
      role: req.user.role
    };
  }
  const accessToken = CookieUtils.getCookie(req, "accessToken");
  if (!accessToken) {
    return {};
  }
  const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
  if (!verifiedToken.success || !verifiedToken.data?.userId || typeof verifiedToken.data.userId !== "string") {
    return {};
  }
  return {
    userId: verifiedToken.data.userId,
    role: verifiedToken.data.role
  };
};
var resolveOptionalUserId = (req) => resolveOptionalViewer(req).userId;
var createReview2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const mediaId = req.params.mediaId;
  const payload = req.body;
  const result = await ReviewService.createReview(userId, mediaId, payload);
  sendResponse(res, {
    httpStatusCode: httpStatus8.CREATED,
    success: true,
    message: "Review created successfully",
    data: result
  });
});
var getMediaReviews2 = catchAsync(async (req, res) => {
  const mediaId = req.params.mediaId;
  const currentUserId = resolveOptionalUserId(req);
  const result = await ReviewService.getMediaReviews(
    mediaId,
    req.query,
    void 0,
    currentUserId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getMediaReviewsForAdmin = catchAsync(async (req, res) => {
  const mediaId = req.params.mediaId;
  const currentUserId = req.user.userId;
  const result = await ReviewService.getMediaReviews(
    mediaId,
    req.query,
    { allowStatusFilter: true },
    currentUserId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Admin reviews fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getReviewById2 = catchAsync(async (req, res) => {
  const reviewId = req.params.reviewId;
  const currentUserId = resolveOptionalUserId(req);
  const result = await ReviewService.getReviewById(reviewId, currentUserId);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Review fetched successfully",
    data: result
  });
});
var getMyReviews2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await ReviewService.getMyReviews(userId, req.query);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "My reviews fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var getAdminStats2 = catchAsync(async (_req, res) => {
  const result = await ReviewService.getAdminStats();
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Review stats fetched successfully",
    data: result
  });
});
var getReviewPermissions2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const reviewId = req.params.reviewId;
  const result = await ReviewService.getReviewPermissions(userId, reviewId);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Review permissions fetched successfully",
    data: result
  });
});
var updateReview2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const reviewId = req.params.reviewId;
  const payload = req.body;
  const result = await ReviewService.updateReview(userId, reviewId, payload);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Review updated successfully",
    data: result
  });
});
var deleteReview2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const reviewId = req.params.reviewId;
  await ReviewService.deleteReview(userId, reviewId);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Review deleted successfully"
  });
});
var likeReview2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const reviewId = req.params.reviewId;
  const result = await ReviewService.likeReview(userId, reviewId);
  sendResponse(res, {
    httpStatusCode: httpStatus8.CREATED,
    success: true,
    message: "Review liked",
    data: result
  });
});
var unlikeReview2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const reviewId = req.params.reviewId;
  const result = await ReviewService.unlikeReview(userId, reviewId);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Review unliked",
    data: result
  });
});
var addComment2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const reviewId = req.params.reviewId;
  const { content } = req.body;
  const result = await ReviewService.addComment(userId, reviewId, content);
  sendResponse(res, {
    httpStatusCode: httpStatus8.CREATED,
    success: true,
    message: "Comment added successfully",
    data: result
  });
});
var getReviewComments2 = catchAsync(async (req, res) => {
  const reviewId = req.params.reviewId;
  const viewer = resolveOptionalViewer(req);
  const includeUnpublished = viewer.role === Role.ADMIN || viewer.role === Role.SUPER_ADMIN;
  const result = await ReviewService.getReviewComments(
    reviewId,
    req.query,
    viewer.userId,
    { allowAllStatuses: includeUnpublished }
  );
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Comments fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var updateComment2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const commentId = req.params.commentId;
  const { content } = req.body;
  const result = await ReviewService.updateComment(userId, commentId, content);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Comment updated successfully",
    data: result
  });
});
var deleteComment2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const commentId = req.params.commentId;
  await ReviewService.deleteComment(userId, commentId);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Comment deleted successfully"
  });
});
var replyToComment2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const commentId = req.params.commentId;
  const { content } = req.body;
  const result = await ReviewService.replyToComment(userId, commentId, content);
  sendResponse(res, {
    httpStatusCode: httpStatus8.CREATED,
    success: true,
    message: "Reply added successfully",
    data: result
  });
});
var likeComment2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const commentId = req.params.commentId;
  const result = await ReviewService.likeComment(userId, commentId);
  sendResponse(res, {
    httpStatusCode: httpStatus8.CREATED,
    success: true,
    message: "Comment liked",
    data: result
  });
});
var unlikeComment2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const commentId = req.params.commentId;
  const result = await ReviewService.unlikeComment(userId, commentId);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Comment unliked",
    data: result
  });
});
var approveReview2 = catchAsync(async (req, res) => {
  const reviewId = req.params.reviewId;
  const result = await ReviewService.approveReview(reviewId);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Review approved and published",
    data: result
  });
});
var unpublishReview2 = catchAsync(async (req, res) => {
  const reviewId = req.params.reviewId;
  const result = await ReviewService.unpublishReview(reviewId);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Review unpublished",
    data: result
  });
});
var rejectReview = catchAsync(async (req, res) => {
  const reviewId = req.params.reviewId;
  const result = await ReviewService.unpublishReview(reviewId);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Review rejected",
    data: result
  });
});
var deleteReviewAsAdmin2 = catchAsync(async (req, res) => {
  const reviewId = req.params.reviewId;
  await ReviewService.deleteReviewAsAdmin(reviewId);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Review deleted by admin"
  });
});
var deleteCommentAsAdmin2 = catchAsync(async (req, res) => {
  const commentId = req.params.commentId;
  await ReviewService.deleteCommentAsAdmin(commentId);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Comment deleted by admin"
  });
});
var getMediaStats2 = catchAsync(async (req, res) => {
  const mediaId = req.params.mediaId;
  const result = await ReviewService.getMediaStats(mediaId);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Media stats retrieved",
    data: result
  });
});
var getAllPublishedReviews2 = catchAsync(async (req, res) => {
  const currentUserId = resolveOptionalUserId(req);
  const result = await ReviewService.getAllPublishedReviews(
    req.query,
    currentUserId
  );
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Published reviews fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var approveComment2 = catchAsync(async (req, res) => {
  const commentId = req.params.commentId;
  const result = await ReviewService.approveComment(commentId);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Comment approved and published",
    data: result
  });
});
var unpublishComment2 = catchAsync(async (req, res) => {
  const commentId = req.params.commentId;
  const result = await ReviewService.unpublishComment(commentId);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Comment unpublished",
    data: result
  });
});
var getAdminComments2 = catchAsync(async (req, res) => {
  const result = await ReviewService.getAdminComments(req.query);
  sendResponse(res, {
    httpStatusCode: httpStatus8.OK,
    success: true,
    message: "Admin comments fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var ReviewController = {
  createReview: createReview2,
  getMediaReviews: getMediaReviews2,
  getMediaReviewsForAdmin,
  getReviewById: getReviewById2,
  getMyReviews: getMyReviews2,
  getReviewPermissions: getReviewPermissions2,
  updateReview: updateReview2,
  deleteReview: deleteReview2,
  likeReview: likeReview2,
  unlikeReview: unlikeReview2,
  addComment: addComment2,
  getReviewComments: getReviewComments2,
  updateComment: updateComment2,
  deleteComment: deleteComment2,
  replyToComment: replyToComment2,
  likeComment: likeComment2,
  unlikeComment: unlikeComment2,
  // Admin actions
  approveReview: approveReview2,
  unpublishReview: unpublishReview2,
  rejectReview,
  deleteReviewAsAdmin: deleteReviewAsAdmin2,
  deleteCommentAsAdmin: deleteCommentAsAdmin2,
  getMediaStats: getMediaStats2,
  getAdminStats: getAdminStats2,
  getAllPublishedReviews: getAllPublishedReviews2,
  getAdminComments: getAdminComments2,
  approveComment: approveComment2,
  unpublishComment: unpublishComment2
};

// src/app/modules/review/review.validation.ts
import z4 from "zod";
var createReviewSchema = z4.object({
  rating: z4.number().min(1, "Rating must be at least 1").max(10, "Rating must be at most 10"),
  content: z4.string().min(5, "Content must be at least 5 characters").max(5e3),
  isSpoiler: z4.boolean().optional(),
  tags: z4.array(z4.string().max(50)).optional()
});
var updateReviewSchema = z4.object({
  rating: z4.number().min(1, "Rating must be at least 1").max(10, "Rating must be at most 10").optional(),
  content: z4.string().min(5, "Content must be at least 5 characters").max(5e3).optional(),
  isSpoiler: z4.boolean().optional(),
  tags: z4.array(z4.string().max(50)).optional()
});
var addCommentSchema = z4.object({
  content: z4.string().min(1, "Comment cannot be empty").max(1e3)
});
var updateCommentSchema = z4.object({
  content: z4.string().min(1, "Comment cannot be empty").max(1e3)
});

// src/app/modules/review/review.route.ts
var router7 = Router7();
router7.get("/", ReviewController.getAllPublishedReviews);
router7.get("/media/:mediaId", ReviewController.getMediaReviews);
router7.get(
  "/admin/media/:mediaId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.getMediaReviewsForAdmin
);
router7.get(
  "/admin/stats",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.getAdminStats
);
router7.get(
  "/admin/comments",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.getAdminComments
);
router7.post(
  "/media/:mediaId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createReviewSchema),
  ReviewController.createReview
);
router7.get(
  "/me",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.getMyReviews
);
router7.get(
  "/:reviewId/permissions",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.getReviewPermissions
);
router7.get("/:reviewId", ReviewController.getReviewById);
router7.patch(
  "/:reviewId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateReviewSchema),
  ReviewController.updateReview
);
router7.delete(
  "/:reviewId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.deleteReview
);
router7.post(
  "/:reviewId/like",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.likeReview
);
router7.delete(
  "/:reviewId/like",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.unlikeReview
);
router7.get("/:reviewId/comments", ReviewController.getReviewComments);
router7.post(
  "/:reviewId/comments",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(addCommentSchema),
  ReviewController.addComment
);
router7.patch(
  "/comments/:commentId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateCommentSchema),
  ReviewController.updateComment
);
router7.delete(
  "/comments/:commentId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.deleteComment
);
router7.post(
  "/comments/:commentId/replies",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(addCommentSchema),
  ReviewController.replyToComment
);
router7.post(
  "/comments/:commentId/like",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.likeComment
);
router7.delete(
  "/comments/:commentId/like",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.unlikeComment
);
router7.patch(
  "/:reviewId/approve",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.approveReview
);
router7.patch(
  "/:reviewId/unpublish",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.unpublishReview
);
router7.patch(
  "/:reviewId/reject",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.rejectReview
);
router7.delete(
  "/:reviewId/admin",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.deleteReviewAsAdmin
);
router7.delete(
  "/comments/:commentId/admin",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.deleteCommentAsAdmin
);
router7.patch(
  "/comments/:commentId/approve",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.approveComment
);
router7.patch(
  "/comments/:commentId/unpublish",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.unpublishComment
);
router7.get(
  "/media/:mediaId/stats",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  ReviewController.getMediaStats
);
var ReviewRoutes = router7;

// src/app/modules/subscription/subscription.route.ts
import { Router as Router8 } from "express";

// src/app/modules/subscription/subscription.controller.ts
import httpStatus10 from "http-status";

// src/app/modules/subscription/subscription.service.ts
import httpStatus9 from "http-status";
var DEFAULT_PLAN_CONFIG = {
  FREE: { amount: 0, durationDays: 0, label: "Free" },
  MONTHLY: { amount: 9.99, durationDays: 30, label: "Monthly" },
  YEARLY: { amount: 99.99, durationDays: 365, label: "Yearly" }
};
var DEFAULT_PLAN_FEATURES = {
  FREE: [
    "Access to free titles",
    "Public reviews and watchlist support"
  ],
  MONTHLY: [
    "30 days premium streaming access",
    "Unlock premium-only titles",
    "Priority access to new releases"
  ],
  YEARLY: [
    "365 days premium streaming access",
    "Unlock premium-only titles",
    "Priority access to new releases",
    "Best value annual billing"
  ]
};
var PLAN_ORDER = [
  SubscriptionPlan.FREE,
  SubscriptionPlan.MONTHLY,
  SubscriptionPlan.YEARLY
];
var ensureSubscriptionPlanSettings = async () => {
  await Promise.all(
    PLAN_ORDER.map(
      (plan) => prisma.subscriptionPlanSetting.upsert({
        where: { plan },
        update: {},
        create: {
          plan,
          label: DEFAULT_PLAN_CONFIG[plan].label,
          price: DEFAULT_PLAN_CONFIG[plan].amount,
          durationDays: DEFAULT_PLAN_CONFIG[plan].durationDays,
          currency: "usd",
          features: DEFAULT_PLAN_FEATURES[plan],
          isActive: true
        }
      })
    )
  );
  return prisma.subscriptionPlanSetting.findMany({
    orderBy: { createdAt: "asc" }
  });
};
var mapPlanSettingToResponse = (setting) => ({
  plan: setting.plan,
  price: setting.price,
  amount: setting.price,
  duration: setting.durationDays > 0 ? `${setting.durationDays} days` : "Lifetime",
  durationDays: setting.durationDays,
  label: setting.label,
  currency: setting.currency,
  features: setting.features,
  isActive: setting.isActive
});
var getPlanSettingOrThrow = async (plan) => {
  const settings = await ensureSubscriptionPlanSettings();
  const setting = settings.find((item) => item.plan === plan);
  if (!setting) {
    throw new AppError_default(httpStatus9.NOT_FOUND, "Subscription plan not found");
  }
  return setting;
};
var getSubscriptionPlans = async () => {
  const settings = await ensureSubscriptionPlanSettings();
  return PLAN_ORDER.map((plan) => settings.find((item) => item.plan === plan)).filter((setting) => Boolean(setting)).map(mapPlanSettingToResponse);
};
var updateSubscriptionPlan = async (plan, payload) => {
  if (!Object.keys(payload).length) {
    throw new AppError_default(httpStatus9.BAD_REQUEST, "No plan changes provided");
  }
  const currentSetting = await getPlanSettingOrThrow(plan);
  const nextDurationDays = payload.durationDays ?? currentSetting.durationDays;
  const nextPrice = payload.price ?? currentSetting.price;
  if (plan === SubscriptionPlan.FREE) {
    if (nextPrice !== 0) {
      throw new AppError_default(httpStatus9.BAD_REQUEST, "FREE plan price must remain 0");
    }
    if (nextDurationDays !== 0) {
      throw new AppError_default(httpStatus9.BAD_REQUEST, "FREE plan duration must remain 0 days");
    }
  }
  if (plan !== SubscriptionPlan.FREE && nextDurationDays <= 0) {
    throw new AppError_default(httpStatus9.BAD_REQUEST, "Paid plans must have a duration greater than 0 days");
  }
  const updated = await prisma.subscriptionPlanSetting.update({
    where: { plan },
    data: {
      ...payload.label !== void 0 ? { label: payload.label.trim() } : {},
      ...payload.price !== void 0 ? { price: payload.price } : {},
      ...payload.durationDays !== void 0 ? { durationDays: payload.durationDays } : {},
      ...payload.features !== void 0 ? { features: payload.features } : {},
      ...payload.isActive !== void 0 ? { isActive: payload.isActive } : {}
    }
  });
  return mapPlanSettingToResponse(updated);
};
var getMySubscription = async (userId) => {
  const sub = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
  if (!sub) {
    return {
      plan: SubscriptionPlan.FREE,
      status: SubscriptionStatus.ACTIVE,
      startDate: null,
      endDate: null,
      amount: 0,
      currency: "usd"
    };
  }
  const now = /* @__PURE__ */ new Date();
  if (sub.status === SubscriptionStatus.ACTIVE && sub.endDate && sub.endDate < now) {
    const expired = await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: SubscriptionStatus.EXPIRED }
    });
    return { ...expired, currency: "usd" };
  }
  return { ...sub, currency: "usd" };
};
var createCheckoutSession3 = async (userId, plan) => {
  if (plan !== SubscriptionPlan.MONTHLY && plan !== SubscriptionPlan.YEARLY) {
    throw new AppError_default(httpStatus9.BAD_REQUEST, "Only MONTHLY or YEARLY plans are allowed for checkout");
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError_default(httpStatus9.NOT_FOUND, "User not found");
  }
  const config2 = await getPlanSettingOrThrow(plan);
  const amountInCents = Math.round(config2.price * 100);
  if (!config2.isActive) {
    throw new AppError_default(httpStatus9.BAD_REQUEST, "This subscription plan is currently unavailable");
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amountInCents,
          product_data: {
            name: `CineTube ${config2.label} Subscription`,
            description: `${config2.durationDays} days premium access`
          }
        },
        quantity: 1
      }
    ],
    metadata: {
      type: "subscription",
      userId,
      plan,
      durationDays: String(config2.durationDays),
      amount: String(config2.price)
    },
    success_url: `${envVars.FRONTEND_URL}/dashboard/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${envVars.FRONTEND_URL}/dashboard/subscription?canceled=true`
  });
  return { checkoutUrl: session.url, sessionId: session.id };
};
var verifyCheckoutSession = async (userId, sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.metadata?.type !== "subscription") {
    throw new AppError_default(httpStatus9.BAD_REQUEST, "Invalid subscription checkout session");
  }
  if (!session.metadata?.userId || session.metadata.userId !== userId) {
    throw new AppError_default(httpStatus9.FORBIDDEN, "You are not allowed to verify this checkout session");
  }
  if (session.payment_status !== "paid") {
    return {
      verified: false,
      paymentStatus: session.payment_status
    };
  }
  const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : null;
  if (!paymentIntentId) {
    throw new AppError_default(httpStatus9.BAD_REQUEST, "Payment intent not found for this checkout session");
  }
  const existing = await prisma.subscription.findFirst({
    where: {
      userId,
      stripePaymentId: paymentIntentId,
      status: SubscriptionStatus.ACTIVE
    },
    orderBy: { createdAt: "desc" }
  });
  if (existing) {
    return {
      verified: true,
      paymentStatus: session.payment_status,
      subscription: existing
    };
  }
  const plan = session.metadata.plan;
  if (!plan || plan !== SubscriptionPlan.MONTHLY && plan !== SubscriptionPlan.YEARLY) {
    throw new AppError_default(httpStatus9.BAD_REQUEST, "Invalid subscription plan in checkout metadata");
  }
  const configuredPlan = await getPlanSettingOrThrow(plan);
  const durationDaysFromMetadata = Number(session.metadata.durationDays || "0");
  const durationDays = durationDaysFromMetadata > 0 ? durationDaysFromMetadata : configuredPlan.durationDays;
  const amountFromMetadata = Number(session.metadata.amount || "0");
  const amount = amountFromMetadata > 0 ? amountFromMetadata : configuredPlan.price;
  const startDate = /* @__PURE__ */ new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + durationDays);
  await prisma.subscription.updateMany({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE
    },
    data: {
      status: SubscriptionStatus.EXPIRED,
      endDate: /* @__PURE__ */ new Date()
    }
  });
  const created = await prisma.subscription.create({
    data: {
      userId,
      plan,
      status: SubscriptionStatus.ACTIVE,
      startDate,
      endDate,
      amount,
      stripeCustomerId: typeof session.customer === "string" ? session.customer : null,
      stripePaymentId: paymentIntentId
    }
  });
  return {
    verified: true,
    paymentStatus: session.payment_status,
    subscription: created
  };
};
var cancelSubscription = async (userId) => {
  const activeSub = await prisma.subscription.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE
    },
    orderBy: { createdAt: "desc" }
  });
  if (!activeSub) {
    throw new AppError_default(httpStatus9.NOT_FOUND, "No active subscription found");
  }
  await prisma.subscription.update({
    where: { id: activeSub.id },
    data: {
      status: SubscriptionStatus.CANCELLED,
      endDate: /* @__PURE__ */ new Date()
    }
  });
  return null;
};
var SubscriptionService = {
  getSubscriptionPlans,
  updateSubscriptionPlan,
  getMySubscription,
  createCheckoutSession: createCheckoutSession3,
  verifyCheckoutSession,
  cancelSubscription
};

// src/app/modules/subscription/subscription.controller.ts
var getSubscriptionPlans2 = catchAsync(async (_req, res) => {
  const result = await SubscriptionService.getSubscriptionPlans();
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "Subscription plans fetched successfully",
    data: result
  });
});
var getMySubscription2 = catchAsync(async (req, res) => {
  const result = await SubscriptionService.getMySubscription(req.user.userId);
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "Subscription fetched successfully",
    data: result
  });
});
var createCheckoutSession4 = catchAsync(async (req, res) => {
  const { plan } = req.body;
  if (!plan) {
    throw new AppError_default(httpStatus10.BAD_REQUEST, "plan is required");
  }
  const result = await SubscriptionService.createCheckoutSession(req.user.userId, plan);
  sendResponse(res, {
    httpStatusCode: httpStatus10.CREATED,
    success: true,
    message: "Subscription checkout session created",
    data: result
  });
});
var verifyCheckoutSession2 = catchAsync(async (req, res) => {
  const sessionId = String(req.query.sessionId || "");
  if (!sessionId) {
    throw new AppError_default(httpStatus10.BAD_REQUEST, "sessionId is required");
  }
  const result = await SubscriptionService.verifyCheckoutSession(req.user.userId, sessionId);
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: result.verified ? "Subscription verified successfully" : "Subscription payment is still processing",
    data: result
  });
});
var updateSubscriptionPlan2 = catchAsync(async (req, res) => {
  const plan = req.params.plan;
  const result = await SubscriptionService.updateSubscriptionPlan(plan, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "Subscription plan updated successfully",
    data: result
  });
});
var cancelSubscription2 = catchAsync(async (req, res) => {
  const result = await SubscriptionService.cancelSubscription(req.user.userId);
  sendResponse(res, {
    httpStatusCode: httpStatus10.OK,
    success: true,
    message: "Subscription cancelled successfully",
    data: result
  });
});
var SubscriptionController = {
  getSubscriptionPlans: getSubscriptionPlans2,
  updateSubscriptionPlan: updateSubscriptionPlan2,
  getMySubscription: getMySubscription2,
  createCheckoutSession: createCheckoutSession4,
  verifyCheckoutSession: verifyCheckoutSession2,
  cancelSubscription: cancelSubscription2
};

// src/app/modules/subscription/subscription.validation.ts
import z5 from "zod";
var updateSubscriptionPlanSchema = z5.object({
  label: z5.string().min(2).max(50).optional(),
  price: z5.number().min(0).optional(),
  durationDays: z5.number().int().min(0).optional(),
  features: z5.array(z5.string().min(1).max(120)).min(1).optional(),
  isActive: z5.boolean().optional()
});

// src/app/modules/subscription/subscription.route.ts
var router8 = Router8();
router8.get("/plans", SubscriptionController.getSubscriptionPlans);
router8.patch(
  "/plans/:plan",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateSubscriptionPlanSchema),
  SubscriptionController.updateSubscriptionPlan
);
router8.get("/me", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), SubscriptionController.getMySubscription);
router8.post("/checkout", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), SubscriptionController.createCheckoutSession);
router8.get("/verify", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), SubscriptionController.verifyCheckoutSession);
router8.post("/cancel", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), SubscriptionController.cancelSubscription);
var SubscriptionRoutes = router8;

// src/app/modules/user/user.router.ts
import { Router as Router9 } from "express";

// src/app/modules/user/user.controller.ts
import status13 from "http-status";

// src/app/modules/user/user.service.ts
import status12 from "http-status";
var createAdmin = async (payload) => {
  const userExists = await prisma.user.findUnique({ where: { email: payload.email } });
  if (userExists) {
    throw new AppError_default(status12.CONFLICT, "User with this email already exists");
  }
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.email,
      password: payload.password,
      name: payload.name,
      role: payload.role,
      needPasswordChange: true
    }
  });
  try {
    const adminProfile = await prisma.adminProfile.create({
      data: { userId: userData.user.id }
    });
    return adminProfile;
  } catch (error) {
    console.log("Error creating admin:", error);
    await prisma.user.delete({ where: { id: userData.user.id } });
    throw error;
  }
};
var getAllUsers = async (queryParams) => {
  const result = await new QueryBuilder(
    prisma.user,
    queryParams,
    {
      searchableFields: ["name", "email"],
      filterableFields: ["role", "status", "isDeleted"]
    }
  ).search().filter().sort().paginate().execute();
  return result;
};
var updateUserStatus = async (userId, newStatus) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError_default(status12.NOT_FOUND, "User not found");
  }
  const validStatuses = ["ACTIVE", "BLOCKED", "DELETED"];
  if (!validStatuses.includes(newStatus)) {
    throw new AppError_default(status12.BAD_REQUEST, "Invalid status value");
  }
  return await prisma.user.update({
    where: { id: userId },
    data: {
      status: newStatus,
      isDeleted: newStatus === "DELETED",
      deletedAt: newStatus === "DELETED" ? /* @__PURE__ */ new Date() : null
    }
  });
};
var getMe3 = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      isDeleted: true,
      emailVerified: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true
    }
  });
  if (!user) {
    throw new AppError_default(status12.NOT_FOUND, "User not found");
  }
  return user;
};
var updateMe = async (userId, payload) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError_default(status12.NOT_FOUND, "User not found");
  }
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      name: payload.name,
      ...payload.image !== void 0 && { image: payload.image }
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      isDeleted: true,
      emailVerified: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true
    }
  });
  return updated;
};
var getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      isDeleted: true,
      emailVerified: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true
    }
  });
  if (!user) {
    throw new AppError_default(status12.NOT_FOUND, "User not found");
  }
  return user;
};
var updateUserProfileById = async (id, payload) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError_default(status12.NOT_FOUND, "User not found");
  }
  return await prisma.user.update({
    where: { id },
    data: {
      name: payload.name,
      ...payload.image !== void 0 && { image: payload.image }
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      isDeleted: true,
      emailVerified: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true
    }
  });
};
var updateUserById = async (id, payload) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError_default(status12.NOT_FOUND, "User not found");
  }
  const nextStatus = typeof payload.status === "string" ? payload.status : void 0;
  return await prisma.user.update({
    where: { id },
    data: {
      ...typeof payload.name === "string" && { name: payload.name },
      ...typeof payload.email === "string" && { email: payload.email },
      ...typeof payload.image === "string" && { image: payload.image },
      ...payload.image === null && { image: null },
      ...typeof payload.role === "string" && { role: payload.role },
      ...nextStatus && { status: nextStatus },
      ...typeof payload.needPasswordChange === "boolean" && { needPasswordChange: payload.needPasswordChange },
      ...typeof payload.isDeleted === "boolean" && { isDeleted: payload.isDeleted },
      ...nextStatus === "DELETED" && { isDeleted: true, deletedAt: /* @__PURE__ */ new Date() },
      ...nextStatus && nextStatus !== "DELETED" && { deletedAt: null }
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      isDeleted: true,
      emailVerified: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true
    }
  });
};
var deleteUserById = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError_default(status12.NOT_FOUND, "User not found");
  }
  await prisma.user.update({
    where: { id },
    data: {
      status: "DELETED",
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
};
var UserService = {
  createAdmin,
  getAllUsers,
  updateUserStatus,
  getMe: getMe3,
  updateMe,
  getUserById,
  updateUserProfileById,
  updateUserById,
  deleteUserById
};

// src/app/modules/user/user.controller.ts
var createAdmin2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await UserService.createAdmin(payload);
  sendResponse(res, {
    httpStatusCode: status13.CREATED,
    success: true,
    message: "Admin created successfully",
    data: result
  });
});
var getAllUsers2 = catchAsync(async (req, res) => {
  const queryParams = {};
  for (const [key, value] of Object.entries(req.query)) {
    if (typeof value === "string") queryParams[key] = value;
  }
  const result = await UserService.getAllUsers(queryParams);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Users fetched successfully",
    data: result.data,
    meta: result.meta
  });
});
var updateUserStatus2 = catchAsync(async (req, res) => {
  const userId = req.params["userId"];
  const { status: newStatus } = req.body;
  const result = await UserService.updateUserStatus(userId, newStatus);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "User status updated successfully",
    data: result
  });
});
var getMe4 = catchAsync(async (req, res) => {
  const result = await UserService.getMe(req.user.userId);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "User profile fetched successfully",
    data: result
  });
});
var updateMe2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await UserService.updateMe(req.user.userId, payload);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Profile updated successfully",
    data: result
  });
});
var getUserById2 = catchAsync(async (req, res) => {
  const id = req.params["id"];
  const result = await UserService.getUserById(id);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "User fetched successfully",
    data: result
  });
});
var updateUserProfileById2 = catchAsync(async (req, res) => {
  const id = req.params["id"];
  const payload = req.body;
  const result = await UserService.updateUserProfileById(id, payload);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "User profile updated successfully",
    data: result
  });
});
var updateUser = catchAsync(async (req, res) => {
  const id = req.params["id"];
  const result = await UserService.updateUserById(id, req.body);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "User updated successfully",
    data: result
  });
});
var deleteUser = catchAsync(async (req, res) => {
  const id = req.params["id"];
  await UserService.deleteUserById(id);
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "User deleted successfully"
  });
});
var UserController = {
  createAdmin: createAdmin2,
  getAllUsers: getAllUsers2,
  updateUserStatus: updateUserStatus2,
  getMe: getMe4,
  updateMe: updateMe2,
  getUserById: getUserById2,
  updateUserProfileById: updateUserProfileById2,
  updateUser,
  deleteUser
};

// src/app/modules/user/user.validation.ts
import z6 from "zod";
var createAdminZodSchema = z6.object({
  email: z6.email("Invalid email address"),
  password: z6.string().min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters"),
  name: z6.string().min(3, "Name must be at least 3 characters").max(50, "Name must be at most 50 characters"),
  role: z6.enum(["ADMIN", "SUPER_ADMIN"], { error: "Role must be ADMIN or SUPER_ADMIN" })
});
var updateMeZodSchema = z6.object({
  name: z6.string().min(2, "Name must be at least 2 characters").max(100),
  image: z6.string().url("Image must be a valid URL").nullable().optional()
});

// src/app/modules/user/user.router.ts
var router9 = Router9();
router9.get(
  "/me",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  UserController.getMe
);
router9.patch(
  "/me",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateMeZodSchema),
  UserController.updateMe
);
router9.post(
  "/create-admin",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(createAdminZodSchema),
  UserController.createAdmin
);
router9.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserController.getAllUsers
);
router9.patch(
  "/:userId/status",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserController.updateUserStatus
);
router9.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserController.getUserById
);
router9.patch(
  "/:id/profile",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserController.updateUserProfileById
);
router9.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserController.updateUser
);
router9.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserController.deleteUser
);
var UserRoutes = router9;

// src/app/modules/watchlist/watchlist.route.ts
import { Router as Router10 } from "express";

// src/app/modules/watchlist/watchlist.controller.ts
import httpStatus12 from "http-status";

// src/app/modules/watchlist/watchlist.service.ts
import httpStatus11 from "http-status";
var addToWatchlist = async (userId, mediaId) => {
  if (!mediaId) {
    throw new AppError_default(httpStatus11.BAD_REQUEST, "mediaId is required");
  }
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media) {
    throw new AppError_default(httpStatus11.NOT_FOUND, "Media not found");
  }
  const existing = await prisma.watchlist.findUnique({
    where: { userId_mediaId: { userId, mediaId } }
  });
  if (existing) {
    throw new AppError_default(httpStatus11.CONFLICT, "Media already in watchlist");
  }
  const watchlistItem = await prisma.watchlist.create({
    data: { userId, mediaId },
    include: {
      media: {
        include: {
          genres: { include: { genre: true } }
        }
      }
    }
  });
  return {
    ...watchlistItem,
    media: {
      ...watchlistItem.media,
      genres: watchlistItem.media.genres.map((mg) => mg.genre)
    }
  };
};
var removeFromWatchlist = async (userId, idParam) => {
  if (!idParam) {
    throw new AppError_default(httpStatus11.BAD_REQUEST, "mediaId or watchlist item id is required");
  }
  let existing = await prisma.watchlist.findUnique({
    where: { userId_mediaId: { userId, mediaId: idParam } }
  });
  if (!existing) {
    existing = await prisma.watchlist.findFirst({
      where: { id: idParam, userId }
    });
  }
  if (!existing) {
    throw new AppError_default(httpStatus11.NOT_FOUND, "Media not found in watchlist");
  }
  await prisma.watchlist.delete({ where: { id: existing.id } });
};
var getMyWatchlist = async (userId) => {
  const items = await prisma.watchlist.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      media: {
        include: {
          genres: { include: { genre: true } }
        }
      }
    }
  });
  return items.map((item) => ({
    id: item.id,
    addedAt: item.createdAt,
    media: {
      ...item.media,
      genres: item.media.genres.map((mg) => mg.genre)
    }
  }));
};
var checkWatchlistStatus = async (userId, mediaId) => {
  if (!mediaId) {
    throw new AppError_default(httpStatus11.BAD_REQUEST, "mediaId is required");
  }
  const existing = await prisma.watchlist.findUnique({
    where: { userId_mediaId: { userId, mediaId } }
  });
  return { inWatchlist: !!existing };
};
var clearWatchlist = async (userId) => {
  await prisma.watchlist.deleteMany({ where: { userId } });
};
var WatchlistService = {
  addToWatchlist,
  removeFromWatchlist,
  getMyWatchlist,
  checkWatchlistStatus,
  clearWatchlist
};

// src/app/modules/watchlist/watchlist.controller.ts
var resolveMediaId = (req) => {
  const fromParams = req.params.mediaId;
  const fromBody = req.body?.mediaId ?? req.body?.id;
  const rawFromQuery = req.query.mediaId ?? req.query.id;
  const fromQuery = Array.isArray(rawFromQuery) ? rawFromQuery[0] : rawFromQuery;
  return [fromParams, fromBody, fromQuery].find((value) => typeof value === "string" && value.trim().length > 0);
};
var addToWatchlist2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const mediaId = resolveMediaId(req);
  if (!mediaId) {
    sendResponse(res, {
      httpStatusCode: httpStatus12.BAD_REQUEST,
      success: false,
      message: "mediaId is required"
    });
    return;
  }
  const result = await WatchlistService.addToWatchlist(userId, mediaId);
  sendResponse(res, {
    httpStatusCode: httpStatus12.CREATED,
    success: true,
    message: "Media added to watchlist",
    data: result
  });
});
var removeFromWatchlist2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const mediaId = resolveMediaId(req);
  if (!mediaId) {
    sendResponse(res, {
      httpStatusCode: httpStatus12.BAD_REQUEST,
      success: false,
      message: "mediaId or watchlist item id is required"
    });
    return;
  }
  await WatchlistService.removeFromWatchlist(userId, mediaId);
  sendResponse(res, {
    httpStatusCode: httpStatus12.OK,
    success: true,
    message: "Media removed from watchlist"
  });
});
var getMyWatchlist2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await WatchlistService.getMyWatchlist(userId);
  sendResponse(res, {
    httpStatusCode: httpStatus12.OK,
    success: true,
    message: "Watchlist fetched successfully",
    data: result
  });
});
var checkWatchlistStatus2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const mediaId = resolveMediaId(req);
  if (!mediaId) {
    sendResponse(res, {
      httpStatusCode: httpStatus12.BAD_REQUEST,
      success: false,
      message: "mediaId is required"
    });
    return;
  }
  const result = await WatchlistService.checkWatchlistStatus(userId, mediaId);
  sendResponse(res, {
    httpStatusCode: httpStatus12.OK,
    success: true,
    message: "Watchlist status fetched",
    data: result
  });
});
var clearWatchlist2 = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  await WatchlistService.clearWatchlist(userId);
  sendResponse(res, {
    httpStatusCode: httpStatus12.OK,
    success: true,
    message: "Watchlist cleared successfully"
  });
});
var WatchlistController = {
  addToWatchlist: addToWatchlist2,
  removeFromWatchlist: removeFromWatchlist2,
  getMyWatchlist: getMyWatchlist2,
  checkWatchlistStatus: checkWatchlistStatus2,
  clearWatchlist: clearWatchlist2
};

// src/app/modules/watchlist/watchlist.route.ts
var router10 = Router10();
router10.get("/", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.getMyWatchlist);
router10.post("/", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.addToWatchlist);
router10.delete("/", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.removeFromWatchlist);
router10.delete("/clear", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.clearWatchlist);
router10.get("/:mediaId/status", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.checkWatchlistStatus);
router10.get("/status", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.checkWatchlistStatus);
router10.post("/:mediaId", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.addToWatchlist);
router10.delete("/:mediaId", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), WatchlistController.removeFromWatchlist);
var WatchlistRoutes = router10;

// src/app/modules/chat/chat.route.ts
import express from "express";

// src/app/modules/chat/chat.service.ts
var createSession = async (userId) => {
  const activeSession = await prisma.chatSession.findFirst({
    where: { userId, status: ChatStatus.OPEN },
    include: { messages: true }
  });
  if (activeSession) {
    return activeSession;
  }
  const newSession = await prisma.chatSession.create({
    data: { userId },
    include: { messages: true }
  });
  return newSession;
};
var getMySessions = async (userId) => {
  const result = await prisma.chatSession.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } }
  });
  return result;
};
var getAllSessions = async () => {
  const result = await prisma.chatSession.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 }
    }
  });
  return result;
};
var getSessionMessages = async (sessionId) => {
  const result = await prisma.chatMessage.findMany({
    where: { chatSessionId: sessionId },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, name: true, role: true } } }
  });
  return result;
};
var sendMessage = async (senderId, payload) => {
  const result = await prisma.$transaction(async (tx) => {
    const message = await tx.chatMessage.create({
      data: {
        chatSessionId: payload.chatSessionId,
        senderId,
        content: payload.content,
        imageUrl: payload.imageUrl
      },
      include: { sender: { select: { id: true, name: true, role: true } } }
    });
    await tx.chatSession.update({
      where: { id: payload.chatSessionId },
      data: { updatedAt: /* @__PURE__ */ new Date() }
    });
    return message;
  });
  return result;
};
var updateSessionStatus = async (sessionId, status14) => {
  const result = await prisma.chatSession.update({
    where: { id: sessionId },
    data: { status: status14 }
  });
  return result;
};
var ChatService = {
  createSession,
  getMySessions,
  getAllSessions,
  getSessionMessages,
  sendMessage,
  updateSessionStatus
};

// src/app/modules/chat/chat.controller.ts
import httpStatus13 from "http-status";
var createSession2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const result = await ChatService.createSession(userId);
  sendResponse(res, {
    httpStatusCode: httpStatus13.CREATED,
    success: true,
    message: "Chat session created successfully",
    data: result
  });
});
var getMySessions2 = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const result = await ChatService.getMySessions(userId);
  sendResponse(res, {
    httpStatusCode: httpStatus13.OK,
    success: true,
    message: "Chat sessions fetched successfully",
    data: result
  });
});
var getAllSessions2 = catchAsync(async (req, res) => {
  const result = await ChatService.getAllSessions();
  sendResponse(res, {
    httpStatusCode: httpStatus13.OK,
    success: true,
    message: "All chat sessions fetched successfully",
    data: result
  });
});
var getSessionMessages2 = catchAsync(async (req, res) => {
  const sessionId = req.params.sessionId;
  const result = await ChatService.getSessionMessages(sessionId);
  sendResponse(res, {
    httpStatusCode: httpStatus13.OK,
    success: true,
    message: "Messages fetched successfully",
    data: result
  });
});
var sendMessage2 = catchAsync(async (req, res) => {
  const senderId = req.user?.userId;
  const result = await ChatService.sendMessage(senderId, req.body);
  sendResponse(res, {
    httpStatusCode: httpStatus13.CREATED,
    success: true,
    message: "Message sent successfully",
    data: result
  });
});
var updateSessionStatus2 = catchAsync(async (req, res) => {
  const sessionId = req.params.sessionId;
  const status14 = req.body.status;
  const result = await ChatService.updateSessionStatus(sessionId, status14);
  sendResponse(res, {
    httpStatusCode: httpStatus13.OK,
    success: true,
    message: "Session status updated successfully",
    data: result
  });
});
var ChatController = {
  createSession: createSession2,
  getMySessions: getMySessions2,
  getAllSessions: getAllSessions2,
  getSessionMessages: getSessionMessages2,
  sendMessage: sendMessage2,
  updateSessionStatus: updateSessionStatus2
};

// src/app/modules/chat/chat.route.ts
var router11 = express.Router();
router11.post("/session", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), ChatController.createSession);
router11.get("/my-sessions", checkAuth(Role.USER), ChatController.getMySessions);
router11.get("/admin-sessions", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ChatController.getAllSessions);
router11.get("/session/:sessionId/messages", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), ChatController.getSessionMessages);
router11.post("/message", checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN), ChatController.sendMessage);
router11.patch("/session/:sessionId/status", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), ChatController.updateSessionStatus);
var ChatRoutes = router11;

// src/app/routes/index.ts
var router12 = Router11();
router12.use("/auth", AuthRoutes);
router12.use("/content", ContentRoutes);
router12.use("/users", UserRoutes);
router12.use("/media", MediaRoutes);
router12.use("/media", PurchaseRoutes);
router12.use("/admin/payments", AdminPaymentRoutes);
router12.use("/genres", GenreRoutes);
router12.use("/watchlist", WatchlistRoutes);
router12.use("/reviews", ReviewRoutes);
router12.use("/subscriptions", SubscriptionRoutes);
router12.use("/chat", ChatRoutes);
var IndexRoutes = router12;

// src/app.ts
var app = express2();
app.set("query parser", (str) => qs.parse(str));
app.set("view engine", "ejs");
app.set("views", path3.resolve(process.cwd(), "src/app/templates"));
app.use(
  cors({
    origin: [envVars.FRONTEND_URL, envVars.BETTER_AUTH_URL, "http://localhost:3000", "http://localhost:5000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use("/api/auth", toNodeHandler(auth));
app.post("/api/v1/stripe/webhook", express2.raw({ type: "application/json" }), PurchaseController.stripeWebhook);
app.use(express2.urlencoded({ extended: true }));
app.use(express2.json());
app.use(cookieParser());
app.use("/api/v1", IndexRoutes);
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CineTube API is running"
  });
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;
export {
  app_default as default
};
