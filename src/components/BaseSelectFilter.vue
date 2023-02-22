<script setup lang="ts">
import useThemesProvider from '@/providers/themes.provider';


const props = defineProps<{
  index: string;
  default: string;
  classSelect?: string;
  options: {
    label: string;
    value: string;
  }[];
}>();

const Themes = useThemesProvider()

const emit = defineEmits<{
  (e: "onChange", value: string): void;
}>();

const onChange = (e: Event) => {
  const dom = e.target as HTMLTextAreaElement;
  const value = dom.value;
  try {
    emit("onChange", value);
  } catch (e) {
    console.warn(e);
  }
};
</script>

<template>
  <div class="d-flex justify-center align-center">
    <select
      :class="classSelect"
      @change="(event) => onChange(event)"
      class="pr-7 z-2"
    >
      <option
        v-for="(item, i) in props.options"
        :key="`opt-${i}`"
        :value="item.value"
        :selected="item.value === props.default"
      >
        {{ item.label }}
      </option>
    </select>
    <v-icon
      icon="mdi-arrow-down"
      class="z-1"
      :color="Themes.current.value === 'dark' ? 'white' : 'black'"
      style="margin-left: -27px"
    />
  </div>
</template>

<style lang="scss">
// @import "@design";

</style>