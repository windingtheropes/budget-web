<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useTransactionStore } from './stores/Argent';
import { onMounted, ref } from 'vue';
const transactionStore = useTransactionStore();

onMounted(async () => {
  await transactionStore.update_tags()
  await transactionStore.update_transactions()
  await transactionStore.update_types()
  await transactionStore.update_budgets()
  transactionStore.update_populated_dates()
})

</script>

<template>
  <RouterView />
</template>