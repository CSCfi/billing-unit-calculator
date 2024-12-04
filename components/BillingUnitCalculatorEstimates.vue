<template>
  <c-card-content data-test="estimates" class="px-0">
    <billing-unit-calculator-consumption :total="total" :mobile="mobile" />

    <div class="mt-4 flex flex-wrap gap-2">
      <p>Detailed estimates per service</p>

      <c-spacer />

      <div class="flex gap-2">
        <c-button
          :disabled="+count === 0"
          size="small"
          ghost
          @click="onExpandAll()"
          @keyup.space="onExpandAll()"
          @keyup.enter="onExpandAll()"
        >
          <c-icon :size="18" :path="mdiExpandAll" />
          Expand all
        </c-button>

        <c-button
          :disabled="+count === 0"
          size="small"
          ghost
          @click="onCollapseAll()"
          @keyup.space="onCollapseAll()"
          @keyup.enter="onCollapseAll()"
        >
          <c-icon :size="18" :path="mdiCollapseAll" />
          Collapse all
        </c-button>
      </div>
    </div>

    <p v-if="+count === 0" class="text-sm opacity-60">No estimates added</p>

    <c-accordion v-model="expandedItems" v-control v-auto-animate multiple>
      <billing-unit-calculator-estimate
        v-for="[type, estimate] in Object.entries(estimates)"
        :key="estimate.type"
        :estimate="estimate"
        @remove="emit('remove', { ...$event, type })"
      />
    </c-accordion>
  </c-card-content>

  <c-card-actions v-if="+count > 0" justify="end" class="mt-6 px-0">
    <c-button
      @click="console.log('Implement email logic here')"
      @keyup.space="console.log('Implement email logic here')"
      @keyup.enter="console.log('Implement email logic here')"
    >
      Send estimates to email
    </c-button>
  </c-card-actions>
</template>

<script setup lang="ts">
import { mdiCollapseAll, mdiExpandAll } from '@mdi/js';
import type { Estimates } from '@/types/billingUnitCalculator';

const props = withDefaults(
  defineProps<{
    count: number;
    estimates: Estimates;
    mobile?: boolean;
  }>(),
  { mobile: false },
);

const emit = defineEmits(['remove', 'change']);

const showEmailDialog = ref(false);

const expandedItems = ref<string[]>([]);

const totalBillingUnits = computed(() => {
  let billingUnits = 0;
  Object.values(props.estimates).forEach((estimate) => {
    if (estimate.type === 'Puhti' || estimate.type === 'Mahti') {
      if (estimate.jobs) {
        estimate.jobs.forEach((job) => {
          billingUnits += job.consumption;
        });
      }

      if (estimate.storage) {
        estimate.storage.forEach((storage) => {
          billingUnits += parseFloat(storage.consumption);
        });
      }
    } else {
      estimate.configurations?.forEach((configuration) => {
        billingUnits += configuration.consumption;
      });
    }
  });

  return parseFloat(billingUnits.toFixed(2));
});

const recommendedPackage = computed(() => {
  const baseAmount = 10000;

  if (totalBillingUnits.value - baseAmount < 100000) {
    return {
      label: 'S',
      name: 'Small Resource Package',
      description: '100 000 billing units',
    };
  }

  if (totalBillingUnits.value - baseAmount < 1000000) {
    return {
      label: 'M',
      name: 'Medium Resource Package',
      description: '1 000 000 billing units',
    };
  }

  return {
    label: 'L',
    name: 'Large Resource Package',
    description: 'Over 1 000 000 billing units',
  };
});

const estimatedPackages = computed(() =>
  Math.ceil(totalBillingUnits.value / 20000),
);

const estimatedPrice = computed(() => {
  let price = 0;

  if (estimatedPackages.value >= 1) {
    price = 1190;
  }

  if (estimatedPackages.value > 1) {
    price += (estimatedPackages.value - 1) * 420;
  }

  return price;
});

const total = computed(() => ({
  totalBillingUnits: totalBillingUnits.value,
  recommendedPackage: recommendedPackage.value,
  estimatedPrice: estimatedPrice.value,
  estimatedPackages: estimatedPackages.value,
}));

watch(totalBillingUnits, () => {
  emit('change', totalBillingUnits.value);
});

const onExpandAll = () => {
  expandedItems.value = Object.values(props.estimates).map((item) => item.type);
};

const onCollapseAll = () => {
  expandedItems.value = [];
};
</script>
