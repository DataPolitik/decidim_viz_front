import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { loadRuntimeConfig } from './app/config/runtime-config';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// Read assets/config.json (and the optional config.local.json) before starting,
// so the back end and Decidim instance can be changed without rebuilding.
loadRuntimeConfig()
  .then(() => platformBrowserDynamic().bootstrapModule(AppModule))
  .catch(err => console.error(err));
