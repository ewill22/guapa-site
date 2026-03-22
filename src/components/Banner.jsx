import './Banner.css';

export default function Banner({ text = 'who are you really? and what were you before?' }) {
  return <div className="top-banner">{text}</div>;
}
