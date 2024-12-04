<template>
  <c-accordion-item
    v-if="
      (estimate.jobs && estimate.jobs.length) ||
      (estimate.configurations && estimate.configurations.length) ||
      (estimate.storage && estimate.storage.length)
    "
    :value="estimate.type"
    :data-test="`estimates-${estimate.type.toLowerCase().replace(' ', '')}`"
  >
    <c-icon slot="icon" :path="estimate.icon" />

    <div slot="header" class="grid content-center gap-1 py-2">
      <p class="font-semibold leading-none text-primary">{{ estimate.type }}</p>

      <p class="text-sm leading-none">
        {{ formatNumber(totalConsumption, 2) }} BU
      </p>
    </div>

    <div class="grid gap-2">
      <template v-if="hasJobs">
        <billing-unit-calculator-estimate-item
          :items="estimate.jobs as unknown as Job[]"
          data-test="estimate-items"
          @remove="onRemoveEstimate({ key: 'jobs', value: $event })"
        />

        <billing-unit-calculator-estimate-item
          v-if="estimate.storage?.length"
          data-test="estimate-storage-items"
          :items="estimate.storage as unknown as Storage[]"
          @remove="onRemoveEstimate({ key: 'storage', value: $event })"
        />
      </template>

      <billing-unit-calculator-estimate-item
        v-else
        :items="estimate.configurations as unknown as Configuration[]"
        data-test="estimate-items"
        @remove="onRemoveEstimate({ key: 'configurations', value: $event })"
      />
    </div>
  </c-accordion-item>
</template>

<script setup lang="ts">
import type {
  Configuration,
  Estimate,
  Job,
  Storage,
} from '@/types/billingUnitCalculator';

const props = defineProps<{
  estimate: Estimate;
}>();

const emit = defineEmits(['remove']);

const hasJobs = computed(
  () => props.estimate.type === 'Puhti' || props.estimate.type === 'Mahti',
);

const onRemoveEstimate = ({
  key,
  value,
}: {
  key: string;
  value: Configuration | Storage | Job;
}) => {
  emit('remove', { key, value: [value] });
};

const totalConsumption = computed(() =>
  [
    ...((props.estimate.jobs || []) as any[]),
    ...((props.estimate.storage || []) as any[]),
    ...((props.estimate.configurations || []) as any[]),
  ].reduce((total, item) => {
    return total + +item.consumption;
  }, 0),
);
</script>
