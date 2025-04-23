<script setup lang="ts">
</script>

<template>
    <div class="flex-container">
        <div class="sidebar">
            <ul class="nav flex-column">
                <li class="nav-item">
                    <a class="nav-link brand" href="#">Jack Anderson</a>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link nav-login" to="/on/overview">Overview</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link nav-login" to="/on/transactions">Transactions</RouterLink>
                </li>
            </ul>
        </div>
        <div class="content-container">
            <slot></slot>
        </div>
    </div>
</template>
