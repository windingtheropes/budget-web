<script setup lang="ts">
import { onMounted, ref, useTemplateRef, type Ref } from "vue";
import { useUserStore } from "@/stores/User";
import type { ResponseStatus } from "@/types";
import ToastAlert from "../ToastAlert";
import { useRouter } from "vue-router";
import ModalHost from "./ModalHost.vue";
import { useTransactionStore } from "@/stores/Argent";
import { useModalStore } from "@/stores/ModalStore";

const transactionStore = useTransactionStore()
const modalStore = useModalStore()
const name: Ref<string> = ref('');
const userStore = useUserStore()
// const cbo: Ref<boolean> = ref(false)
const updateName = async () => {
    if (!userStore.user_info) {
        const resp: ResponseStatus = await userStore.update_user_info()
        if (resp.Code != 200) {
            ToastAlert(`${resp.Code}: ${resp.Message}`, 'red')
            return
        }
        if (!userStore.user_info) {
            ToastAlert(`Error fetching user info.`, 'red')
            return
        }
    }

    name.value = `${userStore.user_info.first_name} ${userStore.user_info.last_name}`
}
const router = useRouter()
const logout = () => {
    userStore.logout();
    router.push("/login")
}

// onMounted(() => {
//     document.addEventListener('keydown', (e) => {
//         if(e.key == "p" && cbo.value == false) {
//             cbo.value = true
//             document.getElementById("cb")?.focus()
//         }
//         if(e.key == "Escape") cbo.value = false
//     })
// })
updateName()

</script>

<template>

    <body>
        <!-- <div v-if="cbo" class="modal-container">
            <div class="command-bar">
                <input id="cb" type="text" class="form-control" 
                        placeholder="Start typing" autocomplete="off">
            </div>
        </div> -->
        <ModalHost />
        <div class="flex-container">
            <div class="sidebar">
                <ul class="nav flex-column">
                    <div class="sidebar-brand">
                        <li class="nav-item">
                            <a class="nav-link brand" href="#">{{ name || "User Name" }}</a>
                        </li>
                        <button class="btn btn-danger" v-on:click="logout()">Log Out</button>
                    </div>
                    <div class="sidebar-links">
                        <li class="nav-item">
                            <RouterLink class="nav-link nav-login" to="/on/overview">Overview</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link nav-login" to="/on/transactions">Transactions</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link nav-login" to="/on/budgets">Budgets</RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink class="nav-link nav-login" to="/on/tags">Tags</RouterLink>
                        </li>
                    </div>
                </ul>
            </div>
            <div class="content-container">
                <slot></slot>
            </div>
        </div>
    </body>
</template>
