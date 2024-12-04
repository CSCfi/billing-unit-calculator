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
          :data-test="`cpouta-name`"
          class="sm:col-span-2 md:col-span-4"
          label="Name of configuration"
        />

        <div
          class="mb-4 grid gap-2 sm:col-span-2 sm:grid-cols-2 md:col-span-4 md:grid-cols-4"
        >
          <p class="sm:col-span-2 md:col-span-4">Select flavor</p>

          <div
            class="grid gap-2 sm:col-span-2 sm:grid-cols-2 md:col-span-4 md:grid-cols-4"
            :data-test="`cpouta-flavor`"
          >
            <c-button
              v-for="(flavor, index) in flavors"
              :key="`flavor-${index}--${configIndex}`"
              :data-test="`cpouta-flavor-${index}--${configIndex}`"
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
          class="mb-4 grid gap-2 sm:col-span-2 sm:grid-cols-2 md:col-span-4 md:grid-cols-4"
        >
          <p class="sm:col-span-2 md:col-span-4">Select size</p>

          <div
            class="col-span-4 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2"
            :data-test="`cpouta-size`"
          >
            <c-button
              v-for="(size, index) in flavors.find(
                (flavor) => flavor.name === config.selectedFlavor,
              )?.sizes || []"
              :key="`size-${configIndex}--${index}`"
              :data-test="`cpouta-size-${configIndex}--${index}`"
              :outlined="config.selectedSize?.name !== size.name"
              :danger="
                !!validation?.getErrors(`selectedSize-${configIndex}`)?.[0]
              "
              @click="onSizeSelection(size, configIndex)"
              @keyup.space="onSizeSelection(size, configIndex)"
              @keyup.enter="onSizeSelection(size, configIndex)"
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

        <template v-if="config.selectedSize">
          <c-text-field
            v-model="config.floatingIps"
            v-control
            v-bind="
              createValidation(
                validation,
                validate,
                `floatingIps-${configIndex}`,
              )
            "
            :data-test="`cpouta-floatingIps`"
            label="Number of Floating IPs"
            name="floatingIps"
            type="number"
            class="sm:col-span-2"
          />

          <c-text-field
            v-model="config.tibOfStorage"
            v-control
            v-bind="
              createValidation(
                validation,
                validate,
                `tibOfStorage-${configIndex}`,
              )
            "
            :data-test="`cpouta-tibOfStorage`"
            label="Amount of TiB of Storage"
            name="tibOfStorage"
            min="0"
            max="100"
            step="1"
            type="number"
            class="sm:col-span-2"
          />

          <c-text-field
            v-model="config.runningTime"
            v-control
            v-bind="
              createValidation(
                validation,
                validate,
                `runningTime-${configIndex}`,
              )
            "
            :data-test="`cpouta-runningTime`"
            name="runningtime"
            min="1"
            label="Running time"
            type="number"
            class="sm:col-span-2"
          />

          <c-select
            v-model="config.runningTimeUnit"
            v-control
            :data-test="`cpouta-runningTimeUnit`"
            :items="runningTimeUnits"
            label="Unit"
            name="unit"
            class="sm:col-span-2"
          />
        </template>
      </div>
    </div>
  </div>

  <div class="grid gap-2 sm:grid-cols-[1fr_auto_auto] sm:justify-end">
    <status-button
      ref="statusButtonRef"
      data-test="cpouta-add-to-estimates"
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
import { billingUnitCalculatorCPoutaSuite } from './BillingUnitCalculatorCPouta.validation';
import type { EstimateEvent, Estimates } from '@/types/billingUnitCalculator';
import type { StatusButton } from '#build/components';

type Size = {
  name: string;
  description: string;
  subtitle: string;
  buh: number;
};

useHead({
  title: 'CPouta',
});

const statusButtonRef = ref<InstanceType<typeof StatusButton> | null>(null);

const emit = defineEmits<{
  (e: 'change', params: EstimateEvent): void;
}>();

const props = defineProps<{
  estimates: Estimates;
}>();

const validation = ref<SuiteRunResult<string, string>>();

