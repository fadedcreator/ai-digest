// @ts-nocheck
export default function About() {
  return (
    <main style={{ minHeight: '100vh', background: '#111', color: '#e8e8e8', fontFamily: "'Inter', -apple-system, sans-serif", padding: '4rem 2.5rem' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        <a href="/" style={{ fontSize: 12, color: '#555', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>← Back to AIWire</a>

        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', margin: '2rem 0 0.5rem', color: '#fff' }}>About AIWire</h1>
        <p style={{ fontSize: 14, color: '#555', marginBottom: '2.5rem' }}>aiwire.app</p>

        <div style={{ borderTop: '0.5px solid #222', paddingTop: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>What it is</h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#aaa', marginBottom: '1.25rem' }}>
            AIWire is a free, real-time AI news aggregator that pulls from 20+ sources so you don't have to. No signup, no ads, no noise, just the latest from the people and companies shaping artificial intelligence.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#aaa' }}>
            The digest auto-refreshes every 30 minutes. Filter by source, category, or date. Switch between dark and light mode. Available in English, Chinese, and Arabic.
          </p>
        </div>

        <div style={{ borderTop: '0.5px solid #222', paddingTop: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>Sources</h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#aaa' }}>
            Companies: OpenAI, Anthropic, Google DeepMind, Meta AI, Microsoft AI, Hugging Face. Media: MIT Technology Review, The Verge, TechCrunch, VentureBeat, Ars Technica, Reuters. YouTube: Andrej Karpathy, AI Explained, Two Minute Papers, Yannic Kilcher. Insiders: The Batch, ImportAI, Ben's Bites, TLDR AI, Simon Willison.
          </p>
        </div>

        <div style={{ borderTop: '0.5px solid #222', paddingTop: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>Why it exists</h2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#aaa' }}>
            Keeping up with AI means checking 10 different sites, feeds, and channels every day. AIWire pulls everything into one place, updated automatically, so you can stay current in one visit.
          </p>
        </div>

       
          <div style={{ borderTop: '0.5px solid #222', paddingTop: '2rem' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: '0.75rem' }}>Contact & Follow</h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#aaa', marginBottom: '1.25rem' }}>
          Suggestions, feedback, or source requests, reach out or follow for updates:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a href="https://x.com/fadedcreator" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#1a1a1a', borderRadius: 10, textDecoration: 'none', border: '0.5px solid #2a2a2a' }}>
              <span style={{ fontSize: 18 }}>𝕏</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>X / Twitter</p>
                <p style={{ fontSize: 12, color: '#555', margin: 0 }}>@fadedcreator</p>
              </div>
            </a>
            <a href="https://bsky.app/profile/fadedcreator.bsky.social" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#1a1a1a', borderRadius: 10, textDecoration: 'none', border: '0.5px solid #2a2a2a' }}>
              <span style={{ fontSize: 18 }}>🦋</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>Bluesky</p>
                <p style={{ fontSize: 12, color: '#555', margin: 0 }}>@fadedcreator.bsky.social</p>
              </div>
            </a>
            <a href="https://mastodon.social/@fadedcreator" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#1a1a1a', borderRadius: 10, textDecoration: 'none', border: '0.5px solid #2a2a2a' }}>
              <span style={{ fontSize: 18 }}>🐘</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>Mastodon</p>
                <p style={{ fontSize: 12, color: '#555', margin: 0 }}>@fadedcreator@mastodon.social</p>
              </div>
            </a>
          </div>
        </div>
          </p>
        </div>

      </div>
    </main>
  );
}