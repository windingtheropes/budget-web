<script setup lang="ts">
import { computed, ref, type Ref, onBeforeMount, useTemplateRef, onMounted } from "vue"
import { get_types, get_ymd_from_seconds } from "@/argent";
import { type GenericResponse, type ResponseStatus, type TransactionEntry, type TransactionType } from "@/types";
import SidebarContainer from "@/components/on/SidebarContainer.vue";
import NewTransaction from "@/components/on/NewTransaction.vue";
import { useRouter } from "vue-router";
import { useTransactionStore } from "@/stores/Transaction";
import ToastAlert from "@/components/ToastAlert";
import { useUserStore } from "@/stores/User";
const router = useRouter()

const transactionStore = useTransactionStore()
const userStore = useUserStore()

onBeforeMount(async () => {
  const resp: ResponseStatus = await userStore.is_valid_session();
  const fetch_transactions_response: GenericResponse = await transactionStore.update_transactions()
  if (fetch_transactions_response.code >= 400) {
    ToastAlert(fetch_transactions_response.message, "red")
    return
  }
  
  if (resp.Code != 200) {
      ToastAlert(`${resp.Code}: ${resp.Message}`, "red")
      router.push("/login")
      return
  }

  types.value = await get_types()
})

let types: Ref<TransactionType[]> = ref([])

const nt_dialog = useTemplateRef("new_transaction")
</script>

<template>
  <NewTransaction ref="new_transaction" />
  <SidebarContainer>
    <div class="content-wrapper">
      <div class="flex-container headbar">
        <h1>Transactions</h1>
        <button class="btn btn-warning" v-on:click="nt_dialog?.show()">
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in transactionStore.transactions" :data-id="entry.Id">
            <td>{{ get_ymd_from_seconds(entry.Unix_Timestamp) }}</td>
            <td>{{ entry.Type_Id }}</td>
            <td>${{ entry.Amount }} {{ entry.Currency }}</td>
            <td>{{  entry.Vendor }}</td>
            <td>{{ entry.Msg }}</td>
            <td v-for="tag in entry.Tags"><span :data-id="tag.Id">{{ tag.Name }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </SidebarContainer>
</template>
