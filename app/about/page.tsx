// @ts-nocheck
export default function About() {
    return (
      <main style={{ minHeight: '100vh', background: '#111', color: '#e8e8e8', fontFamily: "'Inter', -apple-system, sans-serif", padding: '4rem 2.5rem' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
  
          <a href="/" style={{ fontSize: 12, color: '#555', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>← Back to AIWire</a>
  
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', margin: '2rem 0 0.5rem', color: '#fff' }}>About AIWire</h1>
          <p style={{ fontSize: 14, color: '#555', marginBottom: '2.5rem' }}>aiwire.app</p>
  
          <div style={{ borderTop: '0.5px solid #222', paddingTop: '2rem', marginBottom: '2rem' }}>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: '#aaa', marginBottom: '1.25rem' }}>
              AIWire is a free, real-time AI news aggregator that pulls from 20+ sources so you don't have to. No signup, no ads, no noise, just the latest from the people and companies shaping artificial intelligence.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: '#aaa', marginBottom: '1.25rem' }}>
              Sources include OpenAI, Anthropic, Google DeepMind, Meta AI, MIT Technology Review, The Verge, TechCrunch, VentureBeat, and YouTube channels like Andrej Karpathy, AI Explained, and Two Minute Papers.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: '#aaa' }}>
              The digest auto-refreshes every 30 minutes. Filter by source, category, or date. Switch between dark and light mode. Available in English, Chinese, and Arabic.
            </p>
          </div>
  
          <div style={{ borderTop: '0.5px solid #222', paddingTop: '2rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>Built by</h2>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: '#aaa' }}>
              AIWire was built by Ilja, a builder from The Hague, Netherlands. Also created the Co-op Game Planner and a Cybersecurity beginner course.
            </p>
          </div>
  
          <div style={{ borderTop: '0.5px solid #222', paddingTop: '2rem' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>Contact</h2>
            <p style={{ fontSize: 16, lineHeight: 1.75, color: '#aaa' }}>
              Suggestions, feedback, or source requests, reach out on X at <a href="https://x.com/fadedcreator" style={{ color: '#fff' }}>@fadedcreator</a>.
            </p>
          </div>
  
        </div>
      </main>
    );
  }