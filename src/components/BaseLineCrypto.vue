<script setup lang="ts">
import { computed, ref, inject } from "vue";
import { TCryptoData } from "@/stores/crypto/types";
import useCryptoStore from "@/stores/crypto";
import { BaseCryptoChart, FavoriteStar } from "@/app.organizer";
import { useIntersectionObserver } from "@vueuse/core";
import useCurrencySymbol from "@/composables/useCurrencySymbol";
import { reduceSparkline7days } from "@/stores/crypto/sorters";
import { ROUTE_CRYPTO_VIEW } from "@/app.routes";

const props = defineProps<{
  data: TCryptoData;
}>();

const {
  states: { currencyActive, cryptoFavorites },
  addFavorite,
  removeFavorite,
} = useCryptoStore;

const crypto = ref(props.data);

const currencySymbol = computed(() => useCurrencySymbol(currencyActive.value));

const refElement = ref();
const elementIsVisible = ref(false);

const isInFavorites = computed(() =>
  cryptoFavorites.value.get(crypto.value.id) ? true : false
);

const toggleFavorite = () => {
  if (isInFavorites.value) {
    removeFavorite(crypto.value);
  } else addFavorite(crypto.value);
};

useIntersectionObserver(refElement, ([{ isIntersecting }]) => {
  if (isIntersecting !== elementIsVisible.value)
    elementIsVisible.value = isIntersecting;
});

const sparkline7Days = computed(() => {
  if (!crypto?.value?.sparkline_in_7d) return [];
  return reduceSparkline7days(crypto?.value?.sparkline_in_7d);
});

const orderedSparkLabels = computed(() => {
  if (!sparkline7Days.value) return [];
  return sparkline7Days.value.map((_, index: number) => {
    if (sparkline7Days.value) {
      return "J" + (index - sparkline7Days.value.length);
    } else return "";
  });
});

</script>

<template>
  <div class="line-crypto" ref="refElement">
    <v-row
      v-if="elementIsVisible"
      class="w-full fill-height pa-0 ma-0 cursor-pointer justify-space-between"
      @click="
        (event) =>
          $router.push({
            name: ROUTE_CRYPTO_VIEW.name,
            params: { id: crypto.id },
          })
      "
    >
      <v-col
        cols="1"
        class="ctn-image fill-height pa-0 ma-0 d-flex justify-start align-center pl-2 pr-2 items-center"
      >
        <img v-if="crypto.image" v-lazy="crypto.image" class="image" />
      </v-col>
      <v-col
        cols="2"
        class="fill-height pa-0 ma-0 d-flex justify-start align-center text-default font-bold"
      >
        {{
          crypto.name.length > 20
            ? crypto.name.slice(0, 20) + "..."
            : crypto.name
        }}
      </v-col>
      <v-col
        cols="2"
        class="fill-height pa-0 ma-0 d-flex justify-start align-center text-default"
      >
        <template
          v-if="crypto?.pricesByCurrencies[currencyActive]?.current_price"
        >
          {{ crypto.pricesByCurrencies[currencyActive].current_price }}
          {{ currencySymbol }}
        </template>
        <div
          v-else
          class="fill-height pa-0 ma-0 d-flex justify-start align-center text-caption d-text-disabled"
          style="opacity: 0.4"
        >
          N/A
        </div>
      </v-col>
      <v-col
        cols="2"
        class="fill-height pa-0 ma-0 d-flex justify-start align-center text-default"
      >
        <template v-if="crypto?.pricesByCurrencies[currencyActive]?.market_cap">
          {{ crypto.pricesByCurrencies[currencyActive].market_cap }}
          {{ currencySymbol }}
        </template>
        <div v-else class="text-caption d-text-disabled" style="opacity: 0.4">
          N/A
        </div>
      </v-col>
      <v-col
        cols="2"
        class="fill-height pa-0 ma-0 d-flex justify-start align-center text-default"
      >
        <template
          v-if="crypto?.pricesByCurrencies[currencyActive]?.total_volume"
        >
          {{ crypto.pricesByCurrencies[currencyActive].total_volume }}
          {{ currencySymbol }}
        </template>
        <div v-else class="text-caption d-text-disabled" style="opacity: 0.4">
          N/A
        </div>
      </v-col>
      <v-col
        cols="2"
        class="fill-height pa-0 ma-0 d-flex justify-start align-center text-default"
      >
        <template v-if="sparkline7Days">
          <BaseCryptoChart
            :sparkline="sparkline7Days"
            :labels="orderedSparkLabels"
            :grid="false"
            :tooltip="false"
            :win="sparkline7Days[0] < sparkline7Days[sparkline7Days.length - 1]"
          />
        </template>
        <div v-else class="text-caption d-text-disabled" style="opacity: 0.4">
          -
        </div>
      </v-col>
      <v-col
        cols="1"
        class="favorite ill-height pa-0 ma-0 d-flex justify-center align-center cursor-pointer"
        @click.prevent.stop="toggleFavorite"
      >
        <FavoriteStar :active="isInFavorites" />
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss">
.line-crypto {
  transition: all 0.2s;
  height: 40px;

  .ctn-image {
    max-width: 50px;
    .image {
      width: 30px;
      height: 30px;
    }
  }

  .favorite {
    max-width: 50px;
  }
}

#app.dark {
  .line-crypto:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
}

#app.light {
  .line-crypto:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
}
</style>
