import { ApiResponse } from "./api";

export type EventResponse = ApiResponse<Event>;
export type EventListResponse = ApiResponse<Event[]>;

export type Event = {
  id: number;
  name: string;
  location: string;
  totalAttendancesPurchased: number;
  totalAttendancesEntered: number;
  date: string;
  createdAt: string;
  updatedAt: string;
};
