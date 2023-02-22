import { AVAILABLE_THEMES } from "@/app.constants";
import { LOCALSTORAGE_THEME } from "@/app.storages";
import { reactive, Ref, toRefs } from "vue";
import useLocalStorage from "@/composables/useLocalStorage";

/*
  themes.provider.ts is a provider, because it's used in whole application
  @composables are used for composants, so for some part of an application.
  It's doesn't end need to use provide/inject facitilities.
  It work like any other official module.
*/

type TThemes = "light" | "dark";

export interface IThemesProvider {
  current: Ref<TThemes>;
  set: (value: TThemes) => void;
}

/*** Provider Creator ***/

export default function useThemesProvider(): IThemesProvider {
  
  return {
    ...toRefs(states),
    set,
  };
}

/*** States ***/

const states = reactive({
  current: useLocalStorage.get(LOCALSTORAGE_THEME) || "dark",
});

/*** Actions ***/

function set(value: TThemes): void {
  if (!Object.values(AVAILABLE_THEMES).includes(value)) return;
  useLocalStorage.set(LOCALSTORAGE_THEME, value);
  states.current = value;
}
