import GuapaAvatar, { getAvatarColor } from './GuapaAvatar';
import { LENS_COLORS, LENS_ICONS, LENS_LABELS } from '../data/timeline';
import './ProfileModal.css';

export default function ProfileModal({ user, onClose }) {
  if (!user) return null;
  const color = LENS_COLORS[user.lens];

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-backdrop" />
      <div className="profile-card" onClick={e => e.stopPropagation()}>
        <button className="profile-close" onClick={onClose}>✕</button>

        <div className="profile-header">
          <div className="profile-avatar" style={{ borderColor: `${getAvatarColor(user.name)}40` }}>
            <GuapaAvatar name={user.name} size={30} />
          </div>
          <div>
            <h3 className="profile-name">{user.name}</h3>
            <span className={`profile-status ${user.pub ? 'public' : ''}`}>
              {user.pub ? '● public' : '○ private'}
            </span>
          </div>
        </div>

        {user.bio && <p className="profile-bio">"{user.bio}"</p>}

        <div className="profile-exploring">
          <div className="profile-exploring-label">Currently Exploring</div>
          <div className="profile-exploring-content">
            <span className="profile-exploring-icon">{LENS_ICONS[user.lens]}</span>
            <div>
              <div className="profile-exploring-lens" style={{ color }}>
                {LENS_LABELS[user.lens]} — {user.year}
              </div>
              <div className="profile-exploring-vibe">{user.year}</div>
            </div>
          </div>
        </div>

        {user.pub ? (
          <button className="profile-view-btn" style={{
            background: `${color}18`, borderColor: `${color}50`, color
          }}>
            View the world according to {user.name} →
          </button>
        ) : (
          <div className="profile-private">This user's world is private</div>
        )}
      </div>
    </div>
  );
}
