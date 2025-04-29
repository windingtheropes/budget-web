<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { check_auth } from '@/argent';
import { type SessionForm } from '@/types';
import SidebarContainer from '@/components/on/SidebarContainer.vue'
const router = useRouter();

onBeforeMount(async () => {
  if (await check_auth() == false) {
    router.push("/login")
  }
})

</script>

<template>
  <SidebarContainer>
    <div class="content-wrapper">
      <div class="headbar" style="display: flex; justify-content: space-between;">
        <h1>Overview</h1>
        <h1>hello</h1>
      </div>

      <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
  Launch demo modal
</button>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
    </div>
  </SidebarContainer>
</template>
