import './Banner.css';

export default function Banner({ text = 'who are you really? and what were you before? what did you do? and what did you think?' }) {
  return <div className="top-banner">{text}</div>;
}
