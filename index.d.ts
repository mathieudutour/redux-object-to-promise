/// <reference types="redux" />

export = ReduxObjectToPromise

declare namespace ReduxObjectToPromise {
  export default function(options?: {
    keyIn?: string
    keyOut?: string
    axiosOptions?: any
    tokenOptions?: {
      storage?: {
        getItem: (key: string) => string | null | Promise<string | null>,
        setItem: (key: string, data: string) => void | Promise<void>,
        removeItem: (key: string) => void | Promise<void>,
      },
      key?: string
    }
  }): Redux.Middleware
}
