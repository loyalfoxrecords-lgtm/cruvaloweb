import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  summary: string
  image_url: string
  source: string
  league: string
  team: string
  published_at: string
  is_featured: boolean
  is_published: boolean
}

async function getArticles(): Promise<Article[]> {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(30)
  return (data as Article[]) || []
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `Hace ${mins} min`
  if (hours < 24) return `Hace ${hours}h`
  return `Hace ${days}d`
}

const leagueMeta: Record<string, { color: string; bg: string }> = {
  'La Liga': { color: '#C2410C', bg: '#FFF3ED' },
  'Premier': { color: '#1D4ED8', bg: '#EFF6FF' },
  'Champions': { color: '#065F46', bg: '#ECFDF5' },
  'Bundesliga': { color: '#B91C1C', bg: '#FEF2F2' },
  'Serie A': { color: '#065F46', bg: '#F0FDF4' },
  'Ligue 1': { color: '#6B21A8', bg: '#FAF5FF' },
  'Selecciones': { color: '#0369A1', bg: '#F0F9FF' },
  'Fichajes': { color: '#B45309', bg: '#FFFBEB' },
}

function Badge({ league }: { league: string }) {
  const meta = leagueMeta[league] || { color: '#555', bg: '#f3f4f6' }
  return (
    <span style={{
      display: 'inline-block',
      backgroundColor: meta.bg,
      color: meta.color,
      fontSize: '10px',
      fontWeight: 700,
      padding: '3px 9px',
      borderRadius: '6px',
      letterSpacing: '0.4px',
      textTransform: 'uppercase',
      fontFamily: 'Inter, sans-serif',
    }}>
      {league}
    </span>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
      <div style={{
        width: '4px', height: '24px',
        background: 'linear-gradient(180deg, #00A86B 0%, #00D688 100%)',
        borderRadius: '2px', flexShrink: 0,
      }} />
      <h2 style={{
        fontSize: '20px', fontWeight: 700, color: '#111',
        fontFamily: 'Inter, sans-serif', letterSpacing: '-0.3px',
      }}>
        {title}
      </h2>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #e0e0e0, transparent)' }} />
    </div>
  )
}

