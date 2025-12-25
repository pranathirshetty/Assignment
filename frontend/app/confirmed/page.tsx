"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Confirmed() {
  const router = useRouter();
  const params = useSearchParams();

  const type = params.get("type") || "Counter";
  const tableNo =
    type === "Table" ? Math.floor(Math.random() * 20) + 1 : "—";

  const [wait, setWait] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setWait((w) => (w > 0 ? w - 1 : 0));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-50">
      <div className="bg-white p-10 rounded-[2.8rem] shadow-2xl w-full max-w-md text-center border border-orange-100">
        
        <div className="text-7xl mb-4 animate-bounce">🍽️</div>

        <h1 className="text-3xl font-black text-orange-600 mb-8 tracking-tight">
          Order Confirmed!
        </h1>

        <div className="space-y-6 text-left border-y border-dashed py-6 mb-8 font-semibold text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Dining Type</span>
            <span className="text-gray-800">{type}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400">Table Number</span>
            <span className="text-4xl font-black text-blue-600">
              {tableNo}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Estimated Wait</span>
            <span className="text-green-600 font-bold">{wait} mins</span>
          </div>
        </div>

        <button
          onClick={() => router.push("/billing")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-xl shadow-xl transition transform hover:scale-[1.02]"
        >
          GENERATE BILL 🧾
        </button>
      </div>
    </div>
  );
}
