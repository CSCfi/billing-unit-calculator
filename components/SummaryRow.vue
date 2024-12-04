<template>
  <div class="relative">
    <div class="relative flex w-full items-center" v-auto-animate>
      <p class="font-semibold">{{ title }}</p>

      <c-icon-button
        v-if="slots.info"
        ref="infoButtonRef"
        size="small"
        text
        @click="onInfoClick()"
        @keyup.space="onInfoClick()"
        @keyup.enter="onInfoClick()"
      >
        <c-icon
          :path="mdiInformation"
          :size="20"
          style="--c-icon-color: var(--c-primary-600)"
        />
      </c-icon-button>

      <div
        v-if="isInfoVisible && slots.info"
        ref="infoRef"
        class="absolute left-0 top-full z-10 -mx-2 mt-2 max-w-lg before:absolute before:inset-x-0 before:-top-1 before:left-6 before:z-[-1] before:size-4 before:rotate-45 before:bg-white"
      >
        <slot name="info" />
      </div>
    </div>

    <p class="text-sm text-gray-500">
      <slot />
    </p>
  </div>
</template>

<script setup lang="ts">
import { mdiInformation } from '@mdi/js';

const isInfoVisible = ref(false);

const infoContainer = useTemplateRef('infoRef');

const infoButton = useTemplateRef('infoButtonRef');

const slots = useSlots();

const onInfoClick = () => {
  requestAnimationFrame(() => {
    isInfoVisible.value = !isInfoVisible.value;
  });
};

const onOutsideClick = (event: MouseEvent) => {
  if (!isInfoVisible.value || event.target === infoButton.value) return;

  isInfoVisible.value = false;
};

defineProps<{
  title: string;
}>();

onClickOutside(infoContainer, onOutsideClick);
</script>
