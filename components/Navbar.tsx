'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const categories = [
  { name: 'Todas', href: '/' },
  { name: 'La Liga', href: '/liga/laliga' },
  { name: 'Premier', href: '/liga/premier' },
  { name: 'Champions', href: '/liga/champions' },
  { name: 'Bundesliga', href: '/liga/bundesliga' },
  { name: 'Serie A', href: '/liga/seriea' },
  { name: 'Ligue 1', href: '/liga/ligue1' },
  { name: 'Fichajes', href: '/liga/fichajes' },
  { name: 'Selecciones', href: '/liga/selecciones' },
]

export default function Navbar() {
  const [active, setActive] = useState('Todas')
  const [search, setSearch] = useState('')
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Main header */}
      <div style={{ background: 'linear-gradient(135deg, #0D0D1A 0%, #1a1a35 100%)' }}>
        <div style={{
          maxWidth: '1320px', margin: '0 auto', padding: '0 24px',
          height: '64px', display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <img src="/logo.png" alt="Cruvalo" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'white', fontFamily: 'Georgia, serif', lineHeight: 1 }}>Cruvalo</div>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.35)', letterSpacing: '2px', fontWeight: 600 }}>NOTICIAS DE FÚTBOL</div>
            </div>
          </Link>

          {/* Barra de búsqueda */}
          <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '480px' }}>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar equipos, jugadores, noticias..."
                style={{
                  width: '100%', padding: '9px 14px 9px 38px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '10px',
                  fontSize: '13px', color: 'white', outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
                onFocus={e => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.12)'
                  e.target.style.borderColor = 'rgba(0,168,107,0.5)'
                }}
                onBlur={e => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.08)'
                  e.target.style.borderColor = 'rgba(255,255,255,0.12)'
                }}
              />
            </div>
          </form>

          {/* Nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: 'auto' }}>
            {[
              { label: 'Partidos', href: '/partidos' },
              { label: 'Clasificaciones', href: '/clasificaciones' },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{
                padding: '7px 12px', fontSize: '13px', fontWeight: 500,
                color: 'rgba(255,255,255,0.65)', borderRadius: '8px', transition: 'all 0.15s',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = 'white'
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)'
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
              }}>
                {item.label}
              </Link>
            ))}
            {/* Descarga la app */}
            <div style={{ width: '1px', height: '18px', backgroundColor: 'rgba(255,255,255,0.12)', margin: '0 6px' }} />
            <Link href="#" style={{
              padding: '8px 16px', fontSize: '13px', fontWeight: 700,
              color: 'black',
              background: 'linear-gradient(135deg, #00A86B 0%, #00D688 100%)',
              borderRadius: '8px',
              boxShadow: '0 2px 12px rgba(0,168,107,0.35)',
              fontFamily: 'Inter, sans-serif',
              whiteSpace: 'nowrap',
            }}>
              📱 Descarga la app
            </Link>
          </nav>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{
        backgroundColor: 'white', borderBottom: '1px solid #eee',
        overflowX: 'auto', scrollbarWidth: 'none',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 24px', display: 'flex' }}>
          {categories.map(cat => (
            <Link key={cat.name} href={cat.href}
              onClick={() => setActive(cat.name)}
              style={{
                padding: '11px 16px', fontSize: '13px',
                fontWeight: active === cat.name ? 700 : 500,
                color: active === cat.name ? '#00A86B' : '#666',
                borderBottom: active === cat.name ? '2px solid #00A86B' : '2px solid transparent',
                whiteSpace: 'nowrap', transition: 'all 0.15s',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => {
                if (active !== cat.name) {
                  (e.currentTarget as HTMLElement).style.color = '#111'
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = '#f9f9f9'
                }
              }}
              onMouseLeave={e => {
                if (active !== cat.name) {
                  (e.currentTarget as HTMLElement).style.color = '#666'
                  ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                }
              }}>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
