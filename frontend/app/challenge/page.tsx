'use client';
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Send, ChevronLeft, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function ChallengeDetail() {
  const [code, setCode] = useState('// Viết code của bạn tại đây...');

  return (
    <div className="h-screen flex flex-col bg-[#0d1117]">
      {/* Navbar nhỏ */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-slate-800 bg-slate-900">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white transition">
          <ChevronLeft size={20} /> <span className="text-sm">Quay lại Dashboard</span>
        </Link>
        <button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-md text-sm font-bold transition">
          <Send size={16} /> Nộp bài (On-chain)
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Bên trái: Đề bài */}
        <div className="w-1/3 p-6 overflow-y-auto border-r border-slate-800 text-slate-300">
          <h1 className="text-2xl font-bold text-white mb-4">A + B Problem</h1>
          <div className="prose prose-invert">
            <p>Viết chương trình nhập vào hai số nguyên $a$ và $b$. Tính tổng của chúng.</p>
            <h3 className="text-blue-400 mt-4">Input:</h3>
            <pre className="bg-slate-950 p-2 rounded">2 3</pre>
            <h3 className="text-blue-400 mt-4">Output:</h3>
            <pre className="bg-slate-950 p-2 rounded">5</pre>
          </div>
        </div>

        {/* Bên phải: Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex bg-slate-800/50 px-4 py-1 gap-2 border-b border-slate-800">
            <span className="text-xs text-blue-400 font-mono border-b border-blue-400 px-2 py-1">main.cpp</span>
          </div>
          <Editor
            height="100%"
            theme="vs-dark"
            defaultLanguage="cpp"
            value={code}
            onChange={(v) => setCode(v || '')}
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>
      </div>
    </div>
  );
}