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
