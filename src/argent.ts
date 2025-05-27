import ToastAlert from "@/components/ToastAlert"
import { Status, type ValueResponse, type TransactionType, type SignUpForm, type GenericResponse, type ResponseStatus, type ReturnsResponse } from "@/types"
export const create_account = async (form: SignUpForm): Promise<ResponseStatus> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BUDGET_API_URL}/api/account/new`, {
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
export const f_number = (n: number): string => {
  return n > 0 ? `+${Math.abs(n)}` : n < 0 ? `-${Math.abs(n)}` : `${n}`
}
export const get_month_name = (m: number): string | undefined => {
  switch (m) {
      case 1:
        return 'January'
      case 2:
        return 'February'
      case 3:
        return 'March'
      case 4:
        return 'April'
      case 5:
        return 'May'
      case 6:
        return 'June'
      case 7:
        return 'July'
      case 8:
        return 'August'
      case 9:
        return 'September'
      case 10:
        return 'October'
      case 11:
        return 'November'
      case 12:
        return 'December'
  }
  return
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

/**
* Gets the highest value of an array, returns its index.
*/
export const get_highest = (arr: number[]): number => {
    let highest_value = 0;
    let highest_index = 0;
    for(let i = 0; i < arr.length; i++) {
      const v = arr[i]
      if(v > highest_value) {
        highest_value = v
        highest_index = i
      // If same value, touch the new one so that it isn't lost
      } else if (v == highest_value) {
        highest_value = v
        highest_index = i
      }
    }
    return highest_index
}
/**
* Sorts an array highest to lowest, returns array of indicies.
*/
export const sort_descending = (arr: number[]): number[] => {
    const newarr = []
    while (arr.length > 0) {
      let highest_index = get_highest(arr);
      newarr.push(highest_index)
      arr = arr.filter((v, i) => highest_index != i)
    }
    return newarr
}

export const get_ymd_from_seconds = (seconds: number, sep: string = "/"): string => {
  let date = new Date(seconds * 1000)
  return `${date.getFullYear()}${sep}${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1}${sep}${date.getDate() < 10 ? "0" : ""}${date.getDate()}`
}

export const handleResponse = async (callback: ReturnsResponse) => {
  const resp: ResponseStatus = await callback();
  if (resp.Code == 200) {
    return
  }
  return ToastAlert(`${resp.Code}: ${resp.Message}`, "red")
}