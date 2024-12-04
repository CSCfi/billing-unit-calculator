<template>
  <div class="grid gap-6">
    <p>Instances</p>

    <div class="grid gap-12">
      <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        <c-text-field
          v-model="form.name"
          v-control
          v-bind="createValidation(validation, validate, 'name')"
          :data-test="`rahti-name`"
          label="Name of the configuration"
          class="sm:col-span-2 md:col-span-4"
        />

        <c-text-field
          v-model="form.amountOfPods"
          v-control
          v-bind="createValidation(validation, validate, 'amountOfPods')"
          :data-test="`rahti-amountOfPods`"
          class="sm:col-span-2 md:col-span-4"
          label="Amount of pods"
          type="number"
        />

        <c-text-field
          v-model="form.numberOfCpuCoresPerPod"
          v-control
          v-bind="
            createValidation(validation, validate, 'numberOfCpuCoresPerPod')
          "
          :data-test="`rahti-numberOfCpuCoresPerPod`"
          class="sm:col-span-2"
          label="Number of CPU cores per pod"
          name="numberOfCpuCoresPerPod"
          step="0.1"
          type="number"
        />

        <c-text-field
          v-model="form.ramPerPod"
          v-control
          v-bind="createValidation(validation, validate, 'ramPerPod')"
          data-test="rahti-ramPerPod"
          class="sm:col-span-2"
          label="GB of RAM per pod"
          name="ramPerPod"
          step="0.1"
          type="number"
        />

        <c-text-field
          v-model="form.tibOfStorage"
          v-control
          v-bind="createValidation(validation, validate, 'tibOfStorage')"
          data-test="rahti-tibOfStorage"
          class="sm:col-span-2"
          label="TiB of storage"
          name="tibOfStorage"
          type="number"
        />

        <c-text-field
          v-model="form.runningTime"
          v-control
          v-bind="createValidation(validation, validate, 'runningTime')"
          :data-test="`rahti-runningTime`"
          label="Running time"
          name="runningtime"
          type="number"
        />

        <c-select
          v-model="form.runningTimeUnit"
          v-control
          :items="runningTimeUnits"
          :data-test="`rahti-runningTimeUnit`"
          label="Unit"
          name="unit"
        />
      </div>
    </div>

    <div class="grid gap-2 sm:grid-cols-[1fr_auto] sm:justify-end">
      <status-button
        ref="statusButtonRef"
        class="min-w-60 sm:col-start-2"
        data-test="rahti-add-to-estimates"
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
import { billingUnitCalculatorRahtiSuite } from './BillingUnitCalculatorRahti.validation';
import type { EstimateEvent, Estimates } from '@/types/billingUnitCalculator';
import type { StatusButton } from '#build/components';

useHead({
  title: 'Rahti',
});

const emit = defineEmits<{
  change: [params: EstimateEvent];
}>();

const props = defineProps<{
  estimates: Estimates;
}>();

const statusButtonRef = ref<InstanceType<typeof StatusButton> | null>(null);

const validation = ref<SuiteRunResult<string, string>>();

const validate = async (name?: string) => {
  await nextTick();

  validation.value = billingUnitCalculatorRahtiSuite(form, name);
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

class RahtiForm {
  constructor(
    public name: string,
    public amountOfPods = 1,
    public numberOfCpuCoresPerPod = 1,
    public ramPerPod = 0.1,
    public tibOfStorage = 0.1,
    public runningTime = 1,
    public runningTimeUnit = 'hours',
    public id = Date.now(),
  ) {}
}

const form = ref<RahtiForm>(new RahtiForm('Configuration No.1'));

const nextValue = computed(
  () => (props.estimates?.Rahti?.configurations?.length ?? 0) + 1,
);

const addToEstimates = async () => {
  await validate();

  if (!validation.value?.valid) {
    gotoError();

    return;
  }

  const { runningTime, runningTimeUnit, name } = form.value;

  const runningTimeInHours =
    runningTime * factors[runningTimeUnit as keyof typeof factors];

  const configuration = {
    description: `${form.value.amountOfPods} x (${form.value.numberOfCpuCoresPerPod} cores + ${form.value.ramPerPod} GB + ${form.value.tibOfStorage} TiB)`,
    runningTimeInHours,
    consumption: parseFloat(
      (
        (form.value.numberOfCpuCoresPerPod * 0.5 +
          form.value.ramPerPod * 1 +
          form.value.tibOfStorage * 3) *
        runningTimeInHours *
        form.value.amountOfPods
      ).toFixed(2),
    ),
    name,
  };

  emit('change', {
    type: 'Rahti',
    key: 'configurations',
    value: [configuration],
  });

  form.value = new RahtiForm(`Configuration No.${nextValue.value}`);

  billingUnitCalculatorRahtiSuite.reset();
  validation.value = undefined;

  statusButtonRef.value?.showMessage({
    message: 'Added to estimates',
    status: 'success',
  });
};
</script>
