<script setup lang="ts">
import { onBeforeMount, onMounted, ref, useTemplateRef, type Ref } from "vue"
import { type TagBudgetForm, type ResponseStatus, type TagForm } from "@/types";
import { useTransactionStore } from "@/stores/Argent";
import ToastAlert from "../ToastAlert";

const form = useTemplateRef("modal");
const name = useTemplateRef("name");
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

onMounted(() => {
    name.value?.focus()
})

// Form functions
const submit_form = () => {
    if (form.value?.reportValidity() == false) return
    
    const tag: TagForm = {
        Name: name?.value?.value || "",
    }
    transactionStore.new_tag(tag)
    emit('close')
}

</script>

<template>
    <div @keydown="(e)=>{if(e.key=='Enter') submit_form()}" class="budget-modal med">
        <div class="modal-header">
            <h5>New Tag</h5>
        </div>
        <div class="modal-body">
            <form ref="modal" class="needs-validation">
                <div class="">
                    <label for="name" class="form-label">Name</label>
                    <input ref="name" type="text" class="form-control" id="name" placeholder="Food" required>
                </div>
            </form>

        </div>
        <div class="modal-footer">
            <button v-on:click="emit('close')" class="btn btn-danger">Cancel</button>
            <button type="submit" v-on:click="submit_form()" class="btn btn-primary">Create</button>
        </div>
    </div>

</template>