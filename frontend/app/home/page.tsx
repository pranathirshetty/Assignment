"use client";
import { useState, useEffect } from "react"; // Added useEffect
import { useRouter } from "next/navigation";

// Define a type for the product to fix TS errors
interface Product {
  id: number;
  name: string;
  price: number;
  icon: string;
  qty: number;
}

const PRODUCTS = [
  { id: 101, name: "Cheeseburger", price: 150, icon: "🍔" },
  { id: 102, name: "Large Fries", price: 80, icon: "🍟" },
  { id: 103, name: "Chicken Wings", price: 250, icon: "🍗" },
  { id: 104, name: "Soda Pop", price: 60, icon: "🥤" },
];

export default function Home() {
  const router = useRouter();
  
  // ERROR 1 & 2: Added explicit types to avoid 'any' or 'null' assignment errors
  const [diningType, setDiningType] = useState<string | null>(null);
  const [cart, setCart] = useState<Product[]>(PRODUCTS.map(p => ({ ...p, qty: 0 })));
  
  // ERROR 3: Hydration fix. Ensure the component is mounted before showing browser-specific UI
 // This line defines both the variable AND the function to change it
// This line defines both the variable AND the function to change it
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);
  // ERROR 4: Parameter type definition for updateQty
  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
    ));
  };

  const handlePlaceOrder = () => {
    const selectedItems = cart.filter(item => item.qty > 0);
    if (selectedItems.length === 0) return alert("Please select an item!");
    
    // ERROR 5: Safe access to localStorage (window check)
    if (typeof window !== 'undefined') {
      localStorage.setItem("currentOrder", JSON.stringify(selectedItems));
      router.push(`/confirmed?type=${diningType}`);
    }
  };

  // ERROR 6: Preventing hydration mismatch by returning null until mounted
  if (!isMounted) return <div className="min-h-screen bg-black" />;

  // Selection Screen
  if (!diningType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070')" }}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <div className="relative z-10 bg-black/75 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl text-center w-full max-w-md mx-4">
          <h1 className="text-5xl font-black text-white mb-2 italic tracking-tighter uppercase">Hungry Hut</h1>
          <p className="text-gray-400 mb-8 font-medium">Select your dining preference</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => setDiningType("Table")} 
              className="w-full bg-[#ff6600] text-white py-5 rounded-2xl font-bold text-xl hover:bg-[#ff8533] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3"
            >
              At Table 
            </button>
            <button 
              onClick={() => setDiningType("Counter")} 
              className="w-full bg-[#00aa44] text-white py-5 rounded-2xl font-bold text-xl hover:bg-[#00c850] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3"
            >
              At Counter 
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Menu Screen
  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center relative p-4 md:p-12" 
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2070')" }}>
      
      {/* ERROR 7: Fixed background tint z-index and positioning */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-4xl md:text-5xl font-black italic text-white tracking-tighter uppercase text-center">
            HUNGRY HUT <span className="text-[#ff6600]">MENU</span>
          </h1>
          <div className="bg-[#00aa44] px-6 py-2 rounded-full font-black text-white uppercase text-sm shadow-lg">
            SERVICE: {diningType}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cart.map((item) => (
            <div key={item.id} className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-[2.5rem] shadow-xl text-center transition-all hover:border-[#ff6600]/50 group">
              <span className="text-6xl block mb-4 group-hover:scale-110 transition-transform">{item.icon}</span>
              <h2 className="text-xl font-bold text-white mb-1">{item.name}</h2>
              <p className="text-[#ff6600] font-black text-2xl mb-6">₹{item.price}</p>
              
              <div className="flex items-center justify-between bg-white/5 rounded-2xl p-2 border border-white/5">
                <button 
                  onClick={() => updateQty(item.id, -1)} 
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-white transition-all active:scale-90"
                >
                  −
                </button>
                <span className="text-2xl font-black text-white px-4">{item.qty}</span>
                <button 
                  onClick={() => updateQty(item.id, 1)} 
                  className="w-10 h-10 bg-[#00aa44] hover:bg-[#00c850] rounded-xl text-white font-bold transition-all shadow-md active:scale-90"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-6 z-20">
          <button 
            onClick={handlePlaceOrder} 
            className="w-full bg-[#ff6600] hover:bg-[#ff8533] text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-widest"
          >
            Place Order 
          </button>
        </div>
      </div>
    </div>
  );
}