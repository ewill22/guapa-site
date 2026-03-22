import './Banner.css';

const QUOTES = [
  'who are you really? and what were you before?',
  'yearning for something to keep him up at night',
];

export default function Banner() {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  return <div className="top-banner">{quote}</div>;
}
