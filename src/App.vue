<script setup lang="ts">
import { onBeforeMount, useTemplateRef } from 'vue';
import { RouterView } from 'vue-router'
import { useUserStore } from './stores/User';
import { useTransactionStore } from './stores/Transaction';
import { handleResponse } from './argent';
const userStore = useUserStore()
const transactionStore = useTransactionStore()

// const setLoading = (isLoading: boolean) => {
//   if (isLoading) {
//     loading.value?.classList.remove("hidden");
//   } else {
//     loading.value?.classList.add("hidden")
//   }
// }

// const loading = useTemplateRef("loading")
onBeforeMount(async () => {
  // setLoading(true)
  const isValid = (await userStore.is_valid_session()).Code == 200
  if (isValid) {
    // await transactionStore.update_tags()
    // await transactionStore.update_transactions()
    // await transactionStore.update_types()
    // setLoading(false)
  }
})

// defineExpose({
//   setLoading
// });

</script>

<template>
  <!-- <div ref="loading" class="loading"></div> -->
  <RouterView />
</template>