/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'v-contextmenu';
declare module 'mapbox-gl';
declare module 'vue3-pdfjs/esm';
declare module 'crypto-js';
declare module 'http://localhost:8998/js/UniqueValueRender.js';