<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, useTemplateRef, type ComputedRef, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { type Budget, type MetaSignedBudgetedTransaction, type ResponseStatus, type Tag, type Transaction } from '@/types';
import SidebarContainer from '@/components/on/OnContainer.vue'
import ToastAlert from '@/components/ToastAlert';
import { useUserStore } from '@/stores/User';
import { useTransactionStore } from '@/stores/Argent';
import { useModalStore } from '@/stores/ModalStore';
import DateSnippet, { DateDetail, DateFormat } from '@/datesnippet';
import { f_number } from '@/argent';
const router = useRouter();
const userStore = useUserStore()
const transactionStore = useTransactionStore()
const modalStore = useModalStore()

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
  await transactionStore.update_budgets()
  transactionStore.update_populated_dates()
})

</script>

<template>
  <NewTag></NewTag>
  <SidebarContainer>
    <div class="content-wrapper">
      <div class="headbar" style="display: flex; gap: 1em; justify-content: space-between;">
        <h1>Tags</h1>
        <button class="btn btn-primary" v-on:click="modalStore.openModal('Tag')">
          New
        </button>
      </div>
      <!-- only show if budgets already exist -->
      <div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Tag</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tag in transactionStore.tags" :data-id="tag.Id">
              <td>{{ tag.Name }}</td>
              <td>
              <button class="btn btn-warning bi bi-pencil" v-on:click="modalStore.openModal('Tag', {'tag_id': tag.Id})"></button>
              <button class="btn btn-danger bi bi-trash" v-on:click="transactionStore.delete_tag(tag.Id)"></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </SidebarContainer>
</template>
