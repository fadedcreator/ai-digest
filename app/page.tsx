// @ts-nocheck
'use client';
import { useState, useEffect, useRef, useMemo } from 'react';

const TABS = [
  { id: 'all', label: { en: 'All', zh: '全部', ar: 'الكل' } },
  { id: 'companies', label: { en: 'Companies', zh: '公司', ar: 'الشركات' } },
  { id: 'media', label: { en: 'Media', zh: '媒体', ar: 'الإعلام' } },
  { id: 'insiders', label: { en: 'Insiders', zh: '内部人士', ar: 'المطلعون' } },
  { id: 'youtube', label: { en: 'YouTube', zh: 'YouTube', ar: 'يوتيوب' } },
];

const DATE_FILTERS = [
  { id: 'all', label: { en: 'All time', zh: '全部时间', ar: 'كل الأوقات' } },
  { id: '1', label: { en: 'Today', zh: '今天', ar: 'اليوم' } },
  { id: '3', label: { en: 'Last 3 days', zh: '最近3天', ar: 'آخر 3 أيام' } },
  { id: '7', label: { en: 'Last 7 days', zh: '最近7天', ar: 'آخر 7 أيام' } },
];

const LANGUAGES = [
  { id: 'en', native: 'EN' },
  { id: 'zh', native: '中文' },
  { id: 'ar', native: 'AR' },
];

const UI = {
  en: { title: 'AI News Digest', subtitle: 'Intelligence Feed', refresh: 'Refresh', loading: 'Loading…', fetching: 'Fetching latest AI news…', topStories: 'Breaking · last 24h', allArticles: 'All articles', noResults: 'No articles match these filters.', search: 'Search…', allSources: 'All', updated: 'Updated', newArticles: 'new articles', newArticle: 'new article', read: 'Read ↗', watch: 'Watch ↗', readFull: 'Read article ↗', watchFull: 'Watch on YouTube ↗', grid: 'Grid', list: 'List', sources: 'Sources', dir: 'ltr' },
  zh: { title: 'AI 新闻摘要', subtitle: '智能资讯', refresh: '刷新', loading: '加载中…', fetching: '正在获取最新AI新闻…', topStories: '突发 · 最近24小时', allArticles: '全部文章', noResults: '没有符合条件的文章。', search: '搜索…', allSources: '全部', updated: '更新于', newArticles: '条新文章', newArticle: '条新文章', read: '阅读 ↗', watch: '观看 ↗', readFull: '阅读文章 ↗', watchFull: '在YouTube观看 ↗', grid: '网格', list: '列表', sources: '来源', dir: 'ltr' },
  ar: { title: 'ملخص أخبار الذكاء الاصطناعي', subtitle: 'تغذية المعلومات', refresh: 'تحديث', loading: 'جارٍ التحميل…', fetching: 'جارٍ جلب آخر أخبار الذكاء الاصطناعي…', topStories: 'عاجل · آخر 24 ساعة', allArticles: 'جميع المقالات', noResults: 'لا توجد مقالات تطابق هذه الفلاتر.', search: 'بحث…', allSources: 'الكل', updated: 'تحديث', newArticles: 'مقالات جديدة', newArticle: 'مقالة جديدة', read: 'اقرأ ↗', watch: 'شاهد ↗', readFull: 'اقرأ المقالة ↗', watchFull: 'شاهد على يوتيوب ↗', grid: 'شبكة', list: 'قائمة', sources: 'المصادر', dir: 'rtl' },
};

const REFRESH_INTERVAL = 30 * 60 * 1000;

function fmt(d) {
  if (!d) return '';
  const date = new Date(d);
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function isWithinDays(dateStr, days) {
  if (!days || days === 'all') return true;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - parseInt(days));
  return new Date(dateStr) > cutoff;
}

function Badge({ source, color, small = false }) {
  return (
    <span style={{ fontSize: small ? 9 : 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: small ? '2px 7px' : '3px 9px', borderRadius: 100, border: `1px solid ${color}40`, background: color + '15', color, whiteSpace: 'nowrap', flexShrink: 0 }}>
      {source}
    </span>
  );
}

