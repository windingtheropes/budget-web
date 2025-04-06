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
  <form>
    <div class="form-group">
      <label for="exampleInputEmail1">Email address</label>
      <input ref="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
        placeholder="Enter email">
      <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1">Password</label>
      <input ref="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
    </div>
    <div class="form-group form-check">
      <input type="checkbox" class="form-check-input" id="exampleCheck1">
      <label class="form-check-label" for="exampleCheck1">Check me out</label>
    </div>
    <button type="submit" v-on:click.prevent="validate_login()" class="btn btn-primary">Submit</button>
  </form>
</template>
