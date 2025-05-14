<script setup lang="ts">
import { useModalStore } from '@/stores/ModalStore';

const ms = useModalStore()

</script>
<template>
    <!-- Only show the modal container if a current modal is selected -->
     <div v-if="ms.CurrentModal" class="modal-container">
        <!-- when catch emit close from child, run closemodal function -->
        <component v-if="ms.CurrentModal" :is="ms.ModalComponent" v-bind="ms.ModalProps" @close="ms.closeModal"/>
     </div>
</template>