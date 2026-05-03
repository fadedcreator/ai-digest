// @ts-nocheck
'use client';
import { useState, useEffect, useRef, useMemo } from 'react';

const TABS = [
  { id: 'all', label: { en: 'All', zh: '全部', ar: 'الكل' } },
  { id: 'companies', label: { en: 'Companies', zh: '公司', ar: 'الشركات' } },
  { id: 'media', label: { en: 'Media', zh: '媒体', ar: 'الإعلام' } },
  { id: 'youtube', label: { en: 'YouTube', zh: 'YouTube', ar: 'يوتيوب' } },
  { id: 'insiders', label: { en: 'Insiders', zh: '内部人士', ar: 'المطلعون' } },
  { id: 'bookmarks', label: { en: 'Bookmarks', zh: '书签', ar: 'المحفوظات' } },
];

const DATE_FILTERS = [
  { id: 'all', label: { en: 'All time', zh: '全部时间', ar: 'كل الأوقات' } },
  { id: '1', label: { en: 'Today', zh: '今天', ar: 'اليوم' } },
  { id: '3', label: { en: 'Last 3 days', zh: '最近3天', ar: 'آخر 3 أيام' } },
  { id: '7', label: { en: 'Last 7 days', zh: '最近7天', ar: 'آخر 7 أيام' } },
];

const LANGUAGES = [
  { id: 'en', native: 'English' },
  { id: 'zh', native: '中文' },
  { id: 'ar', native: 'العربية' },
];

const UI = {
  en: { title: 'AIWire', subtitle: 'Intelligence Feed', refresh: '↻ Refresh', loading: 'Loading…', fetching: 'Fetching from all sources…', topStories: 'Top stories · last 24h', allArticles: 'All articles', noResults: 'No articles match these filters.', search: 'Search articles…', allSources: 'All sources', updated: 'Updated', newArticles: 'new articles — click to load', newArticle: 'new article — click to load', read: 'Read ↗', watch: 'Watch ↗', readFull: 'Read article ↗', watchFull: 'Watch on YouTube ↗', grid: '⊞ Grid', list: '☰ List', dir: 'ltr' },
  zh: { title: 'AIWire', subtitle: '智能资讯', refresh: '↻ 刷新', loading: '加载中…', fetching: '正在获取所有来源…', topStories: '热门新闻 · 最近24小时', allArticles: '全部文章', noResults: '没有符合条件的文章。', search: '搜索文章…', allSources: '所有来源', updated: '更新于', newArticles: '条新文章', newArticle: '条新文章', read: '阅读 ↗', watch: '观看 ↗', readFull: '阅读文章 ↗', watchFull: '在YouTube观看 ↗', grid: '⊞ 网格', list: '☰ 列表', dir: 'ltr' },
  ar: { title: 'AIWire', subtitle: 'تغذية المعلومات', refresh: '↻ تحديث', loading: 'جارٍ التحميل…', fetching: 'جارٍ جلب المصادر…', topStories: 'أبرز الأخبار · آخر 24 ساعة', allArticles: 'جميع المقالات', noResults: 'لا توجد مقالات.', search: 'البحث…', allSources: 'جميع المصادر', updated: 'تحديث', newArticles: 'مقالات جديدة', newArticle: 'مقالة جديدة', read: 'اقرأ ↗', watch: 'شاهد ↗', readFull: 'اقرأ المقالة ↗', watchFull: 'شاهد على يوتيوب ↗', grid: '⊞ شبكة', list: '☰ قائمة', dir: 'rtl' },
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

function Card({ item, featured, dark, compact, t, bookmarks, toggleBookmark }) {
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
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: hov ? (dark ? '#242424' : '#faf9f7') : 'transparent', borderBottom: `1px solid ${dark ? '#1e1e1e' : '#f0efeb'}`, textDecoration: 'none', transition: 'background 0.15s' }}
      >
        {showImage && (
          <div style={{ width: 56, height: 40, borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
            <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.parentElement.style.display = 'none'; }} />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: titleColor, margin: 0, lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Badge source={item.source} color={item.color} />
          <span style={{ fontSize: 11, color: metaColor }}>{fmt(item.pubDate)}</span>
        </div>
      </a>
    );
  }

  if (featured) {
    return (
      <a href={item.link} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'grid', gridTemplateColumns: showImage ? '1.1fr 1fr' : '1fr', background: bg, borderRadius: 16, overflow: 'hidden', border: `1px solid ${border}`, boxShadow: shadow, transform: hov ? 'translateY(-3px)' : 'none', transition: 'all 0.2s', marginBottom: '2rem', textDecoration: 'none', direction: t.dir, maxHeight: showImage ? 'none' : 220 }}
