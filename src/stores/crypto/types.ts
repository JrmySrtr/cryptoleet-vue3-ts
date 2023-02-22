import type { ComputedRef, ToRefs } from "vue"


export interface TCryptoStore {
  states: ToRefs<TCryptoStoreStates>,
  isReadyCategories: ComputedRef<boolean>
  isReadyCurrencies: ComputedRef<boolean>
  isReadyCryptoList: ComputedRef<boolean>
  fetchCurrenciesList: () => Promise<void>
  fetchCategoriesList: () => Promise<void>
  fetchCryptoList: () => Promise<void>
  fetchCryptosInfos: (optimizedList: TCryptoData[]) => Promise<void>
  setCurrencyActive: (currency: string) => void
  addFavorite: (item: TCryptoData) => void
  removeFavorite: (item: TCryptoData) => void
}


export type TCryptoStoreStates= {
  cryptoList: Map<string,TCryptoData>
  currenciesList: string[]
  categoriesList: TCategoryData[]
  currencyActive: string
  categoryActive: string | null
  cryptoFavorites: Map<string,TCryptoData>
}
export type TCryptoList = {
  [key: string]: TCryptoData
}

export type TEntryCryptoData = {
  id: string,
  image: string,
  current_price: number
  market_cap: number,
  total_volume: number,
  price_change_24h: number,
  sparkline_in_7d: {
    price: number[],
  }
}

export type TCryptoData = {
  id: string
  name: string
  symbol: string
  image?: string
  category?: string,
  sparkline_in_7d?: number[]
  pricesByCurrencies: {
    [key: string]: {
      current_price: number
      market_cap: number,
      total_volume: number,
      price_change_24h: number,
    }
  }
}

export type TEntryCategoryData = {
  category_id: string
  name: string
}

export type TCategoryData = {
  id: string,
  name: string,
}