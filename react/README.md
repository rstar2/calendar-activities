## PWA support

### Use the recommended Vite plugin for PWA - https://vite-pwa-org.netlify.app

- It will dynamically inject a manifest file. Before that can generate all needed icon assets using the `@vite-pwa/assets-generator` npm script.
- Use the `registerType: "prompt"` option as thus specific UI could be shown when new version of the app is available
    > For this use import the virtual Vite module `virtual:pwa-register` . In this case all is encapsulated in a custom TS file `registerSW.tsx`. Its type-definitions should be added in `vite-env.d.ts`
