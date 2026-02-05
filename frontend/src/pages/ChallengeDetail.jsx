import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext.jsx';

const ChallengeDetail = () => {
  const { id } = useParams();
  const { profile } = useStudent();
  
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
  }, [id]);

  const handleSubmit = async () => {
    setStatus("submitting");
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: profile.id,
          challenge_id: id,
          source_code: code,
          language: challenge?.language
        })
      });
      
      const result = await response.json();
      if (result.success) setStatus("success");
      else setStatus("error");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8 h-screen">
      <div className="overflow-y-auto bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-black">{challenge?.name || "Đang tải tên bài..."}</h2>
        <div className="flex gap-2 my-4">
          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
            {challenge?.point_value} Points
          </span>
        </div>
        <div className="prose text-slate-600">
          <p>Cho một mảng số nguyên, hãy tính tổng...</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex-1 bg-slate-900 rounded-2xl overflow-hidden border-4 border-slate-800">
           <textarea 
             className="w-full h-full bg-transparent text-white p-4 font-mono outline-none"
             value={code}
             onChange={(e) => setCode(e.target.value)}
             placeholder="// Viết code của bạn ở đây..."
           />
        </div>

        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
          <div className="text-sm font-medium">
            {status === "submitting" && <span className="text-blue-500 animate-pulse">⏳ Đang chấm bài...</span>}
            {status === "success" && <span className="text-emerald-500">✅ Chính xác! +{challenge?.point_value}đ</span>}
            {status === "error" && <span className="text-red-500">❌ Sai kết quả hoặc lỗi server.</span>}
          </div>
          
          <button 
            onClick={handleSubmit}
            disabled={status === "submitting"}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition"
          >
            NỘP BÀI
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;