<script setup lang="ts">
import type { BaseDynamicList } from "@/app.organizer";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import useCryptoStore from "@/stores/crypto";
import {
  sorterCharactere,
  sorterPrices,
  sorterSparkline7days,
} from "@/stores/crypto/sorters";


export type TDynamicSort = {
  index: string;
  order: "asc" | "desc";
  sorter: (a: any, b: any) => number;
};

const props = defineProps<{
  controller: typeof BaseDynamicList;
}>();

const { t: print } = useI18n();

const {
  states: { currencyActive },
} = useCryptoStore;

const lastSorter = ref<TDynamicSort>({
  index: "name",
  order: "asc",
  sorter: sorterCharactere("name"),
});

const updateSorter = (sortName: string) => {
  let sorter: Function | null;
  let alreadyActiveSorter: boolean = lastSorter.value.index === sortName;
  let order: "asc" | "desc" =
    alreadyActiveSorter && lastSorter.value.order === "asc" ? "desc" : "asc";
  if (["name"].includes(sortName)) sorter = sorterCharactere(sortName);
  else if (["market_cap", "current_price", "total_volume"].includes(sortName))
    sorter = sorterPrices(currencyActive.value, sortName);
  else if (["sparkline_in_7d"].includes(sortName))
    sorter = sorterSparkline7days(currencyActive.value, sortName);
  else sorter = null;

  if (sorter) {
    lastSorter.value = {
      index: sortName,
      order: order,
      sorter: sorter as (a: any, b: any) => number,
    };
    updateController(lastSorter.value);
  }
};

const updateController = (sort: TDynamicSort) => {
  try {
    if (props.controller) {
      props.controller.onUpdateSorters(sort);
    }
  } catch (e) {
    console.warn(e);
  }
};

onMounted(() => {
  updateSorter("name");
});
</script>

<template>
  <div class="dyn-order max-w-max d-flex flex-1 mb-2" style="max-width: 100%">
    <v-row class="sorter ma-0 pa-0">
      <v-col cols="1" style="width: 50px"></v-col>
      <v-col
        cols="2"
        class="pt-0 pb-0 justify-start text-default cursor-pointer"
        @click="(event) => updateSorter('name')"
      >
        {{ print("name") }}
      </v-col>
      <v-col
        cols="2"
        class="pa-0 justify-start text-default cursor-pointer"
        @click="(event) => updateSorter('current_price')"
        style=""
      >
        {{ print("current_price") }}
      </v-col>
      <v-col
        cols="2"
        class="pa-0 justify-start text-default cursor-pointer"
        @click="(event) => updateSorter('market_cap')"
      >
        {{ print("market_cap") }}
      </v-col>
      <v-col
        cols="2"
        class="pa-0 justify-start text-default cursor-pointer"
        @click="(event) => updateSorter('total_volume')"
      >
        {{ print("total_volume") }}
      </v-col>
      <v-col
        cols="2"
        class="pa-0 justify-start text-default cursor-pointer"
        @click="(event) => updateSorter('sparkline_in_7d')"
      >
        {{ print("last_7_day") }}
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss">
.dyn-order {
  .sorter {
    height: auto;
  }
}
#app.light {
  .dyn-order {
    background-color: rgba(1, 1, 1, 0.03);
    border-radius: 100;
  }
}
#app.dark {
  .dyn-order {
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 100;
  }
}
</style>
