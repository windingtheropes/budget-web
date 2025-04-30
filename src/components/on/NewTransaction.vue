<script setup lang="ts">
import { onBeforeMount, ref, useTemplateRef, type Ref } from "vue"
import { get_seconds_from_ymd, get_types, new_transaction } from "@/argent";
import { type TransactionType, type TransactionEntryForm } from "@/types";

const types: Ref<TransactionType[]> = ref([]);

const new_transaction_form = useTemplateRef("newtrans-form");
const date = useTemplateRef("date")
const type = useTemplateRef("type");
const amount = useTemplateRef("amount");
const vendor = useTemplateRef("vendor");
const description = useTemplateRef("description");
const container = useTemplateRef("modal-container");

onBeforeMount(async () => {
    types.value = await get_types()
});

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
    
    const transaction: TransactionEntryForm = {
        type_id: parseInt(type.value?.selectedOptions[0]?.value || "2"),
        msg: description.value?.value || "",
        vendor: vendor.value?.value || "",
        amount: parseFloat(parseFloat(amount.value?.value || "0").toFixed(2)),
        currency: "CAD",
        unix_timestamp: get_seconds_from_ymd(date.value?.value || "") || new Date().getTime()/1000
    }
    new_transaction(transaction);
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
                            <input ref="date" type="date" placeholder="Date" step="0.01" class="form-control" id="amount"
                                aria-describedby="basic-addon3 basic-addon4" required>
                        </div>
                    </div>
                    <!-- TYPE -->
                    <div class="col-md-4">
                        <label for="type" class="form-label">Type</label>
                        <select ref="type" class="form-select" id="type" required>
                            <option selected disabled value="">Choose...</option>
                            <option v-for="type in types" :value="type.Id">{{ type.Name }}</option>
                        </select>
                    </div>

                    <!-- AMOUNT -->
                    <div class="col-md-4">
                        <label for="amount" class="form-label">Amount</label>
                        <div class="input-group">
                            <input ref="amount" type="number" placeholder="10.24" step="0.01" class="form-control" id="amount"
                                aria-describedby="basic-addon3 basic-addon4" required>
                            <span class="input-group-text" id="basic-addon3">CAD</span>
                        </div>
                    </div>

                    <!-- VENDOR -->
                    <div class="col-md-4">
                        <label for="vendor" class="form-label">Vendor</label>
                        <input ref="vendor" type="text" class="form-control" id="vendor" placeholder="Supermarket"
                            required>
                    </div>
                    <!-- DESCRIPTION -->
                    <div class="mb-3">
                        <label for="description" class="form-label">Description</label>
                        <input ref="description" type="text" class="form-control" id="description"
                            placeholder="Groceries">
                    </div>

                    <div class="input-group mb-3">
                        <label class="input-group-text" for="inputGroupSelect01">Tags</label>
                        <select class="form-select" id="inputGroupSelect01">
                            <option selected disabled value="">Choose...</option>
                        </select>
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