import React, { useState } from 'react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { KOTLIN_GRADLE_PROJECT_FILES, ProjectFile } from '../data/kotlinGradleBundle';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  Folder, 
  Workflow, 
  ShieldCheck, 
  Terminal, 
  Github, 
  Cpu, 
  Smartphone,
  ExternalLink
} from 'lucide-react';

interface GradleProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GradleProjectModal: React.FC<GradleProjectModalProps> = ({ isOpen, onClose }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'workflow' | 'gradle' | 'kotlin' | 'layout' | 'res'>('all');

  if (!isOpen) return null;

  const filteredFiles = KOTLIN_GRADLE_PROJECT_FILES.filter((f) => {
    if (activeTab === 'all') return true;
    return f.category === activeTab;
  });

  const currentFile: ProjectFile = filteredFiles[selectedFileIndex] || filteredFiles[0] || KOTLIN_GRADLE_PROJECT_FILES[0];

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const zip = new JSZip();

      // Add all project files into zip archive
      KOTLIN_GRADLE_PROJECT_FILES.forEach((f) => {
        zip.file(f.path, f.content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'XBoard-Keyboard-Android-Kotlin-Gradle-Project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      // Trigger confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Failed to create zip', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      id="gradle-project-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-fade-in"
    >
      <div
        id="gradle-project-modal-card"
        className="w-full max-w-6xl h-[90vh] bg-[#121216] border-2 border-[#07f57e] rounded-2xl flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="bg-[#18181f] px-4 py-3 flex items-center justify-between border-b border-[#252530] flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#07f57e] flex items-center justify-center text-black font-black text-sm shadow">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Android Kotlin App with Gradle &amp; GitHub Workflow
                </h3>
                <span className="px-2 py-0.5 bg-[#07f57e]/20 text-[#07f57e] text-[10px] font-mono font-bold rounded border border-[#07f57e]/30 flex items-center gap-1">
                  <Workflow className="w-3 h-3" />
                  GitHub Actions APK Ready
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                .kt, .xml, build.gradle.kts, .github/workflows/build-apk.yml
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-download-full-gradle-zip"
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="px-4 py-2 bg-[#07f57e] hover:bg-[#07f57e]/90 text-black font-extrabold text-xs rounded-xl transition active:scale-95 shadow-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Creating ZIP...' : 'Download Complete Project (.zip)'}</span>
            </button>

            <button
              id="btn-close-gradle-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#252532] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workflow Info Banner */}
        <div className="bg-[#0b1b12] border-b border-[#07f57e]/30 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-[#07f57e]">
            <Github className="w-4 h-4 shrink-0" />
            <span className="font-semibold">
              GitHub Workflow එක මඟින් කෙලින්ම APK Build කරන්න පුළුවන්:
            </span>
            <span className="text-neutral-300 hidden md:inline">
              Push to GitHub ➔ Actions tab ➔ Download APK Artifact
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-neutral-400">
            <span>Build: <strong className="text-white">./gradlew assembleDebug</strong></span>
            <span>Target: <strong className="text-[#07f57e]">Android 8.0+ (API 26)</strong></span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-[#141418] px-4 py-2 border-b border-[#22222a] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => { setActiveTab('all'); setSelectedFileIndex(0); }}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition cursor-pointer shrink-0 ${
              activeTab === 'all' ? 'bg-[#07f57e] text-black shadow' : 'text-neutral-400 hover:bg-[#1f1f28]'
            }`}
          >
            All Files ({KOTLIN_GRADLE_PROJECT_FILES.length})
          </button>
          <button
            onClick={() => { setActiveTab('workflow'); setSelectedFileIndex(0); }}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 shrink-0 ${
              activeTab === 'workflow' ? 'bg-[#07f57e] text-black shadow' : 'text-neutral-400 hover:bg-[#1f1f28]'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>GitHub Workflow</span>
          </button>
          <button
            onClick={() => { setActiveTab('gradle'); setSelectedFileIndex(0); }}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 shrink-0 ${
              activeTab === 'gradle' ? 'bg-[#07f57e] text-black shadow' : 'text-neutral-400 hover:bg-[#1f1f28]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Gradle Scripts (.kts)</span>
          </button>
          <button
            onClick={() => { setActiveTab('kotlin'); setSelectedFileIndex(0); }}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 shrink-0 ${
              activeTab === 'kotlin' ? 'bg-[#07f57e] text-black shadow' : 'text-neutral-400 hover:bg-[#1f1f28]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Kotlin Sources (.kt)</span>
          </button>
          <button
            onClick={() => { setActiveTab('layout'); setSelectedFileIndex(0); }}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition cursor-pointer flex items-center gap-1 shrink-0 ${
              activeTab === 'layout' ? 'bg-[#07f57e] text-black shadow' : 'text-neutral-400 hover:bg-[#1f1f28]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>XML Layouts</span>
          </button>
          <button
            onClick={() => { setActiveTab('res'); setSelectedFileIndex(0); }}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition cursor-pointer shrink-0 ${
              activeTab === 'res' ? 'bg-[#07f57e] text-black shadow' : 'text-neutral-400 hover:bg-[#1f1f28]'
            }`}
          >
            Resources &amp; Colors
          </button>
        </div>

        {/* Modal Body: File Tree Sidebar & Code Viewer */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* File List Sidebar */}
          <div className="w-full md:w-72 bg-[#101014] border-r border-[#22222a] p-2 overflow-y-auto scrollbar-thin">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-2 py-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Folder className="w-3.5 h-3.5 text-[#07f57e]" />
                <span>Files in category ({filteredFiles.length})</span>
              </span>
            </div>
            <div className="space-y-1">
              {filteredFiles.map((f, idx) => (
                <button
                  key={f.path}
                  id={`project-file-${idx}`}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left p-2 rounded-lg transition flex items-center gap-2 cursor-pointer ${
                    (filteredFiles[selectedFileIndex]?.path === f.path)
                      ? 'bg-[#07f57e]/15 border border-[#07f57e] text-white'
                      : 'bg-transparent text-neutral-400 hover:bg-[#1a1a22] hover:text-neutral-200'
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 shrink-0 ${filteredFiles[selectedFileIndex]?.path === f.path ? 'text-[#07f57e]' : 'text-neutral-500'}`} />
                  <div className="truncate">
                    <span className="text-xs font-mono font-medium block truncate">
                      {f.filename}
                    </span>
                    <span className="text-[10px] text-neutral-500 block truncate">
                      {f.path}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col bg-[#0b0b0e] overflow-hidden">
            <div className="px-4 py-2.5 bg-[#141418] border-b border-[#202028] flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-col">
                <span className="text-xs font-mono text-[#07f57e] font-semibold flex items-center gap-1.5">
                  <FileCode className="w-4 h-4" />
                  {currentFile.path}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {currentFile.description}
                </span>
              </div>

              <button
                id="btn-copy-code-content"
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg bg-[#202028] hover:bg-[#282834] text-xs font-semibold text-white flex items-center gap-1.5 transition active:scale-95 border border-[#2d2d38] cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#07f57e]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy File Content'}</span>
              </button>
            </div>

            <pre className="flex-1 p-4 text-xs font-mono text-neutral-200 overflow-auto scrollbar-thin leading-relaxed selection:bg-[#07f57e] selection:text-black">
              <code>{currentFile.content}</code>
            </pre>
          </div>
        </div>

        {/* Modal Footer Quick Actions & Instructions */}
        <div className="px-4 py-2.5 bg-[#14141a] border-t border-[#252530] text-[11px] text-neutral-400 flex items-center justify-between font-mono flex-wrap gap-2">
          <span>Gradle wrapper &amp; workflow included: Ready to push to GitHub</span>
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Run command:</span>
            <code className="bg-black/60 px-2 py-0.5 rounded border border-[#2e2e38] text-[#07f57e]">
              ./gradlew assembleDebug
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};
