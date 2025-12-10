export function uid(prefix = 'id') {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `${prefix}_${crypto.randomUUID()}`
    }
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const arr = new Uint32Array(2)
      crypto.getRandomValues(arr)
      return `${prefix}_${arr[0].toString(36)}${arr[1].toString(36)}`
    }
  } catch {}
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

export default uid