>
        {showImage && (
          <div style={{ position: 'relative', minHeight: 260, background: dark ? '#2a2a2a' : '#f0efeb', overflow: 'hidden' }}>
            <img src={item.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.parentElement.style.display = 'none'; }} />
            {item.isVideo && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)' }}>
                <div style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.93)', borderadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, paddingLeft: 4 }}>▶</div>
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
      style={{ display: 'flex', flexDirection: 'column', background: bg, borderRadius: 12, overflow: 'hidden', border: `1px solid ${border}`, boxShadow: shadow, transform: hov ? 'translateY(-2px)' : 'none', transition: 'all 0.18s', textDecoration: 'none', height: '100%' }}
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
        <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.45, color: titleColor, margin: 0 }}>{item.title}</h3>
        {item.description && (
          <p style={{ fontSize: 12, color: descColor, lineHeight: 1.55, margin: 0 }}>
            {item.description.length > 120 ? item.description.slice(0, 120) + '...' : item.description}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 4 }}>
          <span style={{ fontSize: 11, color: metaColor }}>{item.isVideo ? t.watch : t.read}</span>
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); toggleBookmark(item); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, padding: '2px 4px', color: bookmarks.find(b => b.link === item.link) ? '#f59e0b' : metaColor, opacity: 1 }}
            title="Bookmark"
          >
            {bookmarks.find(b => b.link === item.link) ? '★' : '☆'}
          </button>
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState('en');
  const [items, setItems] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeSource, setActiveSource] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [compact, setCompact] = useState(false);
  const [lastChecked, setLastChecked] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [newCount, setNewCount] = useState(0);
  const intervalRef = useRef(null);
  const hasFetched = useRef(false);

  const t = UI[lang];

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) setDark(stored === 'dark');
    else setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    const storedLang = localStorage.getItem('lang');
    if (storedLang) setLang(storedLang);
    const storedBookmarks = localStorage.getItem('bookmarks');
    if (storedBookmarks) setBookmarks(JSON.parse(storedBookmarks));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !hasFetched.current) {
      hasFetched.current = true;
      fetchNews(false);
    }
  }, [mounted]);
  async function fetchNews(silent = false) {
    if (!silent) setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      const now = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      setLastChecked(now);
      if (silent && items.length > 0) {
        const existingLinks = new Set(items.map(i => i.link));
        const fresh = data.items.filter(i => !existingLinks.has(i.link));
        if (fresh.length > 0) {
          setPendingItems(data.items);
          setNewCount(fresh.length);
        }
      } else {
        setItems(data.items);
        setPendingItems([]);
        setNewCount(0);
        setLoaded(true);
        setActiveTab('all');
        setActiveSource('all');
      }
    } catch {
      if (!silent) setError('Failed to fetch. Try again.');
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) setDark(stored === 'dark');
    else setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    const storedLang = localStorage.getItem('lang');
    if (storedLang) setLang(storedLang);
    const storedBookmarks = localStorage.getItem('bookmarks');
    if (storedBookmarks) setBookmarks(JSON.parse(storedBookmarks));
    setMounted(true);
  }, []);

  function applyPending() {
    setItems(pendingItems);
    setPendingItems([]);
    setNewCount(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleDark() {
    setDark(d => {
      const next = !d;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }

  function changeLang(newLang) {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  }
  function toggleBookmark(item) {
    setBookmarks(prev => {
      const exists = prev.find(b => b.link === item.link);
      const next = exists ? prev.filter(b => b.link !== item.link) : [...prev, item];
      localStorage.setItem('bookmarks', JSON.stringify(next));
      return next;
    });
  }
  const topStories = useMemo(() => {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - 24);
    return items.filter(i => new Date(i.pubDate) > cutoff).slice(0, 4);
  }, [items]);

  const availableSources = useMemo(() => {
    const base = activeTab === 'all' ? items : items.filter(i => i.category === activeTab);
    return ['all', ...Array.from(new Set(base.map(i => i.source)))];
  }, [items, activeTab]);

  useEffect(() => { setActiveSource('all'); }, [activeTab]);

  const filtered = useMemo(() => {
    if (activeTab === 'bookmarks') return bookmarks;
    let list = activeTab === 'all' ? items : items.filter(i => i.category === activeTab);
    if (activeSource !== 'all') list = list.filter(i => i.source === activeSource);
    if (dateFilter !== 'all') list = list.filter(i => isWithinDays(i.pubDate, dateFilter));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i => i.title.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q) || i.source.toLowerCase().includes(q));
    }
    return list;
  }, [items, activeTab, activeSource, dateFilter, search, bookmarks]);

  const bg = dark ? '#111' : '#f5f4f0';
  const headerBg = dark ? '#161616' : '#fff';
  const borderColor = dark ? '#222' : '#eae9e5';
  const textPrimary = dark ? '#f0f0f0' : '#111';
  const textMuted = dark ? '#555' : '#bbb';
  const inputBg = dark ? '#1e1e1e' : '#fff';

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", direction: t.dir, display: 'flex', flexDirection: 'column' }}>

      {newCount > 0 && (
        <div onClick={applyPending} style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: '#111', color: '#fff', padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 24px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          <span style={{ background: '#10a37f', borderRadius: '50%', width: 8, height: 8, display: 'inline-block' }} />
          {newCount} {newCount > 1 ? t.newArticles : t.newArticle}
        </div>
      )}

      <div style={{ background: headerBg, borderBottom: `1px solid ${borderColor}`, padding: '1.25rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', color: textMuted, textTransform: 'uppercase', marginBottom: 3 }}>{t.subtitle}</p>
          <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em', color: textPrimary, margin: 0 }}>{t.title}</h1>
