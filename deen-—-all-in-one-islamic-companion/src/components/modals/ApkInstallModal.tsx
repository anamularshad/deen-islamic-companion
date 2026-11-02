import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  QrCode,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface ApkInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkInstallModal: React.FC<ApkInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [activeTab, setActiveTab] = useState<'instant' | 'apk' | 'capacitor'>('instant');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadManifest = async () => {
    try {
      const res = await fetch('/manifest.json');
      const text = await res.text();
      const blob = new Blob([text], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'manifest.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to download manifest', e);
    }
  };

  const handleCopyManifest = async () => {
    try {
      const res = await fetch('/manifest.json');
      const text = await res.text();
      navigator.clipboard.writeText(text);
      setCopiedManifest(true);
      setTimeout(() => setCopiedManifest(false), 2500);
    } catch (e) {
      console.error('Failed to copy manifest', e);
    }
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    }
  };

  // QR Code generator URL using public standard API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=ffffff&color=087F5B`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#19251F] w-full max-w-xl rounded-3xl shadow-2xl border border-[#E4EAE5] dark:border-[#23332B] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-br from-[#087F5B] to-[#064E3B] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Smartphone className="w-5 h-5 text-[#C9A45C]" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Test DEEN on Android
              </h3>
              <p className="text-xs text-white/80">
                Instant WebAPK, Standalone APK, or Native Android Project
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E4EAE5] dark:border-[#23332B] bg-[#F7F9F6] dark:bg-[#101A16] px-4 pt-2">
          {[
            { id: 'instant', label: '1. Instant WebAPK (Fastest)' },
            { id: 'apk', label: '2. Download Standalone APK' },
            { id: 'capacitor', label: '3. Capacitor / Source' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-[#087F5B] text-[#087F5B] dark:border-[#C9A45C] dark:text-[#C9A45C]'
                  : 'border-transparent text-[#68756E] dark:text-[#8E9D95] hover:text-[#17231F] dark:hover:text-[#E4EAE5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: Instant WebAPK */}
          {activeTab === 'instant' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#087F5B]/10 dark:bg-[#087F5B]/20 border border-[#087F5B]/20 text-[#064E3B] dark:text-[#C9A45C]">
                <div className="flex items-center gap-2 font-bold text-xs mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Official Android WebAPK Technology</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  Android with Google Play Services natively builds and installs a real
                  native APK whenever you install this web application from Chrome.
                  No manual sideloading or developer flags required!
                </p>
              </div>

              {/* Install Button if triggered on device */}
              {isInstallable && (
                <div className="text-center p-4 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40">
                  <p className="font-semibold text-xs text-emerald-900 dark:text-emerald-200 mb-2">
                    Ready to install on this device!
                  </p>
                  <button
                    onClick={handleInstallClick}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#087F5B] text-white font-bold text-xs shadow-md hover:bg-[#064E3B] active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install DEEN WebAPK Now</span>
                  </button>
                </div>
              )}

              {/* Mobile QR & Link Sharing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-[#F7F9F6] dark:bg-[#101A16] p-4 rounded-2xl border border-[#E4EAE5] dark:border-[#23332B]">
                <div className="flex flex-col items-center text-center">
                  <div className="p-2 bg-white rounded-xl shadow-xs border border-[#E4EAE5]">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code to test live"
                      className="w-32 h-32 rounded-lg"
                    />
                  </div>
                  <span className="mt-2 text-[10px] text-[#68756E] dark:text-[#8E9D95] font-medium flex items-center gap-1">
                    <QrCode className="w-3 h-3" />
                    Scan with Android Phone Camera
                  </span>
                </div>

                <div className="space-y-2.5">
                  <h4 className="font-bold text-xs text-[#17231F] dark:text-[#E4EAE5]">
                    Install on your Android Phone:
                  </h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-[#68756E] dark:text-[#8E9D95] leading-relaxed">
                    <li>Open this URL in Google Chrome on your phone.</li>
                    <li>Tap the <strong>three dots (⋮)</strong> menu in the top right.</li>
                    <li>Tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>.</li>
                    <li>Chrome creates and installs the <strong>DEEN WebAPK</strong> onto your app drawer!</li>
                  </ol>

                  <div className="pt-2">
                    <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] font-semibold text-xs text-[#17231F] dark:text-[#E4EAE5] hover:border-[#087F5B] transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied Link!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#087F5B]" />
                          <span>Copy Live App URL</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Download Standalone APK via PWABuilder */}
          {activeTab === 'apk' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 text-amber-900 dark:text-amber-300">
                <div className="flex items-center gap-2 font-bold text-xs mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Build Standalone .APK File (Google Play Ready)</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  You can convert this live PWA into a standalone downloadable <strong>.apk</strong> or <strong>.aab</strong> package using <strong>PWABuilder</strong> (Google &amp; Microsoft’s open-source packaging tool).
                </p>
              </div>

              {/* PWABuilder Manifest Actions Card */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
                    Your Complete PWA Manifest (manifest.json)
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#087F5B] text-white font-semibold">
                    100% Score Ready
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  If PWABuilder's external scanner says &quot;Create manifest&quot; or times out, it is because AI Studio's dev preview requires Google login cookies. Simply download or copy this manifest to upload/paste directly into PWABuilder:
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    onClick={handleDownloadManifest}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#087F5B] hover:bg-[#064E3B] text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download manifest.json</span>
                  </button>
                  <button
                    onClick={handleCopyManifest}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] font-semibold text-xs text-[#17231F] dark:text-[#E4EAE5] hover:border-[#087F5B] transition-colors"
                  >
                    {copiedManifest ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#087F5B]" />
                        <span>Copy Manifest JSON</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3 bg-[#F7F9F6] dark:bg-[#101A16] p-4 rounded-2xl border border-[#E4EAE5] dark:border-[#23332B]">
                <h4 className="font-bold text-xs text-[#17231F] dark:text-[#E4EAE5]">
                  Steps to generate your APK file:
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-[11px] text-[#68756E] dark:text-[#8E9D95] leading-relaxed">
                  <li>
                    Copy your live app URL: <code className="px-1.5 py-0.5 rounded bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] font-mono text-[10px] text-[#087F5B]">{currentUrl}</code>
                  </li>
                  <li>
                    Go to <strong>PWABuilder.com</strong> (Official PWA to APK packaging engine).
                  </li>
                  <li>
                    Paste your live URL and click <strong>&quot;Start&quot;</strong>.
                  </li>
                  <li>
                    If prompted to create or edit manifest, click <strong>&quot;Upload Manifest&quot;</strong> and select the <code>manifest.json</code> downloaded above.
                  </li>
                  <li>
                    Click <strong>&quot;Package for Stores&quot; &gt; &quot;Android&quot;</strong>.
                  </li>
                  <li>
                    Click <strong>&quot;Generate APK / Package&quot;</strong> to download your signed <code>.apk</code> file for instant installation on any Android phone!
                  </li>
                </ol>

                <div className="pt-2">
                  <a
                    href={`https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#087F5B] text-white font-bold text-xs hover:bg-[#064E3B] transition-all shadow-xs"
                  >
                    <span>Open PWABuilder to Generate .APK</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Capacitor Android Project */}
          {activeTab === 'capacitor' && (
            <div className="space-y-3">
              <p className="text-[#68756E] dark:text-[#8E9D95] leading-relaxed text-[11px]">
                If you are a developer and want to open this project in <strong>Android Studio</strong> to compile a custom debug or release APK with Gradle:
              </p>

              <div className="p-3.5 rounded-xl bg-[#101A16] text-[#E4EAE5] font-mono text-[11px] space-y-1.5 border border-[#23332B] overflow-x-auto">
                <p className="text-gray-400"># 1. Install Capacitor dependencies</p>
                <p className="text-emerald-400">npm install @capacitor/core @capacitor/cli @capacitor/android</p>
                <p className="text-gray-400 mt-2"># 2. Initialize Capacitor project</p>
                <p className="text-emerald-400">npx cap init &quot;DEEN&quot; &quot;com.deen.companion&quot;</p>
                <p className="text-gray-400 mt-2"># 3. Add Android platform &amp; sync assets</p>
                <p className="text-emerald-400">npm run build &amp;&amp; npx cap add android &amp;&amp; npx cap copy</p>
                <p className="text-gray-400 mt-2"># 4. Open Android Studio to build APK</p>
                <p className="text-emerald-400">npx cap open android</p>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#F7F9F6] dark:bg-[#101A16] border border-[#E4EAE5] dark:border-[#23332B]">
                <Layers className="w-4 h-4 text-[#087F5B] shrink-0" />
                <span className="text-[11px] text-[#68756E] dark:text-[#8E9D95]">
                  In Android Studio: Click <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F7F9F6] dark:bg-[#101A16] border-t border-[#E4EAE5] dark:border-[#23332B] flex items-center justify-between">
          <span className="text-[11px] text-[#68756E] dark:text-[#8E9D95]">
            Supports Android 8.0+ &amp; Chrome 76+
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white dark:bg-[#19251F] border border-[#E4EAE5] dark:border-[#23332B] font-semibold text-xs text-[#17231F] dark:text-[#E4EAE5] hover:bg-[#F7F9F6] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
