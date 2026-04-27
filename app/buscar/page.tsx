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
}

async function searchArticles(query: string): Promise<Article[]> {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .or(`title.ilike.%${query}%,summary.ilike.%${query}%,team.ilike.%${query}%,league.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(20)
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
}

function Badge({ league }: { league: string }) {
  const meta = leagueMeta[league] || { color: '#555', bg: '#f3f4f6' }
  return (
    <span style={{
      display: 'inline-block', backgroundColor: meta.bg, color: meta.color,
      fontSize: '10px', fontWeight: 700, padding: '3px 9px',
      borderRadius: '6px', letterSpacing: '0.4px', textTransform: 'uppercase',
    }}>
      {league}
    </span>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const query = params.q || ''
  const articles = query ? await searchArticles(query) : []

  return (
    <div style={{ backgroundColor: '#EBEBEB', minHeight: '100vh' }}>
      <Navbar />

      <main style={{ maxWidth: '1320px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header búsqueda */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '4px', height: '24px',
              background: 'linear-gradient(180deg, #00A86B 0%, #00D688 100%)',
              borderRadius: '2px',
            }} />
            <h1 style={{
              fontSize: '24px', fontWeight: 700, color: '#111',
              fontFamily: 'Georgia, serif',
            }}>
              {query ? `Resultados para "${query}"` : 'Búsqueda'}
            </h1>
          </div>
          {query && (
            <p style={{ fontSize: '14px', color: '#888', fontFamily: 'Inter, sans-serif', marginLeft: '16px' }}>
              {articles.length} {articles.length === 1 ? 'resultado' : 'resultados'} encontrados
            </p>
          )}
        </div>

        {!query && (
          <div style={{
            textAlign: 'center', padding: '80px 40px',
            backgroundColor: 'white', borderRadius: '20px',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
              Busca equipos, jugadores o noticias
            </h2>
            <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>
              Usa la barra de búsqueda del menú para encontrar lo que buscas
            </p>
          </div>
        )}

        {query && articles.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 40px',
            backgroundColor: 'white', borderRadius: '20px',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>😔</div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
              No se encontraron resultados
            </h2>
            <p style={{ color: '#888', fontFamily: 'Inter, sans-serif' }}>
              Intenta buscar con otras palabras
            </p>
          </div>
        )}

        {articles.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {articles.map(article => (
              <Link key={article.id} href={`/noticia/${article.id}`} style={{ display: 'block' }}>
                <div style={{
                  backgroundColor: 'white', borderRadius: '14px',
                  border: '1px solid #eee', padding: '16px',
                  display: 'flex', gap: '16px', cursor: 'pointer',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none'
                  ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                }}
                >
                  {article.image_url && (
                    <div style={{
                      width: '120px', height: '86px',
                      borderRadius: '10px', overflow: 'hidden',
                      flexShrink: 0, backgroundColor: '#f0f0f0',
                    }}>
                      <img src={article.image_url} alt={article.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Badge league={article.league} />
                      {article.team && (
                        <span style={{
                          fontSize: '11px', color: '#888',
                          fontFamily: 'Inter, sans-serif',
                        }}>
                          {article.team}
                        </span>
                      )}
                      <span style={{ fontSize: '11px', color: '#bbb', fontFamily: 'Inter, sans-serif' }}>
                        · {timeAgo(article.published_at)}
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: '16px', fontWeight: 700, color: '#111',
                      lineHeight: 1.35, fontFamily: 'Georgia, serif',
                      marginBottom: '6px',
                    }}>
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p style={{
                        fontSize: '13px', color: '#666', lineHeight: 1.5,
                        fontFamily: 'Inter, sans-serif',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {article.summary}
                      </p>
                    )}
                    <p style={{ fontSize: '12px', color: '#aaa', marginTop: '6px', fontFamily: 'Inter, sans-serif' }}>
                      {article.source}
                    </p>
                  </div>
                  <div style={{ color: '#ccc', fontSize: '20px', alignSelf: 'center' }}>›</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
