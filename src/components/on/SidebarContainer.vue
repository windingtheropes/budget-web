<script setup lang="ts">
    import {get_userinfo} from "@/argent.ts"
    import { ref, type Ref } from "vue";
    let name: Ref<string> = ref('');

    const updatename = async () => {
        name.value = (await get_userinfo()).name
    }
    updatename()
</script>

<template>
    <div class="flex-container">
        <div class="sidebar">
            <ul class="nav flex-column">
                <li class="nav-item">
                    <a class="nav-link brand" href="#">{{name || "User Name"}}</a>
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
