<template>
  <div class="grid gap-6">
    <p>Jobs</p>

    <div class="grid gap-12">
      <div
        v-for="(form, index) in forms"
        :key="`puhti-job-${index}`"
        class="grid gap-6 sm:grid-cols-2 md:grid-cols-4"
      >
        <c-text-field
          v-model="form.name"
          v-control
          v-bind="createValidation(validation, validate, `name-${index}`)"
          :data-test="`puhti-name`"
          label="Name of the job"
          class="sm:col-span-2 md:col-span-4"
        />

        <c-text-field
          v-model="form.numberOfCpuCores"
          v-control
          v-bind="
            createValidation(validation, validate, `numberOfCpuCores-${index}`)
          "
          :data-test="`puhti-numberOfCpuCores`"
          label="Number of CPU cores"
          class="sm:col-span-2 md:col-span-4"
        />

        <c-text-field
          v-model="form.numberOfGpus"
          v-control
          v-bind="
            createValidation(validation, validate, `numberOfGpus-${index}`)
          "
          :data-test="`puhti-numberOfGpus`"
          class="sm:col-span-2"
          label="Number of GPUs"
          name="numberOfGpus"
          type="number"
        />

        <c-text-field
          v-model="form.totalMemory"
          v-control
          v-bind="
            createValidation(validation, validate, `totalMemory-${index}`)
          "
          :data-test="`puhti-totalMemory`"
          class="sm:col-span-2"
          label="Memory per CPU core"
          aria-label="Memory per CPU core in GiB"
          name="totalMemory"
          type="number"
        >
          <span slot="post" class="text-sm">GiB</span>
        </c-text-field>

        <c-text-field
          v-model="form.NVMe"
          v-control
          v-bind="createValidation(validation, validate, `NVMe-${index}`)"
          :data-test="`puhti-nvme`"
          class="sm:col-span-2"
          label="NVMe disk amount"
          aria-label="NVMe disk amount in GiB"
          name="nvme"
          type="number"
        >
          <span slot="post">GiB</span>
        </c-text-field>

        <c-text-field
          v-model="form.runningTime"
          v-control
          v-bind="
            createValidation(validation, validate, `runningTime-${index}`)
          "
          :data-test="`puhti-runningTime`"
          label="Running time"
          name="runningtime"
          type="number"
        />

        <c-select
          v-model="form.runningTimeUnit"
          v-control
          :items="runningTimeUnits"
          :data-test="`puhti-runningTimeUnit`"
          label="Unit"
          name="unit"
        />
      </div>
    </div>

    <div class="grid gap-2 sm:grid-cols-[1fr_auto_auto] sm:justify-end">
      <status-button
        ref="statusButtonRef"
        data-test="puhti-add-to-estimates"
        class="min-w-60 sm:col-start-3"
        fit
        @click="addToEstimates()"
        @keyup.space="addToEstimates()"
        @keyup.enter="addToEstimates()"
      >
        <c-icon :path="icons.mdiPlus" />
        Add to estimates
      </status-button>
    </div>

    <billing-unit-calculator-additional-storage
      type="Puhti"
      :estimates="estimates"
      @change="onAdditionalStorageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { mdiPlus } from '@mdi/js';
import type { SuiteRunResult } from 'vest';
import { billingUnitCalculatorPuhtiSuite } from './BillingUnitCalculatorPuhti.validation';
import type {
  EstimateEvent,
  Estimates,
  PuhtiEstimate,
  Storage,
} from '@/types/billingUnitCalculator';
import type { StatusButton } from '#build/components';

useHead({
  title: 'Puhti',
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

  validation.value = billingUnitCalculatorPuhtiSuite({ items: forms }, name);
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

class PuhtiForm {
  constructor(
    public name: string,
    public numberOfGpus = 0,
    public numberOfCpuCores = 1,
    public totalMemory = 1,
    public NVMe = 0,
    public runningTime = 1,
    public runningTimeUnit = 'hours',
    public id = Date.now(),
  ) {}
}

const forms = ref<PuhtiForm[]>([new PuhtiForm('Job No.1')]);

const formCount = ref(1);

const nextValue = computed(
  () => (props.estimates?.Puhti?.jobs?.length ?? 0) + formCount.value + 1,
);

const puhtiEstimates = ref<PuhtiEstimate>({
  type: 'Puhti',
  jobs: [],
  storage: [],
});

const addToEstimates = async () => {
  await validate();

  if (!validation.value?.valid) {
    gotoError();

    return;
  }

  puhtiEstimates.value.jobs = forms.value.map((form: PuhtiForm) => {
    const { runningTime, runningTimeUnit, ...item } = form;
    const runningTimeInHours =
      runningTime * factors[runningTimeUnit as keyof typeof factors];

    const consumption = +(
      (1 * item.numberOfCpuCores +
        60 * item.numberOfGpus +
        0.1 * (1 * item.numberOfCpuCores) * item.totalMemory +
        0.006 * item.NVMe) *
      runningTimeInHours
    ).toFixed(2);

    const description = `${item.numberOfCpuCores} CPUs + ${item.numberOfGpus} GPUs + ${item.NVMe} GiB + ${item.totalMemory} GB`;

    return {
      ...item,
      consumption,
      description,
      runningTimeInHours,
    };
  });

  emit('change', {
    type: 'Puhti',
    key: 'jobs',
    value: puhtiEstimates.value.jobs,
  });

  formCount.value = 0;

  await nextTick();

  forms.value = [new PuhtiForm(`Job No.${nextValue.value}`)];

  formCount.value += 1;

  billingUnitCalculatorPuhtiSuite.reset();
  validation.value = undefined;

  statusButtonRef.value?.showMessage({
    message: 'Added to estimates',
    status: 'success',
  });
};

const onAdditionalStorageChange = (storage: Storage) => {
  emit('change', {
    type: 'Puhti',
    key: 'storage',
    value: [storage],
  });
};
</script>
