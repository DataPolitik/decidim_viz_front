/**
 * The title to show for a proposal: in the given interface language if there
 * is one, else as originally written (`title`, sent by the back end), else any
 * other translation, else its id. Never empty for a proposal with an id.
 */
export function proposalTitle(proposal: any, language?: string): string {
  if (!proposal) {
    return '';
  }
  const inLanguage = language ? proposal['title_' + language] : undefined;
  return inLanguage || proposal.title || proposal.title_en || proposal.title_es || proposal.title_fr
    || (proposal.id !== undefined && proposal.id !== null ? `#${proposal.id}` : '');
}
