redux-object-to-promise
=============

[![build status](https://img.shields.io/travis/mathieudutour/redux-object-to-promise/master.svg?style=flat-square)](https://travis-ci.org/mathieudutour/redux-object-to-promise)
[![npm version](https://img.shields.io/npm/v/redux-object-to-promise.svg?style=flat-square)](https://www.npmjs.com/package/redux-object-to-promise)

Redux [middleware](http://rackt.github.io/redux/docs/advanced/Middleware.html) middleware to transform an object into a promise.

```js
npm install --save redux-optimist-promise
```

## Usage in middlewares

First, import the middleware creator and include it in `applyMiddleware` when creating the Redux store. **You need to call it as a function (See later why on configuration section below):**

```js
import middleware from 'redux-object-to-promise';

composeStoreWithMiddleware = applyMiddleware(
	middleware({
		keyIn = 'promise',
	  keyOut = 'promise',
	  axiosOptions = {},
	  tokenOptions = {storage = window.localStorage, key = 'token-key'}
	})
)(createStore);

```

To use the middleware, dispatch a `promise` property within the `meta` of the action.

Example:

The below action creator, when triggered `dispatch(addTodo('use redux-object-to-promise'))`

```js
export function addTodo(text) {
	return {
		type: 'ADD_TODO',
		payload: {
			text
		},
		meta: {
			promise: {url: '/todo', method: 'post', data: {text}},
		}
	};
}
```

will dispatch
```js
{
	type: 'ADD_TODO',
	payload: {
		text: 'use redux-optimist-promise'
	},
	optimist: axiosPromise({url: '/todo', method: 'post', data: {text}})
}
```

## License

  MIT
