import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ApolloTestingModule } from 'apollo-angular/testing';

/**
 * Imports that give a component under test what the app module provides:
 * HttpClient (no real requests: they stay pending), the router, ngx-translate
 * (keys are shown untranslated) and Apollo with the named GraphQL clients the
 * app creates at start-up ('futureu', see config/decidim_api.ts and
 * utils/metrics.utils.ts).
 *
 * Pass apolloClients = [] for a component that creates those clients itself
 * (AppComponent).
 */
export function appTestingImports(apolloClients: string[] = ['futureu']): any[] {
  return [
    HttpClientTestingModule,
    RouterTestingModule,
    TranslateModule.forRoot(),
    apolloClients.length ? ApolloTestingModule.withClients(apolloClients) : ApolloTestingModule,
  ];
}

/** Shallow rendering: child components and third-party elements (PrimeNG, charts) are not instantiated. */
export const SHALLOW = [NO_ERRORS_SCHEMA];
