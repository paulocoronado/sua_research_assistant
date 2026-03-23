import Link from 'next/link';

export default function SuaAnalysisHub() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>SUA Analysis Hub</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Bienvenido al centro de análisis. Selecciona un módulo estadístico o de ciencia de datos para continuar.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
        
        <Link href="/workspace/metrics" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #eaeaea', 
            borderRadius: '16px', 
            background: 'white', 
            cursor: 'pointer', 
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', 
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            height: '100%'
          }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.8rem', color: '#0070f3', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📊 Moodle Metrics Analyzer
            </h2>
            <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Genera estadísticas descriptivas, distribuciones categóricas y aplica pruebas comparativas (ANOVA, Kruskal-Wallis, Chi-cuadrado) sobre datasets de eventos en Moodle.
            </p>
          </div>
        </Link>

        <Link href="/workspace/github_stats" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #eaeaea', 
            borderRadius: '16px', 
            background: 'white', 
            cursor: 'pointer', 
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', 
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            height: '100%'
          }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.8rem', color: '#171515', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub Stats
            </h2>
            <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Analiza múltiples repositorios obteniendo estadísticas de commits, código agregado/eliminado y actividad detallada de ramas de manera visual e interactiva.
            </p>
          </div>
        </Link>
        
        {/* Placeholder for future tools */}
        <div style={{ 
          padding: '2rem', 
          border: '2px dashed #e5e7eb', 
          borderRadius: '16px', 
          background: '#f9fafb', 
          opacity: 0.7 
        }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🚀 Predictive Modeling
          </h2>
          <span style={{ display: 'inline-block', background: '#e5e7eb', color: '#374151', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '1rem'}}>
            PRÓXIMAMENTE
          </span>
          <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: 1.5 }}>
            Entrena modelos de Machine Learning (Regresión, Clasificación) utilizando los datos extraídos de la plataforma para predecir el rendimiento o riesgo de deserción de los estudiantes.
          </p>
        </div>

      </div>
    </div>
  );
}
