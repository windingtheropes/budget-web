<script setup lang="ts">

</script>

<template>
    <div class="popup">
        <h1>New Transaction</h1>
        <form>
            <input ref="amount" name="amount" placeholder="0.00" type="text">
            <input ref="currency" name="currency" placeholder="CAD" type="text">
            <input ref="description" name="description" placeholder="Description" type="text">

            <button type="submit" v-on:click.prevent="">Insert</button>
        </form>
    </div>
</template>
