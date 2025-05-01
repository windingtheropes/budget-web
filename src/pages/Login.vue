<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
const email = useTemplateRef("email");
const password = useTemplateRef("password");

import ToastAlert from '@/components/ToastAlert';
import { type GenericResponse, type LoginForm, type ResponseStatus } from '@/types';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/User';

const userStore = useUserStore()
const router = useRouter()
const send_login = async () => {
  const credentials: LoginForm = {
    email: email.value?.value, password: password.value?.value
  }
  const resp: ResponseStatus = await userStore.login(credentials);
  if (resp.Code == 200) {
    router.push("/on/overview")
    return
  } else {
    ToastAlert(`(${resp.Code}): ${resp.Message}`, "red")
    return
  }
} 
</script>

<template>

  <div class="content-wrapper">
    <h1>Login</h1>
    <form class="login">
      <div class="form-group">
        <label for="email">Email address</label>
        <input ref="email" type="email" class="form-control" id="email" aria-describedby="emailHelp"
          placeholder="Email">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input ref="password" type="password" class="form-control" id="password" placeholder="Password">
      </div>
      <p>No account? <RouterLink class="link-opacity-80-hover" to="/register">Sign Up</RouterLink>
      </p>
      <button type="submit" v-on:click.prevent="send_login()" class="btn btn-primary">Log In</button>
    </form>
  </div>

</template>
