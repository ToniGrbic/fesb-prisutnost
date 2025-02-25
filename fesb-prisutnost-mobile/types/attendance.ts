import { ApiResponse } from "./api";
import { Event } from "./event";

export type AttendanceResponse = ApiResponse<Attendance>;
export type AttendanceListResponse = ApiResponse<Attendance[]>;

export type Attendance = {
  id: number;
  eventId: number;
  userId: number;
  event: Event;
  entered: boolean;
  createdAt: string;
  updatedAt: string;
};
