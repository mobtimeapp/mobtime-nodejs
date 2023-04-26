-- CreateTable
CREATE TABLE "Connection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "connectionId" TEXT NOT NULL,
    "timerId" TEXT NOT NULL,
    "connectedAt" DATETIME,
    "disconnectedAt" DATETIME,
    "pingedAt" DATETIME,
    "timeoutAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Connection_connectedAt_idx" ON "Connection"("connectedAt");

-- CreateIndex
CREATE INDEX "Connection_disconnectedAt_idx" ON "Connection"("disconnectedAt");

-- CreateIndex
CREATE INDEX "Connection_timeoutAt_idx" ON "Connection"("timeoutAt");

-- CreateIndex
CREATE INDEX "Connection_createdAt_idx" ON "Connection"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_connectionId_timerId_key" ON "Connection"("connectionId", "timerId");
