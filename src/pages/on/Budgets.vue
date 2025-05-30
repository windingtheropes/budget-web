<script setup lang="ts">
import { onBeforeMount, useTemplateRef } from "vue"
import { get_ymd_from_seconds } from "@/argent";
import { type ResponseStatus } from "@/types";
import SidebarContainer from "@/components/on/OnContainer.vue";
import NewTransaction from "@/components/on/TransactionModal.vue";
import { useRouter } from "vue-router";
import { useTransactionStore } from "@/stores/Argent";
import ToastAlert from "@/components/ToastAlert";
import { useUserStore } from "@/stores/User";
import { useModalStore } from "@/stores/ModalStore";
const router = useRouter()

const transactionStore = useTransactionStore()
const userStore = useUserStore()

onBeforeMount(async () => {
  const resp: ResponseStatus = await userStore.is_valid_session();
  if (resp.Code != 200) {
    ToastAlert(`${resp.Code}: ${resp.Message}`, "red")
    router.push("/login")
    return
  }
})

const modalStore = useModalStore();
</script>

<template>
  <SidebarContainer>
    <div class="content-wrapper">
      <div class="flex-container headbar">
        <h1>Budgets</h1>
        <button class="btn btn-primary" v-on:click="modalStore.openModal('Budget')">
          New
        </button>
      </div>
      <p>Organize your finances and gain deeper insights with budgets.</p>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Budget Name</th>
            <th scope="col">Monthly Goal</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="budget in transactionStore.budgets" :data-id="budget.Id">
            <td>{{ budget.Name }}</td>
            <td>{{ budget.Goal }} CAD</td>
            <td><button class="btn btn-warning bi bi-pencil" v-on:click="modalStore.openModal('Budget', {'budget_id': budget.Id})"></button></td>
            <td><button class="btn btn-danger bi bi-trash" v-on:click=""></button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </SidebarContainer>
</template>
