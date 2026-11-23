import { CONFIGS } from './config.dev';
import { DECIDIM_API } from './decidim_api';

/**
 * Settings read when the app starts in the browser, so a deployment can be
 * pointed at another back end or Decidim instance by editing a JSON file,
 * without rebuilding. Every key is optional; missing ones keep the defaults
 * compiled from config.dev.ts and decidim_api.ts.
 */
export interface RuntimeConfig {
  /** Back end address, e.g. "https://viz.example.org". */
  host?: string;
  /** Back end port, e.g. "443". */
  port?: string;
  /** Name of the Decidim instance the data come from, shown on the About page. */
  instanceName?: string;
  /**
   * GraphQL API of that instance, e.g. "https://meta.decidim.org/api". Only a
   * fallback: at start-up the back end's /stats/instance takes precedence.
   */
  decidimApiUrl?: string;
  /** Interface language: "en" or "es". */
  defaultLanguage?: string;
  /** Proposals listed per community on the Community page. */
  interactions_number_of_proposals?: number;
}

/**
 * Files read in order, later ones overriding earlier ones. config.json ships
 * with the app; config.local.json is optional and ignored by git, for local
 * development.
 */
export const RUNTIME_CONFIG_FILES = ['assets/config.json', 'assets/config.local.json'];

const STRING_KEYS = ['host', 'port', 'instanceName', 'defaultLanguage'] as const;

/** Applies the known keys of one config object; anything else is reported and ignored. */
export function applyRuntimeConfig(config: any): void {
  if (!config || typeof config !== 'object') {
    console.warn('Ignoring runtime config that is not a JSON object:', config);
    return;
  }
  for (const [key, value] of Object.entries(config)) {
    if ((STRING_KEYS as readonly string[]).includes(key) && typeof value === 'string') {
      (CONFIGS as any)[key] = value;
    } else if (key === 'decidimApiUrl' && typeof value === 'string') {
      DECIDIM_API[0].url = value;
    } else if (key === 'interactions_number_of_proposals' && typeof value === 'number') {
      CONFIGS.interactions_number_of_proposals = value;
    } else {
      console.warn(`Ignoring unknown or mistyped runtime config key "${key}"`);
    }
  }
}

type FetchFn = (url: string, init?: RequestInit) => Promise<Response>;

/**
 * Reads the runtime config files before the app starts, then asks the back end
 * which Decidim instance its data come from and uses that instance's GraphQL
 * API (so the API always matches the data; the configured decidimApiUrl is
 * only a fallback). A missing file (such as the optional config.local.json),
 * an invalid one, or an unreachable back end is skipped, so the app always
 * starts.
 */
export async function loadRuntimeConfig(
    files: string[] = RUNTIME_CONFIG_FILES,
    fetchFn: FetchFn = (url, init) => fetch(url, init)): Promise<void> {
  for (const file of files) {
    try {
      const response = await fetchFn(file, { cache: 'no-store' });
      if (!response.ok) {
        continue;
      }
      applyRuntimeConfig(await response.json());
    } catch (error) {
      console.warn(`Could not read runtime config ${file}:`, error);
    }
  }
  await useBackendInstanceApi(fetchFn);
}

/** How long start-up waits for the back end's answer before using the configured API. */
export const BACKEND_INSTANCE_TIMEOUT_MS = 3000;

/** Sets the GraphQL API to the one of the instance the back end's data come from (/stats/instance). */
export async function useBackendInstanceApi(fetchFn: FetchFn, timeoutMs = BACKEND_INSTANCE_TIMEOUT_MS): Promise<void> {
  const url = CONFIGS.host + ':' + CONFIGS.port + '/stats/instance';
  try {
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timed out')), timeoutMs));
    const response = await Promise.race([fetchFn(url), timeout]);
    if (!response.ok) {
      return;
    }
    const instance = await response.json();
    if (instance && typeof instance.api_url === 'string' && instance.api_url) {
      DECIDIM_API[0].url = instance.api_url;
    }
  } catch (error) {
    console.warn('Could not ask the back end for its Decidim instance; using the configured GraphQL API.', error);
  }
}
