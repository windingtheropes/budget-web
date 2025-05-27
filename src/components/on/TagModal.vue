<script setup lang="ts">
import { onBeforeMount, ref, useTemplateRef, type Ref } from "vue"
import { type TagBudgetForm, type ResponseStatus, type TagForm } from "@/types";
import { useTransactionStore } from "@/stores/Argent";
import ToastAlert from "../ToastAlert";

const form = useTemplateRef("modal");
const budget = useTemplateRef("budget")
const name = useTemplateRef("name");
const type = useTemplateRef("type");
const goal = useTemplateRef("goal");
const transactionStore = useTransactionStore()

// Tags can be simply labels, give the user the option
const isTagBudget = ref(false)

const emit = defineEmits(['close'])

onBeforeMount(async () => {
    const resp: ResponseStatus = await transactionStore.update_tags();
    if (resp.Code != 200) {
        ToastAlert(`${resp.Code}: ${resp.Message}`, "red")
        return
    }
})

// Form functions
const submit_form = () => {
    if (form.value?.reportValidity() == false) return
    
    const tagBudgetArr: TagBudgetForm[] = (() => {
        if(isTagBudget.value) {
            const tb: TagBudgetForm = {
                Budget_Id: parseInt(budget.value?.selectedOptions[0]?.value || "0"),
                Goal: parseInt(goal.value?.value || "0"),
                Type_Id: parseInt(type.value?.selectedOptions[0]?.value || "2")
            }
            return [tb]
        }
        return []
    })()
    
    const tag: TagForm = {
        Name: name?.value?.value || "",
        Tag_Budgets: tagBudgetArr
    }
    transactionStore.new_tag(tag)
    emit('close')
}

</script>

<template>
    <div class="budget-modal med">
        <div class="modal-header">
            <h5>New Tag</h5>
        </div>
        <div class="modal-body">
            <form ref="modal" class="row g-3 needs-validation">
                <div class="col-md-4">
                    <label for="name" class="form-label">Name</label>
                    <input ref="name" type="text" class="form-control" id="name" placeholder="Food" required>
                </div>
                <!-- TYPE -->
                <div class="col-md-4">
                    <label for="budget" class="form-label">Budget</label>
                    <select v-on:input="isTagBudget = budget?.selectedOptions[0]?.value != 'none'" ref="budget" class="form-select" id="type" required>
                        <option selected value="none">None</option>
                        <option v-for="budget in transactionStore.budgets" :value="budget.Id">{{ budget.Name }}</option>
                    </select>
                </div>

                <div v-if="isTagBudget" class="col-md-5">
                    <label for="type" class="form-label">Type</label>
                    <select ref="type" class="form-select" id="type" required>
                        <option selected disabled value="">Choose...</option>
                        <option v-for="type in transactionStore.types" :value="type.Id">{{ type.Name }}</option>
                    </select>
                </div>
                <div v-if="isTagBudget" class="col-md-5">
                    <label for="goal" class="form-label">Goal</label>
                    <div class="input-group">
                        <input ref="goal" type="number" placeholder="150.00" step="0.01" class="form-control" id="goal"
                            aria-describedby="basic-addon3 basic-addon4" required>
                        <span class="input-group-text" id="basic-addon3">CAD</span>
                    </div>
                </div>

            </form>

        </div>
        <div class="modal-footer">
            <button v-on:click="emit('close')" class="btn btn-danger">Cancel</button>
            <button type="submit" v-on:click="submit_form()" class="btn btn-primary">Create</button>
        </div>
    </div>

</template>