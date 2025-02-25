package models

import (
	"context"
	"time"
)

type Attendance struct {
	ID        uint      `json:"id" gorm:"primarykey"`
	EventID   uint      `json:"eventId"`
	UserID    uint      `json:"userId" gorm:"foreignkey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Event     Event     `json:"event" gorm:"foreignkey:EventID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Entered   bool      `json:"entered" default:"false"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type AttendanceRepository interface {
	GetMany(ctx context.Context, userId uint) ([]*Attendance, error)
	GetOne(ctx context.Context, userId uint, attendanceId uint) (*Attendance, error)
	CreateOne(ctx context.Context, userId uint, attendance *Attendance) (*Attendance, error)
	UpdateOne(ctx context.Context, userId uint, attendanceId uint, updateData map[string]interface{}) (*Attendance, error)
}

type ValidateAttendance struct {
	AttendanceId uint `json:"attendanceId"`
	OwnerId  uint `json:"ownerId"`
}
