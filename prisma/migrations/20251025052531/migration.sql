-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF', 'DOCTOR', 'PATIENT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'DORMANT');

-- CreateEnum
CREATE TYPE "JOBTYPE" AS ENUM ('FULL', 'PART');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'SCHEDULED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'MOBILE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'UNPAID', 'PARTIAL', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('CONSULTATION', 'LAB_TEST', 'VACCINATION', 'PROCEDURE', 'PHARMACY', 'DIAGNOSIS', 'OTHER');

-- CreateEnum
CREATE TYPE "MeasurementType" AS ENUM ('WFA', 'HFA', 'HcFA');

-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('USER', 'AI');

-- CreateEnum
CREATE TYPE "ReminderMethod" AS ENUM ('EMAIL', 'SMS');

-- CreateEnum
CREATE TYPE "ReminderStatus" AS ENUM ('SENT', 'FAILED', 'PENDING');

-- CreateEnum
CREATE TYPE "BillingStatus" AS ENUM ('PENDING', 'PAID', 'INSURANCE_PENDING', 'DENIED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('APPOINTMENT_REMINDER', 'BILLING', 'GENERAL', 'SECURITY');

-- CreateEnum
CREATE TYPE "FeedingType" AS ENUM ('BREAST', 'FORMULA', 'MIXED');

-- CreateTable
CREATE TABLE "user" (
    "_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT,
    "displayUsername" TEXT,
    "role" TEXT,
    "banned" BOOLEAN,
    "banReason" TEXT,
    "banExpires" TIMESTAMP(3),
    "twoFactorEnabled" BOOLEAN,
    "password" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "clinics" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "clinics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinic_members" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'DOCTOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "doctorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clinic_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "_id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "account" (
    "_id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "verification" (
    "_id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "twoFactor" (
    "id" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "backupCodes" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "twoFactor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'MALE',
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "nutritionalStatus" TEXT,
    "address" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactNumber" TEXT,
    "relation" TEXT,
    "bloodGroup" TEXT,
    "allergies" TEXT,
    "medicalConditions" TEXT,
    "medicalHistory" TEXT,
    "image" TEXT,
    "colorCode" TEXT,
    "role" "Role",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "department" TEXT,
    "img" TEXT,
    "colorCode" TEXT,
    "availabilityStatus" TEXT,
    "type" "JOBTYPE" NOT NULL DEFAULT 'FULL',
    "role" "Role",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkingDays" (
    "id" SERIAL NOT NULL,
    "doctorId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkingDays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "department" TEXT,
    "img" TEXT,
    "licenseNumber" TEXT,
    "colorCode" TEXT,
    "hireDate" DATE DEFAULT CURRENT_TIMESTAMP,
    "salary" DOUBLE PRECISION,
    "role" "Role" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "serviceId" INTEGER,
    "syntheticKey" TEXT NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "status" "AppointmentStatus" DEFAULT 'PENDING',
    "type" TEXT NOT NULL,
    "note" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "billId" INTEGER,
    "patientId" TEXT NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "billDate" TIMESTAMP(3) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
    "status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "receiptNumber" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "method" "ReminderMethod" NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "status" "ReminderStatus" NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientBills" (
    "id" SERIAL NOT NULL,
    "billId" INTEGER NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientBills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabTest" (
    "id" SERIAL NOT NULL,
    "recordId" INTEGER NOT NULL,
    "testDate" TIMESTAMP(3) NOT NULL,
    "result" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT,
    "serviceId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalRecords" (
    "id" SERIAL NOT NULL,
    "patientId" TEXT NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "doctorId" TEXT NOT NULL,
    "treatmentPlan" TEXT,
    "prescriptions" TEXT,
    "labRequest" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalRecords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encounter" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "diagnosis" TEXT,
    "treatment" TEXT,
    "notes" TEXT,
    "medicalId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Encounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VitalSigns" (
    "id" TEXT NOT NULL,
    "encounterId" TEXT,
    "patientId" TEXT NOT NULL,
    "medicalId" INTEGER NOT NULL,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION,
    "systolic" INTEGER,
    "diastolic" INTEGER,
    "heartRate" INTEGER,
    "respiratoryRate" INTEGER,
    "oxygenSaturation" INTEGER,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VitalSigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Immunization" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "vaccine" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dose" TEXT,
    "lotNumber" TEXT,
    "administeredByStaffId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Immunization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GrowthChart" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "age" INTEGER NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "headCircumference" DOUBLE PRECISION,
    "percentileHeight" DOUBLE PRECISION,
    "percentileWeight" DOUBLE PRECISION,
    "percentileHead" DOUBLE PRECISION,

    CONSTRAINT "GrowthChart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedingLog" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "FeedingType" NOT NULL,
    "duration" INTEGER,
    "amount" DOUBLE PRECISION,
    "breast" TEXT,
    "notes" TEXT,

    CONSTRAINT "FeedingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Billing" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "appointmentId" INTEGER,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "BillingStatus" NOT NULL DEFAULT 'PENDING',
    "insurance" TEXT,
    "insuranceId" TEXT,
    "serviceDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Billing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnosis" (
    "id" SERIAL NOT NULL,
    "patientId" TEXT NOT NULL,
    "medicalId" INTEGER NOT NULL,
    "doctorId" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "notes" TEXT,
    "prescribedMedications" TEXT,
    "followUpPlan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Services" (
    "id" SERIAL NOT NULL,
    "serviceName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "category" "ServiceCategory",
    "duration" INTEGER,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" SERIAL NOT NULL,
    "medical_record_id" INTEGER NOT NULL,
    "doctorId" TEXT,
    "patientId" TEXT NOT NULL,
    "enconterId" TEXT NOT NULL,
    "medication_name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "instructions" TEXT,
    "issued_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "who_growth_standards" (
    "id" SERIAL NOT NULL,
    "age_in_months" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "measurement_type" "MeasurementType" NOT NULL,
    "l_value" DOUBLE PRECISION NOT NULL,
    "m_value" DOUBLE PRECISION NOT NULL,
    "s_value" DOUBLE PRECISION NOT NULL,
    "sd0" DOUBLE PRECISION NOT NULL,
    "sd1neg" DOUBLE PRECISION NOT NULL,
    "sd1pos" DOUBLE PRECISION NOT NULL,
    "sd2neg" DOUBLE PRECISION NOT NULL,
    "sd2pos" DOUBLE PRECISION NOT NULL,
    "sd3neg" DOUBLE PRECISION NOT NULL,
    "sd3pos" DOUBLE PRECISION NOT NULL,
    "sd4neg" DOUBLE PRECISION,
    "sd4pos" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "who_growth_standards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "todo" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClinicToPatient" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClinicToPatient_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ClinicToDoctor" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClinicToDoctor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ClinicToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClinicToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AppointmentToClinic" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AppointmentToClinic_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "clinics_name_key" ON "clinics"("name");

-- CreateIndex
CREATE INDEX "clinics_name_deletedAt_idx" ON "clinics"("name", "deletedAt");

-- CreateIndex
CREATE INDEX "clinic_members_doctorId_idx" ON "clinic_members"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "clinic_members_userId_clinicId_key" ON "clinic_members"("userId", "clinicId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- CreateIndex
CREATE INDEX "Patient_lastName_idx" ON "Patient"("lastName");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_email_key" ON "Doctor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_userId_key" ON "Doctor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkingDays_doctorId_day_key" ON "WorkingDays"("doctorId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_userId_key" ON "Staff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_syntheticKey_key" ON "Appointment"("syntheticKey");

-- CreateIndex
CREATE INDEX "Appointment_patientId_appointmentDate_idx" ON "Appointment"("patientId", "appointmentDate");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_appointmentId_key" ON "Payment"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Reminder_appointmentId_key" ON "Reminder"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "LabTest_recordId_key" ON "LabTest"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalRecords_appointmentId_key" ON "MedicalRecords"("appointmentId");

-- CreateIndex
CREATE INDEX "MedicalRecords_patientId_appointmentId_idx" ON "MedicalRecords"("patientId", "appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Encounter_medicalId_key" ON "Encounter"("medicalId");

-- CreateIndex
CREATE UNIQUE INDEX "VitalSigns_encounterId_key" ON "VitalSigns"("encounterId");

-- CreateIndex
CREATE UNIQUE INDEX "VitalSigns_medicalId_key" ON "VitalSigns"("medicalId");

-- CreateIndex
CREATE INDEX "Immunization_patientId_date_idx" ON "Immunization"("patientId", "date");

-- CreateIndex
CREATE INDEX "GrowthChart_patientId_date_idx" ON "GrowthChart"("patientId", "date");

-- CreateIndex
CREATE INDEX "FeedingLog_patientId_date_idx" ON "FeedingLog"("patientId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Billing_appointmentId_key" ON "Billing"("appointmentId");

-- CreateIndex
CREATE INDEX "Billing_patientId_status_idx" ON "Billing"("patientId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Diagnosis_medicalId_key" ON "Diagnosis"("medicalId");

-- CreateIndex
CREATE INDEX "Services_serviceName_idx" ON "Services"("serviceName");

-- CreateIndex
CREATE UNIQUE INDEX "prescriptions_medical_record_id_key" ON "prescriptions"("medical_record_id");

-- CreateIndex
CREATE UNIQUE INDEX "prescriptions_enconterId_key" ON "prescriptions"("enconterId");

-- CreateIndex
CREATE INDEX "_ClinicToPatient_B_index" ON "_ClinicToPatient"("B");

-- CreateIndex
CREATE INDEX "_ClinicToDoctor_B_index" ON "_ClinicToDoctor"("B");

-- CreateIndex
CREATE INDEX "_ClinicToUser_B_index" ON "_ClinicToUser"("B");

-- CreateIndex
CREATE INDEX "_AppointmentToClinic_B_index" ON "_AppointmentToClinic"("B");

-- AddForeignKey
ALTER TABLE "clinic_members" ADD CONSTRAINT "clinic_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic_members" ADD CONSTRAINT "clinic_members_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinic_members" ADD CONSTRAINT "clinic_members_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twoFactor" ADD CONSTRAINT "twoFactor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkingDays" ADD CONSTRAINT "WorkingDays_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientBills" ADD CONSTRAINT "PatientBills_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientBills" ADD CONSTRAINT "PatientBills_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabTest" ADD CONSTRAINT "LabTest_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabTest" ADD CONSTRAINT "LabTest_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MedicalRecords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecords" ADD CONSTRAINT "MedicalRecords_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecords" ADD CONSTRAINT "MedicalRecords_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_medicalId_fkey" FOREIGN KEY ("medicalId") REFERENCES "MedicalRecords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VitalSigns" ADD CONSTRAINT "VitalSigns_encounterId_fkey" FOREIGN KEY ("encounterId") REFERENCES "Encounter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VitalSigns" ADD CONSTRAINT "VitalSigns_medicalId_fkey" FOREIGN KEY ("medicalId") REFERENCES "MedicalRecords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Immunization" ADD CONSTRAINT "Immunization_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Immunization" ADD CONSTRAINT "Immunization_administeredByStaffId_fkey" FOREIGN KEY ("administeredByStaffId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GrowthChart" ADD CONSTRAINT "GrowthChart_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedingLog" ADD CONSTRAINT "FeedingLog_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Billing" ADD CONSTRAINT "Billing_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Billing" ADD CONSTRAINT "Billing_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_medicalId_fkey" FOREIGN KEY ("medicalId") REFERENCES "MedicalRecords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_enconterId_fkey" FOREIGN KEY ("enconterId") REFERENCES "Encounter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "MedicalRecords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClinicToPatient" ADD CONSTRAINT "_ClinicToPatient_A_fkey" FOREIGN KEY ("A") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClinicToPatient" ADD CONSTRAINT "_ClinicToPatient_B_fkey" FOREIGN KEY ("B") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClinicToDoctor" ADD CONSTRAINT "_ClinicToDoctor_A_fkey" FOREIGN KEY ("A") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClinicToDoctor" ADD CONSTRAINT "_ClinicToDoctor_B_fkey" FOREIGN KEY ("B") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClinicToUser" ADD CONSTRAINT "_ClinicToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClinicToUser" ADD CONSTRAINT "_ClinicToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentToClinic" ADD CONSTRAINT "_AppointmentToClinic_A_fkey" FOREIGN KEY ("A") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AppointmentToClinic" ADD CONSTRAINT "_AppointmentToClinic_B_fkey" FOREIGN KEY ("B") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
