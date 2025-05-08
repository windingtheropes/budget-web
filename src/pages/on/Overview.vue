<script setup lang="ts">
import { onBeforeMount, ref, useTemplateRef, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { DateFormats, type ResponseStatus, type TransactionEntry } from '@/types';
import SidebarContainer from '@/components/on/SidebarContainer.vue'
import ToastAlert from '@/components/ToastAlert';
import { useUserStore } from '@/stores/User';
import { useTransactionStore } from '@/stores/Transaction';
import App from '@/App.vue';
const router = useRouter();
const userStore = useUserStore()
const transactionStore = useTransactionStore()

const expenses: Ref<TransactionEntry[]> = ref([])
const income: Ref<TransactionEntry[]> = ref([])

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

  expenses.value = transactionStore.transactions.filter(t => { if (t.Type_Id == 1) { return true } })
  income.value = transactionStore.transactions.filter(t => { if (t.Type_Id == 2) { return true } })
})

</script>

<template>
  <SidebarContainer>
    <div class="content-wrapper">
      <div class="headbar" style="display: flex; gap: 1em; justify-content: start;">
        <h1>Overview</h1>
        <div>
          <select ref="date_filter" class="form-select" aria-label="Default select example">
          <option v-for="opt in transactionStore.populated_dates">
            {{ opt.displayName() }}
          </option>
        </select>
        </div>
      </div>
      <div style="display:flex; ">
        <div class="ov-card ov-card-expenses">
          <h1><strong>${{transactionStore.sum_of(transactionStore.get_transactions_by(1))}}</strong> in spending</h1>
        </div>
        <div class="ov-card ov-card-income">
          <h1><strong>${{transactionStore.sum_of(transactionStore.get_transactions_by(2))}}</strong> in income</h1>
        </div>
      </div>

    </div>
  </SidebarContainer>
</template>
