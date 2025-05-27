<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, type ComputedRef, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import { type MetaSignedBudgetedTransaction, type ResponseStatus, type Tag, type Transaction } from '@/types';
import SidebarContainer from '@/components/on/OnContainer.vue'
import ToastAlert from '@/components/ToastAlert';
import { useUserStore } from '@/stores/User';
import { useTransactionStore } from '@/stores/Argent';
import { useModalStore } from '@/stores/ModalStore';
import DateSnippet, { DateFormat } from '@/datesnippet';
import { f_number } from '@/argent';
const router = useRouter();
const userStore = useUserStore()
const transactionStore = useTransactionStore()

interface BudgetBalance {
  balance: number,
  earned: number,
  spent: number
}
const budget_balance: Ref<BudgetBalance> = ref({ balance: 0, earned: 0, spent: 0 })
const update_budget_balance = () => {
  const mst = transactionStore.get_meta_signed_budgeted_transactions({ budget_id: budget_id.value, date_filter: get_selected_date_filter() })
  if (mst.length == 0) {
    const b: BudgetBalance = { balance: 0, earned: 0, spent: 0 }
    budget_balance.value = b
  }
  const full_values = mst.map(m => m.Value)
  const earned = mst.filter(m => m.Type_Id == 2).map(m => m.Value)
  const spent = mst.filter(m => m.Type_Id == 1).map(m => m.Value)

  const b: BudgetBalance = {
    balance: parseFloat((full_values.length > 0 ? full_values.reduce((p,c) => p+c) : 0).toFixed(2)),
    earned: parseFloat((earned.length > 0 ? earned.reduce((p,c) => p+c) : 0).toFixed(2)),
    spent: parseFloat((spent.length > 0 ? spent.reduce((p,c) => p+c) : 0).toFixed(2))
  }
  budget_balance.value = b
}

const budget_id: Ref<number> = ref(0);
const modalStore = useModalStore()
const budget_filter = useTemplateRef("budget_filter")
const date_filter = useTemplateRef("date_filter")
const get_selected_date_filter = (): DateSnippet => {
  const default_ds: DateSnippet = new DateSnippet({format: DateFormat.ym})
  return transactionStore.populated_dates.length > 0 && date_filter.value?.selectedIndex ? transactionStore.populated_dates[date_filter.value?.selectedIndex] || default_ds : default_ds
} 
interface TagBreakdown {
  tag: Tag,
  balance: ComputedRef<number>
}
const tag_breakdown: Ref<TagBreakdown[]> = ref([]);
const update_tag_breakdown = () => {
  const breakdown: TagBreakdown[] = [];
  const budgetTags = transactionStore.get_budget_tags(budget_id.value)
  for (const tag of budgetTags) {
    const values = transactionStore.get_meta_signed_budgeted_transactions({ budget_id: budget_id.value, tag_id: tag.Id, date_filter: get_selected_date_filter() }).map(m =>
      Math.abs(m.Value))
    breakdown.push({
      tag,
      balance: computed(() => values.length == 0 ? 0 : parseFloat((values.reduce((p, c) => p + c)).toFixed(2)))
    })
  }
  tag_breakdown.value = breakdown
}

const update = () => {
  budget_id.value = parseInt(budget_filter?.value?.selectedOptions ? budget_filter?.value?.selectedOptions[0].value || '0' : '0')

  update_budget_balance()
  update_tag_breakdown()
}

onMounted(async () => {
  const resp: ResponseStatus = await userStore.is_valid_session();
  if (resp.Code != 200) {
    ToastAlert(`${resp.Code}: ${resp.Message}`, "red")
    router.push("/login")
    return
  }
  await transactionStore.update_tags();
  await transactionStore.update_transactions();
  transactionStore.update_populated_dates();
  
  update()
})

const get_tag_goal = (tag: Tag): string => {
  if (tag.Tag_Budgets) {
    const tag_budget = tag.Tag_Budgets.find(b => b.Budget_Id == budget_id.value)
    if (tag_budget) {
      return (transactionStore.populated_dates[date_filter.value?.selectedIndex].format == DateFormat.y ? tag_budget.Goal * 12 : tag_budget.Goal).toString()
    }
  } return ''
}
</script>

<template>
  <NewTag></NewTag>
  <SidebarContainer>
    <div class="content-wrapper">
      <div class="headbar" style="display: flex; gap: 1em; justify-content: space-between;">
        <h1>Overview</h1>
        <div>
          <div style="display: flex; gap:0.5em; justify-content: space-between;">
            <select ref="date_filter" class="form-select" v-on:input="() => {
              update()
            }" aria-label="Default select example">
              <option v-for="opt in transactionStore.populated_dates">
                {{ opt.displayName }}
              </option>
            </select>
            <select ref="budget_filter" v-on:input="() => {
              update()
            }" class="form-select" aria-label="Default select example">
              <option v-for="budget in transactionStore.budgets" :value="budget.Id">
                {{ budget.Name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <h1 style="font-size: 3em;"
        :class="budget_balance.balance == 0 ? '' : budget_balance.balance > 0 ? 'balance-positive' : 'balance-negative'">
        {{
          f_number(budget_balance.balance) }} CAD<span style="font-size: 0.75em; color: initial;"> ({{ get_selected_date_filter().displayName }})</span></h1>
      <div style="display:flex; gap:1em;">
        <p class="balance-positive">{{ f_number(budget_balance.earned) }}</p>
        <p class="balance-negative">{{ f_number(budget_balance.spent) }}</p>
      </div>
      <div class="headbar" style="margin-top: 2.5em; display: flex; gap: 1em; justify-content: space-between;">
        <h2>Breakdown by Tag</h2>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Tag</th>
            <th scope="col">Goal</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="breakdown in tag_breakdown" :data-id="breakdown.tag.Id">
            <td>{{ breakdown.tag.Name }}</td>
            <td>{{ get_tag_goal(breakdown.tag) }}</td>
            <td>{{ breakdown.balance }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </SidebarContainer>
</template>
