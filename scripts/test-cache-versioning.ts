(async function run() {
  try {
    const { getCacheVersion, bumpCacheVersion, buildVersionedRedisKey, redis } = await import('../src/lib/redis')
    const ns = 'api_cache:trips'
    console.log('initial version', await getCacheVersion(ns))
    await redis.del(`cache_version:${ns}`)
    let v = await getCacheVersion(ns)
    if (v !== 0) throw new Error(`expected 0 after deletion but got ${v}`)
    console.log('version reset to', v)
    await bumpCacheVersion(ns)
    v = await getCacheVersion(ns)
    console.log('version after bump', v)
    if (v !== 1) throw new Error('bumpCacheVersion did not increment correctly')
    const k1 = await buildVersionedRedisKey(ns, 'foo')
    await bumpCacheVersion(ns)
    const k2 = await buildVersionedRedisKey(ns, 'foo')
    if (k1 === k2) throw new Error('version not applied to key')
    console.log('versioned key difference validated:', k1, '→', k2)
    console.log('\n✅ Cache versioning helper test passed')
    process.exit(0)
  } catch (err) {
    console.error('\n❌ Cache versioning test failed')
    console.error(err)
    process.exit(2)
  }
})()