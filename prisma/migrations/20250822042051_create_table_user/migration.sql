-- CreateTable
CREATE TABLE "users" (
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "token" VARCHAR(100),
    "email" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("username")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
