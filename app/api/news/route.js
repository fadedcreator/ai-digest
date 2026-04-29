import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: false }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: false }],
      ['media:group', 'mediaGroup', { keepArray: false }],
      ['enclosure', 'enclosure', { keepArray: false }],
    ],
  },
  timeout: 8000,
});

const FEEDS = [
  { name: 'OpenAI', url: 'https://openai.com/news/rss.xml', category: 'companies', color: '#10a37f' },
  { name: 'Anthropic', url: 'https://www.anthropic.com/rss.xml', category: 'companies', color: '#c96442' },
  { name: 'Google DeepMind', url: 'https://deepmind.google/blog/rss/feed/', category: 'companies', color: '#4285f4' },
  { name: 'Google AI', url: 'https://blog.google/technology/ai/rss/', category: 'companies', color: '#34a853' },
  { name: 'Meta AI', url: 'https://ai.meta.com/blog/feed/', category: 'companies', color: '#0866ff' },
  { name: 'Microsoft AI', url: 'https://blogs.microsoft.com/ai/feed/', category: 'companies', color: '#00a4ef' },
  { name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml', category: 'companies', color: '#ff9d00' },

  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', category: 'media', color: '#bb0000' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', category: 'media', color: '#f60' },
  { name: 'The Verge AI', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', category: 'media', color: '#e5197d' },
  { name: 'TechCrunch AI', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'media', color: '#0a8a00' },
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', category: 'media', color: '#888' },
  { name: 'Reuters Tech', url: 'https://feeds.reuters.com/reuters/technologyNews', category: 'media', color: '#ff8000' },

  { name: 'Simon Willison', url: 'https://simonwillison.net/atom/everything/', category: 'insiders', color: '#6366f1' },
  { name: 'One Useful Thing', url: 'https://www.oneusefulthing.org/feed', category: 'insiders', color: '#8b5cf6' },
  { name: 'The Batch', url: 'https://www.deeplearning.ai/the-batch/feed/', category: 'insiders', color: '#e11d48' },
  { name: 'ImportAI', url: 'https://importai.substack.com/feed', category: 'insiders', color: '#0ea5e9' },
  { name: "Ben's Bites", url: 'https://bensbites.beehiiv.com/feed', category: 'insiders', color: '#f59e0b' },
  { name: 'TLDR AI', url: 'https://tldr.tech/ai/rss', category: 'insiders', color: '#06b6d4' },

  { name: 'Andrej Karpathy', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCB1rRq8aevRkX6kVMlgBVXQ', category: 'youtube', color: '#ff0000' },
  { name: 'AI Explained', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCNJ1Ymd5yFuUPtn21xtRbbw', category: 'youtube', color: '#ff0000' },
  { name: 'Two Minute Papers', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCbfYPyITQ-7l4upoX8nvctg', category: 'youtube', color: '#ff0000' },
  { name: 'Yannic Kilcher', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCZHmQk67mSJgfCCTn7xBfew', category: 'youtube', color: '#ff0000' },
];

const DAYS = 14;
const MAX_PER_FEED = 5;

function extractImage(item) {
  if (item.mediaGroup?.['media:thumbnail']?.[0]?.$.url) return item.mediaGroup['media:thumbnail'][0].$.url;
  if (item.mediaContent?.$.url) return item.mediaContent.$.url;
  if (item.mediaThumbnail?.$.url) return item.mediaThumbnail.$.url;
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image')) return item.enclosure.url;
  if (item['content:encoded']) {
    const m = item['content:encoded'].match(/<img[^>]+src="([^"]+)"/);
    if (m) return m[1];
  }
  if (item.content) {
    const m = item.content.match(/<img[^>]+src="([^"]+)"/);
    if (m) return m[1];
  }
  if (item.link?.includes('youtube.com/watch?v=')) {
    const vid = item.link.split('v=')[1]?.split('&')[0];
    if (vid) return `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
  }
  return null;
}

function extractDescription(item) {
  const raw = item.contentSnippet || item.summary || item.description || '';
  return raw.replace(/<[^>]+>/g, '').slice(0, 200).trim();
}

export async function GET() {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - DAYS);

  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const parsed = await parser.parseURL(feed.url);
      return parsed.items
        .filter((item) => {
          const date = new Date(item.pubDate || item.isoDate || '');
          return date > cutoff;
        })
        .slice(0, MAX_PER_FEED)
        .map((item) => ({
          title: item.title || 'No title',
          link: item.link || '',
          pubDate: item.pubDate || item.isoDate || '',
          source: feed.name,
          category: feed.category,
          color: feed.color,
          image: extractImage(item),
          description: extractDescription(item),
          isVideo: feed.category === 'youtube',
        }));
    })
  );

  const items = results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value)
    .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  return Response.json({ items });
}