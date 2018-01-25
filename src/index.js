import axios from 'axios'
import Token from './Token'

export default ({
  keyIn = 'promise',
  keyOut = 'promise',
  axiosOptions = {},
  tokenOptions = {}
} = {}) => {
  const token = new Token(tokenOptions)

  return () => next => action => {
    // check if we don't need to transform the promise
    if (!action.meta || !action.meta[keyIn] || typeof action.meta[keyIn] !== 'object') {
      return next(action)
    }

    const {
      method = 'get',
      headers = {},
      catchToken = false,
      removeToken = false,
      authenticated = true,
      ...rest
    } = action.meta[keyIn]

    const {transformResponse = [], timeout, ...restOfAxiosOptions} = axiosOptions

    let promise = Promise.resolve()

    if (authenticated) {
      const _token = token.get()
      if (_token && _token.then) {
        promise = _token.then((accessToken) => {
          headers['x-access-token'] = accessToken
        })
      } else {
        headers['x-access-token'] = _token
      }
    }

    let finished = false
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()

    if (timeout > 0) {
      setTimeout(() => {
        if (!finished) {
          source.cancel('Timeout of ' + timeout + 'ms exceeded.')
        }
      }, timeout)
    }

    promise = promise.then(() => axios({
      ...restOfAxiosOptions,
      method: method.toLowerCase(),
      cancelToken: source.token,
      headers,
      timeout,
      transformResponse: [data => {
        if (removeToken) {
          token.remove()
        }
        try {
          const parsedData = JSON.parse(data)
          if (catchToken && parsedData && parsedData.token) {
            token.set(parsedData.token)
          }
          return parsedData
        } catch (e) {
          return data
        }
      }, ...transformResponse],
      ...rest
    }).then(res => {
      finished = true
      return Promise.resolve(res)
    }).catch(err => {
      finished = true
      throw err
    }))

    const actionToDispatch = {
      ...action,
      meta: {
        ...action.meta,
        [keyOut]: promise
      }
    }

    if (keyOut !== keyIn) {
      delete actionToDispatch.meta[keyIn]
    }

    return next(actionToDispatch)
  }
}
