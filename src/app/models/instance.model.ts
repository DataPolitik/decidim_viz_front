/** The Decidim instance the dashboard's data come from (back end: /stats/instance). */
export interface InstanceInfo {
  /** Host name, e.g. "meta.decidim.org"; null when unknown. */
  name: string | null;
  /** Home page, e.g. "https://meta.decidim.org"; null when unknown. */
  url: string | null;
  /** Every host found in the imported data, with its number of proposals. */
  hosts?: Array<{ name: string, proposals: number }>;
}
