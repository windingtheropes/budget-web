export const updateEntries = async () => {
    const headers = new Headers()
    headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`)
    const response = await fetch("http://127.0.0.1:3000/api/argent/entry", {
      method: "GET",
      headers
    })
    if(response.status != 200) {
      
    }
    const entries_list: TransactionEntry[] = JSON.parse(await response.text()).Value
    // console.log(entries_list)
    entries.value = entries_list
  }
  
  updateEntries()