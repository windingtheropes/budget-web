import { type LoginResponse } from "./types"
const validate_login = async (email: string, password: string): Promise<number> => {
    const response = await fetch("http://127.0.0.1:3000/api/account/login", {
      method: "PUT",
      body: JSON.stringify({ email, password }),
    })
  
    // follows format of {code: int, message/token: string}
    const resp_json: LoginResponse = JSON.parse(await response.text())
    if (resp_json.Code == 200) {
      localStorage.setItem("token", resp_json.Token)
    }
    return resp_json.Code 
} 