import { ApiResponse } from "@/types/api";
import {
  Attendance,
  AttendanceListResponse,
  AttendanceResponse,
} from "@/types/attendance";
import { Api } from "./api";

async function createOne(eventId: number): Promise<AttendanceResponse> {
  return Api.post("/attendance", { eventId });
}

async function getOne(
  id: number
): Promise<ApiResponse<{ attendance: Attendance; qrcode: string }>> {
  return Api.get(`/attendance/${id}`);
}

async function getAll(): Promise<AttendanceListResponse> {
  return Api.get("/attendance");
}

async function validateOne(
  attendanceId: number,
  ownerId: number
): Promise<AttendanceResponse> {
  return Api.post("/attendance/validate", { attendanceId, ownerId });
}

const attendanceService = {
  createOne,
  getOne,
  getAll,
  validateOne,
};

export { attendanceService };
