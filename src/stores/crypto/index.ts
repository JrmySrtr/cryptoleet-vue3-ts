import { computed, ComputedRef, reactive, toRefs } from "vue";
import axios from "axios";
import useLocalStorage from "@/composables/useLocalStorage";
import { LOCALSTORAGE_CRYPTO_CURRENCY, LOCALSTORAGE_CRYPTO_FAVORITES } from "@/app.storages";
import type {
  TCryptoStoreStates,
  TCryptoData,
  TEntryCategoryData,
  TEntryCryptoData,
  TCryptoStore,
} from "./types";
import { load as loadFavorites } from "./favorites";

const URL_API = "https://api.coingecko.com/api/v3";

/* 
  Here I use global composable declaration, no need option for the store, so no need parameters.
  If any any parameters was needed, create a function which load asynchronously the store file.

  I use this example if the concept was to separate useCryptoStore and useCAC40Store for stockExchange global platform.
  But in case if we need to combine, or externalise everything both and dynamically, we can use a 
  single composable function with options like useStockExchange('crypto') / useStockExchange('cac40')
  and load dynamically files/states/functions when needed.

  export const useStockExchange = (optional: any): <TCryptoStore | TCAC40Store> => {}

 = maintability / flexibility / scalability / optimisaiton
*/

/*** States  ***/ 

const states:TCryptoStoreStates = reactive({
  cryptoList: new Map<string, TCryptoData>(),
  currenciesList: [],
  categoriesList: [],
  currencyActive: useLocalStorage.get(LOCALSTORAGE_CRYPTO_CURRENCY) || 'eur',
  categoryActive: null,
  cryptoFavorites: loadFavorites(),
})

/*** Computed (getters)  ***/ 

const isReadyCategories: TCryptoStore['isReadyCategories'] = computed(() => {
  return states.categoriesList.length ? true : false;
})

const isReadyCurrencies: TCryptoStore['isReadyCurrencies'] = computed(() =>{
  return states.currenciesList.length ? true : false;
})

const isReadyCryptoList: TCryptoStore['isReadyCryptoList'] = computed(() =>{
  return states.cryptoList.size ? true : false;
})

/*** Function (actions)  ***/ 

async function fetchCurrenciesList(): Promise<void>{
  //DevNote: It's for cache API request for dev and not pay it ...
  if (!isReadyCurrencies.value) {
    const cacheCurrencies = useLocalStorage.get("temp_currencies");
    if (cacheCurrencies && Object.entries(cacheCurrencies).length) {
      states.currenciesList = cacheCurrencies;
    } 
    else {
      const response = await axios.get(
        `${URL_API}/simple/supported_vs_currencies`
      );
      if (response.data.length) states.currenciesList = response.data;
      useLocalStorage.set("temp_currencies", response.data);
    }
  }
}

async function fetchCategoriesList(){
  if (!isReadyCategories.value) {
    //DevNote: It's for cache API request for dev and not pay it ...
    const cacheCategories = useLocalStorage.get("temp_categories");

    if (cacheCategories && Object.entries(cacheCategories).length) states.categoriesList = cacheCategories;
    else {
      const response = await axios.get(`${URL_API}/coins/categories/list`);
      if (response.data.length)
        response.data.forEach((e: TEntryCategoryData) => {
          states.categoriesList.push({ id: e.category_id, name: e.name });
        });
      useLocalStorage.set("temp_categories", states.categoriesList);
    }
  }
}

async function fetchCryptoList(): Promise<void> {
  //DevNote: It's for cache API request for dev and not pay it ...
  if (!isReadyCryptoList.value) {
    const cacheCryptoList = useLocalStorage.get("temp_crypto");
    if (cacheCryptoList && Object.entries(cacheCryptoList).length) {
      cacheCryptoList.forEach(([index, e]:[index: string, e: TCryptoData]) => {
        states.cryptoList.set(e.id, { ...e, pricesByCurrencies: {} });
      });
    } else {
      const response = await axios.get(`${URL_API}/coins/list`);
      if (response.data.length)
        for (let e of response.data) {
          states.cryptoList.set(e.id, { ...e, pricesByCurrencies: {} });
        }
      useLocalStorage.set("temp_crypto", Array.from(states.cryptoList))
    }
  }
}

async function fetchCryptosInfos(optimizedList: TCryptoData[]): Promise<void> {
  const requestIds = optimizedList.filter((crypto) =>
    !crypto.pricesByCurrencies[states.currencyActive] ? true : false
  );

  if (requestIds.length) {
    const ids = requestIds.map((e) => e.id);
    const query = {
      ids: ids.join(","),
      vs_currency: states.currencyActive,
      per_page: 250,
      include_24h_vol: true,
      include_24hr_change: true,
      include_last_updated_at: true,
      sparkline: true,
    };

    const response = await axios.get(`${URL_API}/coins/markets`, {
      params: query,
    });

    if (response.data) {
      const responseArray: TEntryCryptoData[] = Object.values(
        response.data
      );
      if (responseArray.length) {
        responseArray.map((value) => {
          const key = value.id;
          const item = states.cryptoList.get(key);
          if (item) {
            item.image = value.image;
            item.sparkline_in_7d = value.sparkline_in_7d.price
            item.pricesByCurrencies[states.currencyActive] = {
              current_price: value.current_price,
              market_cap: value.market_cap,
              total_volume: value.total_volume,
              price_change_24h: value.price_change_24h,
            };
            states.cryptoList.set(key, item);
            if (states.cryptoFavorites.get(key)) states.cryptoFavorites.set(key, item);
          }
        });
      }
    }
  }
}

function setCurrencyActive(currency: string): void {
  states.currencyActive = currency;
  useLocalStorage.set(LOCALSTORAGE_CRYPTO_CURRENCY, states.currencyActive);
}

function addFavorite(crypto: TCryptoData): void {
  states.cryptoFavorites.set(crypto.id, {
    id: crypto.id,
    name: crypto.name,
    symbol: crypto.name,
    pricesByCurrencies: {}
  });
  useLocalStorage.set(LOCALSTORAGE_CRYPTO_FAVORITES, Array.from(states.cryptoFavorites));
}

function removeFavorite(crypto: TCryptoData): void {
  states.cryptoFavorites.delete(crypto.id);
  useLocalStorage.set(LOCALSTORAGE_CRYPTO_FAVORITES, Array.from(states.cryptoFavorites));
}

/* Exports */

export default {
  states: toRefs(states),
  isReadyCategories,
  isReadyCurrencies,
  isReadyCryptoList,
  fetchCurrenciesList,
  fetchCategoriesList,
  fetchCryptoList,
  fetchCryptosInfos,
  setCurrencyActive,
  addFavorite,
  removeFavorite,
} as TCryptoStore