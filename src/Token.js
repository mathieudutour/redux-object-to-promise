export default ({storage = window.localStorage, key = 'token-key'} = {}) => {
  let token = null
  let ready = false
  const getter = storage.getItem(key)
  if (typeof getter === 'string') {
    ready = true
    token = getter
  } else if (getter && getter.then) {
    getter.then((res) => {
      token = res
      ready = true
    })
  }
  return {
    set (t) {
      token = t
      return storage.setItem(key, t || '')
    },
    get () {
      if (ready) {
        return token
      }
      return storage.getItem(key)
    },
    remove () {
      token = null
      return storage.removeItem(key)
    }
  }
}
