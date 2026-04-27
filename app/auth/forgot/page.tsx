'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `http://localhost:3000/auth/reset`,
    })

    if (error) {
      setError('No se pudo enviar el email. Verifica la dirección.')
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D0D1A 0%, #1a1a35 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '32px' }}>
          <img src="/logo.png" alt="Cruvalo" style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
          <span style={{ fontSize: '26px', fontWeight: 800, color: 'white', fontFamily: 'Georgia, serif', letterSpacing: '-0.5px' }}>
            Cruvalo
          </span>
        </Link>

        <div style={{
          backgroundColor: 'white', borderRadius: '20px',
          padding: '36px', boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        }}>
          {!success ? (
            <>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>
                ¿Olvidaste tu contraseña?
              </h2>
              <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>
                Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    style={inputStyle}
                  />
                </div>

                {error && (
                  <div style={{
                    backgroundColor: '#fef2f2', color: '#b91c1c',
                    padding: '10px 14px', borderRadius: '8px',
                    fontSize: '13px', marginBottom: '16px',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '13px',
                    background: 'linear-gradient(135deg, #00A86B 0%, #00D688 100%)',
                    color: 'black', border: 'none', borderRadius: '10px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '15px', fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    opacity: loading ? 0.7 : 1,
                    boxShadow: '0 4px 16px rgba(0,168,107,0.3)',
                  }}
                >
                  {loading ? 'Enviando...' : 'Enviar enlace'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px', height: '64px',
                background: 'linear-gradient(135deg, #00A86B, #00D688)',
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '28px',
              }}>
                ✉️
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', fontFamily: 'Georgia, serif', marginBottom: '8px' }}>
                Email enviado
              </h2>
              <p style={{ fontSize: '14px', color: '#888', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
                Revisa tu bandeja de entrada en <strong>{email}</strong> y sigue el enlace para restablecer tu contraseña.
              </p>
            </div>
          )}

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Link href="/auth" style={{
              fontSize: '13px', color: '#888', fontFamily: 'Inter, sans-serif',
              display: 'inline-flex', alignItems: 'center', gap: '4px',
            }}>
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '13px', fontWeight: 600,
  color: '#555', marginBottom: '6px', fontFamily: 'Inter, sans-serif',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  border: '1px solid #e5e5e5', borderRadius: '10px',
  fontSize: '14px', color: '#111', outline: 'none',
  fontFamily: 'Inter, sans-serif', backgroundColor: 'white',
}
