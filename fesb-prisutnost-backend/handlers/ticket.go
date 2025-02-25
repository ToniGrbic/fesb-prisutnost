package handlers

import (
	"context"
	"fmt"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/mathvaillant/ticket-booking-project-v0/models"
	"github.com/skip2/go-qrcode"
)

type AttendanceHandler struct {
	repository models.AttendanceRepository
}

func (h *AttendanceHandler) GetMany(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	userId := uint(ctx.Locals("userId").(float64))

	attendances, err := h.repository.GetMany(context, userId)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status":  "success",
		"message": "",
		"data":    attendances,
	})
}

func (h *AttendanceHandler) GetOne(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	attendanceId, _ := strconv.Atoi(ctx.Params("attendanceId"))
	userId := uint(ctx.Locals("userId").(float64))

	attendance, err := h.repository.GetOne(context, userId, uint(attendanceId))

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": err.Error(),
		})
	}

	var QRCode []byte
	QRCode, err = qrcode.Encode(
		fmt.Sprintf("attendanceId:%v,ownerId:%v", attendanceId, userId),
		qrcode.Medium,
		256,
	)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status":  "success",
		"message": "",
		"data": &fiber.Map{
			"attendance": attendance,
			"qrcode": QRCode,
		},
	})
}

func (h *AttendanceHandler) CreateOne(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	attendance := &models.Attendance{}
	userId := uint(ctx.Locals("userId").(float64))

	if err := ctx.BodyParser(attendance); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(&fiber.Map{
			"status":  "fail",
			"message": err.Error(),
			"data":    nil,
		})
	}

	attendance, err := h.repository.CreateOne(context, userId, attendance)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": err.Error(),
			"data":    nil,
		})
	}

	return ctx.Status(fiber.StatusCreated).JSON(&fiber.Map{
		"status":  "success",
		"message": "Attendance created",
		"data":    attendance,
	})
}

func (h *AttendanceHandler) ValidateOne(ctx *fiber.Ctx) error {
	context, cancel := context.WithTimeout(context.Background(), time.Duration(5*time.Second))
	defer cancel()

	validateBody := &models.ValidateAttendance{}

	if err := ctx.BodyParser(validateBody); err != nil {
		return ctx.Status(fiber.StatusUnprocessableEntity).JSON(&fiber.Map{
			"status":  "fail",
			"message": err.Error(),
			"data":    nil,
		})
	}

	validateData := make(map[string]interface{})
	validateData["entered"] = true

	attendance, err := h.repository.UpdateOne(context, validateBody.OwnerId, validateBody.AttendanceId, validateData)

	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(&fiber.Map{
			"status":  "fail",
			"message": err.Error(),
			"data":    nil,
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(&fiber.Map{
		"status":  "success",
		"message": "Welcome to the show!",
		"data":    attendance,
	})
}

func NewAttendanceHandler(router fiber.Router, repository models.AttendanceRepository) {
	handler := &AttendanceHandler{
		repository: repository,
	}

	router.Get("/", handler.GetMany)
	router.Post("/", handler.CreateOne)
	router.Get("/:attendanceId", handler.GetOne)
	router.Post("/validate", handler.ValidateOne)
}
