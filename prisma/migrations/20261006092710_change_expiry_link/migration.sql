/*
  Warnings:

  - You are about to drop the column `expirationDate` on the `Link` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `uploadDate` on the `Link` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Link" DROP COLUMN "expirationDate",
ADD COLUMN     "duration" INTEGER NOT NULL,
DROP COLUMN "uploadDate",
ADD COLUMN     "uploadDate" TIMESTAMP(3) NOT NULL;
