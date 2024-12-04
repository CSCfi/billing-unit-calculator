<template>
  <div class="grid gap-6">
    <p>Instances</p>

    <div class="grid gap-12">
      <div
        v-for="(config, configIndex) in configurations"
        :key="`sd-desktop-configuration-${configIndex}`"
        class="grid gap-6 sm:grid-cols-2 md:grid-cols-4"
      >
        <c-text-field
          v-model="config.name"
          v-control
          v-bind="createValidation(validation, validate, `name-${configIndex}`)"
          :data-test="`sddesktop-name`"
          class="sm:col-span-2 md:col-span-4"
          label="Name of configuration"
        />

        <div
          class="mb-4 grid gap-2 sm:col-span-2 sm:grid-cols-2 md:col-span-4 md:grid-cols-4"
        >
          <p class="sm:col-span-2 md:col-span-4">Select flavor</p>

          <div
            class="grid gap-2 sm:col-span-2 sm:grid-cols-2 md:col-span-4 md:grid-cols-4"
            :data-test="`sddesktop-flavor`"
          >
            <c-button
              v-for="(flavor, index) in flavors"
              :key="`flavor-${index}--${configIndex}`"
              :data-test="`sddesktop-flavor-${index}--${configIndex}`"
              :outlined="config.selectedFlavor !== flavor.name"
              fit
              @click="onFlavorSelection(flavor.name, configIndex)"
              @keyup.space="onFlavorSelection(flavor.name, configIndex)"
              @keyup.enter="onFlavorSelection(flavor.name, configIndex)"
            >
              {{ flavor.name }}
            </c-button>
          </div>
        </div>

        <div
          class="mb-6 grid gap-2 sm:col-span-2 sm:grid-cols-2 md:col-span-4 md:grid-cols-4"
        >
          <p class="sm:col-span-2 md:col-span-4">Select size</p>

          <div
            class="col-span-4 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2"
            :data-test="`sddesktop-size`"
          >
            <c-button
              v-for="(size, index) in flavors.find(
                (flavor) => flavor.name === config.selectedFlavor,
              )?.sizes || []"
              :key="`size-${config.selectedFlavor}-${configIndex}--${index}`"
              :danger="
                !!validation?.getErrors(`selectedSize-${configIndex}`)?.[0]
              "
              :data-test="`sddesktop-size-${configIndex}--${index}`"
              :outlined="config.selectedSize?.name !== size.name"
              @click="onSizeSelection(size, configIndex)"
              @keyup.enter="onSizeSelection(size, configIndex)"
              @keyup.space="onSizeSelection(size, configIndex)"
            >
              {{ size.name }}

              <div slot="description">
                <div>{{ size.subtitle }}</div>

                <div>{{ size.description }}</div>
              </div>
            </c-button>
          </div>
        </div>

        <p
          v-if="!!validation?.getErrors(`selectedSize-${configIndex}`)?.[0]"
          class="-mt-4 flex animate-[showError_0.2s_ease-in-out] items-center gap-1 self-start text-[12px] tracking-normal text-red-500 sm:col-span-2 md:col-span-4"
        >
          <c-icon class="ml-3 text-sm" :path="mdiCloseCircle" />

          {{
            validation?.getErrors(`selectedSize-${configIndex}`)?.[0] ||
            'Value is required'
          }}
        </p>

        <c-text-field
          v-model="config.runningTime"
          v-control
          v-bind="
            createValidation(validation, validate, `runningTime-${configIndex}`)
          "
          class="md:col-span-2"
          :data-test="`sddesktop-runningTime`"
          name="runningtime"
          label="Running time"
          type="number"
        />

        <c-select
          v-model="config.runningTimeUnit"
          v-control
          :items="runningTimeUnits"
          class="md:col-span-2"
          :data-test="`sddesktop-runningTimeUnit`"
          label="Unit"
          name="unit"
        />
      </div>
    </div>
  </div>

  <div class="grid gap-2 sm:grid-cols-[1fr_auto_auto] sm:justify-end">
    <status-button
      ref="statusButtonRef"
      data-test="sddesktop-add-to-estimates"
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
</template>

