// @ts-nocheck
'use client';
import { useState, useEffect, useRef, useMemo } from 'react';

const TABS = [
  { id: 'all', label: { en: 'All', zh: '全部', ar: 'الكل' } },
  { id: 'companies', label: { en: 'Companies', zh: '公司', ar: 'الشركات' } },
  { id: 'media', label: { en: 'Media', zh: '媒体', ar: 'الإعلام' } },
  { id: 'youtube', label: { en: 'YouTube', zh: 'YouTube', ar: 'يوتيوب' } },
  { id: 'newsletters', label: { en: 'Newsletters', zh: '通讯', ar: 'النشرات' } },
];

const DATE_FILTERS = [
  { id: 'all', label: { en: 'All time', zh: '全部时间', ar: 'كل الأوقات' } },
  { id: '1', label: { en: 'Today', zh: '今天', ar: 'اليوم' } },
  { id: '3', label: { en: 'Last 3 days', zh: '最近3天', ar: 'آخر 3 أيام' } },
  { id: '7', label: { en: 'Last 7 days', zh: '最近7天', ar: 'آخر 7 أيام' } },
];

const LANGUAGES = [
  { id: 'en', label: 'English', native: 'English' },
  { id: 'zh', label: 'Mandarin', native: '中文' },
  { id: 'ar', label: 'Arabic', native: 'العربية' },
];

const UI = {
  en: {
    title: 'AI News Digest',
    subtitle: 'Intelligence Feed',
    generate: 'Generate Digest',
    refresh: '↻ Refresh',
    loading: 'Loading…',
    fetching: 'Fetching from all sources…',
    translating: 'Translating into',
    empty: 'Click Generate Digest to pull the latest AI news',
    sources: 'OpenAI · Anthropic · Karpathy · TLDR AI · The Batch · and more',
    topStories: 'Top stories · last 24h',
    allArticles: 'All articles',
    noResults: 'No articles match these filters.',
    search: 'Search articles…',
    allSources: 'All sources',
    updated: 'Updated',
    newArticles: 'new articles — click to load',
    newArticle: 'new article — click to load',
    read: 'Read ↗',
    watch: 'Watch ↗',
    readFull: 'Read article ↗',
    watchFull: 'Watch on YouTube ↗',
    apiKey: 'Anthropic API Key (optional — enables translation)',
    apiPlaceholder: 'sk-ant-...',
    grid: '⊞ Grid',
    list: '☰ List',
    dir: 'ltr',
  },
  zh: {
    title: 'AI 新闻摘要',
    subtitle: '智能资讯',
    generate: '生成摘要',
    refresh: '↻ 刷新',
    loading: '加载中…',
    fetching: '正在获取所有来源…',
    translating: '正在翻译为',
    empty: '点击"生成摘要"获取最新AI新闻',
    sources: 'OpenAI · Anthropic · Karpathy · TLDR AI · The Batch · 更多',
    topStories: '热门新闻 · 最近24小时',
    allArticles: '全部文章',
    noResults: '没有符合条件的文章。',
    search: '搜索文章…',
    allSources: '所有来源',
    updated: '更新于',
    newArticles: '条新文章 — 点击加载',
    newArticle: '条新文章 — 点击加载',
    read: '阅读 ↗',
    watch: '观看 ↗',
    readFull: '阅读文章 ↗',
    watchFull: '在YouTube观看 ↗',
    apiKey: 'Anthropic API 密钥（可选 — 启用翻译）',
    apiPlaceholder: 'sk-ant-...',
    grid: '⊞ 网格',
    list: '☰ 列表',
    dir: 'ltr',
  },
  ar: {
    title: 'ملخص أخبار الذكاء الاصطناعي',
    subtitle: 'تغذية المعلومات',
    generate: 'إنشاء الملخص',
    refresh: '↻ تحديث',
    loading: 'جارٍ التحميل…',
    fetching: 'جارٍ جلب المصادر…',
    translating: 'جارٍ الترجمة إلى',
    empty: 'انقر على "إنشاء الملخص" للحصول على آخر أخبار الذكاء الاصطناعي',
    sources: 'OpenAI · Anthropic · Karpathy · TLDR AI · The Batch · والمزيد',
    topStories: 'أبرز الأخبار · آخر 24 ساعة',
    allArticles: 'جميع المقالات',
    noResults: 'لا توجد مقالات تطابق هذه الفلاتر.',
    search: 'البحث في المقالات…',
    allSources: 'جميع المصادر',
    updated: 'تحديث',
    newArticles: 'مقالات جديدة — انقر للتحميل',
    newArticle: 'مقالة جديدة — انقر للتحميل',
    read: 'اقرأ ↗',
    watch: 'شاهد ↗',
    readFull: 'اقرأ المقالة ↗',
    watchFull: 'شاهد على يوتيوب ↗',
    apiKey: 'مفتاح Anthropic API (اختياري — يتيح الترجمة)',
    apiPlaceholder: 'sk-ant-...',
    grid: '⊞ شبكة',
    list: '☰ قائمة',
    dir: 'rtl',
  },
};

