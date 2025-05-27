import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/User';
import { Status, type Budget, type BudgetEntry, type BudgetForm, type GenericResponse, type MetaSignedBudgetedTransaction, type ResponseStatus, type ReturnsResponse, type Tag, type TagBudget, type TagForm, type Transaction, type TransactionForm, type TransactionType, type ValueResponse } from '@/types'
import { computed, ref, type Ref } from 'vue';
import { sort_descending } from '@/argent';
import DateSnippet, { DateFormat } from '@/datesnippet';

export const useTransactionStore = defineStore('transaction', () => {
    const transactions: Ref<Transaction[]> = ref([]);
    const budgets: Ref<Budget[]> = ref([]);
    const types: Ref<TransactionType[]> = ref([]);
    const tags: Ref<Tag[]> = ref([]);
    const populated_yms: Ref<DateSnippet[]> = ref([]);
    const userStore = useUserStore()
    const token = userStore.token
    const api_url = import.meta.env.VITE_BUDGET_API_URL

    // Now at top regardless if it is populated
    const now_at_top = (arr: DateSnippet[]): DateSnippet[] => {
        const now = new Date()
        arr = arr.filter((v, i) => {
            if(!(
                v.month == (now.getMonth() + 1)
                &&
                v.year == now.getFullYear()
                &&
                v.format == DateFormat.text_ym
            )) {
                return true
            }
            return false
        })
        arr.unshift(new DateSnippet({ ymd_string: `${now.getFullYear()}/${now.getMonth() + 1}`, sep: '/', format: DateFormat.text_ym }))
        return arr
    }
    const update_populated_dates = () => {
        const populated: DateSnippet[] = []
        for(const transaction of transactions.value) {
            const ym_snippet: DateSnippet = new DateSnippet({
                seconds: transaction.Unix_Timestamp,
                format: DateFormat.text_ym
            })
            const y_snippet: DateSnippet = new DateSnippet({
                seconds: transaction.Unix_Timestamp,
                format: DateFormat.y
            })

            // year is not present, add it
            if(!populated.find(m => m.displayName == y_snippet.displayName)) {
                populated.push(y_snippet)
            }
            // year month is not present, add it
            if(!populated.find(m => m.displayName == ym_snippet.displayName)) {
                populated.push(ym_snippet)
            }
        }
        populated_yms.value = now_at_top(populated)
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
    const update_tags = async (): Promise<ResponseStatus> => {
        try {
            const headers = new Headers()
            headers.append("Authorization", `Bearer ${token}`)
            const response = await fetch(`${api_url}/api/argent/tag`, {
                method: "GET",
                headers
            })
            if (response.status !== 200) {
                return Status(response.status)
            }
            const resp: ValueResponse<Tag[]> = JSON.parse(await response.text())
            tags.value = resp.value
            return Status(200)
        } catch (error) {
            return Status(1000)
        }
    }
    const update_transactions: ReturnsResponse = async (): Promise<ResponseStatus> => {
        try {
            const headers = new Headers()
            headers.append("Authorization", `Bearer ${token}`)
            const response = await fetch(`${api_url}/api/argent/transaction`, {
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
            const response = await fetch(`${api_url}/api/argent/transaction/new`, {
                method: "POST",
                headers,
                body: JSON.stringify(data)
            })
            const resp: GenericResponse = JSON.parse(await response.text())
            if (resp.code == 200) {
                await update_transactions();
            }
            return Status(resp.code, resp.message)
        } catch (error) {
            return Status(1000)
        }
    }
    const new_budget = async (data: BudgetForm): Promise<ResponseStatus> => {
        try {
            const headers = new Headers()
            headers.append("Authorization", `Bearer ${token}`)
            const response = await fetch(`${api_url}/api/argent/budget/new`, {
                method: "POST",
                headers,
                body: JSON.stringify(data)
            })
            const resp: GenericResponse = JSON.parse(await response.text())
            if (resp.code == 200) {
                await update_budgets();
            }
            return Status(resp.code, resp.message)
        } catch (error) {
            return Status(1000)
        }
    }
    const new_tag = async (data: TagForm): Promise<ResponseStatus> => {
        try {
            const headers = new Headers()
            headers.append("Authorization", `Bearer ${token}`)
            const response = await fetch(`${api_url}/api/argent/tag/new`, {
                method: "POST",
                headers,
                body: JSON.stringify(data)
            })
            const resp: GenericResponse = JSON.parse(await response.text())
            if (resp.code == 200) {
                await update_budgets();
            }
            return Status(resp.code, resp.message)
        } catch (error) {
            return Status(1000)
        }
    }
    const delete_tag = async (id: number): Promise<ResponseStatus> => {
        try {
            const headers = new Headers()
            headers.append("Authorization", `Bearer ${token}`)
            const response = await fetch(`${api_url}/api/argent/tag/delete?id=${id}`, {
                method: "DELETE",
                headers,
            })
            const resp: GenericResponse = JSON.parse(await response.text())
            if (resp.code == 200) {
                await update_tags();
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
            const response = await fetch(`${api_url}/api/argent/transaction/delete?id=${id}`, {
                method: "DELETE",
                headers
            })
            const resp: GenericResponse = JSON.parse(await response.text())
            if (resp.code == 200) {
                await update_transactions();
            }
            return Status(resp.code, resp.message)
        } catch (error) {
            return Status(1000)
        }
    }
    const update_types = async (): Promise<ResponseStatus> => {
        try {
            const response = await fetch(`${api_url}/api/argent/type`, {
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
    const find_budget_in_tag_budgets = (tag_budgets: TagBudget[], budget_id: number): boolean => {
        for (const tb of tag_budgets) {
            if (tb.Budget_Id == budget_id) {
                return true
            }
        }
        return false
    }
    // Get tags on a budget specified, including those that are not assigned to budgets.
    const get_budget_tags = (id: number): Tag[] => {
        const filteredTags: Tag[] = []
        for (const tag of tags.value) {
            if (tag.Tag_Budgets && tag.Tag_Budgets.length > 0) {
                if (find_budget_in_tag_budgets(tag.Tag_Budgets, id)) {
                    filteredTags.push(tag)
                } else {
                    continue
                }
            } else {
                filteredTags.push(tag)
            }
        }
        return filteredTags
    }
    type msbt_options = {
        trans?: Transaction[],
        budget_id: number,
        tag_id?: number,
        date_filter?: DateSnippet
    }
    // Get MetaSignedBudgetedTransaction list by a budget id
    const get_meta_signed_budgeted_transactions = ({budget_id, tag_id, date_filter}: msbt_options): MetaSignedBudgetedTransaction[] => {
        const MetaSigned: MetaSignedBudgetedTransaction[] = []
        for (const transaction of transactions.value) {
            // Filter by date if present
            if (date_filter) {
                const ds_trans = new DateSnippet({seconds:transaction.Unix_Timestamp, format:date_filter.format, sep:date_filter.sep})
                if(!(ds_trans.displayName == date_filter.displayName)) { continue }
            }
            if (transaction.Budget_Entries && transaction.Budget_Entries.length > 0) {
                const entry_on_transaction = transaction.Budget_Entries.find(b => b.Budget_Id == budget_id)
                //  
                if (entry_on_transaction) {
                    const signed: MetaSignedBudgetedTransaction = {
                        Value: transaction.Type_Id == 2 ? Math.abs(entry_on_transaction.Amount) : Math.abs(entry_on_transaction.Amount) * -1,
                        ...transaction
                    }
                    // 
                    if (tag_id) {
                        if (transaction.Tags) {
                            if (transaction.Tags.find(t => t.Id == tag_id)) {
                                MetaSigned.push(signed)
                            } else continue
                        } else continue
                    } else {
                        MetaSigned.push(signed)
                    }
                } else continue
            } else continue
            // Do not sort transactions that don't have budget entries
        }
        return MetaSigned
    }

    const get_type_name = (id: number): string | undefined => {
        return types.value.find(s => s.Id == id)?.Name
    }
    const update_budgets: ReturnsResponse = async (): Promise<ResponseStatus> => {
        try {
            const headers = new Headers()
            headers.append("Authorization", `Bearer ${token}`)
            const response = await fetch(`${api_url}/api/argent/budget`, {
                method: "GET",
                headers
            })
            if (response.status != 200) {
                const resp: GenericResponse = JSON.parse(await response.text())
                return Status(resp.code, resp.message)
            }

            const resp: ValueResponse<Budget[]> = JSON.parse(await response.text())
            budgets.value = resp.value
            return Status(200)
        } catch (err) {
            return Status(1000)
        }
    }

    return {
        transactions,
        update_transactions,
        get_meta_signed_budgeted_transactions,
        new_transaction,
        types,
        update_types,
        get_type_name,
        new_tag,
        tags,
        update_tags,
        sum_of,
        delete_transaction,
        update_populated_dates,
        update_budgets,
        new_budget,
        delete_tag,
        budgets,
        get_budget_tags,
        populated_dates: populated_yms
    }
})

