<template>
  <div v-auto-animate class="-mx-4 grid gap-2">
    <div
      v-for="(item, index) in items"
      :key="'name' in item ? item.name : `storage--${index}`"
      data-test="estimate-item"
      class="overflow-hidden rounded-md border border-primary-100 bg-white shadow-md"
    >
      <div class="flex justify-between gap-4 px-4 py-2 text-primary-600">
        <div class="text-lg font-bold">
          {{ 'name' in item ? item.name : `Additional storage ${index + 1}` }}
        </div>

        <c-icon-button size="small" text @click="onRemoveItem(item)">
          <c-icon :path="mdiDelete" />
        </c-icon-button>
      </div>

      <div
        class="flex justify-between gap-4 bg-primary-100/50 px-4 py-2 text-sm"
      >
        <div class="font-semibold text-text-system">Specifications</div>

        <div class="grig justify-end text-end gap-2">
          {{ item.description }}

          <template v-if="'extra' in item">
            <p v-if="item.extra && 'name' in item.extra">
              {{ item.extra?.name }}
            </p>

            <p v-if="item.extra && 'description' in item.extra">
              {{ item.extra?.description }}
            </p>

            <p v-if="item.extra && 'subtitle' in item.extra">
              {{ item.extra?.subtitle }}
            </p>
          </template>
        </div>
      </div>

      <div class="flex justify-between gap-4 px-4 py-2 text-sm">
        <div class="font-semibold text-text-system">Running time</div>

        <div v-if="'runningTimeInHours' in item">
          {{ formatNumber(+item.runningTimeInHours) }} h
        </div>

        <div v-if="'storageTimeInHours' in item">
          {{ formatNumber(+item.storageTimeInHours) }} h
        </div>
      </div>

      <div
        class="flex justify-between gap-4 bg-primary-100/50 px-4 py-2 text-sm"
      >
        <div class="font-semibold text-text-system">Estimated consumption</div>

        <div>{{ formatNumber(+item.consumption, 2) }} BU</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiDelete } from '@mdi/js';
import type { EstimateItem } from '@/types/billingUnitCalculator';

const emit = defineEmits(['remove']);

defineProps<{
  items: EstimateItem[];
}>();

const onRemoveItem = (item: EstimateItem) => {
  emit('remove', item);
};
</script>
