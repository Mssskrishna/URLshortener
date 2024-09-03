/*
  Warnings:

  - A unique constraint covering the columns `[shortUrl]` on the table `URLservice` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "URLservice_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "URLservice_shortUrl_key" ON "URLservice"("shortUrl");
