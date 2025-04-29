<script setup lang="ts">
import { computed, ref, type Ref, onBeforeMount } from "vue"
import { check_auth, get_types } from "@/argent";
import { type TransactionEntry, type TransactionType } from "@/types";
import SidebarContainer from "@/components/on/SidebarContainer.vue";
import { useRouter } from "vue-router";
const router = useRouter()
onBeforeMount(async () => {
  if (await check_auth() == false) {
    router.push("/login")
  }
})

let types: Ref<TransactionType[]> = ref([]) 
let entries: Ref<TransactionEntry[]> = ref([]);

const updateEntries = async () => {
  const headers = new Headers()
  headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`)
  const response = await fetch("http://127.0.0.1:3000/api/argent/entry", {
    method: "GET",
    headers
  })
  if (response.status != 200) {

  }
  const entries_list: TransactionEntry[] = JSON.parse(await response.text()).Value
  // console.log(entries_list)
  entries.value = entries_list
}

(async () => {
  const t = await get_types()
  types.value = t
})()

updateEntries()

const getYMD = (seconds: number): string => {
  let date = new Date(seconds * 1000)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}
</script>

<template>
  <div class="modal-container">
    <div class="budget-modal med">
      <div class="modal-header">
        <h5>New Transaction</h5>
      </div>
      <div class="modal-body">
        <form>
          <div class="col-md-4">
            <label for="basic-url" class="form-label">Amount</label>
            <div class="input-group">
              <input type="number" step="0.01" class="form-control" id="amount"
                aria-describedby="basic-addon3 basic-addon4">
              <span class="input-group-text" id="basic-addon3">CAD</span>
            </div>
            <div class="form-text" id="basic-addon4">Currently only supports CAD.</div>
          </div>
          <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupSelect01">Type</label>
            <select class="form-select" id="inputGroupSelect01">
              <option v-for="type in types" :value="type.Id">{{ type.Name }}</option>
            </select>
          </div>
          <div class="row-mb">
            <label for="validationCustom01" class="form-label">Description</label>
            <input type="text" step="0.01" class="form-control" id="validationCustom01" value="Mark" required>
          </div>

        </form>
      </div>
      <div class="modal-footer">
        <button type="submit" v-on:click.prevent="" class="btn btn-primary">Create</button>
      </div>
    </div>
  </div>

  <SidebarContainer>
    <div class="content-wrapper">
      <div class="flex-container headbar">
        <h1>Transactions</h1>
        <a class="logo-button" href="#">
          <p>+</p>
          <p>New</p>
        </a>
      </div>
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
          <tr v-for="entry in entries" :data-id="entry.Id"
            :class="(() => { if (entry.Amount > 0) { return 'entry-positive' } else { return 'entry-negative' } })()">
            <td>{{ getYMD(entry.Unix_Timestamp) }}</td>
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
      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
        Launch demo modal
      </button>
    </div>
  </SidebarContainer>

</template>
