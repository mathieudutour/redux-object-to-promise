export default ({storage = window.localStorage, key = 'token-key'}) => {
  let token
  if (typeof storage.getItem(key) === 'string') {
    token = storage.getItem(key)
  } else {
    storage.getItem(key).then((res) => { token = res })
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
