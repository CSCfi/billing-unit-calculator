<template>
  <div
    class="relative border rounded-md p-4 flex items-start gap-3 before:absolute before:w-1 before:h-full before:top-0 before:left-0 before:rounded-l-md"
    :class="{
      'bg-success-100/50 text-success-600 before:bg-success-500 border-success-500':
        type === 'success',
      'bg-error-100/50 text-error-600 before:bg-error-500 border-error-500':
        type === 'error',
      'bg-warning-100/50 text-warning-600 before:bg-warning-500 border-warning-500':
        type === 'warning',
      'bg-info-100/50 text-info-600 before:bg-info-500 border-info-500':
        type === 'info',
      'bg-primary-100/50 text-primary-600 before:bg-primary-500 border-primary-500':
        type === 'primary',
      [`${type}-colors`]: true,
    }"
  >
    <c-icon
      v-if="type !== 'primary'"
      :path="icon || defaultIcon"
      :size="20"
      class="relative top-0.5"
    />

    <div class="grid gap-1 flex-1">
      <p v-if="title" class="font-semibold">{{ title }}</p>

      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { mdiAlert, mdiCheckCircle, mdiInformation } from '@mdi/js';

type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'primary';

const props = withDefaults(
  defineProps<{
    icon?: string;
    title?: string;
    type?: NotificationType;
  }>(),
  { icon: '', title: '', type: 'primary' },
);

const defaultIcon = computed(() => {
  const typeToIcon: Record<NotificationType, string> = {
    success: mdiCheckCircle,
    error: mdiAlert,
    warning: mdiAlert,
    info: mdiInformation,
    primary: '',
  };

  return typeToIcon[props.type];
});
</script>