<script setup lang="ts">
import { mdiPlus, mdiCloseCircle } from '@mdi/js';
import type { SuiteRunResult } from 'vest';
import { billingUnitCalculatorSdDesktopSuite } from './BillingUnitCalculatorSdDesktop.validation';
import type { EstimateEvent, Estimates } from '@/types/billingUnitCalculator';
import type { StatusButton } from '#build/components';

useHead({
  title: 'SD Desktop',
});

type Size = {
  name: string;
  description: string;
  subtitle: string;
  buh: number;
};

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

  validation.value = billingUnitCalculatorSdDesktopSuite(
    { items: configurations },
    name,
  );
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

class SdDesktopForm {
  constructor(
    public name: string,
    public selectedFlavor = 'Standard',
    public selectedSize: Size | null = flavors[0].sizes[0],
    public runningTime = 1,
    public runningTimeUnit = 'hours',
    public id = Date.now(),
  ) {}
}

const nextValue = computed(
  () =>
    (props.estimates?.SdDesktop?.configurations?.length ?? 0) +
    configurationCount.value +
    1,
);

const configurations = ref<SdDesktopForm[]>([]);

const configurationCount = ref(0);

onMounted(() => {
  configurations.value.push(new SdDesktopForm('Configuration No.1'));
  configurationCount.value += 1;
});

const flavors = [
  {
    name: 'Standard',
    sizes: [
      {
        name: 'standard.xlarge',
        description: '15 GB RAM | 6 CPU',
        subtitle: '80 GB storage',
        buh: 4,
      },
      {
        name: 'standard.xxlarge',
        description: '30 GB RAM | 8 CPU',
        subtitle: '80 GB storage',
        buh: 8,
      },
    ],
  },
  {
    name: 'HPC',
    sizes: [
      {
        name: 'hpc.3.56Core',
        description: '240 GB RAM | 56 CPU',
        subtitle: '80 GB storage',
        buh: 96,
      },
    ],
  },
];

const onFlavorSelection = (flavor: string, index: number) => {
  if (configurations.value[index].selectedFlavor === flavor) return;

  configurations.value[index].selectedFlavor = flavor;
  configurations.value[index].selectedSize = null;

  if (validation.value) {
    validate(`selectedSize-${index}`);
  }
};

const onSizeSelection = (size: Size, index: number) => {
  configurations.value[index].selectedSize = size;

  if (validation.value) {
    validate(`selectedSize-${index}`);
  }
};

const addToEstimates = async () => {
  await validate();

  if (!validation.value?.valid) {
    gotoError();

    return;
  }

  const value = configurations.value.map((config: SdDesktopForm) => {
    const { runningTime, runningTimeUnit, name } = config;

    const runningTimeInHours =
      runningTime * factors[runningTimeUnit as keyof typeof factors];

    const consumption =
      (config.selectedSize?.buh || 0) * runningTimeInHours * 1.3;

    return {
      description: config.selectedSize?.name,
      consumption,
      name,
      runningTimeInHours,
      extra: config.selectedSize,
    };
  });

  emit('change', {
    type: 'SdDesktop',
    key: 'configurations',
    value,
  });

  configurationCount.value = 0;

  await nextTick();

  configurations.value = [
    new SdDesktopForm(`Configuration No.${nextValue.value}`),
  ];

  configurationCount.value += 1;

  billingUnitCalculatorSdDesktopSuite.reset();
  validation.value = undefined;

  statusButtonRef.value?.showMessage({
    message: 'Added to estimates',
    status: 'success',
  });
};
</script>

<style>
@keyframes showError {
  0% {
    opacity: 0;
    transform: translateY(-4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
