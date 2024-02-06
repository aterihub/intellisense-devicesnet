-- CreateIndex
CREATE INDEX "RequestLogs_createdAt_idx" ON "RequestLogs"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "RequestLogs_status_idx" ON "RequestLogs"("status");

-- CreateIndex
CREATE INDEX "RequestLogs_user_idx" ON "RequestLogs"("user");

-- CreateIndex
CREATE INDEX "RequestLogs_status_user_createdAt_idx" ON "RequestLogs"("status", "user", "createdAt");
