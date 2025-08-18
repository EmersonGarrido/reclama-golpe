-- DropForeignKey
ALTER TABLE "public"."reports" DROP CONSTRAINT "reports_userId_fkey";

-- AlterTable
ALTER TABLE "public"."reports" ADD COLUMN     "reporterEmail" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
