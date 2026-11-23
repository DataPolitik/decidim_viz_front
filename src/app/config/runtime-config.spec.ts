import { CONFIGS } from './config.dev';
import { DECIDIM_API } from './decidim_api';
import { applyRuntimeConfig, loadRuntimeConfig, useBackendInstanceApi } from './runtime-config';

describe('runtime config', () => {
  let savedConfigs: typeof CONFIGS;
  let savedApiUrl: string;

  beforeEach(() => {
    savedConfigs = { ...CONFIGS };
    savedApiUrl = DECIDIM_API[0].url;
    spyOn(console, 'warn');
  });

  afterEach(() => {
    Object.assign(CONFIGS, savedConfigs);
    DECIDIM_API[0].url = savedApiUrl;
  });

  const response = (status: number, body?: any) =>
    ({ ok: status >= 200 && status < 300, status, json: async () => body } as Response);

  it('overrides the compiled defaults with the known keys', () => {
    applyRuntimeConfig({
      host: 'https://viz.example.org', port: '8443', instanceName: 'decidim.example.org',
      decidimApiUrl: 'https://decidim.example.org/api', defaultLanguage: 'es',
      interactions_number_of_proposals: 5,
    });
    expect(CONFIGS.host).toBe('https://viz.example.org');
    expect(CONFIGS.port).toBe('8443');
    expect(CONFIGS.instanceName).toBe('decidim.example.org');
    expect(CONFIGS.defaultLanguage).toBe('es');
    expect(CONFIGS.interactions_number_of_proposals).toBe(5);
    expect(DECIDIM_API[0].url).toBe('https://decidim.example.org/api');
  });

  it('ignores unknown and mistyped keys', () => {
    applyRuntimeConfig({ hots: 'typo', port: 8000, interactions_number_of_proposals: 'three' });
    expect(CONFIGS).toEqual(savedConfigs);
    expect(console.warn).toHaveBeenCalledTimes(3);
  });

  it('reads the files in order, later ones overriding earlier ones', async () => {
    const files: { [url: string]: Response } = {
      'config.json': response(200, { host: 'https://viz.example.org', port: '443' }),
      'config.local.json': response(200, { host: 'http://localhost', port: '8000' }),
    };
    await loadRuntimeConfig(Object.keys(files), async url => files[url] || response(404));
    expect(CONFIGS.host).toBe('http://localhost');
    expect(CONFIGS.port).toBe('8000');
  });

  it('starts with the defaults when files are missing or broken', async () => {
    const fetchFn = async (url: string) => {
      if (url === 'broken.json') {
        throw new Error('network error');
      }
      return response(404);
    };
    await loadRuntimeConfig(['config.json', 'config.local.json', 'broken.json'], fetchFn);
    expect(CONFIGS).toEqual(savedConfigs);
  });

  describe('GraphQL API from the back end', () => {
    it('uses the API of the instance the back end reports', async () => {
      const fetchFn = jasmine.createSpy('fetch').and.callFake(async (url: string) =>
        url.endsWith('/stats/instance') ? response(200, { name: 'x.org', url: 'https://x.org', api_url: 'https://x.org/api' }) : response(404));
      await loadRuntimeConfig(['config.json'], fetchFn);
      expect(fetchFn).toHaveBeenCalledWith(CONFIGS.host + ':' + CONFIGS.port + '/stats/instance');
      expect(DECIDIM_API[0].url).toBe('https://x.org/api');
    });

    it('prefers the back end over the configured decidimApiUrl', async () => {
      const files: { [url: string]: Response } = {
        'config.json': response(200, { decidimApiUrl: 'https://configured.org/api' }),
      };
      await loadRuntimeConfig(['config.json'], async url =>
        files[url] || response(200, { name: 'data.org', url: 'https://data.org', api_url: 'https://data.org/api' }));
      expect(DECIDIM_API[0].url).toBe('https://data.org/api');
    });

    it('keeps the configured API when the back end cannot tell or does not answer', async () => {
      DECIDIM_API[0].url = 'https://configured.org/api';
      await useBackendInstanceApi(async () => response(200, { name: null, url: null, api_url: null }));
      expect(DECIDIM_API[0].url).toBe('https://configured.org/api');
      await useBackendInstanceApi(async () => response(500));
      expect(DECIDIM_API[0].url).toBe('https://configured.org/api');
      await useBackendInstanceApi(() => new Promise<Response>(() => {}), 10);  // never answers
      expect(DECIDIM_API[0].url).toBe('https://configured.org/api');
    });
  });
});
