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

    </div>
  </SidebarContainer>
</template>
