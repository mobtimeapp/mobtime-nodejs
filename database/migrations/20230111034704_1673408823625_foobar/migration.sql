-- CreateTable
CREATE TABLE "Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_externalId_key" ON "Profile"("externalId");
