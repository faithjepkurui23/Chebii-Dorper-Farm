import React, { useState, useEffect } from 'react';
import { 
  X, 
  CloudSun, 
  Globe, 
  Sparkles, 
  Server, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Cpu, 
  Zap,
  RefreshCw,
  Rocket
} from 'lucide-react';
import { fetchItenWeather, fetchFreeExchangeRates, ItenWeatherData, FreeExchangeRates } from '../services/freeApis';

interface FreeApisAndDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FreeApisAndDeployModal: React.FC<FreeApisAndDeployModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'apis' | 'deploy'>('apis');
  const [weather, setWeather] = useState<ItenWeatherData | null>(null);
  const [rates, setRates] = useState<FreeExchangeRates | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [w, r] = await Promise.all([
        fetchItenWeather(),
        fetchFreeExchangeRates()
      ]);
      setWeather(w);
      setRates(r);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
              <Zap className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-white">Free APIs & Production Hosting</h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/40 uppercase">
                  100% Free
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Zero paid subscriptions or credit card requirements to host and run
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 border-b border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveTab('apis')}
            className={`pb-3 px-3 text-xs font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'apis'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudSun className="w-4 h-4" />
            <span>Active Free APIs</span>
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`pb-3 px-3 text-xs font-bold transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
              activeTab === 'deploy'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Rocket className="w-4 h-4" />
            <span>Deploy to Production (Free)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1">
          {activeTab === 'apis' ? (
            <div className="space-y-4">
              {/* Guarantee Banner */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-emerald-300">
                    Host anywhere with 0 USD / 0 KES API costs
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    This project uses open public APIs that require no billing accounts, no paid tokens, and no credit cards. Everything functions out of the box with zero setup hurdles.
                  </p>
                </div>
              </div>

              {/* 1. Open-Meteo Free Weather API */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <CloudSun className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        Iten Highland Live Weather
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                          NO KEY NEEDED
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400">Powered by Open-Meteo Free Open-Source API</p>
                    </div>
                  </div>
                  <button
                    onClick={loadData}
                    disabled={isLoading}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Refresh live weather"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
                  </button>
                </div>

                {weather && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Temperature</span>
                      <span className="text-base font-bold text-amber-400">{weather.temperature}°C</span>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Humidity</span>
                      <span className="text-base font-bold text-sky-300">{weather.humidity}%</span>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Highland Elevation</span>
                      <span className="text-base font-bold text-emerald-400">{weather.elevation}</span>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">Conditions</span>
                      <span className="text-xs font-semibold text-white truncate block mt-0.5">{weather.condition}</span>
                    </div>
                  </div>
                )}
                {weather?.livestockAdvice && (
                  <div className="text-[11px] bg-sky-950/40 text-sky-200 border border-sky-800/40 p-2.5 rounded-xl">
                    <span className="font-bold text-amber-300">🐑 Dorper Health Insight: </span>
                    {weather.livestockAdvice}
                  </div>
                )}
              </div>

              {/* 2. Free Exchange Rates API */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white flex items-center gap-2">
                        Live Multi-Currency Rates (KES / USD / EUR)
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                          NO KEY NEEDED
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400">Powered by Open Exchange Rate API (open.er-api.com)</p>
                    </div>
                  </div>
                </div>

                {rates && (
                  <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">1 USD</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono">
                        ≈ {(1 / rates.rates.USD).toFixed(1)} KES
                      </span>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">1 EUR</span>
                      <span className="text-sm font-bold text-sky-400 font-mono">
                        ≈ {(1 / rates.rates.EUR).toFixed(1)} KES
                      </span>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-700">
                      <span className="text-slate-400 block text-[10px]">1 GBP</span>
                      <span className="text-sm font-bold text-purple-400 font-mono">
                        ≈ {(1 / rates.rates.GBP).toFixed(1)} KES
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Gemini Free Tier & Offline Engine */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      Google AI Studio Gemini API (100% Free Tier)
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-mono">
                        FREE TIER
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Works on the free tier at aistudio.google.com + built-in offline livestock rule engine fallback
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                  If you deploy without setting a <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded font-mono text-[11px]">GEMINI_API_KEY</code>, the application automatically runs the Chebii Dorper Agronomist Offline Rule Engine. No deployment crashes, no 500 errors!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                You can host this project completely for free on popular hosting platforms. Pre-configured files (<code className="text-emerald-400">vercel.json</code> and <code className="text-emerald-400">public/_redirects</code>) are already in your repository!
              </p>

              {/* Option A: Vercel */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs border border-slate-600">
                      ▲
                    </div>
                    <span className="font-bold text-sm text-white">Vercel (Recommended - 100% Free)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('npx vercel --prod', 'vercel')}
                    className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer"
                  >
                    {copiedSection === 'vercel' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === 'vercel' ? 'Copied!' : 'Copy Command'}</span>
                  </button>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl font-mono text-xs text-emerald-400 flex items-center justify-between">
                  <span>npx vercel --prod</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1 list-disc pl-4">
                  <li>Push your code to GitHub, connect to Vercel, and click <strong>Deploy</strong>.</li>
                  <li>Build Command: <code className="text-amber-300">npm run build</code></li>
                  <li>Output Directory: <code className="text-amber-300">dist</code></li>
                  <li>Free SSL certificate and global CDN included automatically.</li>
                </ul>
              </div>

              {/* Option B: Netlify */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs border border-teal-500/40">
                      N
                    </div>
                    <span className="font-bold text-sm text-white">Netlify (100% Free)</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('npm run build', 'netlify')}
                    className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-bold bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer"
                  >
                    {copiedSection === 'netlify' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === 'netlify' ? 'Copied!' : 'Copy Build'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Run <code className="text-amber-300 font-mono">npm run build</code>, then drag and drop the <code className="text-amber-300 font-mono">dist</code> folder into <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-emerald-400 underline">Netlify Drop</a>. The included <code className="text-amber-300 font-mono">public/_redirects</code> file ensures all SPA routes load smoothly.
                </p>
              </div>

              {/* Option C: Render / Railway */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/40">
                    <Server className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-sm text-white">Render / Railway (Node Full-Stack)</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl font-mono text-xs text-amber-300 space-y-1">
                  <div>Build Command: <span className="text-slate-300">npm run build</span></div>
                  <div>Start Command: <span className="text-slate-300">npm start</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Zero paid lock-in • Ready for deployment</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
