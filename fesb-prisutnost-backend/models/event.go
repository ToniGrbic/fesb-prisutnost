package models

import (
	"context"
	"time"

	"gorm.io/gorm"
)

type Event struct {
	ID                    uint      `json:"id" gorm:"primarykey"`
	Name                  string    `json:"name"`
	Location              string    `json:"location"`
	TotalAttendancesPurchased int64     `json:"totalAttendancesPurchased" gorm:"-"`
	TotalAttendancesEntered   int64     `json:"totalAttendancesEntered" gorm:"-"`
	Date                  time.Time `json:"date"`
	CreatedAt             time.Time `json:"createdAt"`
	UpdatedAt             time.Time `json:"updatedAt"`
}

type EventRepository interface {
	GetMany(ctx context.Context) ([]*Event, error)
	GetOne(ctx context.Context, eventId uint) (*Event, error)
	CreateOne(ctx context.Context, event *Event) (*Event, error)
	UpdateOne(ctx context.Context, eventId uint, updateData map[string]interface{}) (*Event, error)
	DeleteOne(ctx context.Context, eventId uint) error
}

func (e *Event) AfterFind(db *gorm.DB) (err error) {
	baseQuery := db.Model(&Attendance{}).Where(&Attendance{EventID: e.ID})

	if res := baseQuery.Count(&e.TotalAttendancesPurchased); res.Error != nil {
		return res.Error
	}
	if res := baseQuery.Where("entered = ?", true).Count(&e.TotalAttendancesEntered); res.Error != nil {
		return res.Error
	}
	return nil
}
