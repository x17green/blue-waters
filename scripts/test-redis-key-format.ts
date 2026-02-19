function buildRedisKey(prefix: string, ...parts: string[]) {
  return [prefix, ...parts].join(':')
}

function assertEqual(a: any, b: any) {
  if (a !== b) {
    console.error('Assertion failed:', a, '!==', b)
    process.exitCode = 2
  }
}

const key = buildRedisKey('api_cache', 'trips', `cat:_`, `op:_`, `q:_`, `incSchedules:false`, `start:_`, `end:_`, `l:20`, `o:0`)
assertEqual(key, 'api_cache:trips:cat:_:op:_:q:_:incSchedules:false:start:_:end:_:l:20:o:0')

if (!process.exitCode) console.log('✅ Redis key format test passed')
