<script setup lang="ts">
import { useTransactionStore } from '@/stores/Argent';
import type { Tag } from '@/types';
import { computed, ref, useTemplateRef, type Ref } from 'vue';

const transactionStore = useTransactionStore()
const props = defineProps({
    budgetId: Number
})

const tag_list = useTemplateRef("tags")
const get_selected_tags_by_id = (): number[] => {
    const tags_array: number[] = []
    const tags = tag_list.value?.getElementsByTagName("div")
    if (!tags) return []
    for (const tag of tags) {
        const children = tag.getElementsByTagName("input")

        if (children.length == 0) { continue }
        const input = children[0]

        const data_id = input.getAttribute("data-id")
        if (!data_id) { continue }

        if (input.checked) {
            tags_array.push(parseInt(data_id))
        }
    }
    return tags_array
}

const available_tags: Ref<Tag[]> = ref([])
const update_available_tags = (budget_id: number) => {
    available_tags.value = transactionStore.get_budget_tags(budget_id || 0)
}

defineExpose({
    selectedTags: computed(() => get_selected_tags_by_id),
    update_available_tags
})
</script>

<template>
    <label class="form-label">Tags</label>
    <div ref="tags">
        <div v-for="tag in available_tags" class="col-md-4 form-check">
            <input :data-id="tag.Id" class="form-check-input" type="checkbox" id="checkIndeterminateDisabled">
            <label :ref="'tag-checkbox-' + tag.Id.toString()" class="form-check-label" for="checkIndeterminateDisabled">
                {{ tag.Name }}
            </label>
        </div>
    </div>

</template>