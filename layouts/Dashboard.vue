<template>
  <c-main>
    <c-toolbar>
      <c-csc-logo />

      Billing Unit Calculator Demo
    </c-toolbar>

    <c-page>
      <slot />
    </c-page>
  </c-main>
</template>

<script lang="ts" setup></script>

<style>
c-page {
  --c-page-max-width: 1800px;
}
</style>
