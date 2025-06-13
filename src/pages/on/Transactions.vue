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
})

const modalStore = useModalStore();

</script>

<template>
  <SidebarContainer>
    <div class="content-wrapper">
      <div class="flex-container headbar">
        <h1>Transactions</h1>
        <div style="display:flex; gap: 1em;">
          <div class="btn-group">
            <button type="button" class="btn btn-primary" v-on:click="modalStore.openModal('Transaction')">New</button>
            <button type="button" class="btn btn-primary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"
              aria-expanded="false">
              <span class="visually-hidden">Toggle Dropdown</span>
            </button>
            <!-- <ul class="dropdown-menu">
              <li><button class="dropdown-item" v-on:click="modalStore.openModal('BulkImport')">Bulk Import</button></li>
            </ul> -->
          </div>
        </div>

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
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in transactionStore.transactions" :data-id="entry.Id">
            <td>{{ get_ymd_from_seconds(entry.Unix_Timestamp) }}</td>
            <td :class="entry.Type_Id == 2 ? 'green' : 'red'">{{ transactionStore.get_type_name(entry.Type_Id) }}</td>
            <td :class="entry.Type_Id == 2 ? 'green' : 'red'">${{ entry.Amount }} {{ entry.Currency }}</td>
            <td>{{ entry.Vendor }}</td>
            <td>{{ entry.Msg }}</td>
            <td><span v-for="tag in entry.Tags" class="tag" :data-id="tag.Id">{{ tag.Name }}</span></td>
            <td><button class="btn btn-warning bi bi-pencil" v-on:click="modalStore.openModal('Transaction', {transaction_id: entry.Id})"></button></td>
            <td><button class="btn btn-danger bi bi-trash" v-on:click="delete_transaction(entry.Id)"></button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </SidebarContainer>
</template>
