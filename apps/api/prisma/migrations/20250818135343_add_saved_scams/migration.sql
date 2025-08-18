-- CreateTable
CREATE TABLE "public"."saved_scams" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "scamId" TEXT NOT NULL,

    CONSTRAINT "saved_scams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "saved_scams_userId_idx" ON "public"."saved_scams"("userId");

-- CreateIndex
CREATE INDEX "saved_scams_scamId_idx" ON "public"."saved_scams"("scamId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_scams_userId_scamId_key" ON "public"."saved_scams"("userId", "scamId");

-- AddForeignKey
ALTER TABLE "public"."saved_scams" ADD CONSTRAINT "saved_scams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."saved_scams" ADD CONSTRAINT "saved_scams_scamId_fkey" FOREIGN KEY ("scamId") REFERENCES "public"."scams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
