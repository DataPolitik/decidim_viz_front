// Compiled-in defaults. Deployments should not edit this file: settings are
// read at start-up from src/assets/config.json (and the optional, git-ignored
// config.local.json), which override these values. See runtime-config.ts.
export const CONFIGS = {
  host: "https://viz.platoniq.net",
  endpoint: "stats",
  port: "443",
  defaultLanguage: 'en',
  instanceName: 'meta.decidim.org',
  interactions_number_of_proposals: 3
};
