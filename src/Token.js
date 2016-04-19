export default ({storage = window.localStorage, key = 'token-key'}) => {
  let token = storage.getItem(key)
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
