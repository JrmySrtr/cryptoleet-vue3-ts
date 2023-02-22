
import { reactive, Ref, toRefs } from "vue";
import { v4 as uuidv4 } from 'uuid';
/*
  app.ts is a provider, because it's used in whole application
  @composables are used for composants, so for some part of an application.
  It's doesn't end need to use provide/inject facitilities.
  It work like any other official module.
*/

export interface IDeviceProvider {
  eUID: Ref<string>
}

/*** States ***/

const states = reactive({
  eUID: uuidv4(),
});

/*** Provider Creator ***/

export default function useDeviceProvider(): IDeviceProvider {
  return {
    ...toRefs(states),
  };
}
