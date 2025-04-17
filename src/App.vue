<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="navbar navbar-dark navbar-expand-lg" style="background-color: #4080ff;">
        <a class="navbar-brand" href="#">Budget</a>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/overview">Overview</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/transactions">Transactions</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/login">Login</RouterLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </header>

  <body>
    <RouterView />
  </body>
</template>