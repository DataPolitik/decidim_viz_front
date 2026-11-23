import { proposalTitle } from './proposal-title';

describe('proposalTitle', () => {
  const bilingual = { id: 2, title: 'In English', title_en: 'In English', title_es: 'En castellano', title_fr: '' };
  const catalanOnly = { id: 1, title: 'Només en català', title_en: '', title_es: '', title_fr: '' };

  it('uses the interface language when the proposal has it', () => {
    expect(proposalTitle(bilingual, 'es')).toBe('En castellano');
    expect(proposalTitle(bilingual, 'en')).toBe('In English');
  });

  it('falls back to the original title, then other translations, then the id', () => {
    // Regression: the charts always showed title_es, empty for most meta.decidim.org proposals.
    expect(proposalTitle(catalanOnly, 'es')).toBe('Només en català');
    expect(proposalTitle({ id: 3, title_fr: 'En français' }, 'es')).toBe('En français');
    expect(proposalTitle({ id: 4 }, 'es')).toBe('#4');
    expect(proposalTitle(undefined, 'es')).toBe('');
  });
});
