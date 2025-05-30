<script setup lang="ts">
import NavbarContainer from '@/components/NavbarContainer.vue';
import { ref, useTemplateRef } from 'vue';

const seq = ref("")
const timer = (ms: number) => new Promise(res => setTimeout(res, ms))
// key time in miliseconds
const sequence = async (text: string, key_time: number) => {
    let output = '';
    for (const char of text) {
        output = `${output}${char}`
        seq.value = output
        await timer(key_time)
    }
}
// key time in miliseconds
const backspace = async (key_time: number) => {
    let output = seq.value;
    while (output.length > 0) {
        output = output.slice(0, output.length - 2)
        seq.value = output
        await timer(key_time)
    }
}

const landing_typing = async () => {
    await sequence("budgeting that works for you.", 100)
    await backspace(75)
    await sequence("{budget} works for you.", 100)
}

landing_typing()

</script>

<template>
    <NavbarContainer>
        <!-- <div class="content-wrapper"> -->
        <div class="big-talk-space">
            <div class="content-wrapper">
                <h1 class="big-talk">{{ seq }}</h1>
            </div>
        </div>
        <div class="big-talk-space-alt">
            <div class="content-wrapper">
                <h1>Keeping track of your money is hard. It doesn't have to be.</h1>
                <p>Traditionally, tracking money and budgeting digitally has been inaccessible to the everyday user and
                    frustrating for the seasoned, for one reason: spreadsheets. They're difficult to set up
                    and maintain, and only become harder to navigate as they get larger. As powerusers, we recognize and
                    appreciate the power that comes with spreadsheets, so designing a new system meant taking advanced
                    features into account, integrating them into a beautifully optimized interface that is
                    accomodating to anyone, irrespective of technical prowess.</p>
                <p>budget is designed for the goal-oriented saver, the frugal minimalist, the savvy planner, and
                    anywhere in between, it's designed for you.</p>
            </div>
        </div>
        <div class="footer">
            <div class="content-wrapper">
                <div>
                    <h1>{ budget }</h1>
                    <span>keeping track of your money is hard. it doesn't have to be.</span>
                </div>
                <div style="display:flex; justify-content: space-between">
                    <div style="display:flex; gap: 0.5em;">
                        <RouterLink to="/">home</RouterLink>
                        <RouterLink to="/on/overview">overview</RouterLink>
                        <RouterLink to="/login">login</RouterLink>
                        <RouterLink to="/register">signup</RouterLink>
                    </div>
                    <div>
                        <p>2025 jack anderson</p>
                    </div>
                </div>
            </div>
        </div>
        <!-- </div> -->
    </NavbarContainer>
</template>