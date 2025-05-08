<script setup lang="ts">
import { useTemplateRef } from 'vue';

const container = useTemplateRef("modal-container")
const show = () => {
    container.value?.classList.remove("hidden");
}
const hide = () => {
    container.value?.classList.add("hidden");
}

defineExpose({
    show, hide
})

</script>

<template>
    <div ref="modal-container" class="modal-container hidden">
        <slot></slot>
    </div>
</template>