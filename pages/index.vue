<template>
  <div class="mx-auto">
    <div ref="containerRef" class="pb-20 @container">
      <div :class="isEmbedded ? 'h-full overflow-auto' : ''">
        <c-card
          data-test="billing-unit-calculator"
          :class="{ 'shadow-none': isEmbedded }"
        >
          <c-card-title>Billing Unit Calculator</c-card-title>

          <div class="grid @4xl:grid-cols-2">
            <c-card-content>
              <div
                class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2"
              >
                <c-button
                  v-for="service in services"
                  :key="service.name"
                  :data-test="`service-button-${service.name}`"
                  :ghost="selectedService !== service.type"
                  class="min-w-[unset]"
                  @keyup.space="onServiceButtonClick(service)"
                  @keyup.enter="onServiceButtonClick(service)"
                  @click="onServiceButtonClick(service)"
                >
                  <div class="flex w-full items-center justify-between text-lg">
                    {{ service.name }}
                    <c-icon :path="service.icon" />
                  </div>

                  <div
                    slot="description"
                    class="mx-1 whitespace-normal text-left"
                  >
                    {{ service.description }}
                  </div>
                </c-button>
              </div>

              <div class="overflow-hidden" v-auto-animate>
                <component
                  :is="formComponent"
                  :key="formComponent"
                  :estimates="estimates"
                  @change="onAddToEstimates($event as unknown as EstimateEvent)"
                />
              </div>
            </c-card-content>

            <c-card-content
              v-if="!isMobile"
              class="hidden grid-rows-[auto_1fr] @4xl:grid"
            >
              <div
                class="rounded-md bg-primary-100/50 p-4 @4xl:border-2 @4xl:p-6"
              >
                <billing-unit-calculator-estimates
                  :count="amountOfEstimates"
                  :estimates="estimates"
                  @remove="onRemoveEstimate($event)"
                />
              </div>
            </c-card-content>
          </div>
        </c-card>
      </div>
    </div>

    <div
      v-if="isMobile"
      id="drawer-swipe"
      ref="drawerRef"
      class="fixed inset-x-2 bottom-[83px] z-[9] w-[calc(100%_-_16px)] border-t transition-all @4xl:hidden"
      :class="{
        'translate-y-[83px] bg-primary-900': showDrawer,
        'translate-y-full': !showDrawer,
        'rounded-lg': isEmbedded,
        'rounded-t-lg': !isEmbedded,
      }"
      tabindex="-1"
      aria-labelledby="drawer-swipe-label"
    >
      <div
        class="group cursor-pointer bg-primary-900 p-4"
        :class="{ 'rounded-lg': isEmbedded, 'rounded-t-lg': !isEmbedded }"
        data-drawer-toggle="drawer-swipe"
        @click="onToggleDrawer"
        @keyup.space="onToggleDrawer()"
        @keyup.enter="onToggleDrawer()"
      >
        <span
          class="absolute left-1/2 top-3 h-1 w-8 -translate-x-1/2 rounded-lg bg-primary-600 transition-colors group-hover:bg-accent-500"
        />

        <h5
          id="drawer-swipe-label"
          class="my-2 flex items-center gap-2 text-sm font-medium text-white"
        >
          <c-icon :path="mdiChartTimelineVariant" />

          <div class="grid gap-1">
            <p class="leading-none">Estimated consumption</p>

            <div class="leading-none text-accent">
              {{ formatNumber(totalBillingUnits) }}

              <span class="text-xs">BU</span>
            </div>
          </div>

          <c-spacer />

          <c-tag
            :badge="amountOfEstimates"
            class="c-tag c-tag--badge c-tag--active c-tag--flat visible relative"
            style="
              --c-tag-background-color-active: var(--color-accent-500);
              --c-tag-badge-text-color-active: var(--color-accent-500);
              --c-tag-border-color: var(--color-accent-500);
              --c-tag-text-color-active: var(--color-accent-900);
            "
            :class="{
              'after:absolute after:inset-x-4 after:inset-y-0 after:z-0 after:animate-ping after:rounded-full after:bg-accent-500 after:animate-duration-[2000ms]':
                estimateAdded,
            }"
            active
            flat
          >
            Estimates
          </c-tag>

          <div
            class="grid place-content-center transition-transform duration-500"
            :class="showDrawer ? 'rotate-0' : 'rotate-180'"
          >
            <c-icon :path="mdiChevronDown" class="text-accent" />
          </div>
        </h5>
      </div>

      <div class="grid max-h-[calc(100svh_-_92px)] overflow-y-auto p-3 pt-0">
        <c-card class="rounded-md bg-primary-100 p-3">
          <billing-unit-calculator-estimates
            :count="amountOfEstimates"
            :estimates="estimates"
            mobile
            @remove="onRemoveEstimate($event)"
            @change="onEstimateChange($event)"
          />
        </c-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  mdiChip,
  mdiNas,
  mdiServer,
  mdiFileCode,
  mdiChartTimelineVariant,
  mdiChevronDown,
  mdiChartArc,
  mdiDatabase,
} from '@mdi/js';
import type {
  Estimate,
  EstimateEvent,
  Estimates,
} from '@/types/billingUnitCalculator';

