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

    if (authenticated) {
      headers['x-access-token'] = token.get()
    }

    const {transformResponse = [], ...restOfAxiosOptions} = axiosOptions

    const promise = axios({
      ...restOfAxiosOptions,
      method: method.toLowerCase(),
      headers,
      transformResponse: [data => {
        if (removeToken) {
          token.set(null)
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
    })

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
