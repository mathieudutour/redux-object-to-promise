export default ({storage = window.localStorage, key = 'token-key'}) => {
  let token = ''
  const getter = storage.getItem(key)
  if (typeof getter === 'string') {
    token = getter
  } else if (getter && getter.then) {
    getter.then((res) => { token = res })
  }
  return {
    set (t) {
      token = t
      return storage.setItem(key, t)
    },
    get () {
      return token
    }
  }
}
