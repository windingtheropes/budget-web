<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="navbar navbar-expand-lg topnav">
        <a class="navbar-brand" style="color: blue; font-weight: 700;"  href="#">Budget</a>
        <ul class="navbar-nav topnav-middle">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/on/overview">Overview</RouterLink>
          </li>
        </ul>
        <ul class="navbar-nav topnav-right">
          <li class="nav-item">
            <RouterLink class="nav-link nav-login" to="/login">Log In</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link nav-signup" to="/register">Sign Up</RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>

  <body>
    <RouterView />
  </body>
</template>