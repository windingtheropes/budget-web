<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { RouterLink } from 'vue-router'
import { create_account } from '@/argent';
import { type GenericResponse } from '@/types';
const name = useTemplateRef("name")
const email = useTemplateRef("email")
const password = useTemplateRef("password")
const form = useTemplateRef("loginform")

const send_registration = async () => {
  const registration = {
    name: name.value.value, email: email.value.value, password: password.value.value
  }
  const resp: GenericResponse = await create_account(registration);
  alert(`${resp.code} ${resp.message}`)
} 
</script>

<template>

  <div class="content-wrapper">
    <h1>Create Account</h1>
    <form ref="loginform" class="login needs-validation" novalidate>
      <div class="form-group">
        <label for="name">Full Name</label>
        <input ref="name" type="text" class="form-control" id="name" aria-describedby="nameHelp" placeholder="Name"
          required>
      </div>
      <div class="form-group">
        <label for="email">Email address</label>
        <input ref="email" type="email" class="form-control" id="email" aria-describedby="emailHelp" placeholder="Email"
          required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input ref="password" type="password" class="form-control" id="password" placeholder="Password" required>
      </div>
      <p>Have an account? <RouterLink class="link-opacity-80-hover" to="/login">Login</RouterLink>
      </p>
      <button type="submit" v-on:click.prevent="send_registration()" class="btn btn-primary">Sign Up</button>
    </form>
  </div>

</template>
