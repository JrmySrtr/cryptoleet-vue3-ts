<script setup lang="ts">
import { DashboardHeader } from "@/app.organizer";
</script>

<template>
  <div
    class="layout-dashboard max-h-100 h-100 d-flex flex-column"
  >
    <DashboardHeader class="fixed w-screen z-50" />
    <slot />
  </div>
</template>
