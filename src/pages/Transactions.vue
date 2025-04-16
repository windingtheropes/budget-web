<script setup lang="ts">
import { computed, ref, watch, type Ref } from "vue"
import { type TransactionEntry } from "@/types";
import NewTransaction from '..//components/NewTransaction.vue'

let entries: Ref<TransactionEntry[]> = ref([]);

const updateEntries = async () => {
  const headers = new Headers()
  headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`)
  const response = await fetch("http://127.0.0.1:3000/api/argent/entry", {
    method: "GET",
    headers
  })

  const entries_list: TransactionEntry[] = JSON.parse(await response.text()).Value
  // console.log(entries_list)
  entries.value = entries_list
}

updateEntries()

const getYMD = (seconds: number): string => {
  let date = new Date(seconds * 1000)
  return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
}
console.log(entries)
</script>

<template>
  <h1>Transactions</h1>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Date</th>
        <th scope="col">Amount</th>
        <th scope="col">Description</th>
        <th scope="col">Tags</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in entries" :data-id="entry.Id" :class="(() => { if (entry.Amount > 0) {return 'entry-positive'} else {return 'entry-negative'} })()">
        <td>{{ getYMD(entry.Unix_Timestamp)}}</td>
        <td>${{ entry.Amount }} {{ entry.Currency }}</td>
        <td>{{ entry.Msg }}</td>
        <td v-for="tag in entry.Tags"><span :data-id="tag.Id">{{ tag.Name }}</span></td>
      </tr>
      <tr class="entry-positive">
        <td>2025/04/14</td>
        <td>$100 CAD</td>
        <td>Phone Bill</td>
        <td><span data-id="tag.Id" class="tag red">Utilities</span></td>
      </tr>
    </tbody>
  </table>
</template>
