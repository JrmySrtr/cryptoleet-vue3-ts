<script setup lang="ts">
  import { onMounted } from "vue";
  import { createAppProvider } from "@/providers/app.provider";
  import { useRouter } from "vue-router";
  import useCryptoStore from '@/stores/crypto';
  import { useI18n } from "vue-i18n";
import useLanguagesProvider from "./providers/languages.provider";
import useThemesProvider from "./providers/themes.provider";

  createAppProvider(useRouter());
  const Languages = useLanguagesProvider();
  const Themes = useThemesProvider();
  const { locale } = useI18n();
  locale.value = Languages.current.value;
  
  const {
    fetchCategoriesList,
    fetchCurrenciesList,
    fetchCryptoList,
  } = useCryptoStore;
  
  onMounted(() => {
    fetchCurrenciesList();
    fetchCategoriesList()
    fetchCryptoList();
  })
</script>

<template>
  <div id="app" :class="[Themes.current.value]">
    <router-view />
  </div>
</template>



<style lang="scss">
/* Import here or index.html, it will only import one time for whole application  */
@import '@themes';
@import '@design';
@import '@animate';

:root, html, body, #app {
    width: 100vw;
    height: 100vh;
    overflow: auto !important
}

#app {
    &, div, nav, header, span, label, input, select, option, i, p {
      transition: all 0.7s
    }
    &.light {
      background-color: var(--light-bg-default);
    }
    &.dark {
      background-color: var(--dark-bg-default);
    }
  }
</style>