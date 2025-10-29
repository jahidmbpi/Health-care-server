/*
  Warnings:

  - You are about to drop the column `contactNamber` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `contactNamber` on the `doctors` table. All the data in the column will be lost.
  - Added the required column `contactNumber` to the `doctors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "contactNamber",
ADD COLUMN     "contactNumber" TEXT;

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "contactNamber",
ADD COLUMN     "contactNumber" TEXT NOT NULL;
