/*
  Warnings:

  - A unique constraint covering the columns `[attendanceCode]` on the table `attendanceSessions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_AttendanceSessionId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "attendanceSessions_attendanceCode_key" ON "attendanceSessions"("attendanceCode");

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_AttendanceSessionId_fkey" FOREIGN KEY ("AttendanceSessionId") REFERENCES "attendanceSessions"("attendanceCode") ON DELETE RESTRICT ON UPDATE CASCADE;
