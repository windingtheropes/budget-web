<script setup lang="ts">
const props = defineProps(['message', 'color'])
</script>

<template>
    <div class="toastalert" :class="props.color ? 'toastalert-' + props.color : ''">
        <i class="bi bi-exclamation-circle"></i>
        <div>{{ props.message }}</div>
    </div>
</template>