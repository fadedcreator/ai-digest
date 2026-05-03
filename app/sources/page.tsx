// @ts-nocheck
export default function Sources() {
    const groups = [
      {
        category: 'Companies',
        sources: [
          { name: 'OpenAI', url: 'https://openai.com/news', desc: 'Official blog covering model releases, research, and company updates.' },
          { name: 'Anthropic', url: 'https://www.anthropic.com/news', desc: 'Claude maker — safety research and model announcements.' },
          { name: 'Google DeepMind', url: 'https://deepmind.google/blog', desc: 'Research and breakthroughs from Google\'s AI division.' },
          { name: 'Google AI', url: 'https://blog.google/technology/ai', desc: 'AI product news and updates from Google.' },
          { name: 'Meta AI', url: 'https://ai.meta.com/blog', desc: 'Open source AI research and Llama model updates.' },
          { name: 'Microsoft AI', url: 'https://blogs.microsoft.com/ai', desc: 'AI integration across Microsoft products and Azure.' },
          { name: 'Hugging Face', url: 'https://huggingface.co/blog', desc: 'Open source ML models, datasets, and community updates.' },
        ]
      },
      {
        category: 'Media',
        sources: [
          { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/topic/artificial-intelligence', desc: 'In-depth AI journalism from one of the most respected tech publications.' },
          { name: 'The Verge AI', url: 'https://www.theverge.com/ai-artificial-intelligence', desc: 'Consumer AI coverage, product news, and industry analysis.' },
          { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence', desc: 'Startup funding, launches, and AI business coverage.' },
          { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai', desc: 'Enterprise AI, research, and industry trends.' },
          { name: 'Ars Technica', url: 'https://arstechnica.com/tag/artificial-intelligence', desc: 'Technical depth and rigorous analysis of AI developments.' },
          { name: 'Reuters Tech', url: 'https://www.reuters.com/technology', desc: 'Breaking news and business coverage of the AI industry.' },
        ]
      },
      {
        category: 'YouTube',
        sources: [
          { name: 'Andrej Karpathy', url: 'https://www.youtube.com/@AndrejKarpathy', desc: 'Former Tesla AI head and OpenAI founding member. Best channel for understanding how AI actually works.' },
          { name: 'AI Explained', url: 'https://www.youtube.com/@aiexplained-official', desc: 'Deep dives into AI research and breakthroughs, explained clearly.' },
          { name: 'Two Minute Papers', url: 'https://www.youtube.com/@TwoMinutePapers', desc: 'Latest AI research papers summarized concisely.' },
          { name: 'Yannic Kilcher', url: 'https://www.youtube.com/@YannicKilcher', desc: 'Technical paper breakdowns and AI research analysis.' },
        ]
      },
      {
        category: 'Insiders',
        sources: [
          { name: 'The Batch', url: 'https://www.deeplearning.ai/the-batch', desc: 'Andrew Ng\'s weekly AI newsletter from DeepLearning.AI.' },
          { name: 'ImportAI', url: 'https://importai.substack.com', desc: 'Jack Clark\'s weekly roundup of the most important AI research.' },
          { name: "Ben's Bites", url: 'https://bensbites.beehiiv.com', desc: 'Daily AI news and tools, accessible and well-curated.' },
          { name: 'TLDR AI', url: 'https://tldr.tech/ai', desc: 'Concise daily AI summaries for technical and non-technical readers.' },
          { name: 'Simon Willison', url: 'https://simonwillison.net', desc: 'One of the best independent writers on practical AI development.' },
          { name: 'One Useful Thing', url: 'https://www.oneusefulthing.org', desc: 'Ethan Mollick on how AI is changing work and education.' },
        ]
      },
    ];
  
    return (
      <main style={{ minHeight: '100vh', background: '#111', color: '#e8e8e8', fontFamily: "'Inter', -apple-system, sans-serif", padding: '4rem 2.5rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
  
          <a href="/" style={{ fontSize: 12, color: '#555', textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase' }}>← Back to AIWire</a>
  
          <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', margin: '2rem 0 0.5rem', color: '#fff' }}>Sources</h1>
          <p style={{ fontSize: 15, color: '#666', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            AIWire pulls from established outlets with a track record of quality. No content farms, no engagement-first publications. Every source is manually selected and reviewed.
          </p>
  
          {groups.map(group => (
            <div key={group.category} style={{ marginBottom: '2.5rem' }}>
              <div style={{ borderTop: '0.5px solid #222', paddingTop: '1.5rem', marginBottom: '1rem' }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#444' }}>{group.category}</p>
              </div>
              {group.sources.map(source => (
                <a key={source.name} href={source.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem 0', borderBottom: '0.5px solid #1a1a1a', textDecoration: 'none', gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>{source.name}</p>
                    <p style={{ fontSize: 13, color: '#666', margin: 0, lineHeight: 1.5 }}>{source.desc}</p>
                  </div>
                  <span style={{ fontSize: 12, color: '#333', flexShrink: 0, paddingTop: 2 }}>↗</span>
                </a>
              ))}
            </div>
          ))}
  
          <div style={{ borderTop: '0.5px solid #222', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <p style={{ fontSize: 13, color: '#444', lineHeight: 1.6 }}>
            <div style={{ borderTop: '0.5px solid #222', paddingTop: '2rem' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: '0.75rem' }}>Contact & Follow</h2>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: '#aaa', marginBottom: '1.25rem' }}>
            Suggestions, feedback, or source requests — reach out or follow for updates:
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