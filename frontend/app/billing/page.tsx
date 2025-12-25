"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Billing() {
  const router = useRouter();
  const [bill, setBill] = useState<any>(null);
  const items = JSON.parse(localStorage.getItem("currentOrder") || "[]");

  useEffect(() => {
    fetch("http://localhost:5000", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items.map((i:any) => ({ id: i.id, qty: i.qty }))),
    })
      .then(res => res.json())
      .then(data => setBill(data));
  }, []);

  const startNewOrder = () => {
    localStorage.removeItem("currentOrder"); // 🧹 clear old order
    router.replace("/home");                // 🔁 back to menu
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-10 rounded-[2.8rem] shadow-2xl w-full max-w-sm border-t-[12px] border-orange-500">
        
        <h1 className="text-3xl font-black text-center mb-2 tracking-tight">
          HUNGRY HUT
        </h1>
        <p className="text-center text-xs text-gray-400 mb-8 tracking-widest">
          DIGITAL RECEIPT
        </p>

        {/* Items */}
        <div className="space-y-4 border-b-2 border-dashed pb-6 mb-6">
          {items.map((item:any) => (
            <div key={item.id} className="flex justify-between font-mono text-sm font-bold">
              <span>{item.qty} × {item.name}</span>
              <span>₹{(item.qty * item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        {bill ? (
          <div className="space-y-3">
            <div className="flex justify-between text-gray-500 font-bold">
              <span>Subtotal</span>
              <span>₹{bill.total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-500 font-bold">
              <span>Tax (10%)</span>
              <span>₹{bill.tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-2xl font-black text-orange-600 pt-4 border-t">
              <span>TOTAL</span>
              <span>₹{bill.finalAmount.toFixed(2)}</span>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400 font-bold animate-pulse">
            Calculating bill...
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => window.print()}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition"
          >
            Download Receipt 🖨️
          </button>

          <button
            onClick={startNewOrder}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-black transition"
          >
            New Order 🍽️
          </button>
        </div>
      </div>
    </div>
  );
}
