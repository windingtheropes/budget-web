<script setup lang="ts">
import { computed, onBeforeMount, ref, useTemplateRef, type Ref } from "vue"
import { type ResponseStatus, type BudgetForm, type Tag, type TagBudget, type TagBudgetForm } from "@/types";
import { useTransactionStore } from "@/stores/Argent";
import ToastAlert from "../ToastAlert";

const form = useTemplateRef("modal");
const name: Ref<string | null> = ref(null)
// const goal = useTemplateRef("goal");

const transactionStore = useTransactionStore()
const emit = defineEmits(['close'])
const props = defineProps({
    budget_id: Number
})

onBeforeMount(async () => {
    const resp: ResponseStatus = await transactionStore.update_tags();
    if (resp.Code != 200) {
        ToastAlert(`${resp.Code}: ${resp.Message}`, "red")
        return
    }
    load_tag_list()
    update_overview()
})
const goal_modifier = ref(0)
interface tag_breakdown {
    tag_id: number,
    tag_name: string,
    type_id: number,
    goal: number,
    selected: boolean
}

const tag_list: Ref<tag_breakdown[]> = ref([])
const load_tag_list = () => {
    if (props.budget_id) {
        const budget = transactionStore.budgets.find(b => b.Id == props.budget_id)
        if (budget) {
            name.value = budget.Name
            if (budget.Tag_Budgets) {
                budget.Tag_Budgets.forEach(tb => {
                    const tag = transactionStore.tags.find(t => t.Id == tb.Tag_Id)
                    tag_list.value.push({
                        tag_id: tb.Tag_Id,
                        tag_name: tag?.Name || "",
                        type_id: tb.Type_Id,
                        goal: tb.Goal,
                        selected: true
                    })
                })
                return
            }
        }
    }
    for (const tag of transactionStore.tags) {
        tag_list.value.push({
            tag_id: tag.Id,
            tag_name: tag.Name,
            type_id: 0,
            goal: 0,
            selected: false
        })
    }

}


// Form functions
const submit_form = () => {
    if (form.value?.reportValidity() == false) return
    const selectedTags = tag_list.value.filter(t => t.selected)
    selectedTags.forEach(ta => {
        if (!transactionStore.types.find(ty => ty.Id == ta.type_id)) return
    })
    const tag_budgets: TagBudgetForm[] = ((): TagBudgetForm[] => {
        const tbfs: TagBudgetForm[] = []
        selectedTags.forEach(t => {
            const tag_budget_form: TagBudgetForm = {
                Tag_Id: t.tag_id,
                Type_Id: t.type_id,
                Goal: t.goal,
            }
            tbfs.push(tag_budget_form)
        })
        return tbfs
    })()

    if (props.budget_id) { } else {
        const budget: BudgetForm = {
            Name: name.value || "",
            Goal: goal_modifier.value,
            Tag_Budgets: tag_budgets
        }
        transactionStore.new_budget(budget)

        emit('close')
    }

}

const positive = ref(0)
const negative = ref(0)
const update_overview = () => {
    const positives = tag_list.value.filter(t => t.selected && transactionStore.type_is_positive(t.type_id)).map(t => t.goal)
    const negatives = tag_list.value.filter(t => t.selected && transactionStore.type_is_positive(t.type_id) == false).map(t => t.goal)
    positive.value = positives.length > 0 ? positives.reduce((p, c) => p + c) : 0
    negative.value = negatives.length > 0 ? negatives.reduce((p, c) => p + c) : 0
}

</script>

<template>

    <div class="budget-modal large">
        <div class="modal-header">
            <h5>New Budget</h5>
        </div>
        <div class="modal-body">
            <form ref="modal" class="row g-3 needs-validation">
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input v-model="name" type="text" class="form-control" id="name" placeholder="Main" required>
                </div>

                <h5>Balancing</h5>
                <div class="input-group">
                    <input type="number" class="form-control" v-model="positive"
                        aria-describedby="basic-addon3 basic-addon4" disabled>
                    <span class="input-group-text" id="basic-addon3">-</span>
                    <input type="number" class="form-control" v-model="negative"
                        aria-describedby="basic-addon3 basic-addon4" disabled>
                    <span class="input-group-text" id="basic-addon3">+</span>
                    <input type="number" class="form-control" v-model="goal_modifier"
                        aria-describedby="basic-addon3 basic-addon4">
                    <span class="input-group-text" id="basic-addon3">=</span>
                    <input type="number" class="form-control" :value="positive - negative + goal_modifier"
                        aria-describedby="basic-addon3 basic-addon4" disabled>
                    <span class="input-group-text" id="basic-addon3">CAD / month</span>
                </div>
                <div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Include</th>
                                <th>Tag</th>
                                <th>Type</th>
                                <th>Monthly Goal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tag in tag_list" :data-id="tag.tag_id">
                                <td>
                                    <input @change="update_overview();" v-model="tag.selected" class="form-check-input"
                                        type="checkbox" value="" id="flexCheckDefault">
                                </td>
                                <td>{{ tag.tag_name }}</td>
                                <td>
                                    <select @change="update_overview" v-model="tag.type_id" ref="type"
                                        class="form-select" id="type" required>
                                        <option selected disabled :value="0">Choose...</option>
                                        <option v-for="type in transactionStore.types" :value="type.Id">{{ type.Name }}
                                        </option>
                                    </select>
                                </td>
                                <td>
                                    <div class="input-group">
                                        <input v-on:input="update_overview" @keydown="(e) => {
                                            if (e.key == '-') {
                                                e.preventDefault()
                                                return false
                                            }
                                            return true
                                        }" min="0" type="number" placeholder="75.00" step="0.01" class="form-control"
                                            id="goal" v-model="tag.goal" aria-describedby="basic-addon3 basic-addon4"
                                            required>
                                        <span class="input-group-text" id="basic-addon3">CAD</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </form>

        </div>
        <div class="modal-footer">
            <button v-on:click="emit('close')" class="btn btn-danger">Cancel</button>
            <button type="submit" v-on:click="submit_form()" class="btn btn-primary">{{ budget_id ? "Update" : "Create"
            }}</button>
        </div>
    </div>

</template>