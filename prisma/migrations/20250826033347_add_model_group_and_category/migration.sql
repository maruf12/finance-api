-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "userUsername" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "userUsername" VARCHAR(100) NOT NULL,
    "groupId" TEXT NOT NULL,
    "categoryId" TEXT,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "groups_userUsername_name_key" ON "groups"("userUsername", "name");

-- CreateIndex
CREATE INDEX "categories_groupId_idx" ON "categories"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_groupId_name_key" ON "categories"("groupId", "name");

-- CreateIndex
CREATE INDEX "expenses_userUsername_tanggal_idx" ON "expenses"("userUsername", "tanggal");

-- CreateIndex
CREATE INDEX "expenses_groupId_idx" ON "expenses"("groupId");

-- CreateIndex
CREATE INDEX "expenses_categoryId_idx" ON "expenses"("categoryId");

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_userUsername_fkey" FOREIGN KEY ("userUsername") REFERENCES "users"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
