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

const delete_transaction = async (id: number) => {
  const resp: ResponseStatus = await transactionStore.delete_transaction(id)
  if (resp.Code != 200) {
    ToastAlert(`${resp.Code}: ${resp.Message}`, "red")
    return
  }
  return
}

onBeforeMount(async () => {
  const resp: ResponseStatus = await userStore.is_valid_session();
  if (resp.Code != 200) {
    ToastAlert(`${resp.Code}: ${resp.Message}`, "red")
    router.push("/login")
    return
  }

  await transactionStore.update_tags()
  await transactionStore.update_transactions()
  await transactionStore.update_types()
  transactionStore.update_populated_dates();
})

const modalStore = useModalStore();

</script>

<template>
  <SidebarContainer>
    <div class="content-wrapper">
      <div class="flex-container headbar">
        <h1>Transactions</h1>
        <button class="btn btn-warning" v-on:click="modalStore.openModal('NewTransaction')">
          New
        </button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Type</th>
            <th scope="col">Amount</th>
            <th scope="col">Vendor</th>
            <th scope="col">Description</th>
            <th scope="col">Tags</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in transactionStore.transactions" :data-id="entry.Id">
            <td>{{ get_ymd_from_seconds(entry.Unix_Timestamp) }}</td>
            <td>{{ transactionStore.get_type_name(entry.Type_Id) }}</td>
            <td>${{ entry.Amount }} {{ entry.Currency }}</td>
            <td>{{ entry.Vendor }}</td>
            <td>{{ entry.Msg }}</td>
            <td><span v-for="tag in entry.Tags" class="tag" :data-id="tag.Id">{{ tag.Name }}</span></td>
            <td><button class="btn btn-danger bi bi-trash" v-on:click="delete_transaction(entry.Id)"></button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </SidebarContainer>
</template>
