import { GUAPA_LOGO } from '../data/guapaLogo';
import { hashStr } from '../data/timeline';

// Expanded Guapa palette for user avatars
const AVATAR_COLORS = [
  '#e8a0b0', '#f0c014', '#6ab0e8', '#7ec89b', '#c89b6a',
  '#d47a7a', '#b088d4', '#e8d06a', '#6ad4c8', '#d4886a',
  '#8bc4e8', '#e8c88a', '#a0c878', '#e088a8', '#88a8d8',
];

export function getAvatarColor(name) {
  return AVATAR_COLORS[hashStr(name) % AVATAR_COLORS.length];
}

export default function GuapaAvatar({ name, size = 32 }) {
  const color = getAvatarColor(name);
  return (
    <div style={{
      width: size,
      height: size * 1.18,
      flexShrink: 0,
      backgroundColor: color,
      WebkitMaskImage: `url(${GUAPA_LOGO})`,
      maskImage: `url(${GUAPA_LOGO})`,
      WebkitMaskSize: 'contain',
      maskSize: 'contain',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'center',
      maskPosition: 'center',
    }} />
  );
}
