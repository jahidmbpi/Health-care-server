/*
  Warnings:

  - You are about to drop the column `contactNimber` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `contactNimber` on the `doctors` table. All the data in the column will be lost.
  - Added the required column `contactNamber` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactNamber` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "contactNimber",
ADD COLUMN     "contactNamber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "contactNimber",
ADD COLUMN     "contactNamber" TEXT NOT NULL;
