-- Migration: add_passenger_email_bookingitem
-- This migration adds a nullable passengerEmail column to BookingItem for guest checkout support.

ALTER TABLE "BookingItem" ADD COLUMN "passengerEmail" TEXT;