definePageMeta({
  name: 'BillingUnitCalculator',
  layout: 'dashboard',
});

useHead({
  titleTemplate: (title) => `Billing Unit Calculator - ${title}`,
});

type BillingUnitCalculatorService = {
  name: string;
  description: string;
  icon: string;
  type: string;
};

const containerRef = ref<HTMLDivElement | null>(null);

const drawerRef = ref<HTMLDivElement | null>(null);

const { width } = useElementSize(containerRef);

const isMobile = ref(false);

watch(width, (value) => {
  isMobile.value = value < 56 * 16; // 56 rem
});

const totalBillingUnits = computed(() => {
  let billingUnits = 0;
  Object.values(estimates.value).forEach((estimate) => {
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

const route = useRoute();

const estimates = ref<Estimates>({
  Mahti: {
    type: 'Mahti',
    icon: mdiChip,
    jobs: [],
    storage: [],
  },
  Puhti: {
    type: 'Puhti',
    icon: mdiChip,
    jobs: [],
    storage: [],
  },
  Allas: {
    type: 'Allas',
    icon: mdiNas,
    configurations: [],
  },
  CPouta: {
    type: 'cPouta',
    icon: mdiServer,
    configurations: [],
  },
  Rahti: {
    type: 'Rahti',
    icon: mdiServer,
    configurations: [],
  },
  SdDesktop: {
    type: 'SD Desktop',
    icon: mdiFileCode,
    configurations: [],
  },
  Pukki: {
    type: 'Pukki DBaaS',
    icon: mdiDatabase,
    configurations: [],
  },
});

const amountOfEstimates = computed(() => {
  return Object.values(estimates.value).reduce(
    (count: number, estimate: Estimate) => {
      return (
        count +
        (estimate.configurations?.length || 0) +
        (estimate.jobs?.length || 0) +
        (estimate.storage?.length || 0)
      );
    },
    0,
  );
});

const showDrawer = ref(false);

const estimatedConsumption = ref(0);

const onToggleDrawer = () => {
  showDrawer.value = !showDrawer.value;
};

const onCloseDrawer = () => {
  showDrawer.value = false;
};

onClickOutside(drawerRef, onCloseDrawer);

const estimateAdded = ref(false);

const onEstimateChange = (value: number) => {
  estimatedConsumption.value = value;

  estimateAdded.value = true;

  setTimeout(() => {
    estimateAdded.value = false;
  }, 2000);
};

const services: BillingUnitCalculatorService[] = [
  {
    name: 'Mahti',
    description: 'Node based supercomputing environment',
    icon: mdiChip,
    type: 'mahtiComputing',
  },
  {
    name: 'Puhti',
    description: 'Core based supercomputing environment',
    icon: mdiChip,
    type: 'puhtiComputing',
  },
  {
    name: 'Allas',
    description: 'Object storage environment for storing and sharing data',
    icon: mdiNas,
    type: 'storage',
  },
  {
    name: 'cPouta',
    description: 'Virtual machines for web services & software development',
    icon: mdiServer,
    type: 'virtualMachines',
  },
  {
    name: 'SD Desktop',
    description: 'A web-based service for analysing sensitive research data',
    icon: mdiServer,
    type: 'sdDesktop',
  },
  {
    name: 'Rahti',
    description:
      'Web services & software development with easy application deployment',
    icon: mdiFileCode,
    type: 'development',
  },
  {
    name: 'Pukki DBaaS',
    description: 'A self service on-demand database service',
    icon: mdiDatabase,
    type: 'database',
  },
];

const components = {
  development: 'LazyBillingUnitCalculatorRahti',
  mahtiComputing: 'LazyBillingUnitCalculatorMahti',
  puhtiComputing: 'LazyBillingUnitCalculatorPuhti',
  sdDesktop: 'LazyBillingUnitCalculatorSdDesktop',
  storage: 'LazyBillingUnitCalculatorAllas',
  virtualMachines: 'LazyBillingUnitCalculatorCPouta',
  database: 'LazyBillingUnitCalculatorPukki',
};

const formComponent = computed(() => {
  return components[selectedService.value as keyof typeof components];
});

const selectedService = ref('');

const isEmbedded = ref(false);

onMounted(() => {
  isEmbedded.value = route.name === 'buc';

  selectedService.value = route.query?.service
    ? (route.query.service as string)
    : services[0].type;
});

const onAddToEstimates = (estimate: EstimateEvent) => {
  const { type, key, value } = estimate;

  estimates.value[type][key]!.push(...value);
};

const onRemoveEstimate = (estimate: EstimateEvent) => {
  estimates.value[estimate.type][estimate.key] = estimates.value[estimate.type][
    estimate.key
  ]?.filter((item) => item.name !== estimate.value[0].name);
};

const router = useRouter();

const onServiceButtonClick = (service: BillingUnitCalculatorService) => {
  selectedService.value = service.type;

  router.push({ path: route.fullPath, query: { service: service.type } });
};
</script>
