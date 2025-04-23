import { type SignUpForm, type GenericResponse, type SessionForm } from "./types"
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
  const response = await fetch("http://127.0.0.1:3000/api/account/session", {
    method: "PUT",
    body: JSON.stringify(form),
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