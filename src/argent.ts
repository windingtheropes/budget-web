import { Status, type TransactionEntry, type ValueResponse, type TransactionType, type SignUpForm, type GenericResponse, type SessionForm, type UserInfo, type TransactionEntryForm, type ResponseStatus } from "./types"
export const create_account = async (form: SignUpForm): Promise<ResponseStatus> => {
  try {
    const response = await fetch("http://127.0.0.1:3000/api/account/new", {
      method: "POST",
      body: JSON.stringify(form),
    })

    const resp: GenericResponse = JSON.parse(await response.text())
    return Status(resp.code, resp.message)
  }
  catch (error) {
    return Status(1000)
  }
}

export const get_types = async (): Promise<TransactionType[]> => {
  const response = await fetch("http://127.0.0.1:3000/api/argent/type", {
    method: "GET"
  })
  const resp: ValueResponse<TransactionType[]> = JSON.parse(await response.text())
  return resp.Value
}

export const get_tags = async (): Promise<TransactionType[]> => {
  const response = await fetch("http://127.0.0.1:3000/api/argent/type", {
    method: "GET"
  })
  const resp: ValueResponse<TransactionType[]> = JSON.parse(await response.text())
  return resp.Value
}

export const get_seconds_from_ymd = (ymd: string): number => {
  const parts = ymd.split("-")
  if (parts.length < 3) {
    return 0
  }
  const year = parseInt(parts[0])
  const month = parseInt(parts[1])
  const day = parseInt(parts[2])

  const date = new Date(year, month - 1, day)
  date.setTime(0)
  date.setFullYear(year)
  // Month index, not month
  date.setMonth(month - 1)
  date.setDate(day)

  return date.getTime() / 1000
}

export const get_ymd_from_seconds = (seconds: number): string => {
  let date = new Date(seconds * 1000)
  return `${date.getFullYear()}/${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1}/${date.getDate() < 10 ? "0" : ""}${date.getDate()}`
}