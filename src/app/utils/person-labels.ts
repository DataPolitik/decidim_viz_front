/**
 * Adds a `label` that is unique within the list, for charts that use it as
 * the category of each bar: the name, or "<unnamed> #id" when the export has
 * no name for that person (Decidim leaves deleted accounts' names blank), or
 * "name #id" when several people in the list share a name. Without this,
 * people with the same (or no) name are drawn as one stacked bar.
 */
export function withUniqueLabels<T extends { id: string | number, name: string }>(
  people: T[], unnamed: string): Array<T & { label: string }> {
  const counts = new Map<string, number>();
  for (const person of people) {
    const name = (person.name || '').trim();
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  return people.map(person => {
    const name = (person.name || '').trim();
    let label = name;
    if (!name) {
      label = `${unnamed} #${person.id}`;
    } else if ((counts.get(name) || 0) > 1) {
      label = `${name} #${person.id}`;
    }
    return { ...person, label };
  });
}