const REFRESH_INTERVAL = 30 * 60 * 1000;

function fmt(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isWithinDays(dateStr, days) {
  if (!days || days === 'all') return true;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - parseInt(days));
  return new Date(dateStr) > cutoff;
}

function Badge({ source, color }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 100, border: `1px solid ${color}50`, background: color + '18', color, whiteSpace: 'nowrap' }}>
      {source}
    </span>
  );
}

function Card({ item, featured, dark, compact, t }) {
  const [hov, setHov] = useState(false);
  const bg = dark ? '#1e1e1e' : '#fff';
  const border = dark ? (hov ? '#383838' : '#2a2a2a') : (hov ? '#d0cfc9' : '#eae9e5');
  const titleColor = dark ? '#f0f0f0' : '#111';
  const descColor = dark ? '#999' : '#777';
  const metaColor = dark ? '#555' : '#ccc';
  const shadow = hov ? (dark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 28px rgba(0,0,0,0.08)') : 'none';
  const showImage = item.image && item.category !== 'newsletters';

  if (compact) {
    return (
      <a href={item.link} target="_blank" rel="noopener noreferrer"
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: hov ? (dark ? '#242424' : '#faf9f7') : 'transparent', borderBottom: `1px solid ${dark ? '#1e1e1e' : '#f0efeb'}`, textDecoration: 'none', transition: 'background 0.15s', direction: t.dir }}
      >
        {showImage && (
          <div style={{ width: 56, height: 40, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: dark ? '#2a2a2a' : '#f0efeb' }}>
            <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.parentElement.style.display = 'none'; }} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: titleColor, margin: 0, lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Badge source={item.source} color={item.color} />
          <span style={{ fontSize: 11, color: metaColor, minWidth: 80, textAlign: 'right' }}>{fmt(item.pubDate)}</span>
          <span style={{ fontSize: 12, color: metaColor }}>↗</span>
        </div>
      </a>
    );
  }

  if (featured) {
    return (
      <a href={item.link} target="_blank" rel="noopener noreferrer"
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ display: 'grid', gridTemplateColumns: showImage ? '1.1fr 1fr' : '1fr', background: bg, borderRadius: 16, overflow: 'hidden', border: `1px solid ${border}`, boxShadow: shadow, transform: hov ? 'translateY(-3px)' : 'none', transition: 'all 0.2s', marginBottom: '2rem', textDecoration: 'none', direction: t.dir }}
      >
        {showImage && (
          <div style={{ position: 'relative', minHeight: 260, background: dark ? '#2a2a2a' : '#f0efeb', overflow: 'hidden' }}>
            <img src={item.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.parentElement.style.display = 'none'; }} />
            {item.isVideo && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)' }}>
                <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.93)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, paddingLeft: 4 }}>▶</div>
              </div>
            )}
          </div>
        )}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Badge source={item.source} color={item.color} />
            <span style={{ fontSize: 11, color: dark ? '#555' : '#bbb' }}>{fmt(item.pubDate)}</span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.35, letterSpacing: '-0.02em', color: titleColor, margin: 0 }}>{item.title}</h2>
          {item.description && <p style={{ fontSize: 13, color: descColor, lineHeight: 1.65, margin: 0 }}>{item.description}</p>}
          <span style={{ fontSize: 12, color: metaColor, marginTop: 'auto', paddingTop: 8 }}>{item.isVideo ? t.watchFull : t.readFull}</span>
        </div>
      </a>
    );
  }

  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', flexDirection: 'column', background: bg, borderRadius: 12, overflow: 'hidden', border: `1px solid ${border}`, boxShadow: shadow, transform: hov ? 'translateY(-2px)' : 'none', transition: 'all 0.18s', textDecoration: 'none', height: '100%', direction: t.dir }}
    >
      {showImage && (
        <div style={{ position: 'relative', aspectRatio: '16/9', background: dark ? '#2a2a2a' : '#f0efeb', overflow: 'hidden', flexShrink: 0 }}>
          <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} onError={e => { e.currentTarget.parentElement.style.display = 'none'; }} />
          {item.isVideo && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.18)' }}>
              <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.93)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, paddingLeft: 3 }}>▶</div>
            </div>
          )}
        </div>
      )}
      <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Badge source={item.source} color={item.color} />
          <span style={{ fontSize: 11, color: dark ? '#555' : '#bbb' }}>{fmt(item.pubDate)}</span>
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.45, letterSpacing: '-0.01em', color: titleColor, margin: 0 }}>{item.title}</h3>
        {item.description && (
          <p style={{ fontSize: 12, color: descColor, lineHeight: 1.55, margin: 0 }}>
            {item.description.length > 120 ? item.description.slice(0, 120) + '…' : item.description}
          </p>
        )}
        <span style={{ fontSize: 11, color: metaColor, marginTop: 'auto', paddingTop: 4 }}>{item.isVideo ? t.watch : t.read}</span>
      </div>
    </a>
  );
}

