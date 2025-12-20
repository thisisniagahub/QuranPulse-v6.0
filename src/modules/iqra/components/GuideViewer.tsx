import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import mermaid from 'mermaid';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  Menu, 
  CheckCircle2, 
  ArrowRight,
  BrainCircuit,
  Eye,
  Activity
} from 'lucide-react';

interface GuideViewerProps {
  initialLevel?: number;
  initialPage?: number;
}

const IQRA_LEVELS = [1, 2, 3, 4, 5, 6];

// Custom component to render Mermaid diagrams
const MermaidDiagram = ({ chart }: { chart: string }) => {
  const [svg, setSvg] = useState('');
  const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true, 
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'Inter',
    });
    
    mermaid.render(id, chart).then(({ svg }) => {
      setSvg(svg);
    });
  }, [chart, id]);

  return (
    <div className="my-6 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-x-auto flex justify-center">
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
};

export const GuideViewer: React.FC<GuideViewerProps> = ({ initialLevel = 1, initialPage = 1 }) => {
  const [level, setLevel] = useState(initialLevel);
  const [page, setPage] = useState(initialPage);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [totalPages, setTotalPages] = useState<number>(30); // Default estimate

  // Load content
  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const pageStr = String(page).padStart(2, '0');
        const path = `/iqra-guides/iqra-${level}/page_${pageStr}.md`;
        
        // Fallback for different naming conventions just in case
        let response = await fetch(path);
        
        if (!response.ok) {
           // Try capitalized 'Page' if lowercase 'page' fails
           const altPath = `/iqra-guides/iqra-${level}/Page_${pageStr}.md`;
           response = await fetch(altPath);
        }

        if (response.ok) {
          const text = await response.text();
          setContent(text);
        } else {
          setContent(`# Panduan Belum Tersedia\n\nMaaf, panduan untuk Iqra ${level} Muka Surat ${page} belum dijumpai.`);
        }
      } catch (error) {
        console.error("Failed to load guide:", error);
        setContent("# Error Loading Guide\n\nPlease check your connection.");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [level, page]);

  // Handle navigation
  const nextPage = () => setPage(p => p + 1);
  const prevPage = () => setPage(p => Math.max(1, p - 1));

  return (
    <div className="flex h-screen bg-[#051324] text-white overflow-hidden font-sans">
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0e3359]/95 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="text-[#5ab9ff]" />
            <h1 className="font-bold text-lg">Panduan Iqra</h1>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <ChevronLeft />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-2">Pilih Tahap</h3>
              <div className="grid grid-cols-3 gap-2">
                {IQRA_LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLevel(l); setPage(1); }}
                    className={`
                      p-2 rounded-lg text-sm font-medium transition-all
                      ${level === l 
                        ? 'bg-[#5ab9ff] text-[#051324] shadow-[0_0_15px_rgba(90,185,255,0.4)]' 
                        : 'bg-[#154270] hover:bg-[#154270]/80 text-white/80'}
                    `}
                  >
                    Iqra {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-2">Navigasi Pantas</h3>
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`
                      aspect-square rounded flex items-center justify-center text-xs transition-colors
                      ${page === p 
                        ? 'bg-white/20 text-white ring-1 ring-[#5ab9ff]' 
                        : 'hover:bg-white/10 text-white/60'}
                    `}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <div className="md:hidden p-4 bg-[#0e3359] flex items-center gap-3 border-b border-white/10">
          <button onClick={() => setSidebarOpen(true)}><Menu /></button>
          <span className="font-semibold">Iqra {level} - MS {page}</span>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-8 pb-20">
            
            {/* Header Card */}
            <div className="glass-card p-6 md:p-8 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#5ab9ff]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2 text-[#5ab9ff]">
                  <Activity className="w-5 h-5" />
                  <span className="text-sm font-medium tracking-wide">MODUL BIMBINGAN VISUAL</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Iqra {level} : Muka Surat {page}</h1>
                <p className="text-white/60">Ikuti panduan langkah demi langkah di bawah untuk menguasai halaman ini.</p>
              </div>
            </div>

            {/* Content Renderer */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5ab9ff]"></div>
              </div>
            ) : (
              <div className="prose prose-invert prose-lg max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Custom formatting for the tables to look like "Kotak"
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto my-8">
                        <table className="w-full border-collapse text-sm" {...props} />
                      </div>
                    ),
                    thead: ({node, ...props}) => <thead className="bg-[#154270] text-[#5ab9ff] uppercase text-xs tracking-wider" {...props} />,
                    th: ({node, ...props}) => <th className="p-4 text-left border-b border-white/10 font-semibold" {...props} />,
                    td: ({node, ...props}) => <td className="p-4 border-b border-white/5 font-arabic text-lg" {...props} />,
                    
                    // Custom formatting for Mermaid code blocks
                    code: ({node, inline, className, children, ...props}: any) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const isMermaid = match && match[1] === 'mermaid';
                      
                      if (!inline && isMermaid) {
                        return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
                      }
                      
                      if (!inline && match && match[1] === 'text') {
                         // Specific styling for the Arrow Diagram text block
                         return (
                           <div className="bg-[#152e4d] p-6 rounded-xl border border-[#5ab9ff]/30 text-center font-mono text-xl tracking-widest text-[#5ab9ff] shadow-[0_0_20px_rgba(90,185,255,0.1)]">
                             {children}
                           </div>
                         )
                      }

                      return (
                        <code className={`${className} bg-black/30 px-1.5 py-0.5 rounded text-[#5ab9ff] font-mono text-sm`} {...props}>
                          {children}
                        </code>
                      );
                    },
                    
                    // Custom Blockquote for "Ringkasan"
                    blockquote: ({node, ...props}) => (
                      <div className="glass p-6 rounded-xl border-l-4 border-[#5ab9ff] my-8 bg-[#5ab9ff]/5">
                        <div className="flex items-start gap-3">
                          <BrainCircuit className="w-6 h-6 text-[#5ab9ff] mt-1 flex-shrink-0" />
                          <div className="italic text-white/90" {...props} />
                        </div>
                      </div>
                    ),

                    // Headers
                    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-12 mb-6 text-[#5ab9ff] flex items-center gap-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-8 mb-4 text-white border-b border-white/10 pb-2" {...props} />,
                    
                    // Lists (Checklist)
                    ul: ({node, ...props}) => <ul className="space-y-3 my-6" {...props} />,
                    li: ({node, ...props}) => (
                      <li className="flex items-start gap-2" {...props}>
                        {/* We let standard rendering handle the checkbox or bullet, but style the text */}
                      </li>
                    ),
                    input: ({node, ...props}) => (
                        <input type="checkbox" className="mt-1.5 h-4 w-4 rounded border-gray-600 text-[#5ab9ff] focus:ring-[#5ab9ff] bg-transparent" {...props} readOnly />
                    )
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            )}

            {/* Navigation Footer */}
            <div className="flex justify-between items-center pt-8 border-t border-white/10">
              <button 
                onClick={prevPage}
                disabled={page === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#154270] hover:bg-[#154270]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Sebelumnya</span>
              </button>

              <button 
                onClick={nextPage}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#5ab9ff] text-[#051324] font-bold hover:bg-[#5ab9ff]/90 shadow-[0_0_20px_rgba(90,185,255,0.3)] transition-all"
              >
                <span>Seterusnya</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideViewer;
