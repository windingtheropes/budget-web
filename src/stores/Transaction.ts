import { defineStore } from 'pinia'
import { type GenericResponse, type TransactionEntry, type TransactionEntryForm, type ValueResponse } from '@/types'
// import { get_entries } from '@/argent'
import { ref, type Ref } from 'vue';

export const useTransactionStore = defineStore('transaction', () => {
    const transactions: Ref<TransactionEntry[]> = ref([]);
    const update_transactions = async (): Promise<GenericResponse> => {
        const headers = new Headers()
        headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`)
        const response = await fetch("http://127.0.0.1:3000/api/argent/entry", {
            method: "GET",
            headers
        })
        if (response.status != 200) {
            const resp: GenericResponse = JSON.parse(await response.text())
            return resp
        }

        const resp: ValueResponse<TransactionEntry[]> = JSON.parse(await response.text())
        transactions.value = resp.Value
        return { code: 200, message: "Ok." }
    }
    const new_transaction = async (data: TransactionEntryForm): Promise<GenericResponse> => {
      const headers = new Headers()
      headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`)
      const response = await fetch("http://127.0.0.1:3000/api/argent/entry/new", {
        method: "POST",
        headers,
        body: JSON.stringify(data)
      })
      const resp: GenericResponse = JSON.parse(await response.text())
      if (resp.code == 200) {
        update_transactions();
      }
      return resp
    }

    return { transactions, update_transactions, new_transaction }
})

