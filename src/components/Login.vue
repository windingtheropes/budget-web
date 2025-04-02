<script setup lang="ts">
import { ref } from 'vue';

const email = ref(null);
const password = ref(null);

const validate_login = async () => {
  const email_value: string = email.value.value
  const password_value: string = password.value.value
  const response = await fetch("http://127.0.0.1:3000/api/account/login", {
    method: "PUT",
    body: JSON.stringify({ email: email_value, password: password_value }),
  })

  // follows format of {code: int, message/token: string}
  const { code, message, token } = JSON.parse(await response.text())
  if (code == 200) {
    localStorage.setItem("token", token)
    alert("logged in")
  } else {
    alert(code + " " + message)
  }
} 
</script>

<template>
  <h1>LOGIN</h1>
  <form>
    <input ref="email" name="email" placeholder="Email" type="text">
    <input ref="password" name="password" placeholder="Password" type="password">
    <button type="submit" v-on:click.prevent="validate_login()">Login</button>
  </form>
</template>
