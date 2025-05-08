<script setup lang="ts">
import { onBeforeMount, ref, useTemplateRef, type Ref } from "vue"
import { get_seconds_from_ymd, get_ymd_from_seconds } from "@/argent";
import { type TransactionEntryForm, type ResponseStatus } from "@/types";
import { useTransactionStore } from "@/stores/Transaction";
import ToastAlert from "../ToastAlert";
import ModalContainer from "../ModalContainer.vue";

const new_transaction_form = useTemplateRef("newtrans-form");
const date = useTemplateRef("date")
const type = useTemplateRef("type");
const amount = useTemplateRef("amount");
const vendor = useTemplateRef("vendor");
const description = useTemplateRef("description");
const container = useTemplateRef("modal-container");
const tag_list = useTemplateRef("tag-list")
const transactionStore = useTransactionStore()

const get_selected_tags_by_id = (): number[] => {
    const tags_array: number[] = []
    const tags = tag_list.value?.getElementsByTagName("div")
    if (!tags) return []
    for (const tag of tags) {
        const children = tag.getElementsByTagName("input")

        if (children.length == 0) { continue }
        const input = children[0]

        const data_id = input.getAttribute("data-id")
        if (!data_id) { continue }

        if (input.checked) {
            tags_array.push(parseInt(data_id))
        }
    }
    return tags_array
}

onBeforeMount(async () => {
    const resp: ResponseStatus = await transactionStore.update_tags();
    if (resp.Code != 200) {
        ToastAlert(`${resp.Code}: ${resp.Message}`, "red")
        return
    }
})

// HTML wrapper functions
const reset = () => {
    new_transaction_form.value?.reset()
}
const hide = () => {
    container.value?.classList.add("hidden")
}
const show = () => {
    container.value?.classList.remove("hidden")
}

// Form functions
const submit_form = () => {
    if (new_transaction_form.value?.reportValidity() == false) return

    const selected_tags = get_selected_tags_by_id()
    const transaction: TransactionEntryForm = {
        type_id: parseInt(type.value?.selectedOptions[0]?.value || "2"),
        msg: description.value?.value || "",
        vendor: vendor.value?.value || "",
        amount: parseFloat(parseFloat(amount.value?.value || "0").toFixed(2)),
        tags: selected_tags,
        currency: "CAD",
        unix_timestamp: get_seconds_from_ymd(date.value?.value || "") || new Date().getTime() / 1000
    }
    transactionStore.new_transaction(transaction);
    // new_transaction(transaction);
    reset();
    hide();
}
const cancel_form = () => {
    reset();
    hide();
}

// Export template functions
defineExpose({
    show
})

</script>

<template>
    <div ref="modal-container" class="modal-container hidden">
        <div class="budget-modal med">
            <div class="modal-header">
                <h5>New Transaction</h5>
            </div>
            <div class="modal-body">
                <form ref="newtrans-form" class="row g-3 needs-validation">
                    <div class="mb-3">
                        <div class="input-group">
                            <span class="input-group-text" id="basic-addon3">Date</span>
                            <input ref="date" type="date" placeholder="Date" step="0.01" class="form-control"
                                id="amount" aria-describedby="basic-addon3 basic-addon4"
                                :value="get_ymd_from_seconds((new Date().getTime()) / 1000, '-')" required>
                        </div>
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
                        <label for="amount" class="form-label">Amount</label>
                        <div class="input-group">
                            <input ref="amount" type="number" placeholder="10.24" step="0.01" class="form-control"
                                id="amount" aria-describedby="basic-addon3 basic-addon4" required>
                            <span class="input-group-text" id="basic-addon3">CAD</span>
                        </div>
                    </div>

                    <!-- VENDOR -->
                    <div class="col-md-4">
                        <label for="vendor" class="form-label">Vendor</label>
                        <input ref="vendor" type="text" class="form-control" id="vendor" placeholder="Amazon" required>
                    </div>
                    <!-- DESCRIPTION -->
                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <input ref="description" type="text" class="form-control" id="description"
                            placeholder="Adapter for Europe trip">
                    </div>

                    <div ref="tag-list" class="mb-3">
                        <label class="form-label">Tags</label>
                        <div v-for="tag in transactionStore.tags" class="col-md-4 form-check">
                            <input :data-id="tag.Id" class="form-check-input" type="checkbox"
                                id="checkIndeterminateDisabled">
                            <label :ref="'tag-checkbox-' + tag.Id.toString()" class="form-check-label"
                                for="checkIndeterminateDisabled">
                                {{ tag.Name }}
                            </label>
                        </div>
                    </div>
                </form>

            </div>
            <div class="modal-footer">
                <button v-on:click="cancel_form()" class="btn btn-danger">Cancel</button>
                <button type="submit" v-on:click="submit_form()" class="btn btn-primary">Create</button>
            </div>
        </div>
    </div>
</template>