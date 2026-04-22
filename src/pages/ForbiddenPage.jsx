import { useNavigate } from 'react-router-dom'

export default function ForbiddenPage() {
  const navigate = useNavigate()
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-page, #F0F4F9)',
    }}>
      <div style={{
        background: '#fff',
        border: '1px solid #E0E8F1',
        borderRadius: 12,
        boxShadow: '0 20px 60px rgba(0,0,0,0.10)',
        padding: 48,
        textAlign: 'center',
        maxWidth: 400,
        width: '100%',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: '#FFF5F5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: 28,
        }}>🔒</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1A202C', marginBottom: 10 }}>
          Accès refusé
        </h2>
        <p style={{ fontSize: 14, color: '#718096', lineHeight: 1.6, marginBottom: 24 }}>
          Vous n'avez pas les droits nécessaires pour accéder à cette page.
        </p>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'linear-gradient(135deg, #003F82 0%, #0056B3 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          ← Retour
        </button>
      </div>
    </div>
  )
}