const validate = async (name?: string) => {
  await nextTick();

  validation.value = billingUnitCalculatorCPoutaSuite(
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

class CPoutaForm {
  constructor(
    public name: string,
    public selectedFlavor = 'Standard',
    public selectedSize: Size | null = flavors[0].sizes[0],
    public floatingIps = 0,
    public tibOfStorage = 0,
    public runningTime = 1,
    public runningTimeUnit = 'hours',
    public id = Date.now(),
  ) {}
}

const nextValue = computed(
  () =>
    (props.estimates?.CPouta?.configurations?.length ?? 0) +
    configurationCount.value +
    1,
);

const configurations = ref<CPoutaForm[]>([]);

const configurationCount = ref(0);

onMounted(() => {
  configurations.value.push(new CPoutaForm('Configuration No.1'));
  configurationCount.value += 1;
});

const flavors = [
  {
    name: 'Standard',
    sizes: [
      {
        name: 'standard.tiny',
        description: '0.9 GiB RAM | 1 cores',
        subtitle: '80 GB storage',
        buh: 0.25,
      },
      {
        name: 'standard.small',
        description: '1.9 GiB RAM | 2 cores',
        subtitle: '80 GB storage',
        buh: 0.5,
      },
      {
        name: 'standard.medium',
        description: '3.9 GiB RAM | 3 cores',
        subtitle: '80 GB storage',
        buh: 1,
      },
      {
        name: 'standard.large',
        description: '7.8 GiB RAM | 4 cores',
        subtitle: '80 GB storage',
        buh: 2,
      },
      {
        name: 'standard.xlarge',
        description: '15 GiB RAM | 6 cores',
        subtitle: '80 GB storage',
        buh: 4,
      },
      {
        name: 'standard.xxlarge',
        description: '31 GiB RAM | 8 cores',
        subtitle: '80 GB storage',
        buh: 8,
      },
      {
        name: 'standard.3xlarge',
        description: '62 GiB RAM | 8 cores',
        subtitle: '80 GB storage',
        buh: 16,
      },
    ],
  },
  {
    name: 'HPC',
    sizes: [
      {
        name: 'hpc.5.16Core',
        description: '58 GiB RAM | 16 cores',
        subtitle: '80 GB storage',
        buh: 20,
      },
      {
        name: 'hpc.5.32Core',
        description: '116 GiB RAM | 32 cores',
        subtitle: '80 GB storage',
        buh: 40,
      },
      {
        name: 'hpc.5.64Core',
        description: '232 GiB RAM | 64 cores',
        subtitle: '80 GB storage',
        buh: 80,
      },
      {
        name: 'hpc.5.128Core',
        description: '464 GiB RAM | 128 cores',
        subtitle: '80 GB storage',
        buh: 160,
      },
      {
        name: 'hpc.4.5Core',
        description: '21 GiB RAM | 5 cores',
        subtitle: '80 GB storage',
        buh: 6,
      },
      {
        name: 'hpc.4.10Core',
        description: '42 GiB RAM | 10 cores',
        subtitle: '80 GB storage',
        buh: 12,
      },
      {
        name: 'hpc.4.20Core',
        description: '85 GiB RAM | 20 cores',
        subtitle: '80 GB storage',
        buh: 25,
      },
      {
        name: 'hpc.4.40Core',
        description: '171 GiB RAM | 40 cores',
        subtitle: '80 GB storage',
        buh: 50,
      },
      {
        name: 'hpc.4.80Core',
        description: '343 GiB RAM | 80 cores',
        subtitle: '80 GB storage',
        buh: 100,
      },
      {
        name: 'hpc-gen2.24Core',
        description: '117 GiB RAM | 24 cores',
        subtitle: '80 GB storage',
        buh: 30,
      },
      {
        name: 'hpc-gen2.48Core',
        description: '234 GiB RAM | 48 cores',
        subtitle: '80 GB storage',
        buh: 60,
      },
    ],
  },
  {
    name: 'I/O',
    sizes: [
      {
        name: 'io.70GB',
        description: '9.7 GiB RAM | 2 cores',
        subtitle: '20 + 70 GB storage',
        buh: 3,
      },
      {
        name: 'io.160GB',
        description: '19 GiB RAM | 4 cores',
        subtitle: '20 + 160 GB storage',
        buh: 6,
      },
      {
        name: 'io.340GB',
        description: '39 GiB RAM | 8 cores',
        subtitle: '20 + 340 GB storage',
        buh: 12,
      },
      {
        name: 'io.700GB',
        description: '78 GiB RAM | 16 cores',
        subtitle: '20 + 700 GB storage',
        buh: 24,
      },
      {
        name: 'io.2.80GB',
        description: '12.7 GiB RAM | 2 cores',
        subtitle: '80 + 80 GB storage',
        buh: 6,
      },
      {
        name: 'io.2.240GB',
        description: '26 GiB RAM | 4 cores',
        subtitle: '80 + 240 GB storage',
        buh: 12,
      },
      {
        name: 'io.2.550GB',
        description: '54 GiB RAM | 8 cores',
        subtitle: '80 + 550 GB storage',
        buh: 24,
      },
      {
        name: 'io.2.1200GB',
        description: '107 GiB RAM | 16 cores',
        subtitle: '80 + 1200 GB storage',
        buh: 48,
      },
    ],
  },
  {
    name: 'GPU',
    sizes: [
      {
        name: 'gpu.1.1gpu',
        description: '117 GiB RAM | 14 cores',
        subtitle: '80 GB storage',
        buh: 60,
      },
      {
        name: 'gpu.1.2gpu',
        description: '234 GiB RAM | 28 cores',
        subtitle: '80 GB storage',
        buh: 120,
      },
      {
        name: 'gpu.1.4gpu',
        description: '468 GiB RAM | 56 cores',
        subtitle: '80 GB storage',
        buh: 240,
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

  const value = configurations.value.map((config: CPoutaForm) => {
    const { runningTime, runningTimeUnit, name } = config;

    const runningTimeInHours =
      runningTime * factors[runningTimeUnit as keyof typeof factors];

    const consumption =
      ((config.selectedSize?.buh || 0) +
        config.floatingIps * 0.2 +
        config.tibOfStorage * 3.5) *
      runningTimeInHours;

    return {
      description: `${config.selectedSize?.name} + ${config.floatingIps} IPs + ${config.tibOfStorage} TiB`,
      consumption,
      name,
      runningTimeInHours,
      extra: config.selectedSize,
    };
  });

  emit('change', {
    type: 'CPouta',
    key: 'configurations',
    value,
  });

  configurationCount.value = 0;

  await nextTick();

  configurations.value = [
    new CPoutaForm(`Configuration No.${nextValue.value}`),
  ];

  configurationCount.value = 1;

  billingUnitCalculatorCPoutaSuite.reset();
  validation.value = undefined;

  statusButtonRef.value?.showMessage({
    message: 'Added to estimates',
    status: 'success',
  });
};
</script>
