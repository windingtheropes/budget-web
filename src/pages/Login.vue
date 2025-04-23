<script setup lang="ts">
import { ref } from 'vue';
const email = ref(null);
const password = ref(null);
import { login } from '@/argent';
import { type LoginForm, type LoginResponse } from '@/types';
import { useRouter } from 'vue-router';
const router = useRouter()
const send_login = async () => {
  const credentials: LoginForm  = {
    email: email.value.value, password: password.value.value
  }
  const resp: LoginResponse = await login(credentials);
  if (resp.code == 200) {
    localStorage.setItem("token", resp.token)
    router.push("/on/overview")
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
    <p>No account? <RouterLink class="link-opacity-80-hover" to="/register">Sign Up</RouterLink></p>
    <button type="submit" v-on:click.prevent="send_login()" class="btn btn-primary">Log In</button>
    </form>
  </div>

</template>
