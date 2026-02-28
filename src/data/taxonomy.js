// Taxonomy data for expandable branches per lens/year
export const TAXONOMY = {
  world: {
    2026: [
      { icon: '⚡', label: 'Technology', stat: 'dominant', items: [
        { name: 'Artificial Intelligence', d: '$700B+ capex', b: 'peak' },
        { name: 'Quantum Computing', d: 'early commercial', b: 'new' },
        { name: 'Renewable Energy', d: '35% of grid', b: 'up' },
      ]},
      { icon: '💰', label: 'Economy', stat: '$105T GDP', items: [
        { name: 'AI Infra Boom', d: 'largest capex ever', b: 'peak' },
        { name: 'US Debt', d: '$36T+', b: 'up' },
        { name: 'Interest Rates', d: 'elevated plateau', b: 'down' },
      ]},
    ],
    2020: [
      { icon: '🦠', label: 'Pandemic', stat: 'global crisis', items: [
        { name: 'COVID-19', d: '6M+ deaths', b: 'peak' },
        { name: 'mRNA Vaccines', d: 'breakthrough', b: 'new' },
        { name: 'Remote Work', d: 'permanent shift', b: 'new' },
      ]},
    ],
  },
  music: {
    2026: [
      { icon: '🤖', label: 'AI & Production', stat: 'transforming', items: [
        { name: 'AI Mastering', d: 'LANDR, iZotope', b: 'peak' },
        { name: 'Generative Music', d: 'Suno, Udio', b: 'new' },
      ]},
      { icon: '🎤', label: 'Genres', stat: 'fragmented', items: [
        { name: 'Afrobeats', d: 'global mainstream', b: 'up' },
        { name: 'Regional Mexican', d: 'Billboard dominant', b: 'up' },
      ]},
    ],
    1994: [
      { icon: '🎤', label: 'Hip-Hop', stat: 'golden age', items: [
        { name: 'Nas — Illmatic', d: 'April 19', b: 'peak' },
        { name: 'Notorious B.I.G.', d: 'Ready to Die', b: 'new' },
        { name: 'Outkast', d: 'debut album', b: 'new' },
      ]},
    ],
  },
  tech: {
    2026: [
      { icon: '🤖', label: 'AI & ML', stat: '$200B+', items: [
        { name: 'Agentic AI', d: 'autonomous workflows', b: 'peak' },
        { name: 'OpenAI', d: '$150B+ valuation', b: 'up' },
        { name: 'Anthropic', d: 'enterprise leader', b: 'up' },
      ]},
      { icon: '💰', label: 'Big Tech Capex', stat: '$700B+', items: [
        { name: 'Amazon', d: '$200B', b: 'peak' },
        { name: 'Alphabet', d: '$175B', b: 'peak' },
        { name: 'Microsoft', d: '$80B+', b: 'up' },
        { name: 'Meta', d: '$65B', b: 'up' },
      ]},
    ],
  },
  coffee: {
    2026: [
      { icon: '☕', label: 'Methods', stat: 'precision era', items: [
        { name: 'French Press', d: 'classic immersion', b: 'peak' },
        { name: 'Pour Over', d: 'V60, Kalita', b: 'up' },
        { name: 'Espresso', d: 'home machines boom', b: 'up' },
      ]},
      { icon: '🌱', label: 'Origins', stat: 'climate pressure', items: [
        { name: 'Ethiopia', d: 'naturals', b: 'peak' },
        { name: 'Colombia', d: 'washed excellence', b: 'up' },
        { name: 'Honduras', d: 'rising star', b: 'up' },
      ]},
    ],
  },
  economics: {
    2026: [
      { icon: '📈', label: 'Markets', stat: 'AI-driven', items: [
        { name: 'S&P 500', d: 'tech-heavy rally', b: 'up' },
        { name: 'Bond Market', d: 'curve normalizing', b: 'down' },
        { name: 'Real Estate', d: 'rate-sensitive stall', b: 'down' },
      ]},
      { icon: '🏛️', label: 'Policy', stat: 'divergence', items: [
        { name: 'Fed Rate', d: '4.25-4.50%', b: 'down' },
        { name: 'National Debt', d: '$36T+', b: 'up' },
        { name: 'Tariffs', d: 'trade tensions', b: 'up' },
      ]},
    ],
  },
};

export function getTaxonomy(lens, year) {
  const d = TAXONOMY[lens];
  if (!d) return null;
  if (d[year]) return d[year];
  const yrs = Object.keys(d).map(Number).sort((a, b) => b - a);
  for (const y of yrs) if (y <= year) return d[y];
  return null;
}
