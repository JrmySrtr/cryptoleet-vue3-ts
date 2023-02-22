<script setup lang="ts">
import { ref, computed, DefineComponent, onMounted, watch, Ref } from "vue";
import {
  BaseTitle,
  BaseInputFilter,
  BaseSelectFilter,
  BaseDynamicSorts,
  BaseDynamicList,
  BaseLineCrypto,
  BaseLoader,
} from "@/app.organizer";
import { useI18n } from "vue-i18n";
import useCryptoStore from "@/stores/crypto";
import { TCryptoData } from "@/stores/crypto/types";
import { useRoute } from "vue-router";
import useThemesProvider from "@/providers/themes.provider";

type TEventLists = {
  newList: TCryptoData[];
  oldList: TCryptoData[];
};

const Themes = useThemesProvider();

const props = defineProps<{
  title: string;
  cryptoList: Map<string, TCryptoData>;
  component: DefineComponent<any, any, any>;
}>();

const { t: print } = useI18n();

const {
  states: { currencyActive, currenciesList },
  isReadyCategories,
  isReadyCurrencies,
  isReadyCryptoList,
  fetchCryptosInfos,
  setCurrencyActive,
} = useCryptoStore;

const isReadyCryptoStore = computed(
  () =>
    isReadyCategories.value &&
    isReadyCurrencies.value &&
    isReadyCryptoList.value
);

const itemsByPage = 150;
const dynamicController = ref() as Ref<typeof BaseDynamicList>;
const refInputFilter = ref() as Ref<typeof BaseInputFilter>;

const updatePricesForList = ({ newList, oldList }: TEventLists) => {
  const toUpdatePricesList = newList.filter((e) => {
    if (!e.pricesByCurrencies[currencyActive.value]) return true;
    return !oldList.find((f) => e.id === f.id);
  });
  fetchCryptosInfos(toUpdatePricesList);
};

const currenciesListOptions = computed(() => {
  return currenciesList.value.map((c) => {
    return {
      value: c,
      label: c,
    };
  });
});

const route = useRoute();
watch(
  () => route.name,
  () => {
    if (refInputFilter.value) refInputFilter.value.reset();
    if (dynamicController.value) dynamicController.value.onReset();
  }
);

onMounted(async () => {
  fetchCryptosInfos(
    Array.from(props.cryptoList)
      .map(([key, value]) => value)
      .slice(0, itemsByPage)
  );
});
</script>

<template>

    <v-container class="pb-0 px-0 h-100">
      <div v-if="!isReadyCryptoStore" class="d-flex flex-1 h-100 relative">
        <BaseLoader :text="print('loading_data')" />
      </div>
      <div
        v-else
        class="d-flex flex-1 h-100 flex-column w-100 self-center"
      >
        <div class="d-flex flex-column max-w-screen w-100 mx-auto">
          <div class="v-row ma-0 pa-0 mb-2">
            <v-col cols="12" md="2" class="ma-0 pa-0 fill-height d-flex justify-center justify-md-start" >
              <BaseTitle :text="title" class="d-flex justify-center align-center text-default mr-4 a-05 fadeInLeft" />
            </v-col>
            <v-col
              cols="4"
              class="d-flex ma-0 pa-0 items-center justify-start align-center"
            >
              <BaseInputFilter
                ref="refInputFilter"
                index="name"
                :search-indexes="['name', 'symbol']"
                :controller="dynamicController"
                class="base-input a-05 d-500 fadeInDown bg-default"
                :placeholder="print('search_a_name') + '...'"
              />
              <BaseSelectFilter
                index="currency"
                :default="currencyActive"
                :options="currenciesListOptions"
                @onChange="setCurrencyActive"
                class="a-08 d-500 fadeInDown"
                :class-select="'base-select h-10 text-uppercase font-bold pl-3 cursor-pointer'"
              />
            </v-col>
          </div>
          <div class="ma-0 pa-0 fill-height d-flex flex-1">
            <BaseDynamicSorts
              class="h-10 a-05 d-200 fadeInDown pt-1 pb-1"
              :controller="dynamicController"
            />
          </div>
        </div>

        <div class="db-list flex-1 d-flex flex-column h-100 p-1" style="min-height:10px">
          <BaseDynamicList
            class="d-500 a-04 fadeIn"
            component-key="id"
            ref="dynamicController"
            :items="props.cryptoList"
            :items-by-bloc="itemsByPage"
            :component="BaseLineCrypto"
            :watcher="ref(currencyActive)"
            :no-result-text="print('no_result')"
            :loader-color="Themes.current.value === 'dark' ? 'white' : 'black'"
            @onRequestNextBloc="(data) => updatePricesForList(data as TEventLists)"
          />
        </div>
      </div>
    </v-container>
</template>

<style lang="scss">
  @import "@elements/base-input.css";
  @import "@elements/base-select.css";
</style>
