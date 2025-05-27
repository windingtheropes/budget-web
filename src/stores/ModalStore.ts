import BudgetModal from '@/components/on/BudgetModal.vue';
import TagModal from '@/components/on/TagModal.vue';
import TransactionModal from '@/components/on/TransactionModal.vue';
import { defineStore } from 'pinia'
import { computed, ref, type Component, type Ref } from 'vue'

// Stores the currently active modal and properties
export const useModalStore = defineStore('modal', () => {
    const CurrentModal: Ref<string | null> = ref(null);
    const ModalProps = ref({})

    const openModal = (name: string, props = {}) => {
        CurrentModal.value = name
        ModalProps.value = props
    }
    const closeModal = () => {
        CurrentModal.value = null;
    }

    // Define the list of deployable modals
    const modals: { [key: string]: Component } = {
        "Transaction": TransactionModal,
        "Budget": BudgetModal,
        "Tag": TagModal
    }
    
    // Return the Component of the active modal, or nothing
    const ModalComponent = computed(() => {
        if (CurrentModal.value) {
            if(modals[CurrentModal.value]) {
                return modals[CurrentModal.value]
            }
        } else { return null }
    })
    
    return {
        openModal, closeModal, ModalProps, CurrentModal, ModalComponent, modals
    }
})

