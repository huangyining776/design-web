/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  ArrowUpRight, 
  Layers, 
  Trash2, 
  RotateCw, 
  Plus, 
  RefreshCw, 
  Sparkles, 
  Languages, 
  Info, 
  Settings, 
  ChevronRight, 
  FileText, 
  Maximize2, 
  Sliders, 
  Check, 
  ExternalLink,
  MapPin,
  Cpu,
  User,
  Inbox,
  AlertCircle
} from "lucide-react";
import { portfolioProjects, defaultPaperElements, i18n } from "./data";
import { ProjectItem, PaperElement, CritiqueResult } from "./types";

export default function App() {
  const [lang, setLang] = useState<"en" | "zh">("zh");
  const [activeTab, setActiveTab] = useState<"works" | "lab" | "ai" | "about">("works");
  
  // Project detail drawer state
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  
  // Interactive Crafting Playground states
  const [elements, setElements] = useState<PaperElement[]>(defaultPaperElements);
  const [selectedElementId, setSelectedElementId] = useState<string | null>("pe-02");
  
  // AI Critique states
  const [aiInput, setAiInput] = useState<string>("");
  const [isCritiquing, setIsCritiquing] = useState<boolean>(false);
  const [critiqueResult, setCritiqueResult] = useState<CritiqueResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [activeCritiqueTab, setActiveCritiqueTab] = useState<"analysis" | "recs" | "tactile">("analysis");

  // Local clock state for that live international tech-vibe
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZoneName: "short"
      };
      setTimeStr(now.toLocaleTimeString(lang === "zh" ? "zh-CN" : "en-US", options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lang]);

  // Handle playground element transformation updates
  const updateSelectedElement = (field: keyof PaperElement, value: any) => {
    if (!selectedElementId) return;
    setElements(prev => prev.map(el => {
      if (el.id === selectedElementId) {
        return { ...el, [field]: value };
      }
      return el;
    }));
  };

  // Drag simulation / move handlers for playground elements on grid workspace
  const moveElement = (id: string, deltaX: number, deltaY: number) => {
    setElements(prev => prev.map(el => {
      if (el.id === id) {
        // Clamp bounds to fit inside draft board safely
        const newX = Math.max(0, Math.min(500, el.x + deltaX));
        const newY = Math.max(0, Math.min(300, el.y + deltaY));
        return { ...el, x: newX, y: newY };
      }
      return el;
    }));
  };

  // Element additions
  const addNewElement = () => {
    const freshId = `pe-${Date.now()}`;
    const newEl: PaperElement = {
      id: freshId,
      labelEn: `Dynamic Fibrous Plate ${elements.length + 1}`,
      labelZh: `动态纤维板块 ${elements.length + 1}`,
      x: 100 + Math.floor(Math.random() * 80),
      y: 80 + Math.floor(Math.random() * 80),
      width: 140,
      height: 90,
      rotate: Math.floor(Math.random() * 10) - 5,
      elevation: 3,
      color: "#edf1e8",
      type: "grid-card"
    };
    setElements(prev => [...prev, newEl]);
    setSelectedElementId(freshId);
  };

  const removeElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  const resetPlayground = () => {
    setElements(defaultPaperElements);
    setSelectedElementId("pe-02");
  };

  // Submit concept to Gemini critique endpoint
  const requestAIEvaluation = async () => {
    if (!aiInput.trim()) return;
    setIsCritiquing(true);
    setAiError(null);
    setCritiqueResult(null);

    try {
      const response = await fetch("/api/ai/critique", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept: aiInput, lang: lang })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Internal evaluation error occurred.");
      }
      setCritiqueResult(data);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Failed to contact design controller.");
    } finally {
      setIsCritiquing(false);
    }
  };

  const t = i18n[lang];

  return (
    <div id="app-root" className="min-h-screen bg-[#f7f5ef] text-[#1a1a1a] font-sans relative flex flex-col justify-between overflow-x-hidden selection:bg-[#282828] selection:text-[#f7f5ef] draftsman-grid">
      
      {/* Background radial overlay matching 'Artistic Flair' guidelines */}
      <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply" style={{
        backgroundImage: "radial-gradient(#1a1a1a 1px, transparent 1px)",
        backgroundSize: "24px 24px"
      }}></div>

      {/* Aesthetic Border Layout Lines defining draft table margins */}
      <div className="absolute top-0 bottom-0 left-6 w-[1px] bg-[#1a1a1a]/10 pointer-events-none hidden md:block"></div>
      <div className="absolute top-0 bottom-0 right-6 w-[1px] bg-[#1a1a1a]/10 pointer-events-none hidden md:block"></div>

      {/* HEADER SECTION */}
      <header id="main-header" className="border-b border-[#1a1a1a]/15 bg-[#f7f5ef]/95 backdrop-blur-md relative z-30 sticky top-0 px-4 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Subtitle */}
          <div className="flex items-start gap-4">
            <span className="bg-[#1a1a1a] text-[#f7f5ef] font-mono text-[11px] font-bold tracking-[0.2em] px-2.5 py-1.5 paper-elevation-1 uppercase">
              {t.logoTitle}
            </span>
            <div className="space-y-0.5">
              <h2 className="font-display font-medium text-xs tracking-widest text-[#1a1a1a]">
                {t.subtitle}
              </h2>
              <p className="font-mono text-[9px] text-[#1a1a1a]/60 uppercase tracking-tight">
                STATION_LATENCY_VERIFIED: 2026_INDEX // SYSTEM_MODE: ARTISTIC_FLAIR
              </p>
            </div>
          </div>

          {/* Center navigation & Language button */}
          <div className="flex flex-wrap items-center gap-4 md:gap-6 font-mono text-[11px] font-medium">
            
            {/* Lang switcher */}
            <button 
              id="lang-switch-btn"
              onClick={() => setLang(prev => prev === "en" ? "zh" : "en")}
              className="flex items-center gap-1.5 border border-[#1a1a1a]/20 bg-[#f7f5ef] px-3 py-1.5 hover:bg-[#1a1a1a] hover:text-[#f7f5ef] transition-colors rounded-sm cursor-pointer shadow-xs font-mono"
            >
              <Languages size={12} />
              <span>{lang === "en" ? "中文 // ZH" : "ENGLISH // EN"}</span>
            </button>

            <div className="h-4 w-[1px] bg-[#1a1a1a]/20 hidden md:block"></div>

            {/* Micro Metadata specs - Artistic Flair design requirement */}
            <div className="font-mono text-[10px] text-[#1a1a1a]/70 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#5e7751] rounded-full coordinate-pulse"></span>
              <span className="uppercase tracking-wider mr-2 text-[9px]">
                {lang === "en" ? "ONLINE" : "空闲中"}
              </span>
              <span className="opacity-40">// UTC CORE TIME //</span>
              <span className="font-semibold text-emerald-800 tabular-nums">{timeStr || "07:04:49"}</span>
            </div>
          </div>

        </div>
      </header>

      {/* SUB-HEADER EXPERT DETAILS */}
      <div className="border-b border-[#1a1a1a]/10 px-4 md:px-12 py-3 bg-[#e8e6df]/30 font-mono text-[10px] text-[#1a1a1a]/60 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[#1a1a1a] font-semibold">{lang === 'zh' ? '设计档案册：' : 'AESTHETIC PORTFOLIO:'}</span>
            <span>SPEC_REF: 420-COTTON</span>
            <span>DEBOSSED_PLATES: STREAK_OK</span>
            <span>SHADOW_STEPS: 5-DEGREES</span>
          </div>
          <div className="flex items-center gap-2">
            <span>DEVICE_DIMENSIONS: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1024x768'}</span>
            <span className="text-[#15803d]">● ACCREDITED</span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 lg:p-12 relative z-20">
        
        {/* BIG HERO INTRO CARD WITH ARTISTIC FLAIR TYPOGRAPHY */}
        <section id="hero-statement" className="mb-12 bg-[#fafaf6] border border-[#1a1a1a]/15 p-6 md:p-12 relative overflow-hidden paper-elevation-3">
          
          {/* Subtle blueprint graphic markers in corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#1a1a1a]/15"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#1a1a1a]/15"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#1a1a1a]/15"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#1a1a1a]/15"></div>
          
          <div className="absolute top-3 right-4 font-mono text-[9px] opacity-45 uppercase text-right leading-relaxed tracking-tighter">
            PROJECTION METHOD: MULTI-OVERLAY<br />
            PAPER WEIGHT: 350g COLOURED PULP BOARD
          </div>

          <div className="max-w-4xl space-y-6">
            <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#5a5a40] uppercase bg-[#efeade] px-3 py-1 border border-[#1a1a1a]/10 rounded-sm">
              <span className="w-2.5 h-2.5 bg-amber-600 rounded-full"></span>
              {lang === "en" ? "ACTIVE RETINAL BLUEPRINT" : "实时视网膜几何蓝图"}
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#1a1a1a] leading-[1.05] tracking-tight">
              {lang === "en" ? (
                <>
                  Visualizing <br />
                  <span className="italic text-[#5a5a40]">Functional</span> Dimensions.
                </>
              ) : (
                <>
                  雕刻数字界的 <br />
                  <span className="italic text-[#5a5a40] font-sans font-extralight tracking-normal">实体物理</span> 空间感。
                </>
              )}
            </h1>

            <p className="text-sm md:text-base leading-relaxed text-[#1a1a1a]/80 font-sans max-w-2xl bg-white/55 backdrop-blur-xs p-4 border-l-4 border-[#5a5a40] rounded-r-md">
              {t.introText}
            </p>
          </div>
        </section>

        {/* PERSISTENT SUB SECTION NAVIGATOR */}
        <section id="section-navigator" className="mb-8 overflow-x-auto">
          <div className="flex border-b border-[#1a1a1a]/15 gap-2 pb-0">
            {[
              { id: "works", label: t.workTitle, count: portfolioProjects.length },
              { id: "lab", label: t.labTitle, count: elements.length },
              { id: "ai", label: t.aiTitle, icon: Sparkles },
              { id: "about", label: t.aboutTitle, count: 2026 }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`tab-btn-${tab.id}`}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    // Close project detail drawer if switching tabs
                    setSelectedProject(null);
                  }}
                  className={`flex items-center gap-2 px-5 py-3.5 font-mono text-xs tracking-wider uppercase border-t border-x cursor-pointer transition-all duration-150 relative -bottom-[1px] rounded-t-sm whitespace-nowrap ${
                    isActive 
                      ? "bg-[#fafaf6] text-[#1a1a1a] border-[#1a1a1a]/25 border-b-[#fafaf6] font-bold shadow-xs paper-elevation-1" 
                      : "bg-[#e8e6df]/35 text-[#1a1a1a]/60 border-transparent border-b-[#1a1a1a]/15 hover:bg-[#e8e6df]/60 hover:text-[#1a1a1a]"
                  }`}
                >
                  {IconComp && <IconComp size={12} className="text-[#ab8c50]" />}
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="inline-block bg-[#1a1a1a]/5 border border-[#1a1a1a]/15 text-[#1a1a1a]/70 px-1.5 py-0.5 rounded-full text-[9px] font-semibold tabular-nums">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* VIEW CONTAINER */}
        <div id="view-cabinet" className="relative">

          {/* VIEW 1: WORKS CARDS */}
          {activeTab === "works" && (
            <div id="works-view" className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              {portfolioProjects.map((project, index) => {
                const title = lang === "zh" ? project.titleZh : project.titleEn;
                const category = lang === "zh" ? project.categoryZh : project.categoryEn;
                const summary = lang === "zh" ? project.summaryZh : project.summaryEn;
                const role = lang === "zh" ? project.roleZh : project.roleEn;
                return (
                  <div
                    key={project.id}
                    id={`project-card-${project.id}`}
                    onClick={() => setSelectedProject(project)}
                    className="bg-[#fafaf6] border border-[#1a1a1a]/20 p-6 flex flex-col justify-between hover:scale-[1.01] transition-transform duration-200 cursor-pointer relative group paper-elevation-2 select-none"
                  >
                    {/* Index notation */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="font-mono text-xs text-[#1a1a1a]/40 bg-[#1a1a1a]/5 px-2 py-1 rounded-sm">
                        0{index + 1}/_PLAN
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#5a5a40]">
                        <span>{project.year}</span>
                        <span className="w-1.5 h-1.5 bg-[#5a5a40] rounded-full"></span>
                        <span>{project.paperGrammage.split(',')[0]}</span>
                      </div>
                    </div>

                    {/* Paper simulation color block */}
                    <div className="w-full h-44 mb-6 border border-[#282828]/10 relative transition-all overflow-hidden flex items-center justify-center p-4 rounded-sm"
                      style={{ backgroundColor: project.colorHex }}
                    >
                      {/* Grid background in mockup block */}
                      <div className="absolute inset-0 opacity-15 pointer-events-none isometric-blueprint"></div>
                      
                      {/* Technical specifications overlay */}
                      <div className="absolute bottom-2 left-2 font-mono text-[9px] text-[#1a1a1a]/50 bg-white/70 px-2 py-0.5 rounded-sm">
                        {project.technicalCoordinations[0]}
                      </div>

                      {/* Mock drawing simulation */}
                      <div className="w-32 h-20 border border-[#282828]/35 border-dashed relative flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full border border-red-800/40 crosshair-element"></div>
                        <div className="absolute top-1 left-1 text-[8px] font-mono opacity-40">SYS_COR: 004</div>
                        <div className="absolute bottom-1 right-1 text-[8px] font-mono text-emerald-800 font-semibold">{project.technicalCoordinations[1]}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#5a5a40] uppercase tracking-widest block">
                          {category}
                        </span>
                        <h3 className="font-serif text-2xl group-hover:text-[#5a5a40] transition-colors">
                          {title}
                        </h3>
                      </div>

                      <p className="text-xs text-[#1a1a1a]/70 leading-relaxed font-sans line-clamp-3">
                        {summary}
                      </p>

                      <div className="border-t border-[#1a1a1a]/10 pt-4 flex items-center justify-between font-mono text-[11px] text-[#1a1a1a]/80">
                        <span className="opacity-60">{lang === "zh" ? "职能" : "ROLE"}: {role.split(" & ")[0]}</span>
                        <span className="flex items-center gap-1 text-[#5a5a40] font-bold group-hover:translate-x-1 transition-transform">
                          {t.viewDetails}
                          <ArrowUpRight size={13} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW 2: TACTILE PLAYGROUND / GRID LAB */}
          {activeTab === "lab" && (
            <div id="sandbox-view" className="bg-[#fafaf6] border border-[#1a1a1a]/20 p-4 md:p-8 paper-elevation-3 animate-fade-in">
              <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl text-[#1a1a1a] flex items-center gap-2">
                    <Sliders size={20} className="text-[#ab8c50]" />
                    {t.playgroundTitle}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      id="reset-playground-btn"
                      onClick={resetPlayground}
                      className="flex items-center gap-1.5 font-mono text-[11px] border border-[#1a1a1a]/20 hover:bg-[#1a1a1a] hover:text-[#f7f5ef] px-3 py-1.5 rounded-sm transition-all"
                    >
                      <RefreshCw size={11} />
                      {t.resetLayout}
                    </button>
                    <button
                      id="add-element-btn"
                      onClick={addNewElement}
                      className="flex items-center gap-1.5 font-mono text-[11px] bg-[#1a1a1a] text-[#f7f5ef] hover:bg-[#1a1a1a]/85 px-3 py-1.5 rounded-sm transition-all shadow-sm"
                    >
                      <Plus size={11} />
                      {t.addCard}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#1a1a1a]/70 max-w-3xl leading-relaxed">
                  {t.playgroundIntro}
                </p>
              </div>

              {/* Master layout split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Visual Draft Canvas stage - 2/3 columns wide */}
                <div className="lg:col-span-2 border-2 border-dashed border-[#1a1a1a]/25 bg-[#e8e6df]/30 relative rounded-sm h-[420px] overflow-hidden select-none draftsman-grid">
                  
                  {/* Outer ruler ticks along the border to emphasize blueprint drafting theme */}
                  <div className="absolute top-0 left-0 right-0 h-4 border-b border-[#1a1a1a]/10 bg-[#fafaf6]/80 flex justify-between px-4 font-mono text-[8px] text-[#1a1a1a]/40 items-center">
                    <span>0px</span>
                    <span>100px</span>
                    <span>200px</span>
                    <span>300px</span>
                    <span>400px</span>
                    <span>500px</span>
                  </div>
                  
                  {/* Drag-instruct watermark */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center space-y-1 opacity-25">
                    <div className="font-serif text-3xl italic tracking-tight text-[#1a1a1a]">Fibre Desk Grid</div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-[#1a1a1a]">Interactive Coordinate System // Canvas Plane</div>
                  </div>

                  {/* Render simulated physical paper cards */}
                  {elements.map((el) => {
                    const isSelected = selectedElementId === el.id;
                    const label = lang === "zh" ? el.labelZh : el.labelEn;
                    return (
                      <div
                        key={el.id}
                        id={`sandbox-element-${el.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedElementId(el.id);
                        }}
                        style={{
                          left: `${el.x}px`,
                          top: `${el.y}px`,
                          width: `${el.width}px`,
                          height: `${el.height}px`,
                          transform: `rotate(${el.rotate}deg)`,
                          backgroundColor: el.color,
                          zIndex: isSelected ? 40 : el.elevation + 10,
                        }}
                        className={`absolute cursor-pointer p-3 select-none flex flex-col justify-between transition-shadow duration-100 ${
                          isSelected 
                            ? "ring-2 ring-amber-600 ring-offset-1 shadow-lg" 
                            : ""
                        } border border-[#282828]`}
                      >
                        {/* Static shadow representation according to elevation level */}
                        <div className="absolute inset-0 pointer-events-none opacity-45 shadow-sm" style={{
                          boxShadow: `${el.elevation * 1.5}px ${el.elevation * 1.5}px 0px rgba(40,40,40,0.85)`
                        }}></div>

                        {/* Top alignment bar */}
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-[8px] text-[#282828]/45">
                            ID:_{el.id.slice(3, 8)}
                          </span>
                          <span className="font-mono text-[8px] text-[#282828]/50 uppercase">
                            z-idx: {el.elevation}
                          </span>
                        </div>

                        {/* Text and visual representations by type */}
                        <div className="my-auto space-y-1 text-[#282828]">
                          <p className="font-mono text-[10px] uppercase font-bold tracking-tight leading-tight line-clamp-2">
                            {label}
                          </p>
                          
                          {/* Inside block details depending on element type */}
                          {el.type === "header" && (
                            <div className="w-full h-1 bg-red-800/20 rounded-full"></div>
                          )}
                          {el.type === "hero-img" && (
                            <div className="w-full h-6 border border-dashed border-[#282828]/35 flex items-center justify-center">
                              <span className="text-[7px] font-mono text-amber-900/60 font-semibold">// RASTER_DRAFT</span>
                            </div>
                          )}
                          {el.type === "circular-tag" && (
                            <div className="rounded-full w-4 h-4 border border-[#282828]/45 flex items-center justify-center text-[7px] font-mono mx-auto">★</div>
                          )}
                        </div>

                        {/* Micro coordinates footer */}
                        <div className="flex justify-between items-center text-[7px] font-mono text-[#282828]/60 uppercase">
                          <span>w:{el.width} h:{el.height}</span>
                          <span className="font-bold">x:{el.x} y:{el.y}</span>
                        </div>

                        {/* Tiny drag pointers for tactile simulation */}
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-neutral-800 border border-[#f7f5ef] rounded-full opacity-35"></div>
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-neutral-800 border border-[#f7f5ef] rounded-full opacity-35"></div>
                      </div>
                    );
                  })}

                  {/* Mechanical coordinate feedback strip across the canvas base */}
                  <div className="absolute bottom-4 left-4 right-4 bg-[#1a1a1a] text-[#fafaf6] px-4 py-2 font-mono text-[9px] flex justify-between items-center rounded-sm shadow-md">
                    <span className="truncate">
                      {t.coordsFeedback}
                      {selectedElementId ? (
                        <span className="text-amber-400 font-bold">
                          ACTIVE_ELEMENT: "{elements.find(e => e.id === selectedElementId)?.labelEn}" [LAT_ANG: {elements.find(e => e.id === selectedElementId)?.rotate}° | ELEV_Z: {elements.find(e => e.id === selectedElementId)?.elevation}px]
                        </span>
                      ) : "STANDBY_ALIGN_MATRIX_A"}
                    </span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 coordinate-pulse"></span>
                      CALCOMP_OK
                    </span>
                  </div>

                  {/* Simplified D-PAD buttons for touch/click dragging simulation inside frames */}
                  <div className="absolute right-4 top-6 flex flex-col gap-1 bg-[#fafaf6] border border-[#282828] p-1.5 rounded-sm shadow-xs z-30">
                    <div className="text-[7px] font-mono text-center mb-0.5 opacity-65 uppercase">{lang === 'zh' ? '位移' : 'MOVE'}</div>
                    <div className="flex justify-center">
                      <button 
                        onClick={() => selectedElementId && moveElement(selectedElementId, 0, -15)}
                        disabled={!selectedElementId}
                        className="w-6 h-6 border border-[#282828] hover:bg-[#1a1a1a] hover:text-white disabled:opacity-20 flex items-center justify-center font-bold text-xs cursor-pointer select-none"
                      >
                        ▲
                      </button>
                    </div>
                    <div className="flex gap-1 justify-center">
                      <button 
                        onClick={() => selectedElementId && moveElement(selectedElementId, -15, 0)}
                        disabled={!selectedElementId}
                        className="w-6 h-6 border border-[#282828] hover:bg-[#1a1a1a] hover:text-white disabled:opacity-20 flex items-center justify-center font-bold text-xs cursor-pointer select-none"
                      >
                        ◀
                      </button>
                      <button 
                        onClick={() => selectedElementId && moveElement(selectedElementId, 15, 0)}
                        disabled={!selectedElementId}
                        className="w-6 h-6 border border-[#282828] hover:bg-[#1a1a1a] hover:text-white disabled:opacity-20 flex items-center justify-center font-bold text-xs cursor-pointer select-none"
                      >
                        ▶
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <button 
                        onClick={() => selectedElementId && moveElement(selectedElementId, 0, 15)}
                        disabled={!selectedElementId}
                        className="w-6 h-6 border border-[#282828] hover:bg-[#1a1a1a] hover:text-white disabled:opacity-20 flex items-center justify-center font-bold text-xs cursor-pointer select-none"
                      >
                        ▼
                      </button>
                    </div>
                  </div>

                </div>

                {/* Grid inspector and transform sliders panel - 1/3 cols wide */}
                <div className="space-y-6">
                  
                  {/* Card selector list */}
                  <div className="bg-[#e8e6df]/25 border border-[#1a1a1a]/15 p-4 rounded-sm">
                    <h4 className="font-mono text-xs font-bold tracking-wider mb-3 uppercase text-[#1a1a1a]/80 flex items-center justify-between">
                      <span>{t.elementSelector}</span>
                      <span className="text-[10px] font-normal text-emerald-800 tracking-normal font-sans">N = {elements.length}</span>
                    </h4>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {elements.map(el => {
                        const isSelected = selectedElementId === el.id;
                        return (
                          <div
                            key={el.id}
                            onClick={() => setSelectedElementId(el.id)}
                            className={`flex items-center justify-between p-2 rounded-sm cursor-pointer border text-xs font-mono transition-all ${
                              isSelected 
                                ? "bg-white border-[#282828] font-bold shadow-xs scale-[1.01]" 
                                : "bg-[#f1ebd9]/40 border-[#1a1a1a]/10 hover:bg-neutral-100"
                            }`}
                          >
                            <span className="truncate max-w-[130px]">{lang === "zh" ? el.labelZh : el.labelEn}</span>
                            <div className="flex items-center gap-1.5 font-sans">
                              <span className="font-mono text-[9px] text-[#1a1a1a]/50">[{el.x},{el.y}]</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeElement(el.id);
                                }}
                                className="text-red-700/60 hover:text-red-700 p-1.5 hover:bg-neutral-200/50 rounded-sm cursor-pointer"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active transformation params sliders */}
                  {selectedElementId ? (
                    (() => {
                      const activeEl = elements.find(e => e.id === selectedElementId);
                      if (!activeEl) return null;
                      return (
                        <div className="bg-white border text-[#1a1a1a] border-[#282828] p-5 rounded-sm shadow-sm space-y-4">
                          <div className="border-b border-[#282828]/10 pb-2">
                            <span className="text-[9px] font-mono text-[#5a5a40] uppercase tracking-widest">{t.customizingElement}</span>
                            <h4 className="font-serif text-lg font-bold truncate">
                              {lang === "zh" ? activeEl.labelZh : activeEl.labelEn}
                            </h4>
                          </div>

                          <div className="space-y-3 font-mono text-[11px]">
                            
                            {/* Width Slider */}
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="opacity-75">{t.width}</span>
                                <span className="font-bold fill-amber-700">{activeEl.width}px</span>
                              </div>
                              <input 
                                type="range" 
                                min="80" 
                                max="350" 
                                value={activeEl.width} 
                                onChange={(e) => updateSelectedElement("width", parseInt(e.target.value))}
                                className="w-full accent-[#5a5a40] h-1.5 bg-[#e8e6df] rounded-lg cursor-pointer"
                              />
                            </div>

                            {/* Height Slider */}
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="opacity-75">{t.height}</span>
                                <span className="font-bold">{activeEl.height}px</span>
                              </div>
                              <input 
                                type="range" 
                                min="40" 
                                max="220" 
                                value={activeEl.height} 
                                onChange={(e) => updateSelectedElement("height", parseInt(e.target.value))}
                                className="w-full accent-[#5a5a40] h-1.5 bg-[#e8e6df] rounded-lg cursor-pointer"
                              />
                            </div>

                            {/* Rotate Slider */}
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="opacity-75">{t.rotate}</span>
                                <span className="font-bold">{activeEl.rotate}°</span>
                              </div>
                              <input 
                                type="range" 
                                min="-25" 
                                max="25" 
                                value={activeEl.rotate} 
                                onChange={(e) => updateSelectedElement("rotate", parseInt(e.target.value))}
                                className="w-full accent-[#5a5a40] h-1.5 bg-[#e8e6df] rounded-lg cursor-pointer"
                              />
                            </div>

                            {/* Elevation Slider */}
                            <div className="space-y-1">
                              <div className="flex justify-between">
                                <span className="opacity-75">{t.elevation}</span>
                                <span className="font-bold">Layer {activeEl.elevation} (dx = {activeEl.elevation * 1.5}px)</span>
                              </div>
                              <input 
                                type="range" 
                                min="1" 
                                max="5" 
                                value={activeEl.elevation} 
                                onChange={(e) => updateSelectedElement("elevation", parseInt(e.target.value))}
                                className="w-full accent-[#5a5a40] h-1.5 bg-[#e8e6df] rounded-lg cursor-pointer"
                              />
                            </div>

                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="bg-[#fafaf6] border border-[#1a1a1a]/15 p-6 rounded-sm text-center py-10 font-mono text-xs text-[#1a1a1a]/50">
                      {lang === "zh" ? "请在左侧图表中择选任意一幅纤维板块以执行高精变维控制" : "Please select an organic cardboard piece within the canvas sheet to configure layout attributes."}
                    </div>
                  )}

                  {/* Craft metric logs */}
                  <div className="bg-amber-100/35 border border-dashed border-[#ab8c50]/55 p-4 rounded-sm space-y-2">
                    <h5 className="font-mono text-[10px] font-bold text-[#ab8c50] uppercase tracking-wider flex items-center gap-1.5">
                      <Info size={11} />
                      {lang === "zh" ? "纸上工艺对位注释" : "PRINTMAKING ALIGNMENT NOTE"}
                    </h5>
                    <p className="font-sans text-[11px] text-[#1a1a1a]/80 leading-relaxed">
                      {lang === "zh" 
                        ? "本实验室基于真正的 letterpress 金属模具重合度模拟。板块的层积度 elevation 在真实的叠压中能够带来明显的自然折光阴影(Skeuomorphic Natural Shadows)，这能消除数字屏幕冷冰冰的失重浮躁感。"
                        : "Our coordinate mechanics map to live plotter arms. Adjusting rotations mimics direct sheet layouts on tactile print presses. Notice the solid displacement shadows, creating tangible physical dimension without performance costs."}
                    </p>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* VIEW 3: AI GEMINI STUDIO CRITIQUE */}
          {activeTab === "ai" && (
            <div id="ai-view" className="bg-[#fafaf6] border border-[#1a1a1a]/20 p-6 md:p-8 paper-elevation-3 animate-fade-in">
              <div className="mb-6 space-y-2 border-b border-[#1a1a1a]/10 pb-4">
                <span className="font-mono text-[10px] text-amber-800 bg-amber-100/75 border border-amber-800/20 px-2.5 py-1 rounded-sm tracking-widest uppercase inline-block">
                  {lang === "en" ? "REMOTE COGNITIVE VECTOR GRAVER" : "远程审美测定智能探针 (HYBRID INTEGRATION)"}
                </span>
                <h3 className="font-serif text-3xl">
                  {t.critiqueHeading}
                </h3>
                <p className="text-xs text-[#1a1a1a]/75 max-w-3xl leading-relaxed">
                  {t.critiqueIntro}
                </p>
              </div>

              <div id="ai-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* User brief inputs - 5 columns */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs uppercase text-[#1a1a1a]/70 font-bold block">
                      {lang === "zh" ? "在此简述设计方案" : "CONCEPT BRIEF"}
                    </label>
                    <textarea
                      id="ai-concept-input"
                      rows={6}
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder={t.aiInputPlaceholder}
                      className="w-full bg-[#fcfcfa] text-[#1a1a1a] border border-[#1a1a1a]/25 rounded-sm p-3 text-xs md:text-sm font-sans placeholder:text-neutral-400 focus:outline-none focus:border-[#282828] focus:ring-1 focus:ring-[#282828] transition-all"
                    ></textarea>
                  </div>

                  <button
                    id="submit-ai-critique-btn"
                    onClick={requestAIEvaluation}
                    disabled={isCritiquing || !aiInput.trim()}
                    className={`w-full py-3.5 px-4 font-mono text-xs font-bold uppercase cursor-pointer rounded-sm border transition-all flex items-center justify-center gap-2 ${
                      isCritiquing || !aiInput.trim()
                        ? "bg-neutral-200 text-neutral-400 border-neutral-300 cursor-not-allowed"
                        : "bg-[#1a1a1a] text-[#fafaf6] border-[#1a1a1a] hover:bg-[#1a1a1a]/90 hover:-translate-y-0.5 shadow-md active:translate-y-0"
                    }`}
                  >
                    <Sparkles size={13} className="text-amber-400" />
                    <span>{isCritiquing ? (lang === "zh" ? "审美破译中..." : "Evaluating...") : t.getCritiqueBtn}</span>
                  </button>

                  {aiError && (
                    <div className="bg-red-50 border border-red-200 rounded-sm p-4 text-xs text-red-800 space-y-1.5">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertCircle size={14} className="text-red-700" />
                        <span>{lang === 'zh' ? '审美标定分析受阻' : 'CRITIQUE ENGINE DELAY'}</span>
                      </div>
                      <p className="font-sans text-[11px] leading-relaxed">
                        {aiError}
                      </p>
                    </div>
                  )}

                </div>

                {/* AI Critique Response Sheets - 7 columns */}
                <div className="lg:col-span-7 flex flex-col min-h-[350px]">
                  {isCritiquing ? (
                    <div className="flex-1 bg-white border border-dashed border-amber-900/40 rounded-sm flex flex-col items-center justify-center p-8 space-y-4 text-center">
                      <div className="relative">
                        <div className="w-12 h-12 border-4 border-[#e8e6df] border-t-amber-800 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center font-mono text-[9px]">AI</div>
                      </div>
                      <div className="space-y-1">
                        <p className="font-mono text-xs font-bold uppercase">{lang === "zh" ? "正在雕刻审美应力谱线" : "ENGRAVING STATIC FORCE COEFFICIENTS..."}</p>
                        <p className="font-sans text-[11px] text-[#1a1a1a]/60 leading-tight">
                          {lang === "zh" ? "深度判定折痕刚性与纤维克重配比..." : "Evaluating physical grain fibers, letterpress pressures, and typeface spatial contrasts..."}
                        </p>
                      </div>
                    </div>
                  ) : critiqueResult ? (
                    <div className="bg-white border-2 border-[#1a1a1a] rounded-sm p-5 space-y-6 shadow-md transition-all">
                      
                      {/* Top Header Card Info */}
                      <div className="grid grid-cols-2 gap-4 border-b border-neutral-200 pb-4">
                        
                        {/* Score Metric Card */}
                        <div className="space-y-1 border-r border-neutral-100 pr-4">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 block">{t.scoreCard}</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-serif text-4xl lg:text-5xl font-bold text-amber-950 tabular-nums">{critiqueResult.score}</span>
                            <span className="font-mono text-xs text-[#1a1a1a]/45">/ 100 RA</span>
                          </div>
                          
                          {/* Radial rating micro-bar */}
                          <div className="w-full bg-[#f1ebd9]/55 h-1.5 rounded-full overflow-hidden mt-2">
                            <div className="bg-[#44403c] h-full" style={{ width: `${critiqueResult.score}%` }}></div>
                          </div>
                        </div>

                        {/* Aesthetic specifiers */}
                        <div className="space-y-1.5">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 block">{t.keywordsCard}</span>
                          <div className="flex flex-wrap gap-1">
                            {critiqueResult.creativeKeywords.map((kw, idx) => (
                              <span key={idx} className="bg-amber-100/35 border border-amber-900/10 text-amber-900 font-mono text-[10px] px-2 py-0.5 rounded-full">
                                # {kw}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Content Toggle Tabs inside Sheet */}
                      <div className="space-y-4">
                        <div className="flex border-b border-neutral-200 gap-1">
                          {[
                            { id: "analysis", label: t.analysisTab },
                            { id: "recs", label: t.recsTab },
                            { id: "tactile", label: t.tactileTab }
                          ].map(tab => (
                            <button
                              key={tab.id}
                              id={`critique-tab-${tab.id}`}
                              onClick={() => setActiveCritiqueTab(tab.id as any)}
                              className={`px-3 py-2 font-mono text-[10px] uppercase cursor-pointer rounded-t-sm border-t border-x -mb-[1px] ${
                                activeCritiqueTab === tab.id
                                  ? "bg-white text-[#1a1a1a] border-neutral-200 font-bold border-b-white"
                                  : "bg-transparent text-neutral-400 border-transparent hover:text-neutral-700"
                              }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        {/* Tab contents */}
                        <div className="min-h-[160px] text-xs leading-relaxed text-[#1a1a1a]/95">
                          
                          {activeCritiqueTab === "analysis" && (
                            <div className="space-y-2 p-1.5">
                              <p className="font-sans whitespace-pre-line text-neutral-800">
                                {critiqueResult.conceptAnalysis}
                              </p>
                              <div className="font-mono text-[9px] text-[#282828]/50 uppercase mt-4">
                                EVALUATION_MATRIC_STABILITY / OK_COORD
                              </div>
                            </div>
                          )}

                          {activeCritiqueTab === "recs" && (
                            <div className="space-y-3 p-1.5">
                              <h5 className="font-mono text-[11px] font-bold text-amber-900 uppercase flex items-center gap-1.5">
                                <Sliders size={13} />
                                {lang === "zh" ? "工程落地微调指针" : "AESTHETIC GRID MODULATORS"}
                              </h5>
                              <ul className="space-y-2.5 font-sans text-neutral-800 pl-4 list-disc">
                                {critiqueResult.recommendations.map((rec, i) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {activeCritiqueTab === "tactile" && (
                            <div className="bg-amber-50/20 border border-amber-900/10 p-4 rounded-sm space-y-2 text-neutral-800">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-amber-900 rounded-full"></span>
                                <h5 className="font-serif text-sm font-bold text-amber-950">{lang === "zh" ? "纸性承印与加工指南" : "PAPER PULP GRAIN DIRECTIONS"}</h5>
                              </div>
                              <p className="font-sans leading-relaxed text-neutral-800">
                                {critiqueResult.tactileTip}
                              </p>
                            </div>
                          )}

                        </div>

                      </div>

                    </div>
                  ) : (
                    <div className="flex-1 bg-white border border-[#1a1a1a]/15 rounded-sm flex flex-col items-center justify-center p-8 space-y-4 text-center">
                      <Inbox size={40} className="text-neutral-300 stroke-1" />
                      <div className="space-y-1">
                        <p className="font-mono text-xs uppercase font-bold text-[#1a1a1a]/60">
                          {lang === "zh" ? "等待进行纸体审美雕塑" : "Awaiting geometric draft input"}
                        </p>
                        <p className="font-sans text-[11px] text-neutral-400 max-w-sm mx-auto leading-normal">
                          {lang === "zh"
                            ? "在左侧键入你想构思的海报、书籍或交互界面的纸张工艺与几何布局。双子座服务器将自动为您渲染高精密工艺方案。"
                            : "Enter a brief concept specification in the text area block and prompt the Gemini core engine. Your tactile blueprint feedback results populate instantly here."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* VIEW 4: COGNITIVE MATRIX // ABOUT */}
          {activeTab === "about" && (
            <div id="about-view" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
              
              {/* Creator Intro & text - 7 columns */}
              <div className="lg:col-span-7 bg-[#fafaf6] border border-[#1a1a1a]/20 p-6 md:p-10 paper-elevation-3 space-y-6">
                <span className="font-mono text-[9px] text-[#5a5a40] tracking-widest bg-[#efeade] uppercase border border-[#1a1a1a]/10 px-2.5 py-1.5 rounded-sm inline-block">
                  {lang === "en" ? "MEDITATION ON ARTISAN GRAINS" : "数实重力物理认知纪要 // AUTOBIOGRAPHY"}
                </span>

                <h3 className="font-serif text-3xl sm:text-4xl text-[#1a1a1a] leading-tight">
                  {t.aboutIntro}
                </h3>

                <div className="space-y-4 font-sans text-xs md:text-sm text-[#1a1a1a]/85 leading-relaxed">
                  <p>{t.aboutBody1}</p>
                  <p>{t.aboutBody2}</p>
                </div>

                {/* System Capabilities list */}
                <div className="border-t border-[#1a1a1a]/10 pt-6 space-y-4">
                  <h4 className="font-mono text-xs font-bold tracking-wider uppercase text-[#1a1a1a]/70">
                    // {t.skillsLabel}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: "Letterpress debossing mechanics", level: "94%" },
                      { name: "Responsive CSS grid coordinate maps", level: "98%" },
                      { name: "Node.js full-stack blueprint engines", level: "90%" },
                      { name: "Material touch-indicator architectures", level: "95%" }
                    ].map((cap, i) => (
                      <div key={i} className="space-y-1.5 font-mono text-[11px]">
                        <div className="flex justify-between items-center text-[#1a1a1a]">
                          <span>{cap.name}</span>
                          <span className="text-amber-800 font-bold">{cap.level}</span>
                        </div>
                        {/* Blueprint ruler bar representation */}
                        <div className="w-full bg-[#1a1a1a]/10 h-3 border border-[#1a1a1a]/15 relative">
                          <div className="bg-[#44403c] h-full" style={{ width: cap.level }}></div>
                          {/* Tiny tick marks on ruler */}
                          <div className="absolute inset-0 flex justify-between px-2 text-[6px] pointer-events-none opacity-20 text-white">
                            <span>|</span><span>|</span><span>|</span><span>|</span><span>|</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Chronicle catalog - 5 columns */}
              <div className="lg:col-span-5 bg-[#fafaf6] border border-[#1a1a1a]/25 p-6 paper-elevation-2 flex flex-col justify-between">
                
                <div className="space-y-4">
                  <h4 className="font-mono text-xs font-bold tracking-wider uppercase text-neutral-400 flex items-center gap-1.5">
                    <FileText size={13} className="text-[#ab8c50]" />
                    {t.experienceLabel}
                  </h4>

                  <div className="space-y-6 font-mono text-[11px] relative pl-4 before:content-[''] before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#282828]/25">
                    {[
                      {
                        year: "2025 - Present",
                        heading: "Principal Designer / Tactile Code Cohort",
                        body: "Bridging mechanical steel debossing vector algorithms with client-side interactive visual frames on unbleached pulp canvases."
                      },
                      {
                        year: "2023 - 2025",
                        heading: "Visual Architect // Milan Fine Print Labs",
                        body: "Investigated rigid origami mathematical algorithms for ultra-lux physical cosmetics boxes with high-contrast CAD grid alignments."
                      },
                      {
                        year: "2021 - 2023",
                        heading: "Creative Engineer / Zurich Layout Group",
                        body: "Programmed fluid, browser-based physical sandbox modules using native device canvas and deceleration calculations."
                      }
                    ].map((item, id) => (
                      <div key={id} className="relative space-y-1">
                        {/* Timeline node */}
                        <div className="absolute -left-[16.5px] top-1 w-2 h-2 rounded-full border border-neutral-900 bg-[#fafaf6]"></div>
                        <div className="text-amber-900 font-bold tracking-wide">{item.year}</div>
                        <div className="font-sans font-bold text-xs text-[#1a1a1a]">{item.heading}</div>
                        <div className="font-sans text-[11px] text-neutral-500 leading-normal">{item.body}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#1a1a1a]/10 pt-4 mt-6">
                  <div className="font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                    AESTHETIC COMMISSION OUTPOST
                  </div>
                  <p className="font-sans text-xs text-[#1a1a1a]/70 leading-relaxed mt-1">
                    {lang === 'zh' 
                      ? '我们常驻中国上海与欧洲苏黎世，可承接跨国全案品牌重构、实体/数码极高质媒介交互搭建。' 
                      : 'We maintain dual studios in Shanghai and Zurich. Intensely focused on physical-digital physical artifacts.'}
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

      </main>

      {/* FOOTER METADATA - Artistic Flair design requirement */}
      <footer id="main-footer" className="border-t border-[#1a1a1a]/15 bg-[#fafaf6] relative z-20 py-6 px-4 md:px-12 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 font-mono text-[10px] text-[#1a1a1a]/60">
          
          <div className="space-y-1">
            <span className="font-bold text-[#1a1a1a] uppercase">
              {lang === "en" ? "© Alexander Chen Studio / Curators of Gravity" : "© 纸上重力美学工作室Alexander Chen"}
            </span>
            <p className="opacity-75">
              ALL SPECIFICATIONS VERIFIED REAL TIME IN ACCORDANCE WITH KRAFT DRAFT STANDARD v26.04
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <div>
              <span className="opacity-45 mr-1">TYPE:</span>
              <span className="font-bold text-[#1a1a1a]">OTF Space Grotesk / JetBrains Mono</span>
            </div>
            <div>
              <span className="opacity-45 mr-1">CRAFT_INDEX:</span>
              <span className="font-bold text-[#1a1a1a]">0.96 (Tactile Match)</span>
            </div>
            <div>
              <span className="opacity-45 mr-1">COGNITIVE_GRID:</span>
              <span className="font-bold text-[#1a1a1a]">4x4 Bento Stack</span>
            </div>
            <div>
              <span className="opacity-45 mr-1">STATUS:</span>
              <span className="font-bold text-[#15803d]">VERIFIED</span>
            </div>
          </div>

        </div>
      </footer>

      {/* DRAWER / SPEC SHEET WINDOW DETAIL IF A CARD IS SELECTED */}
      {selectedProject && (
        <div id="project-detail-overlay" className="fixed inset-0 bg-[#1a1a1a]/55 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div 
            id="drawer-surface" 
            className="bg-[#fafaf6] border-3 border-[#1a1a1a] max-w-2xl w-full p-6 md:p-8 relative shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto"
          >
            {/* Corner align points to feel like blueprint graph */}
            <div className="absolute top-1 right-2 font-mono text-[9px] opacity-40 uppercase">EX_SPEC_0{selectedProject.id.slice(-2)}</div>
            
            <div className="space-y-6">
              
              {/* Top metadata strip */}
              <div className="flex items-center justify-between border-b border-[#1a1a1a]/15 pb-4">
                <div className="font-mono text-xs font-bold text-amber-900 bg-amber-100/35 border border-amber-900/10 px-2 py-1 rounded-sm">
                  {selectedProject.paperGrammage}
                </div>
                <div className="text-[11px] font-mono text-[#1a1a1a]/55">
                  YEAR // {selectedProject.year}
                </div>
              </div>

              {/* Title heading */}
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-amber-800 uppercase tracking-widest block">
                  {lang === "zh" ? selectedProject.categoryZh : selectedProject.categoryEn}
                </span>
                <h3 className="font-serif text-3xl md:text-4xl">
                  {lang === "zh" ? selectedProject.titleZh : selectedProject.titleEn}
                </h3>
              </div>

              {/* Interactive color swatch & dimension log card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-[#1a1a1a]/10 p-4 rounded-sm">
                
                <div className="space-y-1.5">
                  <span className="font-mono text-[9px] uppercase text-neutral-400 block">{t.specsTitle}</span>
                  
                  <div className="space-y-1 font-mono text-[10px] text-[#1a1a1a]/80">
                    <div className="flex justify-between border-b border-neutral-100 pb-0.5">
                      <span>{t.gridCoordsLabel}:</span>
                      <span className="font-bold text-[#1a1a1a]">{selectedProject.technicalCoordinations[0]}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-0.5">
                      <span>{lang === "zh" ? "工艺压力系数:" : "DIE PRESS COEFFICIENT:"}</span>
                      <span className="font-bold text-[#1a1a1a]">{selectedProject.technicalCoordinations[1]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{lang === "zh" ? "微雕对位标:" : "ROTATIONAL ANGLE LOG:"}</span>
                      <span className="font-bold text-[#1a1a1a]">{selectedProject.technicalCoordinations[2]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 border border-[#282828]/25 rounded-md shadow-sm relative flex items-center justify-center font-mono text-[8px]" 
                    style={{ backgroundColor: selectedProject.colorHex }}
                  >
                    <div className="absolute inset-0 opacity-15 pointer-events-none isometric-blueprint"></div>
                    CLR
                  </div>
                  <div className="space-y-0.5 font-mono text-[10px]">
                    <div className="font-bold">{selectedProject.colorHex}</div>
                    <div className="opacity-60">{selectedProject.paperGrammage.split(',')[1] || "Dry Matte Ink"}</div>
                  </div>
                </div>

              </div>

              {/* Details text paragraph */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wide">// CONCEPTUAL EXPOSITION</h4>
                <p className="text-xs md:text-sm leading-relaxed text-[#1a1a1a]/85 font-sans">
                  {lang === "zh" ? selectedProject.detailsZh : selectedProject.detailsEn}
                </p>
              </div>

              {/* Features list */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-wide">// KEY EMBOSS FEATURES</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#1a1a1a]/85 font-sans pl-4 list-disc">
                  {(lang === "zh" ? selectedProject.featuresZh : selectedProject.featuresEn).map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              </div>

              {/* Lower Retract close block */}
              <div className="border-t border-[#1a1a1a]/15 pt-5 flex justify-between items-center">
                <span className="font-mono text-[9px] text-neutral-400">INDEXED:_ST_REF04</span>
                <button
                  id="close-drawer-btn"
                  onClick={() => setSelectedProject(null)}
                  className="bg-[#1a1a1a] hover:bg-[#1a1a1a]/85 text-[#fafaf6] text-xs font-mono py-2.5 px-6 rounded-sm cursor-pointer border border-[#1a1a1a] transition-all paper-elevation-1"
                >
                  {t.close}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
