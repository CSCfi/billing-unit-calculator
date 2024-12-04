<template>
  <div class="grid gap-6">
    <p>Storage</p>

    <div class="grid gap-12">
      <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        <c-text-field
          v-model="form.name"
          v-control
          v-bind="createValidation(validation, validate, 'name')"
          data-test="allas-name"
          class="sm:col-span-2 md:col-span-4"
          label="Name of the storage"
        />

        <c-text-field
          v-model="form.amountOfTiB"
          v-control
          v-bind="createValidation(validation, validate, 'amountOfTiB')"
          class="sm:col-span-2"
          data-test="allas-amountOfTiB"
          label="Amount of TiB required"
          name="amountOfTiB"
          step="0.1"
          type="number"
        />

        <c-text-field
          v-model="form.runningTime"
          v-control
          v-bind="createValidation(validation, validate, 'runningTime')"
          data-test="allas-runningTime"
          name="runningtime"
          label="Running time"
          type="number"
        />

        <c-select
          v-model="form.runningTimeUnit"
          v-control
          :items="runningTimeUnits"
          data-test="allas-runningTimeUnit"
          label="Unit"
          name="unit"
        />
      </div>
    </div>

    <div class="grid gap-2 sm:grid-cols-[1fr_auto] sm:justify-end">
      <status-button
        ref="statusButtonRef"
        class="min-w-60 sm:col-start-2"
        data-test="allas-add-to-estimates"
        fit
        @click="addToEstimates()"
        @keyup.space="addToEstimates()"
        @keyup.enter="addToEstimates()"
      >
        <c-icon :path="icons.mdiPlus" />
        Add to estimates
      </status-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mdiPlus } from '@mdi/js';
import type { SuiteRunResult } from 'vest';
import { billingUnitClaculatorAllasSuite } from './BillingUnitCalculatorAllas.validation';
import type { EstimateEvent, Estimates } from '@/types/billingUnitCalculator';
import type { StatusButton } from '#build/components';

useHead({
  title: 'Allas',
});

const emit = defineEmits<{
  (e: 'change', params: EstimateEvent): void;
}>();

const props = defineProps<{
  estimates: Estimates;
}>();

const statusButtonRef = ref<InstanceType<typeof StatusButton> | null>(null);

const validation = ref<SuiteRunResult<string, string>>();

const validate = async (name?: string) => {
  await nextTick();

  validation.value = billingUnitClaculatorAllasSuite(form, name);
};

const icons = { mdiPlus };

const factors = {
  hours: 1,
  days: 24,
  years: 8760,
};

const runningTimeUnits = [
  {
    value: 'hours',
    name: 'Hours',
  },
  {
    value: 'days',
    name: 'Days',
  },
  {
    value: 'years',
    name: 'Years',
  },
];

class AllasForm {
  constructor(
    public name: string,
    public amountOfTiB = 1,
    public runningTime = 1,
    public runningTimeUnit = 'hours',
  ) {}
}

const form = ref<AllasForm>(new AllasForm('Storage No.1'));

const nextValue = computed(
  () => (props.estimates?.Allas?.configurations?.length ?? 0) + 1,
);

const addToEstimates = async () => {
  await validate();

  if (!validation.value?.valid) {
    gotoError();

    return;
  }

  const { amountOfTiB, runningTime, runningTimeUnit, name } = form.value;

  const runningTimeInHours =
    runningTime * factors[runningTimeUnit as keyof typeof factors];

  const configuration = {
    description: `${amountOfTiB} TiB`,
    runningTimeInHours,
    consumption: parseFloat((1 * +amountOfTiB * runningTimeInHours).toFixed(2)),
    name,
  };

  emit('change', {
    type: 'Allas',
    key: 'configurations',
    value: [configuration],
  });

  form.value = new AllasForm(`Storage No.${nextValue.value}`);

  billingUnitClaculatorAllasSuite.reset();
  validation.value = undefined;

  statusButtonRef.value?.showMessage({
    message: 'Added to estimates',
    status: 'success',
  });
};
</script>
