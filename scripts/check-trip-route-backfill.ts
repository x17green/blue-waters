import { prisma } from '../src/lib/prisma.client'

async function main() {
  const trips = await prisma.trip.findMany({
    include: { schedules: { select: { departurePort: true, arrivalPort: true, startTime: true } } },
  })

  const missing = trips.filter(t => {
    const hasSchedulePorts = (t.schedules || []).some(s => s.departurePort && s.arrivalPort)
    return hasSchedulePorts && (!t.departurePort || !t.arrivalPort)
  })

  if (missing.length === 0) {
    console.log('✅ All trips with schedule ports have trip-level route backfilled')
  } else {
    console.log('⚠️  Trips missing backfilled route fields:')
    missing.forEach(t => console.log(` - ${t.id} (${t.title})`))
    process.exitCode = 2
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
