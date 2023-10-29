-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedpassword" TEXT NOT NULL,
    "hshedRefreshToken" TEXT,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "realtor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "firma_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "reg_data" TIMESTAMP(3) NOT NULL,
    "deactivate_date" TIMESTAMP(3) NOT NULL,
    "photo_url" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "realtor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");
