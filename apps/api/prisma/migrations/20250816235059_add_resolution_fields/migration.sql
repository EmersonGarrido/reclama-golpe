-- CreateEnum
CREATE TYPE "public"."ScamCategory" AS ENUM ('PHISHING', 'PYRAMID_SCHEME', 'FAKE_ECOMMERCE', 'INVESTMENT_FRAUD', 'ROMANCE_SCAM', 'JOB_SCAM', 'LOTTERY_SCAM', 'TECH_SUPPORT', 'CRYPTOCURRENCY', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ScamStatus" AS ENUM ('PENDING', 'VERIFIED', 'UNVERIFIED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "public"."ReportReason" AS ENUM ('FALSE_INFORMATION', 'SPAM', 'INAPPROPRIATE_CONTENT', 'DUPLICATE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "bio" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "tips" TEXT[],
    "riskLevel" TEXT NOT NULL DEFAULT 'MEDIUM',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."scams" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "public"."ScamCategory" NOT NULL,
    "status" "public"."ScamStatus" NOT NULL DEFAULT 'PENDING',
    "categoryId" TEXT,
    "scammerName" TEXT,
    "scammerWebsite" TEXT,
    "scammerPhone" TEXT,
    "scammerEmail" TEXT,
    "amountLost" DOUBLE PRECISION,
    "dateOccurred" TIMESTAMP(3),
    "evidence" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "resolutionNote" TEXT,
    "resolutionLinks" TEXT[],
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "scams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "scamId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."likes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "scamId" TEXT NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reports" (
    "id" TEXT NOT NULL,
    "reason" "public"."ReportReason" NOT NULL,
    "details" TEXT,
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "scamId" TEXT NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."telegram_sessions" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "sessionString" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "apiId" TEXT,
    "apiHash" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "telegram_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "public"."categories"("slug");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "public"."categories"("slug");

-- CreateIndex
CREATE INDEX "categories_isActive_idx" ON "public"."categories"("isActive");

-- CreateIndex
CREATE INDEX "scams_category_idx" ON "public"."scams"("category");

-- CreateIndex
CREATE INDEX "scams_status_idx" ON "public"."scams"("status");

-- CreateIndex
CREATE INDEX "scams_createdAt_idx" ON "public"."scams"("createdAt");

-- CreateIndex
CREATE INDEX "scams_isResolved_idx" ON "public"."scams"("isResolved");

-- CreateIndex
CREATE INDEX "comments_scamId_idx" ON "public"."comments"("scamId");

-- CreateIndex
CREATE INDEX "likes_scamId_idx" ON "public"."likes"("scamId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_scamId_key" ON "public"."likes"("userId", "scamId");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "public"."reports"("status");

-- CreateIndex
CREATE UNIQUE INDEX "telegram_sessions_phoneNumber_key" ON "public"."telegram_sessions"("phoneNumber");

-- CreateIndex
CREATE INDEX "telegram_sessions_isActive_idx" ON "public"."telegram_sessions"("isActive");

-- CreateIndex
CREATE INDEX "telegram_sessions_phoneNumber_idx" ON "public"."telegram_sessions"("phoneNumber");

-- CreateIndex
CREATE INDEX "telegram_sessions_updatedAt_idx" ON "public"."telegram_sessions"("updatedAt");

-- AddForeignKey
ALTER TABLE "public"."scams" ADD CONSTRAINT "scams_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."scams" ADD CONSTRAINT "scams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_scamId_fkey" FOREIGN KEY ("scamId") REFERENCES "public"."scams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_scamId_fkey" FOREIGN KEY ("scamId") REFERENCES "public"."scams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_scamId_fkey" FOREIGN KEY ("scamId") REFERENCES "public"."scams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
