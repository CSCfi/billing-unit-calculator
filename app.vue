<template>
  <div>
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </div>
</template>

<script setup lang="ts">
import { defineCustomElements } from '@cscfi/csc-ui/loader';

defineCustomElements();
</script>
