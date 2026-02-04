'use client';
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Send, ChevronLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useCurrentAccount } from '@mysten/dapp-kit';

export default function ChallengeDetail() {
  const [code, setCode] = useState('// Viết code của bạn tại đây...\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    cout << a + b;\n    return 0;\n}');
  const account = useCurrentAccount();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = () => {
    setStatus('submitting');
    // Giả lập nộp bài: Trong thực tế bạn sẽ lưu code vào database 
    // hoặc gửi một transaction "Submit" lên Sui.
    setTimeout(() => setStatus('success'), 2000);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0d1117]">
      <div className="flex items-center justify-between px-6 py-2 border-b border-slate-800 bg-slate-900">
        <Link href="/" className="flex items-center text-slate-400 hover:text-white transition">
          <ChevronLeft size={20} /> <span className="text-sm">Quay lại Dashboard</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {status === 'success' && (
            <span className="text-green-400 text-xs flex items-center gap-1">
              <CheckCircle size={14} /> Đã nộp bài thành công!
            </span>
          )}
          <button 
            onClick={handleSubmit}
            disabled={status === 'submitting'}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 text-white px-6 py-1.5 rounded-md text-sm font-bold transition shadow-lg shadow-green-900/20"
          >
            {status === 'submitting' ? "Đang kiểm tra..." : <><Send size={16} /> Nộp bài (Verify)</>}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 p-6 overflow-y-auto border-r border-slate-800 text-slate-300 bg-[#0d1117]">
          <div className="flex items-center gap-2 mb-4">
             <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/20">DỄ</span>
             <span className="text-slate-500 text-xs font-mono">ID: #001</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Bài toán: Tổng A + B</h1>
          <div className="prose prose-invert text-sm leading-relaxed">
            <p>Viết chương trình nhập vào hai số nguyên $a$ và $b$ từ bàn phím ($|a|, |b| < 10^9$).</p>
            <p>Hãy in ra tổng $a + b$.</p>
            
            <div className="mt-6 space-y-4">
               <div>
                  <h3 className="text-blue-400 text-xs font-bold uppercase mb-2">Ví dụ đầu vào:</h3>
                  <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-white">2 3</pre>
               </div>
               <div>
                  <h3 className="text-blue-400 text-xs font-bold uppercase mb-2">Ví dụ đầu ra:</h3>
                  <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-white">5</pre>
               </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex bg-slate-900 px-4 border-b border-slate-800">
            <div className="border-b-2 border-blue-500 px-4 py-2 text-xs text-blue-400 font-medium">
              solution.cpp
            </div>
          </div>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              theme="vs-dark"
              defaultLanguage="cpp"
              value={code}
              onChange={(v) => setCode(v || '')}
              options={{ 
                minimap: { enabled: false }, 
                fontSize: 15,
                padding: { top: 20 },
                fontFamily: 'Fira Code, monospace'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}