<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
    <header>
        <div class="wrapper">
            <nav class="navbar navbar-expand-lg topnav">
                <RouterLink class="navbar-brand" to="/">{ budget }</RouterLink>
                <ul class="navbar-nav topnav-middle">
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/on/overview">Overview</RouterLink>
                    </li>
                </ul>
                <ul class="navbar-nav topnav-right">
                    <li class="nav-item">
                        <RouterLink class="nav-link nav-account nav-login pill" to="/login">Log In</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link nav-account nav-signup pill" to="/register">Sign Up</RouterLink>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
    <body>
        <slot></slot>
    </body>
</template>