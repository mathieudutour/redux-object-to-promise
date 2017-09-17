declare module 'redux-object-to-promise' {
  import { Middleware } from 'redux'
  export default function(options?: {
    keyIn?: string
    keyOut?: string
    axiosOptions?: any
    tokenOptions?: {
      storage?: {
        getItem: (key: string) => string | null | Promise<string | null>
        setItem: (key: string, data: string) => void | Promise<void>
        removeItem: (key: string) => void | Promise<void>
      }
      key?: string
    }
  }): Middleware
}
