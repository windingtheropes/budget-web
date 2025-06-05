import { defineStore } from 'pinia'
import { Status, codes, messages, type ResponseStatus, type GenericResponse, type LoginForm, type LoginResponse, type UserInfo } from '@/types'
import { ref, type Ref } from 'vue';


export const useUserStore = defineStore('user', () => {
    const token: Ref<string | undefined> = ref(localStorage.getItem("token") || undefined);
    const user_info: Ref<UserInfo | undefined> = ref();
    const api_url = import.meta.env.VITE_BUDGET_API_URL || "https://budget.alacriware.com"
    const logout = () => {
        token.value = undefined;
    }
    const login = async (form: LoginForm): Promise<ResponseStatus> => {
      try {
        const response = await fetch(`${api_url}/api/account/login`, {
          method: "PUT",
          body: JSON.stringify(form),
        })
        
        const resp: LoginResponse = JSON.parse(await response.text())
        if(resp.code != 200) {
            return Status(resp.code, resp.message)
        }

        token.value = resp.token
        localStorage.setItem("token", token.value)
        return Status(200)
      }
      catch (error) {
        return Status(1000)
      }
    }
    const is_valid_session = async (): Promise<ResponseStatus> => {
        if (!token.value) {
            return Status(403, "No Token")
        }
        try {
            const headers = new Headers()
            headers.append("Authorization", `Bearer ${token.value}`)
            const response = await fetch(`${api_url}/api/account/session`, {
                method: "PUT",
                headers
            })
            const resp: GenericResponse = JSON.parse(await response.text())
            if (resp.code == 200) {
                return Status(200)
            }
            return Status(403)
        }
        catch (error) {
            return Status(1000)
        }
    }

    const update_user_info = async (): Promise<ResponseStatus> => {
        const headers = new Headers()
        headers.append("Authorization", `Bearer ${token.value}`)
        const response = await fetch(`${api_url}/api/account/user`, {
            method: "PUT",
            headers
        })

        if (response.status != 200) {
            return Status(response.status)
        }

        const resp: UserInfo = JSON.parse(await response.text())
        user_info.value = resp

        return Status(200)
    }

    return { token, user_info, login, is_valid_session, update_user_info, logout }
})

