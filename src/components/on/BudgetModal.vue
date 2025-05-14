<script setup lang="ts">
import { onBeforeMount, ref, useTemplateRef, type Ref } from "vue"
import { get_seconds_from_ymd, get_ymd_from_seconds } from "@/argent";
import { type TransactionEntryForm, type ResponseStatus } from "@/types";
import { useTransactionStore } from "@/stores/Transaction";
import ToastAlert from "../ToastAlert";
import TagSelector from "./TagSelector.vue";

const form = useTemplateRef("modal");
const name = useTemplateRef("name");
const type = useTemplateRef("type");
const goal = useTemplateRef("goal");
const tags = useTemplateRef("tags");
const transactionStore = useTransactionStore()

const emit = defineEmits(['close'])

onBeforeMount(async () => {
    const resp: ResponseStatus = await transactionStore.update_tags();
    if (resp.Code != 200) {
        ToastAlert(`${resp.Code}: ${resp.Message}`, "red")
        return
    }
})

// HTML wrapper functions
const reset = () => {
    form.value?.reset()
}
const hide = () => {
    // emit this to the parent
    emit('close')
}
// Form functions
const submit_form = () => {
    if (form.value?.reportValidity() == false) return

    // const selected_tags = get_selected_tags_by_id()
    // const transaction: TransactionEntryForm = {
    //     type_id: parseInt(type.value?.selectedOptions[0]?.value || "2"),
    //     msg: description.value?.value || "",
    //     vendor: vendor.value?.value || "",
    //     amount: parseFloat(parseFloat(amount.value?.value || "0").toFixed(2)),
    //     tags: selected_tags,
    //     currency: "CAD",
    //     unix_timestamp: get_seconds_from_ymd(date.value?.value || "") || new Date().getTime() / 1000
    // }
    // transactionStore.new_transaction(transaction);
    // new_transaction(transaction);
    reset();
    hide();
}
const cancel_form = () => {
    reset();
    hide();
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

                <div v-if="transactionStore.tags.length > 0" ref="tag-list" class="mb-3">
                    <TagSelector ref="tags" />
                </div>
            </form>

        </div>
        <div class="modal-footer">
            <button v-on:click="cancel_form()" class="btn btn-danger">Cancel</button>
            <button type="submit" v-on:click="submit_form()" class="btn btn-primary">Create</button>
        </div>
    </div>

</template>