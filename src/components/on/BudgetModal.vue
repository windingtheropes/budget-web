<script setup lang="ts">
import { onBeforeMount, useTemplateRef } from "vue"
import { type ResponseStatus, type BudgetForm, type Tag } from "@/types";
import { useTransactionStore } from "@/stores/Argent";
import ToastAlert from "../ToastAlert";

const form = useTemplateRef("modal");
const name = useTemplateRef("name");
const type = useTemplateRef("type");
const goal = useTemplateRef("goal");

const transactionStore = useTransactionStore()

const emit = defineEmits(['close'])

onBeforeMount(async () => {
    const resp: ResponseStatus = await transactionStore.update_tags();
    if (resp.Code != 200) {
        ToastAlert(`${resp.Code}: ${resp.Message}`, "red")
        return
    }
})

// interface tag_budget_breakdown {
//     tag_id: number,
//     tag_name: string,


// }
const tag_budgets = 0; 
// Form functions
const submit_form = () => {
    if (form.value?.reportValidity() == false) return

    const budget: BudgetForm = {
        Name: name.value?.value || "",
        Type_Id: parseInt(type.value?.selectedOptions[0]?.value || "1"),
        Goal: parseInt(goal.value?.value || "0")
    }
    transactionStore.new_budget(budget)
    emit('close')
}

</script>

<template>

    <div class="budget-modal med">
        <div class="modal-header">
            <h5>New Budget</h5>
        </div>
        <div class="modal-body">
            <form ref="modal" class="row g-3 needs-validation">
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input ref="name" type="text" class="form-control" id="name" placeholder="Spending" required>
                </div>
                <!-- TYPE -->
                <div class="col-md-4">
                    <label for="type" class="form-label">Type</label>
                    <select ref="type" class="form-select" id="type" required>
                        <option selected disabled value="">Choose...</option>
                        <option v-for="type in transactionStore.types" :value="type.Id">{{ type.Name }}</option>
                    </select>
                </div>

                <!-- AMOUNT -->
                <div class="col-md-4">
                    <label for="goal" class="form-label">Goal</label>
                    <div class="input-group">
                        <input ref="goal" type="number" placeholder="300.00" step="0.01" class="form-control" id="goal"
                            aria-describedby="basic-addon3 basic-addon4" required>
                        <span class="input-group-text" id="basic-addon3">CAD</span>
                    </div>
                </div>

                <div>
                    <!-- <table class="table">
                        <thead>
                            <tr>
                                <th>Include</th>
                                <th>Tag</th>
                                <th>Budget</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                                </td>
                                <td>Tag name</td>
                                <td>
                                    <div class="input-group">
                                        <input type="number" placeholder="300.00" step="0.01"
                                            class="form-control" id="goal" aria-describedby="basic-addon3 basic-addon4"
                                            required>
                                        <span class="input-group-text" id="basic-addon3">CAD</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table> -->
                </div>
            </form>

        </div>
        <div class="modal-footer">
            <button v-on:click="emit('close')" class="btn btn-danger">Cancel</button>
            <button type="submit" v-on:click="submit_form()" class="btn btn-primary">Create</button>
        </div>
    </div>

</template>