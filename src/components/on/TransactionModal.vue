<script setup lang="ts">
import { computed, onBeforeMount, ref, useTemplateRef, type Ref } from "vue"
import { get_seconds_from_ymd, get_ymd_from_seconds } from "@/argent";
import { type TransactionForm, type ResponseStatus, type BudgetEntryForm } from "@/types";
import { useTransactionStore } from "@/stores/Argent";
import ToastAlert from "../ToastAlert";
import TagSelector from "./TagSelector.vue";
import DateSnippet, { DateDetail, DateFormat } from "@/datesnippet";


defineProps(['date', 'type', 'amount', 'vendor', 'description', 'tags'])

// TODO: DON'T ALLOW BUDGET ENTRIES TO ADD UP TO MORE THAN THE TRANSACTION VALUE

const new_transaction_form = useTemplateRef("transaction-form");
const amount: Ref<number> = ref(0);
const ds = new DateSnippet({ format: DateFormat.ymd, detail: DateDetail.ymd })
const date: Ref<string> = ref(ds.displayName)

const type = useTemplateRef("type");
const vendor: Ref<string> = ref("")
const description: Ref<string> = ref("")
const tags = useTemplateRef("tags")
const selectedType = ref(0);

// const container = useTemplateRef("modal-container");
const transactionStore = useTransactionStore()

const emit = defineEmits(['close'])

onBeforeMount(async () => {
    const resp: ResponseStatus = await transactionStore.update_tags();
    if (resp.Code != 200) {
        ToastAlert(`${resp.Code}: ${resp.Message}`, "red")
        return
    }
    await transactionStore.update_budgets();
})


interface BreakdownBudget {
    Id: number,
    Name: string,
    Amount: number,
    Percent: number
}
const budget_breakdowns: Ref<{ [key: number]: BreakdownBudget }> = ref({})
for (const budget of transactionStore.budgets) {
    budget_breakdowns.value[budget.Id] = {
        Id: budget.Id,
        Name: budget.Name,
        Amount: 0,
        Percent: 0
    }
}
const budget_id = ref(0)
const refreshAllAmountsByPercentage = () => {
    for (const i in budget_breakdowns.value) {
        const breakdown = budget_breakdowns.value[i]
        updateBreakdownAmountFromPercent(breakdown.Id)
    }
}
const updateBreakdownAmountFromPercent = (budget_id: number) => {
    const breakdown = budget_breakdowns.value[budget_id]
    breakdown.Amount = parseFloat((amount.value * (breakdown.Percent / 100)).toFixed(2))
}
const updateBreakdownPercentFromAmount = (budget_id: number) => {
    const breakdown = budget_breakdowns.value[budget_id]
    breakdown.Percent = parseFloat((breakdown.Amount / amount.value).toFixed(2))
}

const getBudgetEntries = (): BudgetEntryForm[] => {
    const budgetEntries: BudgetEntryForm[] = [];
    if (selectedType.value == 1) {
        budgetEntries.push(
            {
                Budget_Id: budget_id.value,
                Amount: amount.value
            }
        )
    } else if (selectedType.value == 2) {
        for (const i in budget_breakdowns.value) {
            const breakdown = budget_breakdowns.value[i]
            if (breakdown.Amount == 0 || breakdown.Percent == 0) continue
            budgetEntries.push(
                {
                    Budget_Id: breakdown.Id,
                    Amount: breakdown.Amount
                }
            )
        }
    }
    return budgetEntries
}

// Form functions
const submit_form = () => {
    if (new_transaction_form.value?.reportValidity() == false) return
    const transaction: TransactionForm = {
        type_id: parseInt(type.value?.selectedOptions[0]?.value || "2"),
        msg: description.value || "",
        vendor: vendor.value || "",
        amount: parseFloat(amount.value.toFixed(2)),
        tags: tags.value?.selectedTags() || [],
        currency: "CAD",
        unix_timestamp: new DateSnippet({ymd_string: date.value, sep:"-"}).seconds,
        budget_entries: getBudgetEntries()
    }
    transactionStore.new_transaction(transaction);
    emit('close')
}

</script>

<template>
    <div class="budget-modal med">
        <div class="modal-header">
            <h5>New Transaction</h5>
        </div>
        <div class="modal-body">
            <form ref="transaction-form" class="row g-3 needs-validation">
                <div class="mb-3">
                    <div class="input-group">
                        <span class="input-group-text" id="basic-addon3">Date</span>
                        <input type="date" placeholder="Date" step="0.01" class="form-control" id="amount"
                            aria-describedby="basic-addon3 basic-addon4"
                            v-model="date" required>
                    </div>
                </div>
                <!-- TYPE -->
                <div class="col-md-4">
                    <label for="type" class="form-label">Type</label>
                    <select v-on:input="() => {
                        const selectedValue = type?.selectedOptions[0].value || '0'
                        selectedType = parseInt(selectedValue)
                    }" ref="type" class="form-select" id="type" required>
                        <option selected disabled value="0">Choose...</option>
                        <option v-for="type in transactionStore.types" :value="type.Id">{{ type.Name }}</option>
                    </select>
                </div>

                <!-- AMOUNT -->
                <div class="col-md-4">
                    <label for="amount" class="form-label">Amount</label>
                    <div class="input-group">
                        <input @input="refreshAllAmountsByPercentage()" @keydown="(e) => {
                                            if (e.key == '-') {
                                                e.preventDefault()
                                                return false
                                            }
                                        }" min="0" type="number" placeholder="75.00" step="0.01" class="form-control"
                                            id="amount" v-model="amount" aria-describedby="basic-addon3 basic-addon4"
                                            required>
                        <span class="input-group-text" id="basic-addon3">CAD</span>
                    </div>
                </div>
                <!-- VENDOR -->
                <div class="col-md-4">
                    <label for="vendor" class="form-label">Vendor</label>
                    <input v-model="vendor" type="text" class="form-control" id="vendor" placeholder="Amazon" required>
                </div>
                <!-- DESCRIPTION -->
                <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <input v-model="description" type="text" class="form-control" id="description"
                        placeholder="Adapter for Europe trip">
                </div>
                
                <h5 v-if="selectedType == 2 || selectedType == 1">Breakdown</h5>
                <div v-if="selectedType == 1" class="mb-3">
                    <label for="budget" class="form-label">Budget</label>
                    <select v-on:change="tags?.update_available_tags(budget_id)" v-model="budget_id" class="form-select" id="type" required>
                        <option selected disabled value="0">Choose...</option>
                        <option v-for="budget in transactionStore.budgets" :value="budget.Id">{{ budget.Name }}</option>
                    </select>
                </div>
                <div class="md-3">
                    <TagSelector ref="tags"/>
                </div>
                <div v-if="selectedType == 2" class="md-3">

                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Budget</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="budget in budget_breakdowns">
                                <td>{{ budget.Name }}</td>
                                <td>
                                    <input type="number" v-model="budget.Amount" step="0.01" class="form-control"
                                        aria-describedby="basic-addon3 basic-addon4"
                                        v-on:input="updateBreakdownPercentFromAmount(budget.Id)" required>
                                </td>
                                <td><input type="number" class="form-control" v-model="budget.Percent"
                                        v-on:input="updateBreakdownAmountFromPercent(budget.Id)" required>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>


            </form>

        </div>
        <div class=" modal-footer">
            <button v-on:click="emit('close')" class="btn btn-danger">Cancel</button>
            <button type="submit" v-on:click="submit_form()" class="btn btn-primary">Create</button>
        </div>
    </div>

</template>