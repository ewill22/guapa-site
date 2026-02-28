import './Banner.css';

export default function Banner({ text = 'yearning for something to keep him up at night' }) {
  return <div className="top-banner">{text}</div>;
}
