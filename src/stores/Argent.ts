import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/User';
import { Status, type GenericResponse, type ResponseStatus, type ReturnsResponse, type Tag, type Transaction, type TransactionForm, type TransactionType, type ValueResponse } from '@/types'
import { ref, type Ref } from 'vue';
import { sort_descending } from '@/argent';
import DateSnippet, { DateFormats } from '@/datesnippet';

export const useTransactionStore = defineStore('transaction', () => {
    const transactions: Ref<Transaction[]> = ref([]);
    const types: Ref<TransactionType[]> = ref([]);
    const tags: Ref<Tag[]> = ref([]);
    const populated_yms: Ref<DateSnippet[]> = ref([]);
    const userStore = useUserStore()
    const token = userStore.token

    // Now at top regardless if it is populated
    const now_at_top = (arr: DateSnippet[]): DateSnippet[] => {
        const now = new Date()
        arr = arr.filter((v, i) => {
            if (!(v.month == now.getMonth() + 1 && v.year == now.getFullYear() && v.format == DateFormats.text_ym)) return true
        })
        arr.unshift(new DateSnippet({ ymd_string: `${now.getFullYear()}/${now.getMonth() + 1}`, sep: '/', format: DateFormats.text_ym }))
        return arr
    }

    const update_populated_dates = () => {
        const populated: DateSnippet[] = []
        for (const transaction of transactions.value) {
            const ym_date_snippet = new DateSnippet({ seconds: transaction.Unix_Timestamp, format: DateFormats.text_ym })
            if (!(populated.find(v => 
                v.month == ym_date_snippet.month && v.year == ym_date_snippet.year && v.format == DateFormats.text_ym
            ))) {
                populated.push(ym_date_snippet)
            }
            if (!(populated.find(v => 
                v.year == ym_date_snippet.year && v.format == DateFormats.y
            ))) {
                const y_date_snippet = new DateSnippet({seconds: transaction.Unix_Timestamp, format: DateFormats.y})
                populated.push(y_date_snippet)
            }
        }
        console.log(sort_descending(populated.map(v => v.timestamp)))
        populated_yms.value = now_at_top(sort_descending(populated.map(v => v.timestamp)).map(v => populated[v]))

    }
    const b_cont_all_a = <T>(a: T[], b: T[]): boolean => {
        for (const key of a) {
            if (b.find(v => v == key)) { continue } else {
                return false
            }
        }
        return true
    }

    const sum_of = (entries: Transaction[]): number => {
        if (entries.length == 0) { return 0 }
        const amounts = entries.map(e => e.Amount)
        return amounts.reduce((p, c) => {
            return parseFloat((p + c).toFixed(2))
        })
    }
    const get_transactions_by = (type?: number, tags?: number[]): Transaction[] => {
        return transactions.value.filter((t) => {
            if (type && t.Type_Id != type) { return false }
            if (tags && !b_cont_all_a(tags, t.Tags.map(v => v.Id))) { return false }
            return true
        })
    }
    const update_tags = async (): Promise<ResponseStatus> => {
        const headers = new Headers()
        headers.append("Authorization", `Bearer ${token}`)
        const response = await fetch(`${import.meta.env.VITE_BUDGET_API_URL}/api/argent/tag`, {
            method: "GET",
            headers
        })
        if (response.status !== 200) {
            return Status(response.status)
        }
        const resp: ValueResponse<Tag[]> = JSON.parse(await response.text())
        tags.value = resp.value
        return Status(200)
    }
    const update_transactions: ReturnsResponse = async (): Promise<ResponseStatus> => {
        try {
            const headers = new Headers()
            headers.append("Authorization", `Bearer ${token}`)
            const response = await fetch(`${import.meta.env.VITE_BUDGET_API_URL}/api/argent/entry`, {
                method: "GET",
                headers
            })
            if (response.status != 200) {
                const resp: GenericResponse = JSON.parse(await response.text())
                return Status(resp.code, resp.message)
            }

            const resp: ValueResponse<Transaction[]> = JSON.parse(await response.text())
            transactions.value = resp.value
            return Status(200)
        } catch (err) {
            return Status(1000)
        }
    }
    const new_transaction = async (data: TransactionForm): Promise<ResponseStatus> => {
        try {
            const headers = new Headers()
            headers.append("Authorization", `Bearer ${token}`)
            const response = await fetch(`${import.meta.env.VITE_BUDGET_API_URL}/api/argent/entry/new`, {
                method: "POST",
                headers,
                body: JSON.stringify(data)
            })
            const resp: GenericResponse = JSON.parse(await response.text())
            if (resp.code == 200) {
                update_transactions();
            }
            return Status(resp.code, resp.message)
        } catch (error) {
            return Status(1000)
        }
    }
    const delete_transaction = async (id: number): Promise<ResponseStatus> => {
        try {
            const headers = new Headers()
            headers.append("Authorization", `Bearer ${token}`)
            const response = await fetch(`${import.meta.env.VITE_BUDGET_API_URL}/api/argent/entry/delete?id=${id}`, {
                method: "DELETE",
                headers
            })
            const resp: GenericResponse = JSON.parse(await response.text())
            if (resp.code == 200) {
                update_transactions();
            }
            return Status(resp.code, resp.message)
        } catch (error) {
            return Status(1000)
        }
    }
    const update_types = async (): Promise<ResponseStatus> => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BUDGET_API_URL}/api/argent/type`, {
                method: "GET"
            })
            if (response.status != 200) {
                return Status(response.status)
            }

            const resp: ValueResponse<TransactionType[]> = JSON.parse(await response.text())

            types.value = resp.value
            return Status(200)
        } catch (error) {
            return Status(1000)
        }

    }
    const get_type_name = (id: number): string | undefined => {
        return types.value.find(s => s.Id == id)?.Name
    }
    return {
        transactions,
        update_transactions,
        new_transaction,
        types,
        update_types,
        get_type_name,
        tags,
        update_tags,
        get_transactions_by,
        sum_of,
        delete_transaction,
        update_populated_dates,
        populated_dates: populated_yms
    }
})

