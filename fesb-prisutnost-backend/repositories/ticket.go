package repositories

import (
	"context"

	"github.com/mathvaillant/ticket-booking-project-v0/models"
	"gorm.io/gorm"
)

type AttendanceRepository struct {
	db *gorm.DB
}

func (r *AttendanceRepository) GetMany(ctx context.Context, userId uint) ([]*models.Attendance, error) {
	attendances := []*models.Attendance{}

	res := r.db.Model(&models.Attendance{}).Where("user_id = ?", userId).Preload("Event").Order("updated_at desc").Find(&attendances)

	if res.Error != nil {
		return nil, res.Error
	}

	return attendances, nil
}

func (r *AttendanceRepository) GetOne(ctx context.Context, userId uint, attendanceId uint) (*models.Attendance, error) {
	attendance := &models.Attendance{}

	res := r.db.Model(attendance).Where("id = ?", attendanceId).Where("user_id = ?", userId).Preload("Event").First(attendance)

	if res.Error != nil {
		return nil, res.Error
	}

	return attendance, nil
}

func (r *AttendanceRepository) CreateOne(ctx context.Context, userId uint, attendance *models.Attendance) (*models.Attendance, error) {
	attendance.UserID = userId

	res := r.db.Model(attendance).Create(attendance)

	if res.Error != nil {
		return nil, res.Error
	}

	return r.GetOne(ctx, userId, attendance.ID)
}

func (r *AttendanceRepository) UpdateOne(ctx context.Context, userId uint, attendanceId uint, updateData map[string]interface{}) (*models.Attendance, error) {
	attendance := &models.Attendance{}

	updateRes := r.db.Model(attendance).Where("id = ?", attendanceId).Updates(updateData)

	if updateRes.Error != nil {
		return nil, updateRes.Error
	}

	return r.GetOne(ctx, userId, attendanceId)
}

func NewAttendanceRepository(db *gorm.DB) models.AttendanceRepository {
	return &AttendanceRepository{
		db: db,
	}
}
