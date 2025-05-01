<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { type ResponseStatus, type SessionForm } from '@/types';
import SidebarContainer from '@/components/on/SidebarContainer.vue'
import ToastAlert from '@/components/ToastAlert';
import { useUserStore } from '@/stores/User';
const router = useRouter();
const userStore = useUserStore()

onBeforeMount(async () => {
  const resp: ResponseStatus = await userStore.is_valid_session();
  if (resp.Code != 200) {
      ToastAlert(`${resp.Code}: ${resp.Message}`, "red")
      router.push("/login")
      return
  }
  return
})

</script>

<template>
  <SidebarContainer>
    <div class="content-wrapper">
      <div class="headbar" style="display: flex; justify-content: space-between;">
        <h1>Overview</h1>
        <h1>hello</h1>
      </div>
    </div>
  </SidebarContainer>
</template>
