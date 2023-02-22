<script setup lang="ts">
const props = defineProps<{
  text: string;
}>();
</script>

<template>
    <div class="text-h6 p-3">
      {{ text }}
    </div>
</template>
