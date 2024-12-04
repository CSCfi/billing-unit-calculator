<template>
  <div v-if="!mobile" class="grid gap-1">
    <p class="text-xlshadow-2xl font-semibold text-primary-600">
      Estimated billing unit consumption
    </p>

    <p class="text-4xl font-light">
      {{ formatNumber(total.totalBillingUnits, 2) }}
      <span class="text-xlshadow-2xl">BU</span>
    </p>
  </div>

  <div class="grid gap-2 rounded-md border bg-white p-4">
    <p class="text-xlshadow-2xl font-semibold text-primary-600">Academic projects</p>

    <p class="text-sm">
      Academic projects are granted 10 000 billing units initially.
    </p>

    <summary-rows>
      <summary-row title="Required additional resource package">
        <div v-if="total.totalBillingUnits > 10000" class="flex gap-4">
          <p class="text-4xl font-light text-primary-600">
            {{ total.recommendedPackage.label }}
          </p>

          <p class="grid text-sm">
            <span>{{ total.recommendedPackage.name }}</span>

            <span>{{ total.recommendedPackage.description }}</span>
          </p>
        </div>

        <div v-else>
          <p class="text-sm">Additional resources are not required</p>
        </div>

        <template #info>
          <div class="grid rounded-md bg-white p-4 shadow-2xl">
            <p class="mb-2 flex items-center gap-2">
              <c-icon
                :path="mdiInformation"
                :size="20"
                style="--c-icon-color: var(--c-primary-600)"
              />

              <span class="font-semibold">
                Applying for resources (free-of-charge)
              </span>
            </p>

            <p class="mb-2 text-sm">
              The use of many of CSC's services is free-of-charge for users
              affiliated with a Finnish higher education institution. Such users
              can apply for additional resources on top of the base amount of 10
              000 BUs per project.
            </p>

            <ul class="list-disc pl-5 text-sm">
              <li class="mt-2">
                Learn more about
                <c-link
                  href="https://research.csc.fi/en/applying-for-computing-resources"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline
                >
                  applying for resources

                  <c-icon :path="mdiOpenInNew" :size="20" />
                </c-link>
              </li>

              <li class="mt-2">
                Learn more about
                <c-link
                  href="https://research.csc.fi/free-of-charge-use-cases"
                  target="_blank"
                  rel="noopener noreferrer"
                  underline
                >
                  free-of-charge use cases

                  <c-icon :path="mdiOpenInNew" :size="20" />
                </c-link>
              </li>
            </ul>
          </div>
        </template>
      </summary-row>
    </summary-rows>
  </div>

  <div class="inline-grid gap-2 rounded-md border bg-white p-4">
    <p class="text-xlshadow-2xl font-semibold text-primary-600">Commercial projects</p>

    <summary-rows>
      <summary-row title="Estimated price">
        <c-table :mobile-breakpoint="384" responsive>
          <table>
            <thead>
              <tr>
                <th>Qty</th>

                <th>Item</th>

                <th style="text-align: right">Price</th>
              </tr>
            </thead>

            <tbody>
              <tr v-show="total.estimatedPrice > 0" ref="summaryTableRowRef">
                <td class="align-top">1</td>

                <td class="align-top">
                  <p>Base Package</p>

                  <span class="text-sm opacity-60">Includes 20 000 BU</span>
                </td>

                <td class="align-top">
                  <p :class="{ 'text-right': !isMobile }">1 190 EUR</p>
                </td>
              </tr>

              <tr v-if="total.estimatedPrice === 0">
                <td colspan="3">Please add items to estimates</td>
              </tr>

              <tr v-show="total.estimatedPackages > 1">
                <td class="align-top">{{ total.estimatedPackages - 1 }}</td>

                <td class="align-top">
                  <p>
                    Additional Package{{
                      total.estimatedPackages > 1 ? 's' : ''
                    }}
                  </p>

                  <span class="text-sm opacity-60">420 EUR / 20 000 BU</span>
                </td>

                <td class="align-top">
                  <p :class="{ 'text-right': !isMobile }">
                    {{ formatNumber(420 * (total.estimatedPackages - 1)) }} EUR
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </c-table>

        <c-table>
          <table>
            <tfoot>
              <tr>
                <td>Total</td>

                <td class="text-end">
                  <span class="font-semibold">
                    {{ formatNumber(total.estimatedPrice) }} EUR
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </c-table>

        <template #info>
          <div class="grid rounded-md bg-white p-4 shadow-2xl">
            <p class="mb-2 flex items-center gap-2">
              <c-icon
                :path="mdiInformation"
                :size="20"
                style="--c-icon-color: var(--c-primary-600)"
              />

              <span class="font-semibold">CSC Computing Base Package</span>
            </p>

            <p class="mb-2 text-sm">
              Sold to state or higher education institution customers when the
              intended usage does not fall under
              <c-link
                href="https://research.csc.fi/free-of-charge-use-cases"
                target="_blank"
                rel="noopener noreferrer"
                underline
              >
                free-of-charge policy

                <c-icon :path="mdiOpenInNew" :size="20" />
              </c-link>
              .
            </p>

            <ul class="list-disc pl-5 text-sm">
              <li class="mt-2">1 190 € base price for 20 000 billing units</li>

              <li class="mt-2">420 € per additional 20 000 billing units</li>
            </ul>
          </div>
        </template>
      </summary-row>
    </summary-rows>
  </div>
</template>

<script setup lang="ts">
import { mdiInformation, mdiOpenInNew } from '@mdi/js';
import type { ComponentPublicInstance } from 'vue';
import SummaryRow from './SummaryRow.vue';
import type { TotalConsumption } from '@/types/billingUnitCalculator';

withDefaults(
  defineProps<{
    total: TotalConsumption;
    mobile?: boolean;
  }>(),
  {
    mobile: false,
  },
);

const summaryTableRowRef = ref<HTMLTableRowElement | null>(null);

const isMobile = ref(false);

useResizeObserver(summaryTableRowRef, (entries) => {
  const entry = entries[0];
  const { width } = entry.contentRect;

  isMobile.value = width < 384;
});
</script>

<style>
@container (min-width: 24rem) {
  .\@sm\:text-right {
    text-align: right;
  }
}
</style>
