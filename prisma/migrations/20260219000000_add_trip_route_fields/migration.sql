-- Add canonical route fields to Trip
ALTER TABLE "Trip" ADD COLUMN "departurePort" TEXT;
ALTER TABLE "Trip" ADD COLUMN "arrivalPort" TEXT;
ALTER TABLE "Trip" ADD COLUMN "routeName" TEXT;
