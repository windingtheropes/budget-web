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
  <h1>Login</h1>
  <form style="width: 25%">
    <div class="form-group">
      <label for="email">Email address</label>
      <input ref="email" type="email" class="form-control" id="email" aria-describedby="emailHelp"
        placeholder="Email">
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input ref="password" type="password" class="form-control" id="password" placeholder="Password">
    </div>
    <!-- <div class="form-group form-check">
      <input type="checkbox" class="form-check-input" id="exampleCheck1">
      <label class="form-check-label" for="exampleCheck1">Check me out</label>
    </div> -->
    <button type="submit" v-on:click.prevent="validate_login()" class="btn btn-primary">Submit</button>
  </form>
</template>
