/*
  Warnings:

  - A unique constraint covering the columns `[userId,street,city,state]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_street_city_state_key" ON "Address"("userId", "street", "city", "state");
