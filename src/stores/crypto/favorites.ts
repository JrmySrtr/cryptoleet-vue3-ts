import { LOCALSTORAGE_CRYPTO_FAVORITES } from "@/app.storages";
import useLocalStorage from "../../composables/useLocalStorage";
import { TCryptoData } from "./types";

export const load = (): Map<string,TCryptoData> => {
  const favorites: [string, TCryptoData][] = useLocalStorage.get(LOCALSTORAGE_CRYPTO_FAVORITES)
  if (favorites && Object.entries(favorites).length)
  {
    const map = new Map<string,TCryptoData>();
    for (const [key, value] of Object.values(favorites)) map.set(key, value);
    return map
  }
  else return new Map();
}