import { useState } from 'react';
import { UserCircle, Save, CheckCircle2 } from 'lucide-react';

/**
 * ProfilePage Component
 *
 * Props Down / Callbacks Up:
 * - Receives the current profile from App (the owner of profile state).
 * - Owns only a local draft of the form fields.
 * - Calls onSave(profile) up to App when the form is submitted, which
 *   updates the username shown in the navbar and on the todo page.
 */
export default function ProfilePage({ profile, onSave }) {
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!draft.name.trim() || !draft.username.trim()) return;
    onSave({
      ...draft,
      name: draft.name.trim(),
      username: draft.username.trim(),
    });
    setSaved(true);
  }

  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="todo-container">
      <div className="page-header">
        <div className="page-title-group">
          <UserCircle size={28} color="var(--primary)" />
          <h1 className="page-title">Account & Profile</h1>
        </div>
        <p className="page-subtitle">Update the details of the person using this app.</p>
      </div>

      <div className="glass-card profile-summary">
        <div className="user-profile-avatar">{initials}</div>
        <div>
          <h2 className="profile-name">{profile.name}</h2>
          <p className="user-username">@{profile.username}</p>
          <p className="profile-meta">{profile.role} &middot; {profile.email}</p>
        </div>
      </div>

      <form className="glass-card profile-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>Full name</span>
          <input className="form-input" name="name" value={draft.name} onChange={handleChange} required />
        </label>
        <label className="form-field">
          <span>Username</span>
          <input className="form-input" name="username" value={draft.username} onChange={handleChange} required />
        </label>
        <label className="form-field">
          <span>Email</span>
          <input className="form-input" type="email" name="email" value={draft.email} onChange={handleChange} />
        </label>
        <label className="form-field">
          <span>Role</span>
          <input className="form-input" name="role" value={draft.role} onChange={handleChange} />
        </label>

        <div className="profile-form-actions">
          {saved && (
            <span className="profile-saved">
              <CheckCircle2 size={16} />
              <span>Profile saved</span>
            </span>
          )}
          <button type="submit" className="btn btn-primary">
            <Save size={16} />
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