<p style={{ fontSize: 11, color: dark ? '#888' : '#999', margin: '3px 0 0', letterSpacing: '0.04em' }}>Free · No account needed</p>        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {lastChecked && <span style={{ fontSize: 11, color: textMuted }}>{t.updated} {lastChecked}</span>}
          <div style={{ display: 'flex', gap: 4 }}>
            {LANGUAGES.map(l => (
              <button key={l.id} onClick={() => changeLang(l.id)} style={{ padding: '6px 12px', fontSize: 12, fontWeight: lang === l.id ? 700 : 400, background: lang === l.id ? (dark ? '#fff' : '#111') : 'transparent', color: lang === l.id ? (dark ? '#111' : '#fff') : textMuted, border: `1px solid ${lang === l.id ? (dark ? '#fff' : '#111') : borderColor}`, borderRadius: 6, cursor: 'pointer' }}>
                {l.native}
              </button>
            ))}
          </div>
          <button onClick={toggleDark} style={{ background: 'none', border: `1px solid ${borderColor}`, borderRadius: 8, padding: '8px 12px', fontSize: 16, cursor: 'pointer', lineHeight: 1 }}>{dark ? '☀️' : '🌙'}</button>
          <button onClick={() => setCompact(c => !c)} style={{ background: 'none', border: `1px solid ${borderColor}`, borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: textPrimary }}>{compact ? t.grid : t.list}</button>
          <button onClick={() => fetchNews(false)} disabled={loading} style={{ background: dark ? '#fff' : '#111', color: dark ? '#111' : '#fff', border: 'none', padding: '10px 22px', fontSize: 12, fontWeight: 600, borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? t.loading : t.refresh}
          </button>
        </div>
      </div>

      {loaded && (
        <div style={{ background: headerBg, borderBottom: `1px solid ${borderColor}`, padding: '0 2.5rem', display: 'flex', gap: 4, overflowX: 'auto' }}>
          {TABS.map(tab => {
            const count = tab.id === 'all' ? items.length : tab.id === 'bookmarks' ? bookmarks.length : items.filter(i => i.category === tab.id).length;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '13px 16px', fontSize: 13, fontWeight: active ? 600 : 400, color: active ? textPrimary : textMuted, background: 'none', border: 'none', borderBottom: active ? `2px solid ${textPrimary}` : '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6, marginBottom: -1 }}>
                {tab.label[lang]}
                <span style={{ fontSize: 11, background: active ? (dark ? '#2a2a2a' : '#f0efeb') : 'transparent', color: active ? (dark ? '#aaa' : '#666') : (dark ? '#444' : '#ddd'), padding: '1px 7px', borderRadius: 10 }}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {error && <div style={{ margin: '1.5rem 2.5rem', padding: '12px 16px', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13 }}>{error}</div>}

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '65vh' }}>
          <p style={{ fontSize: 14, color: textMuted }}>{t.fetching}</p>
        </div>
      )}

      {loaded && (
        <div style={{ padding: '1.5rem 2.5rem 0', maxWidth: 1280, margin: '0 auto' }}>
{activeTab === 'all' && search === '' && dateFilter === 'all' && activeSource === 'all' && topStories.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, whiteSpace: 'nowrap' }}>{t.topStories}</span>
                <div style={{ flex: 1, height: 1, background: borderColor }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                {topStories.map((item, i) => (
                  <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', gap: 10, padding: '12px', background: dark ? '#1a1a1a' : '#fff', border: `1px solid ${borderColor}`, borderRadius: 10, textDecoration: 'none', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: dark ? '#333' : '#e5e4e0', lineHeight: 1, flexShrink: 0, paddingTop: 2 }}>0{i + 1}</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: dark ? '#f0f0f0' : '#111', lineHeight: 1.4, margin: '0 0 6px' }}>{item.title}</p>
                      <Badge source={item.source} color={item.color} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: textMuted, pointerEvents: 'none' }}>🔍</span>
              <input type="text" placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '9px 12px 9px 36px', fontSize: 13, background: inputBg, border: `1px solid ${borderColor}`, borderRadius: 8, color: textPrimary, outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {DATE_FILTERS.map(f => (
                <button key={f.id} onClick={() => setDateFilter(f.id)} style={{ padding: '8px 14px', fontSize: 12, fontWeight: dateFilter === f.id ? 600 : 400, color: dateFilter === f.id ? (dark ? '#111' : '#fff') : textMuted, background: dateFilter === f.id ? (dark ? '#fff' : '#111') : 'transparent', border: `1px solid ${dateFilter === f.id ? (dark ? '#fff' : '#111') : borderColor}`, borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {f.label[lang]}
                </button>
              ))}
            </div>
          </div>

          {availableSources.length > 2 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {availableSources.map(src => {
                const active = activeSource === src;
                const srcItem = items.find(i => i.source === src);
                const color = srcItem?.color || '#888';
                return (
                  <button key={src} onClick={() => setActiveSource(src)} style={{ padding: '5px 13px', fontSize: 11, fontWeight: active ? 700 : 400, borderRadius: 100, border: active ? `1px solid ${color}` : `1px solid ${borderColor}`, background: active ? color + '18' : 'transparent', color: active ? color : textMuted, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {src === 'all' ? t.allSources : src}
                  </button>
                );
              })}
            </div>
          )}

         

          {filtered.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, whiteSpace: 'nowrap' }}>
                {activeTab === 'all' ? t.allArticles : TABS.find(tab => tab.id === activeTab)?.label[lang]}
                <span style={{ fontWeight: 400, marginLeft: 6 }}>· {filtered.length}</span>
              </span>
              <div style={{ flex: 1, height: 1, background: borderColor }} />
            </div>
          )}

          {filtered.length > 0 && !compact && (
            <>
              <Card item={filtered[0]} featured dark={dark} compact={false} t={t} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', paddingBottom: '3rem' }}>
                {filtered.slice(1).map((item, i) => <Card key={i} item={item} dark={dark} compact={false} t={t} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />)}
              </div>
            </>
          )}

          {filtered.length > 0 && compact && (
            <div style={{ background: dark ? '#161616' : '#fff', border: `1px solid ${borderColor}`, borderRadius: 12, overflow: 'hidden', marginBottom: '3rem' }}>
              {filtered.map((item, i) => <Card key={i} item={item} dark={dark} compact={true} t={t} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />)}
            </div>
          )}

          {filtered.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '4rem', color: textMuted, fontSize: 14 }}>{t.noResults}</div>
          )}
        </div>
      )}
  
{/* Footer */}
<div style={{ borderTop: `0.5px solid ${dark ? '#1e1e1e' : '#eae9e5'}`, padding: '1.5rem 2.5rem', display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center', background: dark ? '#161616' : '#fff', marginTop: 'auto' }}>     
     <a href="/about" style={{ fontSize: 12, color: dark ? '#555' : '#bbb', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>About</a> 
     <a href="/sources" style={{ fontSize: 12, color: dark ? '#555' : '#bbb', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Sources</a>
        <a href="/privacy" style={{ fontSize: 12, color: dark ? '#555' : '#bbb', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Privacy Policy</a>
        <span style={{ fontSize: 12, color: dark ? '#333' : '#ddd' }}>© 2026 AIWire</span>
      </div>
      <style>{`
        @keyframes slideDown {
          from { opacity: 1; transform: translateX(-50%) translateY(-12px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        input::placeholder { color: ${dark ? '#444' : '#bbb'}; }
        input:focus { border-color: ${dark ? '#444' : '#aaa'} !important; }
      `}</style>
    </div>
  );
}