export default async function HomePage() {
  const articles = await getArticles()

  if (articles.length === 0) {
    return (
      <div style={{ backgroundColor: '#EBEBEB', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '60px 40px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{
              width: '72px', height: '72px',
              background: 'linear-gradient(135deg, #00A86B 0%, #00D688 100%)',
              borderRadius: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 8px 24px rgba(0,168,107,0.25)',
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1.5"/>
                <path d="M12 6l3.09 6.26L22 13.27l-5 4.87L18.18 25 12 21.77 5.82 25l1.18-6.86L2 13.27l6.91-1.01L12 6z" fill="black" opacity="0.8"/>
              </svg>
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '10px', color: '#111', fontFamily: 'Inter, sans-serif' }}>
              No hay noticias publicadas
            </h2>
            <p style={{ color: '#888', marginBottom: '32px', fontSize: '15px', lineHeight: 1.6 }}>
              Ve al panel de administración para publicar tu primera noticia.
            </p>
            <Link href="/admin" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #00A86B, #00D688)',
              color: 'black', padding: '13px 28px', borderRadius: '10px',
              fontWeight: 700, fontSize: '14px', fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 16px rgba(0,168,107,0.3)',
            }}>
              Ir al Admin
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const hero = articles[0]
  const secondary = articles.slice(1, 4)
  const sidebar = articles.slice(0, 8)
  const latest = articles.slice(4, 16)

  return (
    <div style={{ backgroundColor: '#EBEBEB', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ maxWidth: '1320px', margin: '0 auto', padding: '28px 24px' }}>

        {hero && (
          <section style={{ marginBottom: '28px' }}>
            <Link href={`/noticia/${hero.id}`} style={{ display: 'block' }}>
              <div className="card" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', minHeight: '420px', cursor: 'pointer' }}>
                <div style={{ position: 'relative', overflow: 'hidden', backgroundColor: '#1a1a2e' }}>
                  {hero.image_url ? (
                    <img src={hero.image_url} alt={hero.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', minHeight: '420px', background: 'linear-gradient(135deg, #0D0D1A 0%, #1a1a35 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>⚽</div>
                  )}
                  <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '100px', background: 'linear-gradient(to right, transparent, white)' }} />
                </div>
                <div style={{ padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: 'white' }}>
                  <Badge league={hero.league} />
                  <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#0D0D1A', fontFamily: 'Georgia, serif', lineHeight: 1.25, marginTop: '14px', marginBottom: '14px', letterSpacing: '-0.5px' }}>
                    {hero.title}
                  </h1>
                  {hero.summary && (
                    <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.65, marginBottom: '24px', fontFamily: 'Inter, sans-serif', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {hero.summary}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#999', borderTop: '1px solid #f0f0f0', paddingTop: '16px', fontFamily: 'Inter, sans-serif' }}>
                    <span style={{ fontWeight: 600, color: '#555' }}>{hero.source}</span>
                    <span>·</span>
                    <span>{timeAgo(hero.published_at)}</span>
                    <div style={{ marginLeft: 'auto' }}>
                      <span style={{ backgroundColor: '#0D0D1A', color: 'white', fontSize: '12px', fontWeight: 600, padding: '6px 16px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        Leer
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
          <div>
            {secondary.length > 0 && (
              <section style={{ marginBottom: '28px' }}>
                <SectionTitle title="Noticias destacadas" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                  {secondary.map(article => (
                    <Link key={article.id} href={`/noticia/${article.id}`} style={{ display: 'block' }}>
                      <div className="card" style={{ cursor: 'pointer' }}>
                        <div style={{ height: '160px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                          {article.image_url ? (
                            <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px' }}>⚽</div>
                          )}
                        </div>
                        <div style={{ padding: '14px' }}>
                          <Badge league={article.league} />
                          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111', marginTop: '8px', lineHeight: 1.35, fontFamily: 'Georgia, serif', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {article.title}
                          </h3>
                          <p style={{ fontSize: '11px', color: '#aaa', marginTop: '8px', fontFamily: 'Inter, sans-serif' }}>
                            {article.source} · {timeAgo(article.published_at)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section>
              <SectionTitle title="Últimas noticias" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {latest.map(article => (
                  <Link key={article.id} href={`/noticia/${article.id}`} style={{ display: 'block' }}>
                    <div className="card" style={{ display: 'flex', gap: '16px', padding: '16px', cursor: 'pointer', borderRadius: '14px' }}>
                      {article.image_url && (
                        <div style={{ width: '110px', height: '80px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f0f0f0' }}>
                          <img src={article.image_url} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <Badge league={article.league} />
                          <span style={{ fontSize: '11px', color: '#bbb', fontFamily: 'Inter, sans-serif' }}>{timeAgo(article.published_at)}</span>
                        </div>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111', lineHeight: 1.35, fontFamily: 'Georgia, serif', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {article.title}
                        </h3>
                        <p style={{ fontSize: '12px', color: '#888', marginTop: '4px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>{article.source}</p>
                      </div>
                      <div style={{ color: '#ccc', fontSize: '20px', alignSelf: 'center', flexShrink: 0 }}>›</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <aside>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', position: 'sticky', top: '120px' }}>
              <div style={{ padding: '14px 20px', background: 'linear-gradient(135deg, #0D0D1A 0%, #1a1a35 100%)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#E8302A' }} className="live-pulse" />
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'white', letterSpacing: '1.5px', fontFamily: 'Inter, sans-serif' }}>MÁS LEÍDO</span>
              </div>
              {sidebar.map((article, i) => (
                <div key={article.id}>
                  {i > 0 && <div style={{ height: '1px', backgroundColor: '#f5f5f5', margin: '0 16px' }} />}
                  <Link href={`/noticia/${article.id}`} style={{ display: 'block' }}>
                    <div style={{ display: 'flex', gap: '12px', padding: '14px 16px', cursor: 'pointer' }}>
                      <span style={{ fontSize: '20px', fontWeight: 900, color: i < 3 ? '#00A86B' : '#e0e0e0', width: '24px', flexShrink: 0, lineHeight: 1, fontFamily: 'Georgia, serif' }}>{i + 1}</span>
                      <div style={{ flex: 1 }}>
                        <Badge league={article.league} />
                        <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#111', marginTop: '4px', lineHeight: 1.3, fontFamily: 'Georgia, serif', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {article.title}
                        </h4>
                        <p style={{ fontSize: '11px', color: '#aaa', marginTop: '3px', fontFamily: 'Inter, sans-serif' }}>{timeAgo(article.published_at)}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '16px', background: 'linear-gradient(135deg, #00A86B 0%, #005C3A 100%)', borderRadius: '16px', padding: '28px 20px', textAlign: 'center' }}>
              <img src="/logo.png" alt="Cruvalo" style={{ width: '56px', height: '56px', objectFit: 'contain', margin: '0 auto 14px', display: 'block' }} />
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'white', fontFamily: 'Georgia, serif', marginBottom: '6px' }}>Descarga Cruvalo</h3>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '18px', lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>
                Resultados en tiempo real, noticias y clasificaciones
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href="#" style={{ flex: 1, padding: '10px 8px', borderRadius: '10px', backgroundColor: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '12px', fontWeight: 700, color: 'white', fontFamily: 'Inter, sans-serif', textAlign: 'center', display: 'block' }}>🍎 App Store</Link>
                <Link href="#" style={{ flex: 1, padding: '10px 8px', borderRadius: '10px', backgroundColor: 'white', fontSize: '12px', fontWeight: 700, color: '#00A86B', fontFamily: 'Inter, sans-serif', textAlign: 'center', display: 'block' }}>▶ Play Store</Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer style={{ background: 'linear-gradient(135deg, #0D0D1A 0%, #1a1a35 100%)', marginTop: '48px' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '48px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', paddingBottom: '32px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img src="/logo.png" alt="Cruvalo" style={{ width: '38px', height: '38px', objectFit: 'contain' }} />
                <span style={{ fontSize: '20px', fontWeight: 800, color: 'white', fontFamily: 'Georgia, serif' }}>Cruvalo</span>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, maxWidth: '260px', fontFamily: 'Inter, sans-serif' }}>
                Las últimas noticias, resultados y clasificaciones del fútbol mundial.
              </p>
            </div>
            {[
              { title: 'LIGAS', links: ['La Liga', 'Premier League', 'Champions', 'Bundesliga', 'Serie A'] },
              { title: 'SECCIONES', links: ['Noticias', 'Partidos', 'Clasificaciones', 'Fichajes'] },
              { title: 'CRUVALO', links: ['Descargar app', 'Sobre nosotros', 'Contacto'] },
            ].map(section => (
              <div key={section.title}>
                <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', marginBottom: '14px', fontFamily: 'Inter, sans-serif' }}>{section.title}</h4>
                {section.links.map(link => (
                  <Link key={link} href="#" style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '9px', fontFamily: 'Inter, sans-serif' }}>
                    {link}
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div style={{ paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif' }}>
            <span>© 2025 Cruvalo · Todos los derechos reservados</span>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link href="#" style={{ color: 'rgba(255,255,255,0.25)' }}>Privacidad</Link>
              <Link href="#" style={{ color: 'rgba(255,255,255,0.25)' }}>Términos</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