function Card({ item, featured, dark, compact, t }) {
  const [hov, setHov] = useState(false);
  const bg = dark ? '#1a1a1a' : '#fff';
  const border = dark ? (hov ? '#333' : '#242424') : (hov ? '#d8d6d0' : '#eae9e5');
  const titleColor = dark ? '#efefef' : '#111';
  const descColor = dark ? '#888' : '#666';
  const metaColor = dark ? '#444' : '#ccc';
  const shadow = hov ? (dark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.07)') : 'none';
  const showImage = item.image && item.category !== 'insiders';

  if (compact) {
    return (
      <a href={item.link} target="_blank" rel="noopener noreferrer"
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', background: hov ? (dark ? '#1e1e1e' : '#faf9f7') : 'transparent', borderBottom: `1px solid ${dark ? '#1c1c1c' : '#f0efeb'}`, textDecoration: 'none', transition: 'background 0.12s' }}
      >
        {showImage && (
          <div style={{ width: 48, height: 34, borderRadius: 5, overflow: 'hidden', flexShrink: 0, background: dark ? '#2a2a2a' : '#f0efeb' }}>
            <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.parentElement.style.display = 'none'; }} />
          </div>
        )}
        <p style={{ fontSize: 13, fontWeight: 500, color: titleColor, margin: 0, lineHeight: 1.3, flex: 1, minWidth: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.title}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Badge source={item.source} color={item.color} small />
          <span style={{ fontSize: 11, color: metaColor, minWidth: 56, textAlign: 'right' }}>{fmt(item.pubDate)}</span>
        </div>
      </a>
    );
  }

  if (featured) {
    return (
      <a href={item.link} target="_blank" rel="noopener noreferrer"
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ display: 'grid', gridTemplateColumns: showImage ? '1.2fr 1fr' : '1fr', background: bg, borderRadius: 14, overflow: 'hidden', border: `1px solid ${border}`, boxShadow: shadow, transform: hov ? 'translateY(-2px)' : 'none', transition: 'all 0.18s', marginBottom: '1.5rem', textDecoration: 'none' }}
      >
        {showImage && (
          <div style={{ position: 'relative', minHeight: 240, background: dark ? '#222' : '#f0efeb', overflow: 'hidden' }}>
            <img src={item.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.parentElement.style.display = 'none'; }} />
            {item.isVideo && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.93)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, paddingLeft: 3 }}>▶</div>
              </div>
            )}
          </div>
        )}
        <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Badge source={item.source} color={item.color} />
            <span style={{ fontSize: 11, color: metaColor }}>{fmt(item.pubDate)}</span>
          </div>
          <h2 style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', color: titleColor, margin: 0 }}>{item.title}</h2>
          {item.description && <p style={{ fontSize: 13, color: descColor, lineHeight: 1.6, margin: 0 }}>{item.description}</p>}
          <span style={{ fontSize: 12, color: metaColor, marginTop: 'auto', paddingTop: 6 }}>{item.isVideo ? t.watchFull : t.readFull}</span>
        </div>
      </a>
    );
  }

  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: 'flex', flexDirection: 'column', background: bg, borderRadius: 12, overflow: 'hidden', border: `1px solid ${border}`, boxShadow: shadow, transform: hov ? 'translateY(-2px)' : 'none', transition: 'all 0.16s', textDecoration: 'none', height: '100%' }}
    >
      {showImage && (
        <div style={{ position: 'relative', aspectRatio: '16/9', background: dark ? '#222' : '#f0efeb', overflow: 'hidden', flexShrink: 0 }}>
          <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} onError={e => { e.currentTarget.parentElement.style.display = 'none'; }} />
          {item.isVideo && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.15)' }}>
              <div style={{ width: 38, height: 38, background: 'rgba(255,255,255,0.93)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, paddingLeft: 3 }}>▶</div>
            </div>
          )}
        </div>
      )}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Badge source={item.source} color={item.color} small />
          <span style={{ fontSize: 11, color: metaColor }}>{fmt(item.pubDate)}</span>
        </div>
        <h3 style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, color: titleColor, margin: 0 }}>{item.title}</h3>
        {item.description && (
          <p style={{ fontSize: 12, color: descColor, lineHeight: 1.5, margin: 0 }}>
            {item.description.length > 100 ? item.description.slice(0, 100) + '…' : item.description}
          </p>
        )}
        <span style={{ fontSize: 11, color: metaColor, marginTop: 'auto', paddingTop: 3 }}>{item.isVideo ? t.watch : t.read}</span>
      </div>
    </a>
  );
}

