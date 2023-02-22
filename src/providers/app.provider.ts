
import { reactive } from "vue";
import { Router, RouteLocation } from "vue-router";
/*
  app.ts is a provider, because it's used in whole application
  @composables are used for composants, so for some part of an application.
  It's doesn't end need to use provide/inject facitilities.
  It work like any other official module.
*/

export interface IAppProvider {
  loadingRoute: boolean;
}

/*** States ***/

const states = reactive({
  loadingRoute: false,
});

/*** Provider Creator ***/

export function createAppProvider(router: Router | undefined = undefined): void {
  if (router) {
    router.beforeEach(
      (to: RouteLocation, from: RouteLocation, next: Function) => {
        states.loadingRoute = true;
        next();
      }
    );
    router.afterEach(() => {
      states.loadingRoute = false;
    });
  }
}

/*** Provider ***/

export default function useAppProvider(router: Router | undefined = undefined): IAppProvider {
  return {
    ...states,
  };
}
