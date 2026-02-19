import { prisma } from '../src/lib/prisma.client'

async function main() {
  console.log('🔁 Running trip-level route backfill (earliest schedule → trip)')
  const sql = `
    UPDATE "Trip" t
    SET "departurePort" = s."departurePort",
        "arrivalPort" = s."arrivalPort",
        "routeName" = CASE
          WHEN s."departurePort" IS NOT NULL AND s."arrivalPort" IS NOT NULL THEN s."departurePort" || ' → ' || s."arrivalPort"
          ELSE COALESCE(s."departurePort", s."arrivalPort")
        END
    FROM (
      SELECT DISTINCT ON ("tripId") "tripId" AS tid, "departurePort", "arrivalPort"
      FROM "TripSchedule"
      WHERE "departurePort" IS NOT NULL OR "arrivalPort" IS NOT NULL
      ORDER BY "tripId", "startTime" ASC
    ) s
    WHERE t.id = s.tid AND (t."departurePort" IS NULL OR t."arrivalPort" IS NULL);
  `

  const result = await prisma.$executeRawUnsafe(sql)
  console.log(`✅ Backfill SQL executed, rows affected: ${result}`)
}

main().catch(err => {
  console.error('Backfill failed:', err)
  process.exit(1)
})
