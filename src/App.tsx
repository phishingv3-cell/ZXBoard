import React, { useState } from 'react';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { AdModal } from './components/AdModal';
import { GradleProjectModal } from './components/GradleProjectModal';
import { 
  Smartphone, 
  Workflow, 
  Tv, 
  Sparkles, 
  Check, 
  Copy, 
  Scissors, 
  FileText, 
  Trash2, 
  CheckCheck,
  MessageSquare,
  FileEdit,
  ShieldCheck,
  Github,
  Download,
  Code
} from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
}

export default function App() {
  const [text, setText] = useState<string>('Hello X Board ');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);
  const [inputMode, setInputMode] = useState<'send' | 'multiline'>('send');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      text: 'Welcome to X Board Keyboard for Android 8.0+! 🚀',
      timestamp: '10:42 AM'
    },
    {
      id: 'm-2',
      text: '🌸 සුභ •~°• උදෑසනක් •~°• 🌸',
      timestamp: '10:43 AM'
    }
  ]);

  const [clipboardHistory, setClipboardHistory] = useState<string[]>([
    '🌸 සුභ •~°• උදෑසනක් •~°• 🌸',
    'X Board Custom Engine',
    'Hello World'
  ]);

  const [isAdModalOpen, setIsAdModalOpen] = useState<boolean>(false);
  const [adActionType, setAdActionType] = useState<'enable' | 'select'>('enable');
  const [isKeyboardEnabled, setIsKeyboardEnabled] = useState<boolean>(true);
  const [isKeyboardSelected, setIsKeyboardSelected] = useState<boolean>(true);
  const [isGradleModalOpen, setIsGradleModalOpen] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleOpenAdForAction = (action: 'enable' | 'select') => {
    setAdActionType(action);
    setIsAdModalOpen(true);
  };

  const handleAdFinished = () => {
    setIsAdModalOpen(false);
    if (adActionType === 'enable') {
      setIsKeyboardEnabled(true);
      showToast('X Board Keyboard Enabled in System Settings!');
    } else {
      setIsKeyboardSelected(true);
      showToast('X Board Keyboard Selected as Default IME!');
    }
  };

  const handleUpdateText = (newText: string) => {
    setText(newText);
  };

  const handleTriggerEnterAction = () => {
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setText('');
    setSelectionRange(null);
    showToast('Message sent via X Board Enter key');
  };

  const handleSelectAll = () => {
    if (text.length > 0) {
      setSelectionRange({ start: 0, end: text.length });
      showToast('All text selected (Press ⌫ to clear)');
    }
  };

  const handleCopy = () => {
    let toCopy = text;
    if (selectionRange && selectionRange.end > selectionRange.start) {
      toCopy = text.slice(selectionRange.start, selectionRange.end);
    }
    if (toCopy.trim()) {
      setClipboardHistory((prev) => [toCopy, ...prev.filter((c) => c !== toCopy)]);
      navigator.clipboard?.writeText(toCopy).catch(() => {});
      showToast('Copied to Clipboard!');
    }
  };

  const handleCut = () => {
    if (selectionRange && selectionRange.end > selectionRange.start) {
      const selected = text.slice(selectionRange.start, selectionRange.end);
      setClipboardHistory((prev) => [selected, ...prev.filter((c) => c !== selected)]);
      navigator.clipboard?.writeText(selected).catch(() => {});

      const before = text.slice(0, selectionRange.start);
      const after = text.slice(selectionRange.end);
      setText(before + after);
      setSelectionRange(null);
      showToast('Cut to Clipboard!');
    } else if (text.length > 0) {
      setClipboardHistory((prev) => [text, ...prev.filter((c) => c !== text)]);
      navigator.clipboard?.writeText(text).catch(() => {});
      setText('');
      showToast('Cut to Clipboard!');
    }
  };

  const handlePaste = async () => {
    let clipText = clipboardHistory[0] || '';
    try {
      if (navigator.clipboard) {
        const sysClip = await navigator.clipboard.readText();
        if (sysClip) clipText = sysClip;
      }
    } catch {}

    if (clipText) {
      if (selectionRange && selectionRange.end > selectionRange.start) {
        const before = text.slice(0, selectionRange.start);
        const after = text.slice(selectionRange.end);
        setText(before + clipText + after);
        setSelectionRange(null);
      } else {
        setText((prev) => prev + clipText);
      }
      showToast('Pasted text from Clipboard');
    }
  };

  const handleClear = () => {
    setText('');
    setSelectionRange(null);
    showToast('Text cleared');
  };

  return (
    <div
      id="xboard-app-container"
      className="min-h-screen bg-[#000000] text-white flex flex-col justify-between font-sans selection:bg-[#07f57e] selection:text-black"
    >
      {/* 1. TOP HEADER */}
      <header
        id="app-main-header"
        className="bg-[#121214] border-b border-[#202026] px-4 py-3 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#07f57e] flex items-center justify-center text-black font-black text-xl shadow-[0_0_15px_rgba(7,245,126,0.35)]">
            X
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white tracking-wider">
                X BOARD KEYBOARD
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#07f57e]/15 text-[#07f57e] text-[10px] font-mono font-bold border border-[#07f57e]/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Kotlin &amp; Gradle (API 26+)
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Android Virtual Keyboard • 24 Fonts • 20 Styles • GitHub Actions APK Build
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-app-enable-keyboard"
            onClick={() => handleOpenAdForAction('enable')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow active:scale-95 ${
              isKeyboardEnabled
                ? 'bg-[#1e1e26] text-neutral-300 border border-[#2d2d38] hover:border-[#07f57e]'
                : 'bg-[#07f57e] text-black hover:bg-[#07f57e]/90'
            }`}
            title="Enable Keyboard in Android Settings (Plays Ad)"
          >
            <Tv className="w-3.5 h-3.5 text-[#07f57e]" />
            <span>{isKeyboardEnabled ? 'Keyboard Enabled ✓' : '1. Enable Keyboard (Ad)'}</span>
          </button>

          <button
            id="btn-app-select-keyboard"
            onClick={() => handleOpenAdForAction('select')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow active:scale-95 ${
              isKeyboardSelected
                ? 'bg-[#1e1e26] text-neutral-300 border border-[#2d2d38] hover:border-[#07f57e]'
                : 'bg-[#07f57e] text-black hover:bg-[#07f57e]/90'
            }`}
            title="Select X Board as Active Keyboard (Plays Ad)"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#07f57e]" />
            <span>{isKeyboardSelected ? 'X Board Selected ✓' : '2. Select Keyboard (Ad)'}</span>
          </button>

          <button
            id="btn-app-view-gradle-project"
            onClick={() => setIsGradleModalOpen(true)}
            className="px-4 py-1.5 rounded-lg bg-[#07f57e] hover:bg-[#07f57e]/90 text-black text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95"
            title="GitHub Workflow & Gradle Kotlin Project (.kt, .xml, build.gradle.kts)"
          >
            <Workflow className="w-4 h-4" />
            <span>GitHub Workflow &amp; Gradle Project</span>
          </button>
        </div>
      </header>

      {/* 2. GITHUB ACTIONS BANNER */}
      <div className="bg-gradient-to-r from-[#0d1f14] via-[#12281a] to-[#0a180f] border-b border-[#07f57e]/30 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#07f57e]/20 text-[#07f57e] flex items-center justify-center border border-[#07f57e]/40">
            <Github className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-[#07f57e]">GitHub Actions Workflow Included:</span>{' '}
            <span className="text-neutral-200">
              Push කරනකොට GitHub Workflow එකෙන් APK එක compile කරල Artifacts වලට බාගත කරන්න දෙයි!
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsGradleModalOpen(true)}
          className="text-xs text-[#07f57e] hover:underline font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>View .github/workflows &amp; Code</span>
          <span>➔</span>
        </button>
      </div>

      {/* 3. MAIN INTERACTION WORKSPACE */}
      <main
        id="app-main-workspace"
        className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-5 flex flex-col justify-between gap-4"
      >
        {/* UPPER SECTION: Phone Simulator & Messaging Arena */}
        <div className="flex flex-col bg-[#121214] rounded-2xl border border-[#202026] overflow-hidden shadow-xl">
          <div className="px-4 py-2.5 bg-[#18181f] border-b border-[#202026] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#07f57e] animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Active Typing Arena
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#101012] p-1 rounded-xl border border-[#252530]">
              <button
                id="btn-mode-send-chat"
                onClick={() => setInputMode('send')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer ${
                  inputMode === 'send'
                    ? 'bg-[#07f57e] text-black shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>Chat Mode (Enter = Send ➔)</span>
              </button>
              <button
                id="btn-mode-multiline-notes"
                onClick={() => setInputMode('multiline')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer ${
                  inputMode === 'multiline'
                    ? 'bg-[#07f57e] text-black shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <FileEdit className="w-3 h-3" />
                <span>Notes Mode (Enter = Newline ↵)</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Feed */}
          {inputMode === 'send' && (
            <div
              id="chat-message-feed"
              className="max-h-44 overflow-y-auto p-3 space-y-2 bg-[#0c0c0e] border-b border-[#1c1c24] scrollbar-thin"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="flex justify-end"
                >
                  <div className="max-w-[85%] bg-[#1a1a22] border border-[#252532] text-white px-3.5 py-2 rounded-2xl rounded-tr-sm shadow flex flex-col">
                    <span className="text-sm font-medium break-words select-text">
                      {m.text}
                    </span>
                    <span className="text-[9px] text-neutral-400 text-right mt-1 font-mono">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Text Input Target Box */}
          <div className="p-4 bg-[#141418] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Type below using the X Board Keyboard:</span>
              <span className="font-mono text-[#07f57e]">
                {text.length} characters
              </span>
            </div>

            {/* Target Display Text Area */}
            <div
              id="active-target-text-display"
              className="w-full min-h-[70px] max-h-36 overflow-y-auto p-3 rounded-xl bg-[#0a0a0c] border-2 border-[#202026] text-white font-medium text-base relative outline-none focus:border-[#07f57e] scrollbar-thin select-text whitespace-pre-wrap leading-relaxed"
            >
              {selectionRange && selectionRange.end > selectionRange.start ? (
                <>
                  <span>{text.slice(0, selectionRange.start)}</span>
                  <mark className="bg-[#07f57e] text-black rounded px-0.5">
                    {text.slice(selectionRange.start, selectionRange.end)}
                  </mark>
                  <span>{text.slice(selectionRange.end)}</span>
                </>
              ) : text ? (
                <span>{text}</span>
              ) : (
                <span className="text-neutral-600 italic">
                  Tap keyboard keys below to type in English with fancy fonts and styles...
                </span>
              )}
              <span className="inline-block w-2 h-5 bg-[#07f57e] align-middle ml-0.5 animate-pulse" />
            </div>

            {/* Quick Action Toolbar: Select All, Copy, Cut, Paste, Clear */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <button
                id="btn-quick-select-all"
                onClick={handleSelectAll}
                className="px-2.5 py-1 rounded-lg bg-[#202028] hover:bg-[#282834] text-xs font-semibold text-white flex items-center gap-1 border border-[#2d2d38] active:scale-95 transition cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5 text-[#07f57e]" />
                <span>Select All</span>
              </button>
              <button
                id="btn-quick-copy"
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg bg-[#202028] hover:bg-[#282834] text-xs font-semibold text-white flex items-center gap-1 border border-[#2d2d38] active:scale-95 transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-[#07f57e]" />
                <span>Copy</span>
              </button>
              <button
                id="btn-quick-cut"
                onClick={handleCut}
                className="px-2.5 py-1 rounded-lg bg-[#202028] hover:bg-[#282834] text-xs font-semibold text-white flex items-center gap-1 border border-[#2d2d38] active:scale-95 transition cursor-pointer"
              >
                <Scissors className="w-3.5 h-3.5 text-[#07f57e]" />
                <span>Cut</span>
              </button>
              <button
                id="btn-quick-paste"
                onClick={handlePaste}
                className="px-2.5 py-1 rounded-lg bg-[#202028] hover:bg-[#282834] text-xs font-semibold text-white flex items-center gap-1 border border-[#2d2d38] active:scale-95 transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#07f57e]" />
                <span>Paste</span>
              </button>
              <button
                id="btn-quick-clear"
                onClick={handleClear}
                className="px-2.5 py-1 rounded-lg bg-[#202028] hover:bg-red-950 text-xs font-semibold text-neutral-400 hover:text-red-400 flex items-center gap-1 border border-[#2d2d38] active:scale-95 transition cursor-pointer ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>

        {/* LOWER SECTION: THE ACTUAL VIRTUAL KEYBOARD ENGINE */}
        <div className="flex flex-col rounded-2xl overflow-hidden border border-[#202026] shadow-2xl">
          <VirtualKeyboard
            inputText={text}
            onUpdateText={handleUpdateText}
            onTriggerEnterAction={handleTriggerEnterAction}
            onOpenSettingsAd={handleOpenAdForAction}
            inputMode={inputMode}
            clipboardHistory={clipboardHistory}
            onAddToClipboard={(clip) =>
              setClipboardHistory((prev) => [clip, ...prev.filter((c) => c !== clip)])
            }
            onClearClipboard={() => setClipboardHistory([])}
            selectionRange={selectionRange}
            onSetSelectionRange={setSelectionRange}
          />
        </div>
      </main>

      {/* 4. FOOTER INFO */}
      <footer className="bg-[#0e0e10] border-t border-[#1a1a20] px-4 py-2.5 text-center text-xs text-neutral-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[#07f57e] font-bold">X Board Engine</span>
          <span>•</span>
          <span>Package: com.xboard.keyboard</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Gradle 8.5 • Kotlin 1.9+ • GitHub Actions CI/CD</span>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="xboard-status-toast"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#07f57e] text-black font-bold text-xs rounded-full shadow-[0_0_20px_rgba(7,245,126,0.4)] flex items-center gap-2 animate-bounce"
        >
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* AdMob Simulator */}
      <AdModal
        isOpen={isAdModalOpen}
        onClose={handleAdFinished}
        actionType={adActionType}
      />

      {/* Gradle Project & GitHub Workflow Explorer Modal */}
      <GradleProjectModal
        isOpen={isGradleModalOpen}
        onClose={() => setIsGradleModalOpen(false)}
      />
    </div>
  );
}
