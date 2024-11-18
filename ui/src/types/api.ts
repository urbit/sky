export interface HTTPRequest {
  url: string
  method: string
  headers: Record<string, string>
  body: string
}
