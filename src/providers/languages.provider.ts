import { AVAILABLE_LANGUAGES } from "@/app.constants";
import { LOCALSTORAGE_LANGUAGE } from "@/app.storages";
import { reactive, Ref, toRefs } from "vue";
import useLocalStorage from "@/composables/useLocalStorage";
/*
  language.provider.ts is a provider, because it's used in whole application
  @composables are used for composants, so for some part of an application.
  It's doesn't end need to use provide/inject facitilities.
  It work like any other official module.
*/

export type TLangs = "fr" | "en";

export interface ILanguagesProvider {
  current: Ref<TLangs>;
  set: (value: TLangs) => void;
}
/*** Provider Creator ***/

export default function useLanguagesProvider(): ILanguagesProvider {
  return {
    ...toRefs(states),
    set,
  };
}

/*** States ***/

const states = reactive({
  current: useLocalStorage.get(LOCALSTORAGE_LANGUAGE) || "en",
});


/*** Actions ***/

function set(value: TLangs): void {
  if (!Object.values(AVAILABLE_LANGUAGES).includes(value)) return;
  useLocalStorage.set(LOCALSTORAGE_LANGUAGE, value);
  states.current = value;
}