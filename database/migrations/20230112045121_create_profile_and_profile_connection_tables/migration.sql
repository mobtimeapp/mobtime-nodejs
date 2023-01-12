-- CreateTable
CREATE TABLE "Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT
);

-- CreateTable
CREATE TABLE "ProfileConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "connectionId" TEXT NOT NULL,
    "timerId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_externalId_key" ON "Profile"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileConnection_connectionId_timerId_key" ON "ProfileConnection"("connectionId", "timerId");
