<script setup lang="ts">
import { computed, ref, watch, type Ref } from "vue"
import { type TransactionEntry } from "@/types";

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
console.log(entries)
</script>

<template>
  <h1>Transactions</h1>
  <table>
    <thead>
      <tr>
        <!-- <th>Date</th> -->
        <th>Amount</th>
        <th>Currency</th>
        <th>Tags</th>
      </tr>
    </thead>
    <tbody v-for="entry in entries">
      <tr :data-id="entry.Id">
        <!-- <td>{{ new Date(entry.Unix_Timestamp) }}</td> -->
        <td>{{ entry.Amount }}</td>
        <td>{{ entry.Currency }}</td>
        <td v-for="tag in entry.Tags">{{tag.Name}}</td>
      </tr>
    </tbody>
  </table>
</template>
