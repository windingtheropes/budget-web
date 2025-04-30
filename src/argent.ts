import { type TransactionEntry, type ValueResponse, type TransactionType, type SignUpForm, type GenericResponse, type SessionForm, type UserInfo, type TransactionEntryForm } from "./types"
export const create_account = async (form: SignUpForm): Promise<GenericResponse>  => {
  const response = await fetch("http://127.0.0.1:3000/api/account/new", {
    method: "POST",
    body: JSON.stringify(form),
  })

  const resp: GenericResponse = JSON.parse(await response.text())
  return resp
} 

import { type LoginForm, type LoginResponse } from "./types"
export const login = async (form: LoginForm): Promise<LoginResponse>  => {
  const response = await fetch("http://127.0.0.1:3000/api/account/login", {
    method: "PUT",
    body: JSON.stringify(form),
  })

  const resp: LoginResponse = JSON.parse(await response.text())
  return resp
} 

export const get_session = async (form: SessionForm): Promise<GenericResponse>  => {
  const headers = new Headers()
  headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`)
  const response = await fetch("http://127.0.0.1:3000/api/account/session", {
    method: "PUT",
    headers
  })
  const resp: GenericResponse = JSON.parse(await response.text())
  return resp
} 

export const check_auth = async (): Promise<boolean> => {
  const token = localStorage.getItem("token") || ""
  const session: SessionForm = {token: token}
  const resp = await get_session(session)
  if(resp.code == 200) {
    return true
  }
  return false
}

export const get_userinfo = async (): Promise<UserInfo>  => {
  const headers = new Headers()
  headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`)
  const response = await fetch("http://127.0.0.1:3000/api/account/user", {
    method: "PUT",
    headers
  })
  const resp: UserInfo = JSON.parse(await response.text())
  return resp
} 

export const get_types = async (): Promise<TransactionType[]>  => {
  const response = await fetch("http://127.0.0.1:3000/api/argent/type", {
    method: "GET"
  })
  const resp: ValueResponse<TransactionType[]> = JSON.parse(await response.text())
  return resp.value
} 

export const get_tags = async (): Promise<TransactionType[]>  => {
  const response = await fetch("http://127.0.0.1:3000/api/argent/type", {
    method: "GET"
  })
  const resp: ValueResponse<TransactionType[]> = JSON.parse(await response.text())
  return resp.value
} 

export const new_transaction = async (data: TransactionEntryForm): Promise<GenericResponse>  => {
  const headers = new Headers()
  headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`)
  const response = await fetch("http://127.0.0.1:3000/api/argent/entry/new", {
    method: "POST",
    headers,
    body: JSON.stringify(data)
  })
  const resp: GenericResponse = JSON.parse(await response.text())
  return resp
} 

export const get_seconds_from_ymd = (ymd: string): number => {
  const parts = ymd.split("-")
  if (parts.length < 3) {
    return 0
  }
  const year = parseInt(parts[0])
  const month = parseInt(parts[1])
  const day = parseInt(parts[2])

  const date = new Date(year, month-1, day)
  date.setTime(0)
  date.setFullYear(year)
  // Month index, not month
  date.setMonth(month-1)
  date.setDate(day)
  
  return date.getTime() / 1000
}

export const get_entries = async (): Promise<TransactionEntry[]> => {
  const headers = new Headers()
  headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`)
  const response = await fetch("http://127.0.0.1:3000/api/argent/entry", {
    method: "GET",
    headers
  })
  if (response.status != 200) {

  }
  const entries_list: TransactionEntry[] = JSON.parse(await response.text()).Value
  // console.log(entries_list)
  return entries_list
}

export const get_ymd_from_seconds = (seconds: number): string => {
  let date = new Date(seconds * 1000)
  return `${date.getFullYear()}/${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1}/${date.getDate() < 10 ? "0" : ""}${date.getDate()}`
}