/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}


declare module 'vuex' {
  import * as Vuex from 'vuex/types/index';
  export = Vuex;
}