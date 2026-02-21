(async function run() {
  try {
    const base = process.env.BASE_URL || 'http://localhost:3000'
    const tripsUrl = `${base}/api/trips?includeSchedules=true&limit=50&startDate=2026-02-19T00%3A00%3A00.000Z&endDate=2026-02-25T00%3A00%3A00.000Z`
    const prismaTestUrl = `${base}/api/test/prisma`

    // We'll fetch the first trip from the listing so we can test schedules/detail dynamically
    let schedulesUrl: string | null = null
    let tripDetailUrl: string | null = null
    const listResp = await fetch(tripsUrl)
    if (listResp.ok) {
      const listJson = await listResp.json()
      const firstTrip = listJson?.trips?.[0]
      if (firstTrip && firstTrip.id) {
        tripDetailUrl = `${base}/api/trips/${firstTrip.id}`
        schedulesUrl = `${tripDetailUrl}/schedules?startDate=2026-02-19T00%3A00%3A00.000Z&endDate=2026-02-20T00%3A00%3A00.000Z`
      }
    }

    async function resetCounter() {
      await fetch(prismaTestUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'reset' }) })
    }

    async function getCounter() {
      const r = await fetch(prismaTestUrl)
      const j = await r.json()
      return j.count || 0
    }

    async function checkNoDbOnConditional(url: string) {
      // warm cache & get ETag
      const first = await fetch(url)
      if (first.status !== 200) throw new Error(`warm request failed ${url} -> ${first.status}`)
      const etag = first.headers.get('etag')
      if (!etag) throw new Error(`no ETag for ${url}`)

      // reset counter then make conditional GET
      await resetCounter()
      const before = await getCounter()
      if (before !== 0) throw new Error('counter not reset')

      const cond = await fetch(url, { headers: { 'If-None-Match': etag } })
      if (cond.status !== 304) throw new Error(`conditional GET did not return 304 for ${url} (got ${cond.status})`)

      const after = await getCounter()
      if (after !== 0) throw new Error(`DB queries executed on cache-hit for ${url} (count=${after})`)
      console.log(`${url} -> conditional 304 produced NO DB queries (counter=${after})`)
      return true
    }

    // capture trip list + detail etags for later use when bumping
    const tripListResp = await fetch(tripsUrl)
    const tripListEtag = tripListResp.headers.get('etag') || ''
    let tripDetailEtag = ''
    if (tripDetailUrl) {
      const dresp = await fetch(tripDetailUrl)
      tripDetailEtag = dresp.headers.get('etag') || ''
    }

    await checkNoDbOnConditional(tripsUrl)
    if (schedulesUrl) await checkNoDbOnConditional(schedulesUrl)
    if (tripDetailUrl) await checkNoDbOnConditional(tripDetailUrl)

    // now simulate an invalidation bump (payload stays same) and ensure fallback ETag still prevents DB hit
    console.log('Bumping trips cache version to simulate write invalidation...')
    // call test helper route so we don't have to import TS modules in script
    await fetch(`${base}/api/test/cache-bump`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ namespace: 'api_cache:trips' }),
    })

    // conditional GET again using original etag
    if (tripDetailUrl) {
      await resetCounter()
      const conditional = await fetch(tripDetailUrl, { headers: { 'If-None-Match': tripDetailEtag } })
      if (conditional.status !== 304) throw new Error('fallback cache failed after version bump')
      const after = await getCounter()
      if (after !== 0) throw new Error('DB queries executed after version bump despite fallback (count='+after+')')
      console.log('version-bump fallback test passed for trip detail')
    }

    console.log('\n✅ ETag short-circuit NO-DB integration test passed')
    process.exit(0)
  } catch (err) {
    console.error('\n❌ ETag short-circuit NO-DB integration test failed')
    console.error(err)
    process.exit(2)
  }
})()
