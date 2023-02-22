<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import type { TLangs } from "@/providers/languages.provider";
import { Flag } from "@/app.organizer";
import { ROUTE_CRYPTO_OVERVIEW, ROUTE_CRYPTO_FAVORITES } from "@/app.routes";
import useThemesProvider from "@/providers/themes.provider";
import useLanguagesProvider from "@/providers/languages.provider";

const Themes = useThemesProvider();
const Languages = useLanguagesProvider();

const router = useRouter();
const { t: print, locale } = useI18n();
const isMobileMenuOpen = ref(false);
const currentRouteName = computed(() => router.currentRoute.value.name);

const menuActiveRoute = ref(router.currentRoute.value.name);

const setMobileMenuOpen = (value: boolean) => {
  isMobileMenuOpen.value = value;
};

const changeLanguage = (value: TLangs) => {
  locale.value = value;
  Languages.set(value);
};

const toggleTheme = () => {
  if (Themes.current.value === "dark") Themes.set("light");
  else Themes.set("dark");
}

watch(currentRouteName, () => {
  isMobileMenuOpen.value = false;
  menuActiveRoute.value = currentRouteName.value ? currentRouteName.value : '';
});

watch(menuActiveRoute, (name) => {
  if (name) router.push({ name: name })
})
</script>

<template>
  <header class="header absolute d-flex bg-default p-4 w-100">
    <nav class="d-flex flex-1">
      <v-container class="d-flex flex-1 mx-auto py-1 px-0 max-w-80r">
        <v-row class="fill-height ma-0">
          <v-col
            cols="3"
            class="d-flex fill-height align-center justify-left pa-0 a-05 d-500 slideInDown"
          >
            <img
              src="https://www.iconpacks.net/icons/2/free-cryptocurrency-coin-icon-2422-thumb.png"
              class="fill-height mr-3 h-6 sm:h-9 dark:invert"
              alt="Cryptoleet logo"
            />
            <span
              class="self-center text-default text-h5 font-semibold whitespace-nowrap dark:text-white"
            >
              Cryptoleet
            </span>
          </v-col>
          <v-col
            cols="6"
            class="d-flex fill-height align-center justify-center pa-0 a-05 d-700 slideInDown"
          >
            <v-btn-toggle v-model="menuActiveRoute" rounded="0" mandatory group>
              <v-btn class="menu-link" :value="ROUTE_CRYPTO_OVERVIEW.name">
                {{ print("home") }}
              </v-btn>
              <v-btn class="menu-link" :value="ROUTE_CRYPTO_FAVORITES.name">
                {{ print("favorites") }}
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col
            cols="3"
            class="d-flex fill-height align-center justify-end pa-0 a-05 d-900 slideInDown"
          >
            <div class="d-flex flex-1 justify-center align-center">
              <Flag
                :type="'fr'"
                class="flag"
                width="40px"
                @click="() => changeLanguage('fr')"
                :is-active="Languages.current.value === 'fr'"
              />
              <Flag
                :type="'en'"
                class="flag"
                width="40px"
                @click="() => changeLanguage('en')"
                :is-active="Languages.current.value === 'en'"
              />
            </div>
            <div class="theme hidden-sm d-md-flex ">
              <input type="checkbox" id="toggle-theme" @change="()=> toggleTheme()"/>
	            <label for="toggle-theme"></label>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </nav>
  </header>
</template>

<style lang="scss">
.header {
  height: var(--header-height);

  .menu-link {
    background-color: transparent;
    &.v-btn--active {
      background-color: transparent;
    }
    .v-btn__overlay {
      display: none;
    }
  }

  .theme {
    transition: all 0.5s;
    input[type="checkbox"] {
      visibility: hidden;
      &:checked + label {
        transform: rotate(360deg);
        &:before {
          transform: translateX(28px);
        }
      }
    }

    label {
      display: flex;
      width: 60px;
      height: 30px;
      border: 3px solid;
      border-radius: 99em;
      position: relative;
      transition: transform .75s ease-in-out;
      transform-origin: 50% 50%;
      cursor: pointer;
      
      &:before {
        transition: transform .75s ease;
        transition-delay: .5s;
        content: "";
        display: block;
        position: absolute;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        top: 1px;
        left: 2px;
      }
    }
  }
}

#app.dark {
  .header {
    .menu-link {
      color: #777;
      &.v-btn--active {
        color: white;
      }
    }
    .theme {
      input[type="checkbox"] {
        &:checked + label {
          background-color: transparent;
          &:before {
            transform: translateX(28px);
            background-color: #FFF;
          }
        }
      }
      label {
        border-color: white;
        &:before {
          background-color: white;
        }
      }
    }
  }
}

#app.light{
  .header {
    .menu-link {
      color: #AAA;
      &.v-btn--active {
        color: black;
      }
    }
    .theme {
      input[type="checkbox"] {
        &:checked + label {
          &:before {
            transform: translateX(28px);
            background-color: #000;
          }
        }
      }
      label {
        border-color: black;
        &:before {
          background-color: #000;
        }
      }
    }
  }
}
</style>
