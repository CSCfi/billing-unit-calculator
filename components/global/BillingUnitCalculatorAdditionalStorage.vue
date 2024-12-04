<template>
  <div>
    <p class="mb-4">Storage</p>

    <div class="mb-8">
      <status-notification type="info">
        <p>Included free of change:</p>

        <ul class="mb-2 list-disc pl-4">
          <li>1 TiB scratch disk storage</li>

          <li>50 GiB projappl disk storage</li>
        </ul>

        <p>Enter the amount for the additional disk storage required.</p>
      </status-notification>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
      <c-text-field
        v-model="form.amountOfTiB"
        v-control
        v-bind="createValidation(validation, validate, 'amountOfTiB')"
        class="sm:col-span-2"
        data-test="additional-amountOfTiB"
        label="Additional amount of TiB"
        name="amountOfTiB"
        step="0.1"
        type="number"
      />

      <c-text-field
        v-model="form.runningTime"
        v-control
        v-bind="createValidation(validation, validate, 'runningTime')"
        data-test="additional-runningTime"
        label="Running time"
        type="number"
      />

      <c-select
        v-model="form.runningTimeUnit"
        v-control
        data-test="additional-runningTimeUnit"
        label="Unit"
        name="unit"
        :items="runningTimeUnits"
      />
    </div>

    <div class="grid gap-2 sm:grid-cols-[1fr_auto] sm:justify-end">
      <status-button
        ref="statusButtonRef"
        class="min-w-60 sm:col-start-2"
        data-test="additional-add-to-estimates"
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
import { billingUnitClaculatorAdditionalStorageSuite } from './BillingUnitCalculatorAdditionalStorage.validation';
import type { StatusButton } from '#build/components';

const emit = defineEmits(['change']);

const statusButtonRef = ref<InstanceType<typeof StatusButton> | null>(null);

const validation = ref<SuiteRunResult<string, string>>();

const validate = async (name?: string) => {
  await nextTick();

  validation.value = billingUnitClaculatorAdditionalStorageSuite(form, name);
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

const form = ref({
  amountOfTiB: 0,
  runningTime: 0,
  runningTimeUnit: runningTimeUnits[0].value,
});

const addToEstimates = async () => {
  await validate();

  if (!validation.value?.valid) {
    gotoError();

    return;
  }

  const { amountOfTiB, runningTime, runningTimeUnit } = form.value;

  const storageTimeInHours =
    runningTime * factors[runningTimeUnit as keyof typeof factors];
  const costPerHour = 5 * amountOfTiB;

  emit('change', {
    description: `${amountOfTiB} TiB`,
    storageTimeInHours,
    consumption: (storageTimeInHours * costPerHour).toFixed(2),
  });

  form.value = {
    amountOfTiB: 0,
    runningTime: 0,
    runningTimeUnit: runningTimeUnits[0].value,
  };

  statusButtonRef.value?.showMessage({
    message: 'Added to estimates',
    status: 'success',
  });

  billingUnitClaculatorAdditionalStorageSuite.reset();
  validation.value = undefined;
};
</script>
