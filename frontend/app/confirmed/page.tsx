"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function BillingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const diningType = searchParams.get("type"); 
  
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [tableNumber, setTableNumber] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedOrder = localStorage.getItem("currentOrder");
    if (savedOrder) setOrderItems(JSON.parse(savedOrder));

    // AUTO-GENERATE logic: If Counter, create a random order ID immediately
    if (diningType === "Counter") {
      setTableNumber("C-" + Math.floor(100 + Math.random() * 900));
    }
  }, [diningType]);

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  const total = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative p-4"
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070')" }}>
      
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md"></div>

      <div className="relative z-10 bg-black/80 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl text-white">
        <h1 className="text-4xl font-black italic mb-2 text-center uppercase tracking-tighter">
          Hungry Hut <span className="text-[#ff6600]">Bill</span>
        </h1>
        <p className="text-gray-400 text-center mb-8 font-medium italic">Order Summary</p>

        {/* CONDITIONAL INPUT BOX */}
        <div className="mb-8 p-6 bg-white/5 rounded-3xl border border-white/10">
          <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-widest">
            {diningType === "Table" ? "Enter Table Number" : "Assigned Counter ID"}
          </label>
          
          <input
            type="number"
            value={tableNumber}
            onChange={(e) => diningType === "Table" && setTableNumber(e.target.value)}
            readOnly={diningType === "Counter"} 
            placeholder={diningType === "Table" ? "Type Table # (e.g. 05)" : "Generating..."}
            className={`w-full p-4 rounded-2xl text-xl font-bold transition-all outline-none border 
              ${diningType === "Table" 
                ? "bg-white/10 border-[#ff6600] text-white focus:ring-2 focus:ring-[#ff6600]" 
                : "bg-white/5 border-white/5 text-gray-500 cursor-not-allowed"
              }`}
          />
          {diningType === "Counter" && (
            <p className="text-[#00aa44] text-[10px] mt-2 font-black uppercase italic">✓ Automatically generated for pickup</p>
          )}
        </div>

        {/* Itemized List */}
        <div className="space-y-4 mb-8 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          {orderItems.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-lg border-b border-white/5 pb-2">
              <span className="text-gray-300 font-medium">
                <span className="text-[#ff6600] mr-2">{item.qty}x</span> {item.name}
              </span>
              <span className="font-bold">₹{item.price * item.qty}</span>
            </div>
          ))}
        </div>

        {/* Total Display */}
        <div className="bg-white/5 p-4 rounded-2xl mb-8 flex justify-between items-center border border-white/10">
          <span className="text-xl font-black italic">GRAND TOTAL</span>
          <span className="text-3xl font-black text-[#ff6600]">₹{total}</span>
        </div>

       <button 
  onClick={() => {
    if (!tableNumber && diningType === "Table") return alert("Please specify a table number!");
    // Save the table number so the final receipt can show it
    localStorage.setItem("finalTable", tableNumber);
    router.push("/billing"); // Redirect to the generated bill
  }}
  className="w-full bg-[#00aa44] hover:bg-[#00c850] py-5 rounded-[1.5rem] font-black text-xl transition-all active:scale-95 shadow-lg uppercase tracking-tighter"
>
  Confirm & Pay 
</button>
      </div>
    </div>
  );
}