function SourceDrawer({ sources, activeSource, setActiveSource, items, dark, t, borderColor, textMuted }) {
  const [open, setOpen] = useState(false);

  const grouped = useMemo(() => {
    const map = {};
    sources.forEach(src => {
      if (src === 'all') return;
      const item = items.find(i => i.source === src);
      const cat = item?.category || 'other';
      if (!map[cat]) map[cat] = [];
      map[cat].push({ name: src, color: item?.color || '#888', count: items.filter(i => i.source === src).length });
    });
    return map;
  }, [sources, items]);

  const bg = dark ? '#161616' : '#fff';
  const hoverBg = dark ? '#1e1e1e' : '#f5f4f0';
  const textPrimary = dark ? '#efefef' : '#111';

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => setActiveSource('all')} style={{ padding: '6px 14px', fontSize: 12, fontWeight: activeSource === 'all' ? 600 : 400, borderRadius: 6, border: `1px solid ${activeSource === 'all' ? (dark ? '#fff' : '#111') : borderColor}`, background: activeSource === 'all' ? (dark ? '#fff' : '#111') : 'transparent', color: activeSource === 'all' ? (dark ? '#111' : '#fff') : textMuted, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          {t.allSources}
        </button>

        {activeSource !== 'all' && (() => {
          const srcItem = items.find(i => i.source === activeSource);
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 6, background: (srcItem?.color || '#888') + '15', border: `1px solid ${(srcItem?.color || '#888')}40` }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: srcItem?.color || '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{activeSource}</span>
              <button onClick={() => setActiveSource('all')} style={{ background: 'none', border: 'none', color: textMuted, cursor: 'pointer', fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
            </div>
          );
        })()}

        <div style={{ flex: 1 }} />

        <button onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: 12, fontWeight: 500, borderRadius: 6, border: `1px solid ${borderColor}`, background: open ? (dark ? '#1e1e1e' : '#f5f4f0') : 'transparent', color: textMuted, cursor: 'pointer' }}>
          {t.sources}
          <span style={{ fontSize: 10, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▾</span>
        </button>
      </div>

      {open && (
        <div style={{ marginTop: 8, background: bg, border: `1px solid ${borderColor}`, borderRadius: 10, overflow: 'hidden' }}>
          {Object.entries(grouped).map(([cat, srcs]) => (
            <div key={cat}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, padding: '10px 14px 6px', margin: 0, borderBottom: `1px solid ${borderColor}` }}>{cat}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                {srcs.map(src => {
                  const active = activeSource === src.name;
                  return (
                    <button key={src.name} onClick={() => { setActiveSource(src.name); setOpen(false); }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '9px 14px', background: active ? src.color + '12' : 'transparent', border: 'none', borderRight: `1px solid ${borderColor}`, borderBottom: `1px solid ${borderColor}`, cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s' }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = hoverBg; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ fontSize: 12, fontWeight: active ? 700 : 400, color: active ? src.color : (dark ? '#ccc' : '#333'), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{src.name}</span>
                      <span style={{ fontSize: 10, color: textMuted, flexShrink: 0 }}>{src.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
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
    if (!loaded) return;
    intervalRef.current = setInterval(() => fetchNews(true), REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [loaded, items]);

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
    let list = activeTab === 'all' ? items : items.filter(i => i.category === activeTab);
    if (activeSource !== 'all') list = list.filter(i => i.source === activeSource);
    if (dateFilter !== 'all') list = list.filter(i => isWithinDays(i.pubDate, dateFilter));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i => i.title.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q) || i.source.toLowerCase().includes(q));
    }
    return list;
  }, [items, activeTab, activeSource, dateFilter, search]);

  const bg = dark ? '#0f0f0f' : '#f5f4f0';
  const headerBg = dark ? '#141414' : '#fff';
  const borderColor = dark ? '#1e1e1e' : '#eae9e5';
  const textPrimary = dark ? '#efefef' : '#111';
  const textMuted = dark ? '#484848' : '#bbb';
  const inputBg = dark ? '#1a1a1a' : '#fff';

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', background: bg, fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", direction: t.dir }}>

      {newCount > 0 && (
        <div onClick={applyPending} style={{ position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: dark ? '#fff' : '#111', color: dark ? '#111' : '#fff', padding: '9px 18px', borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', animation: 'slideDown 0.25s ease' }}>
          <span style={{ background: '#10a37f', borderRadius: '50%', width: 7, height: 7, display: 'inline-block', flexShrink: 0 }} />
          {newCount} {newCount > 1 ? t.newArticles : t.newArticle} — click to load
        </div>
      )}

      <div style={{ background: headerBg, borderBottom: `1px solid ${borderColor}`, padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div>
          <p style={{ fontSize: 9, letterSpacing: '0.22em', color: textMuted, textTransform: 'uppercase', marginBottom: 2 }}>{t.subtitle}</p>
          <h1 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.03em', color: textPrimary, margin: 0 }}>{t.title}</h1>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {lastChecked && <span style={{ fontSize: 10, color: textMuted }}>{t.updated} {lastChecked}</span>}
          <div style={{ display: 'flex', background: dark ? '#1a1a1a' : '#f5f4f0', borderRadius: 7, padding: 2, gap: 1 }}>
            {LANGUAGES.map(l => (
              <button key={l.id} onClick={() => changeLang(l.id)} style={{ padding: '5px 10px', fontSize: 11, fontWeight: lang === l.id ? 700 : 400, background: lang === l.id ? (dark ? '#2e2e2e' : '#fff') : 'transparent', color: lang === l.id ? textPrimary : textMuted, border: 'none', borderRadius: 5, cursor: 'pointer', boxShadow: lang === l.id ? (dark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)') : 'none' }}>
                {l.native}
              </button>
            ))}
          </div>
          <button onClick={toggleDark} style={{ background: 'none', border: `1px solid ${borderColor}`, borderRadius: 7, padding: '7px 10px', fontSize: 14, cursor: 'pointer', lineHeight: 1, color: textPrimary }}>{dark ? '☀️' : '🌙'}</button>
          <button onClick={() => setCompact(c => !c)} style={{ background: 'none', border: `1px solid ${borderColor}`, borderRadius: 7, padding: '7px 11px', fontSize: 11, fontWeight: 500, cursor: 'pointer', color: textMuted }}>{compact ? t.grid : t.list}</button>
          <button onClick={() => fetchNews(false)} disabled={loading} style={{ background: dark ? '#fff' : '#111', color: dark ? '#111' : '#fff', border: 'none', padding: '8px 18px', fontSize: 12, fontWeight: 600, borderRadius: 7, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}>
            {loading ? t.loading : `↻ ${t.refresh}`}
          </button>
        </div>
      </div>

      {loaded && (
        <div style={{ background: headerBg, borderBottom: `1px solid ${borderColor}`, padding: '0 2rem', display: 'flex', gap: 0, overflowX: 'auto' }}>
          {TABS.map(tab => {
            const count = tab.id === 'all' ? items.length : items.filter(i => i.category === tab.id).length;
            const active = activeTab === tab.id;
            if (count === 0 && tab.id !== 'all') return null;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '11px 14px', fontSize: 12, fontWeight: active ? 600 : 400, color: active ? textPrimary : textMuted, background: 'none', border: 'none', borderBottom: active ? `2px solid ${textPrimary}` : '2px solid transparent', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 5, marginBottom: -1 }}>
                {tab.label[lang]}
                <span style={{ fontSize: 10, background: active ? (dark ? '#252525' : '#f0efeb') : 'transparent', color: active ? (dark ? '#888' : '#666') : (dark ? '#333' : '#ddd'), padding: '1px 6px', borderRadius: 8 }}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {error && <div style={{ margin: '1.5rem 2rem', padding: '11px 16px', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: 13 }}>{error}</div>}

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>📡</div>
            <p style={{ fontSize: 13, color: textMuted }}>{t.fetching}</p>
          </div>
        </div>
      )}

      {loaded && (
        <div style={{ padding: '1.5rem 2rem 0', maxWidth: 1300, margin: '0 auto' }}>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: textMuted, pointerEvents: 'none' }}>🔍</span>
              <input type="text" placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 32px', fontSize: 13, background: inputBg, border: `1px solid ${borderColor}`, borderRadius: 7, color: textPrimary, outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', background: dark ? '#1a1a1a' : '#f5f4f0', borderRadius: 7, padding: 2, gap: 1 }}>
              {DATE_FILTERS.map(f => (
                <button key={f.id} onClick={() => setDateFilter(f.id)} style={{ padding: '6px 12px', fontSize: 11, fontWeight: dateFilter === f.id ? 600 : 400, color: dateFilter === f.id ? textPrimary : textMuted, background: dateFilter === f.id ? (dark ? '#2e2e2e' : '#fff') : 'transparent', border: 'none', borderRadius: 5, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: dateFilter === f.id ? (dark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)') : 'none' }}>
                  {f.label[lang]}
                </button>
              ))}
            </div>
          </div>

          <SourceDrawer sources={availableSources} activeSource={activeSource} setActiveSource={setActiveSource} items={items} dark={dark} t={t} borderColor={borderColor} textMuted={textMuted} />

          {activeTab === 'all' && !search && dateFilter === 'all' && activeSource === 'all' && topStories.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.875rem' }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, whiteSpace: 'nowrap' }}>{t.topStories}</span>
                <div style={{ flex: 1, height: 1, background: borderColor }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.875rem' }}>
                {topStories.map((item, i) => (
                  <a key={i} href={item.link} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', gap: 10, padding: '11px 13px', background: dark ? '#161616' : '#fff', border: `1px solid ${borderColor}`, borderRadius: 10, textDecoration: 'none', alignItems: 'flex-start', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = dark ? '#333' : '#d0cfc9'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = borderColor}
                  >
                    <span style={{ fontSize: 14, fontWeight: 800, color: dark ? '#2a2a2a' : '#e8e7e3', lineHeight: 1, flexShrink: 0, paddingTop: 1 }}>0{i + 1}</span>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: dark ? '#efefef' : '#111', lineHeight: 1.35, margin: '0 0 6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Badge source={item.source} color={item.color} small />
                        <span style={{ fontSize: 10, color: textMuted }}>{fmt(item.pubDate)}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {filtered.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: textMuted, whiteSpace: 'nowrap' }}>
                {search ? `"${search}"` : activeSource !== 'all' ? activeSource : activeTab === 'all' ? t.allArticles : TABS.find(tab => tab.id === activeTab)?.label[lang]}
                <span style={{ fontWeight: 400, marginLeft: 5 }}>· {filtered.length}</span>
              </span>
              <div style={{ flex: 1, height: 1, background: borderColor }} />
            </div>
          )}

          {filtered.length > 0 && !compact && (
            <>
              <Card item={filtered[0]} featured dark={dark} compact={false} t={t} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', paddingBottom: '3rem' }}>
                {filtered.slice(1).map((item, i) => <Card key={i} item={item} dark={dark} compact={false} t={t} />)}
              </div>
            </>
          )}

          {filtered.length > 0 && compact && (
            <div style={{ background: dark ? '#141414' : '#fff', border: `1px solid ${borderColor}`, borderRadius: 10, overflow: 'hidden', marginBottom: '3rem' }}>
              {filtered.map((item, i) => <Card key={i} item={item} dark={dark} compact={true} t={t} />)}
            </div>
          )}

<style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-12px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        input::placeholder { color: ${dark ? '#444' : '#bbb'}; }
        input:focus { border-color: ${dark ? '#444' : '#aaa'} !important; }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>
      
          )}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        input::placeholder { color: ${dark ? '#333' : '#ccc'}; }
        input:focus { border-color: ${dark ? '#383838' : '#aaa'} !important; }
        * { scrollbar-width: thin; scrollbar-color: ${dark ? '#2a2a2a #0f0f0f' : '#e0deda #f5f4f0'}; }
      `}</style>
    </div>
  );
}