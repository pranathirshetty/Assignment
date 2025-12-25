"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PRODUCTS = [
  { id: 101, name: "Cheeseburger", price: 150, img: "🍔" },
  { id: 102, name: "Large Fries", price: 80, img: "🍟" },
  { id: 103, name: "Chicken Wings", price: 250, img: "🍗" },
  { id: 104, name: "Soda Pop", price: 60, img: "🥤" },
];

export default function MenuPage() {
  const [cart, setCart] = useState(PRODUCTS.map(p => ({ ...p, qty: 0 })));
  const router = useRouter();

  const updateQty = (id: number, delta: number) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
    ));
  };

  const handleOrder = () => {
    const activeItems = cart.filter(i => i.qty > 0);
    if (activeItems.length === 0) return alert("Select at least one item!");
    // Store cart in localStorage to pass to Billing
    localStorage.setItem("currentOrder", JSON.stringify(activeItems));
    router.push("/order");
  };

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center p-8" 
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070')" }}>
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-black text-gray-800 mb-8 border-b-4 border-orange-500 inline-block">Order Now</h1>
        
        <div className="grid gap-6">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{item.img}</span>
                <div>
                  <h3 className="font-bold text-xl">{item.name}</h3>
                  <p className="text-orange-600 font-bold">₹{item.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gray-100 p-2 rounded-xl">
                <button onClick={() => updateQty(item.id, -1)} className="w-10 h-10 bg-white rounded-lg shadow-sm font-bold">-</button>
                <span className="font-mono text-xl w-8 text-center">{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-10 h-10 bg-orange-500 text-white rounded-lg shadow-sm font-bold">+</button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleOrder} className="w-full mt-10 bg-green-600 text-white py-5 rounded-2xl font-black text-2xl shadow-xl hover:bg-green-700 transition-all transform hover:-translate-y-1">
          CONFIRM ORDER 🚀
        </button>
      </div>
    </div>
  );
}