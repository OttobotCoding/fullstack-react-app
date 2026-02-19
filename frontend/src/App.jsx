import React, { useState, useEffect, useCallback } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ─── API helpers ──────────────────────────────────────────────────────────────
const api = {
  submit: (data) =>
    fetch(`${API_URL}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then((r) => r.json()),
  getAll: () => fetch(`${API_URL}/api/contacts`).then((r) => r.json()),
  delete: (id) =>
    fetch(`${API_URL}/api/contacts/${id}`, { method: 'DELETE' }).then((r) => r.json()),
};

// ─── Components ───────────────────────────────────────────────────────────────
const Spinner = () => (
  <span style={{
    display: 'inline-block', width: 18, height: 18,
    border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000',
    borderRadius: '50%', animation: 'spin 0.7s linear infinite', verticalAlign: 'middle',
  }} />
);

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 999,
      background: type === 'success' ? 'var(--success)' : 'var(--danger)',
      color: '#000', padding: '14px 22px', borderRadius: 'var(--radius)',
      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      animation: 'fadeUp 0.3s ease forwards',
      display: 'flex', alignItems: 'center', gap: 10,
      maxWidth: 360,
    }}>
      <span style={{ fontSize: 18 }}>{type === 'success' ? '✓' : '✕'}</span>
      {message}
    </div>
  );
};

const Field = ({ label, name, type = 'text', value, onChange, error, required, placeholder, multiline, rows = 4 }) => {
  const [focused, setFocused] = useState(false);
  const inputStyle = {
    width: '100%', background: 'var(--surface2)',
    border: `1.5px solid ${error ? 'var(--danger)' : focused ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 8, color: 'var(--text)',
    fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: 15,
    padding: multiline ? '14px 16px' : '12px 16px',
    outline: 'none', resize: multiline ? 'vertical' : undefined,
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxShadow: focused ? `0 0 0 3px ${error ? 'rgba(255,71,87,0.15)' : 'rgba(232,255,71,0.12)'}` : 'none',
    minHeight: multiline ? rows * 30 : undefined,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: error ? 'var(--danger)' : 'var(--text-muted)',
      }}>
        {label}{required && <span style={{ color: 'var(--accent)', marginLeft: 3 }}>*</span>}
      </label>
      {multiline ? (
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder}
          style={inputStyle} rows={rows}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      ) : (
        <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder}
          style={inputStyle}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      )}
      {error && (
        <span style={{ fontSize: 12, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 4 }}>
          ⚠ {error}
        </span>
      )}
    </div>
  );
};

