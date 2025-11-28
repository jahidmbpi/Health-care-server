/*
  Warnings:

  - You are about to drop the column `videoCallinId` on the `appoinment` table. All the data in the column will be lost.
  - You are about to drop the column `endDateTime` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `startDateTime` on the `schedule` table. All the data in the column will be lost.
  - Added the required column `videoCallingId` to the `appoinment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Time` to the `schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDateTstartDateime` to the `schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appoinment" DROP COLUMN "videoCallinId",
ADD COLUMN     "videoCallingId" TEXT NOT NULL,
ALTER COLUMN "paymentStatus" SET DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE "schedule" DROP COLUMN "endDateTime",
DROP COLUMN "startDateTime",
ADD COLUMN     "Time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "endDateTstartDateime" TIMESTAMP(3) NOT NULL;
