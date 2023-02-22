<script setup lang="ts">
import { Spinner } from '@/app.organizer';
import useThemesProvider from '@/providers/themes.provider';

const Themes = useThemesProvider()

type Props = {
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: 'Loading',
})

</script>

<template>
    <div
      class="index-loading z-20 pt-20 mx-auto w-5/6 max-w-screen-xl flex-1 flex justify-center items-center"
    >
      <div class="text-3xl font-extrabold text-black dark:text-white">
        <Spinner :color="Themes.current.value === 'dark' ? 'white' : 'black'" />
        <div class="mt-5">{{ props.text }}</div>
      </div>
    </div>
</template>