const ContactCard = ({ contact, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this entry?')) return;
    setDeleting(true);
    await onDelete(contact.id);
  };

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '20px 24px',
      display: 'grid', gridTemplateColumns: '1fr auto', gap: 12,
      animation: 'fadeUp 0.4s ease forwards',
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#333'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
          }}>{contact.name}</span>
          <span style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 4, padding: '2px 8px', fontSize: 11,
            fontFamily: 'var(--font-display)', color: 'var(--accent2)', letterSpacing: '0.05em',
          }}>{contact.subject}</span>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>
          {contact.email}{contact.phone && ` · ${contact.phone}`}
        </div>
        <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.5 }}>{contact.message}</p>
        <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>
          {new Date(contact.created_at).toLocaleString()}
        </div>
      </div>
      <button onClick={handleDelete} disabled={deleting}
        style={{
          background: 'none', border: '1px solid var(--border)',
          borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer',
          width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
          alignSelf: 'start', fontSize: 16, transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--danger)'; e.currentTarget.style.color = 'var(--danger)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
      >
        {deleting ? <Spinner /> : '×'}
      </button>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
const INITIAL_FORM = { name: '', email: '', phone: '', subject: '', message: '' };
const SUBJECTS = ['General Inquiry', 'Support', 'Feedback', 'Partnership', 'Other'];

export default function App() {
  const [tab, setTab] = useState('form');
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.subject) e.subject = 'Please select a subject';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const res = await api.submit(form);
      if (res.success) {
        setForm(INITIAL_FORM);
        showToast('Message sent successfully!');
        if (contacts.length > 0) fetchContacts(); // refresh if already loaded
      } else {
        showToast(res.errors?.[0]?.msg || 'Submission failed', 'error');
      }
    } catch {
      showToast('Cannot connect to server. Is the backend running?', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getAll();
      if (res.success) setContacts(res.data);
      else showToast('Failed to load contacts', 'error');
    } catch {
      showToast('Cannot connect to server', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(id);
      if (res.success) {
        setContacts((c) => c.filter((x) => x.id !== id));
        showToast('Entry deleted');
      }
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  useEffect(() => {
    if (tab === 'records') fetchContacts();
  }, [tab, fetchContacts]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '60px 60px', opacity: 0.3,
      }} />

      {/* Header */}
      <header style={{
        position: 'relative', zIndex: 1,
        borderBottom: '1px solid var(--border)',
        padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
        background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, background: 'var(--accent)',
            borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: '#000' }}>F</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
            FullStack<span style={{ color: 'var(--accent)' }}>App</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {['form', 'records'].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 20px', borderRadius: 8, cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, letterSpacing: '0.04em',
              textTransform: 'uppercase', transition: 'all 0.2s',
              background: tab === t ? 'var(--accent)' : 'transparent',
              color: tab === t ? '#000' : 'var(--text-muted)',
              border: tab === t ? '1px solid var(--accent)' : '1px solid transparent',
            }}>
              {t === 'form' ? '📝 Submit' : '📋 Records'}
            </button>
          ))}
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1, padding: '60px 40px', maxWidth: 860, margin: '0 auto', width: '100%' }}>

        {tab === 'form' && (
          <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>
            {/* Hero */}
            <div style={{ marginBottom: 48 }}>
              <p style={{
                fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)',
                marginBottom: 16,
              }}>MySQL · Express · React · Node.js</p>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(36px, 6vw, 64px)',
                lineHeight: 1.05, marginBottom: 16,
              }}>
                Get in<br />
                <span style={{
                  background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>Touch.</span>
              </h1>
              <p style={{ color: 'var(--text-muted)', maxWidth: 480, fontSize: 16 }}>
                Submit the form below. Your data is stored in a MySQL database via a RESTful Node.js API.
              </p>
            </div>

            {/* Form */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 20, padding: 'clamp(24px, 5vw, 48px)',
            }}>
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  <Field label="Full Name" name="name" value={form.name} onChange={handleChange}
                    error={errors.name} required placeholder="Jane Smith" />
                  <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange}
                    error={errors.email} required placeholder="jane@example.com" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange}
                    placeholder="+1 (555) 000-0000" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{
                      fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: errors.subject ? 'var(--danger)' : 'var(--text-muted)',
                    }}>
                      Subject<span style={{ color: 'var(--accent)', marginLeft: 3 }}>*</span>
                    </label>
                    <select name="subject" value={form.subject} onChange={handleChange}
                      style={{
                        background: 'var(--surface2)', border: `1.5px solid ${errors.subject ? 'var(--danger)' : 'var(--border)'}`,
                        borderRadius: 8, color: form.subject ? 'var(--text)' : 'var(--text-muted)',
                        fontFamily: 'var(--font-body)', fontSize: 15, padding: '12px 16px',
                        outline: 'none', cursor: 'pointer',
                      }}>
                      <option value="" disabled>Select a subject…</option>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.subject && <span style={{ fontSize: 12, color: 'var(--danger)' }}>⚠ {errors.subject}</span>}
                  </div>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <Field label="Message" name="message" value={form.message} onChange={handleChange}
                    error={errors.message} required placeholder="Write your message here…" multiline rows={5} />
                </div>

                <button type="submit" disabled={submitting}
                  style={{
                    background: submitting ? 'var(--border)' : 'var(--accent)',
                    color: '#000', border: 'none', borderRadius: 10, cursor: submitting ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, letterSpacing: '0.05em',
                    padding: '15px 32px', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: 10,
                    transform: submitting ? 'none' : undefined,
                  }}
                  onMouseEnter={e => !submitting && (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {submitting && <Spinner />}
                  {submitting ? 'Sending…' : 'Send Message →'}
                </button>
              </form>
            </div>

            {/* Stack info */}
            <div style={{
              marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
            }}>
              {[
                { icon: '⚛️', label: 'React', desc: 'Frontend' },
                { icon: '🟢', label: 'Node.js', desc: 'Runtime' },
                { icon: '🚂', label: 'Express', desc: 'API Server' },
                { icon: '🐬', label: 'MySQL', desc: 'Database' },
              ].map((item) => (
                <div key={item.label} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: '16px 18px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{item.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'records' && (
          <div style={{ animation: 'fadeUp 0.5s ease forwards' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 36 }}>
              <div>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8,
                }}>Database Records</p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36 }}>
                  All Contacts
                  {!loading && (
                    <span style={{
                      marginLeft: 14, fontSize: 18, color: 'var(--text-muted)',
                      fontWeight: 400, fontFamily: 'var(--font-body)',
                    }}>({contacts.length})</span>
                  )}
                </h2>
              </div>
              <button onClick={fetchContacts} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 8, color: 'var(--text)', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 12, letterSpacing: '0.05em',
                padding: '10px 18px', transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >↺ Refresh</button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 32, animation: 'pulse 1.5s infinite', marginBottom: 12 }}>⏳</div>
                Loading from database…
              </div>
            ) : contacts.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: 80,
                border: '1px dashed var(--border)', borderRadius: 16,
                color: 'var(--text-muted)',
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 8 }}>No records yet</p>
                <p>Submit the form to see entries here.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {contacts.map((c) => (
                  <ContactCard key={c.id} contact={c} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid var(--border)', padding: '20px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-display)',
      }}>
        <span>Full-Stack Contact App — React + Express + MySQL</span>
        <span style={{ color: 'var(--border)' }}>●</span>
        <span>Deploy Frontend → GitHub Pages · Backend → Railway / Render</span>
      </footer>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}
