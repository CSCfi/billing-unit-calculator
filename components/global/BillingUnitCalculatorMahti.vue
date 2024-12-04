<template>
  <div class="grid gap-6">
    <p>Jobs</p>

    <div class="grid gap-12">
      <div
        v-for="(form, index) in forms"
        :key="`mahti-job-${index}`"
        class="grid gap-6 sm:grid-cols-2"
      >
        <c-text-field
          v-model="form.name"
          v-control
          v-bind="createValidation(validation, validate, `name-${index}`)"
          :data-test="`mahti-name`"
          class="sm:col-span-2"
          label="Name of the job"
        />

        <c-select
          id="partition"
          v-model="form.partition"
          v-control
          v-bind="createValidation(validation, validate, `partition-${index}`)"
          :items="partitionTypes"
          :data-test="`mahti-partition`"
          label="Partition"
          name="partition"
        />

        <c-text-field
          v-if="form.partition === 'normal'"
          v-model="form.numberOfNodes"
          v-control
          v-bind="
            createValidation(validation, validate, `numberOfNodes-${index}`)
          "
          :data-test="`mahti-numberOfNodes`"
          label="Number of nodes"
          name="numberOfNodes"
          type="number"
        />

        <c-text-field
          v-if="form.partition === 'interactive'"
          v-model="form.numberOfCores"
          v-control
          v-bind="
            createValidation(validation, validate, `numberOfCores-${index}`)
          "
          :data-test="`mahti-numberOfCores`"
          label="Number of interactive cores"
          name="numberOfCores"
          type="number"
        />

        <c-text-field
          v-if="form.partition === 'gpu'"
          v-model="form.numberOfGpus"
          v-control
          v-bind="
            createValidation(validation, validate, `numberOfGpus-${index}`)
          "
          :data-test="`mahti-numberOfGpus`"
          label="Number of GPUs"
          name="numberOfGpus"
          type="number"
        />

        <c-text-field
          v-model="form.runningTime"
          v-control
          v-bind="
            createValidation(validation, validate, `runningTime-${index}`)
          "
          :data-test="`mahti-runningTime`"
          name="runningtime"
          label="Running time"
          type="number"
        />

        <c-select
          id="running-time-unit"
          v-model="form.runningTimeUnit"
          v-control
          :items="runningTimeUnits"
          :data-test="`mahti-runningTimeUnit`"
          label="Unit"
          name="unit"
        />
      </div>
    </div>

    <div class="grid gap-2 sm:grid-cols-[1fr_auto_auto] sm:justify-end">
      <status-button
        ref="statusButtonRef"
        data-test="mahti-add-to-estimates"
        class="min-w-60 justify-self-end sm:col-start-3"
        fit
        @click="addToEstimates()"
        @keyup.enter="addToEstimates()"
        @keyup.space="addToEstimates()"
      >
        <c-icon :path="icons.mdiPlus" />

        Add to estimates
      </status-button>
    </div>

    <billing-unit-calculator-additional-storage
      type="Mahti"
      :estimates="estimates"
      @change="onAdditionalStorageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { mdiPlus } from '@mdi/js';
import type { SuiteRunResult } from 'vest';
import { billingUnitCalculatorMahtiSuite } from './BillingUnitCalculatorMahti.validation';
import type {
  Estimates,
  EstimateEvent,
  MahtiEstimate,
  Storage,
} from '@/types/billingUnitCalculator';
import type { StatusButton } from '#build/components';

useHead({
  title: 'Mahti',
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

  validation.value = billingUnitCalculatorMahtiSuite({ items: forms }, name);
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

const partitionTypes = [
  {
    name: 'Normal',
    value: 'normal',
  },
  {
    name: 'Interactive',
    value: 'interactive',
  },
  {
    name: 'GPU',
    value: 'gpu',
  },
];

class MahtiForm {
  constructor(
    public name: string,
    public partition = 'normal',
    public numberOfNodes = 1,
    public numberOfCores = 1,
    public numberOfGpus = 1,
    public runningTime = 1,
    public runningTimeUnit = 'hours',
    public id = Date.now(),
  ) {}
}

const forms = ref<MahtiForm[]>([new MahtiForm('Job No.1')]);

const formCount = ref(1);

const nextValue = computed(
  () => (props.estimates?.Mahti?.jobs?.length ?? 0) + formCount.value + 1,
);

const mahtiEstimates = ref<MahtiEstimate>({
  type: 'Mahti',
  jobs: [],
  storage: [],
});

const addToEstimates = async () => {
  await validate();

  if (!validation.value?.valid) {
    gotoError();

    return;
  }

  mahtiEstimates.value.jobs = forms.value.map((form: MahtiForm) => {
    const { runningTime, runningTimeUnit, ...item } = form;
    const runningTimeInHours =
      runningTime * factors[runningTimeUnit as keyof typeof factors];

    let consumption = parseFloat(
      (item.numberOfNodes * 100 * runningTimeInHours).toFixed(2),
    );
    let description = `${item.numberOfNodes} nodes`;

    if (item.partition === 'interactive') {
      consumption = parseFloat(
        (item.numberOfCores * runningTimeInHours).toFixed(2),
      );
      description = `${item.numberOfCores} CPUs`;
    } else if (item.partition === 'gpu') {
      consumption = parseFloat(
        (item.numberOfGpus * 100 * runningTimeInHours).toFixed(2),
      );
      description = `${item.numberOfGpus} GPUs`;
    }

    return {
      ...item,
      consumption,
      description,
      runningTimeInHours,
    };
  });

  emit('change', {
    type: 'Mahti',
    key: 'jobs',
    value: mahtiEstimates.value.jobs,
  });

  formCount.value = 0;

  await nextTick();

  forms.value = [new MahtiForm(`Job No.${nextValue.value}`)];

  formCount.value = 1;

  billingUnitCalculatorMahtiSuite.reset();
  validation.value = undefined;

  statusButtonRef.value?.showMessage({
    message: 'Added to estimates',
    status: 'success',
  });
};

const onAdditionalStorageChange = (storage: Storage) => {
  emit('change', {
    type: 'Mahti',
    key: 'storage',
    value: [storage],
  });
};
</script>
