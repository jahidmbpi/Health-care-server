/*
  Warnings:

  - You are about to drop the column `Time` on the `schedule` table. All the data in the column will be lost.
  - You are about to drop the column `endDateTstartDateime` on the `schedule` table. All the data in the column will be lost.
  - Added the required column `endDateTime` to the `schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDateTime` to the `schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schedule" DROP COLUMN "Time",
DROP COLUMN "endDateTstartDateime",
ADD COLUMN     "endDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL;
