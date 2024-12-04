<template>
  <c-button class="relative" :style="styles">
    <div class="sr-only" aria-live="assertive" aria-atomic="true">
      {{ message }}
    </div>

    <div
      v-if="message"
      class="flex animate-fade-left items-center gap-2 animate-duration-300"
    >
      <c-icon
        color="currentColor"
        :path="status === 'success' ? mdiCheckCircle : mdiAlert"
        :size="16"
      />

      {{ message }}
    </div>

    <div
      v-else
      class="flex animate-fade-right items-center gap-2 animate-duration-300"
    >
      <slot />
    </div>
  </c-button>
</template>

<script setup lang="ts">
import { mdiAlert, mdiCheckCircle } from '@mdi/js';

const props = withDefaults(defineProps<{ duration?: number }>(), {
  duration: 3000,
});

const timer = ref<ReturnType<typeof setTimeout>>();

const message = ref('');

const status = ref('success');

const showMessage = (options: {
  message: string;
  status: 'success' | 'error';
}) => {
  clearTimeout(timer.value);

  message.value = options.message;
  status.value = options.status;

  timer.value = setTimeout(() => {
    message.value = '';
  }, props.duration);
};

const styles = computed(() =>
  message.value
    ? {
        '--c-button-background-color': `var(--tw-${status.value}-500)`,
        '--c-button-background-color-hover': `var(--tw-${status.value}-400)`,
      }
    : {},
);

onBeforeUnmount(() => {
  clearTimeout(timer.value);
});

defineExpose({ showMessage });
</script>