export default function Home() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState('en');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [items, setItems] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeSource, setActiveSource] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [compact, setCompact] = useState(false);
  const [lastChecked, setLastChecked] = useState('');
  const [newCount, setNewCount] = useState(0);
  const intervalRef = useRef(null);

  const t = UI[lang];

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) setDark(stored === 'dark');
    else setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    const storedKey = localStorage.getItem('apiKey');
    if (storedKey) setApiKey(storedKey);
    const storedLang = localStorage.getItem('lang');
    if (storedLang) setLang(storedLang);
    setMounted(true);
  }, []);

  async function translateItems(rawItems, targetLang) {
    if (targetLang === 'en' || !apiKey) return rawItems;
    const langName = LANGUAGES.find(l => l.id === targetLang)?.label || targetLang;
    setTranslating(true);
    try {
      const sample = rawItems.slice(0, 20).map(i => ({ title: i.title, description: i.description || '' }));
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4000,
          system: `You are a professional AI news translator. Translate the given JSON array of articles into ${langName}. 
Prioritize accuracy and natural-sounding ${langName}. Keep source names and proper nouns in their original form.
Return ONLY a raw JSON array with the same structure — no markdown, no backticks, no explanation.`,
          messages: [{
            role: 'user',
            content: `Translate these AI news articles into ${langName}. Return only the JSON array:\n${JSON.stringify(sample)}`
          }]
        })
      });
      if (!res.ok) throw new Error('Translation failed');
      const data = await res.json();
      const text = data.content.find(b => b.type === 'text')?.text || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const translated = JSON.parse(clean);
      return rawItems.map((item, i) => ({
        ...item,
        title: translated[i]?.title || item.title,
        description: translated[i]?.description || item.description,
      }));
    } catch (e) {
      console.error('Translation error:', e);
      return rawItems;
    } finally {
      setTranslating(false);
    }
  }

  async function fetchNews(silent = false) {
    if (!silent) setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      setLastChecked(now);

      let finalItems = data.items;
      if (lang !== 'en' && apiKey) {
        finalItems = await translateItems(data.items, lang);
      }

      if (silent && items.length > 0) {
        const existingLinks = new Set(items.map(i => i.link));
        const fresh = finalItems.filter(i => !existingLinks.has(i.link));
        if (fresh.length > 0) {
          setPendingItems(finalItems);
          setNewCount(fresh.length);
        }
      } else {
        setItems(finalItems);
        setPendingItems([]);
        setNewCount(0);