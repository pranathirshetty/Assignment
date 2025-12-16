"use client";
import { useState } from "react";

// --- TYPES (No Change in Logic) ---
interface Product {
  id: number;
  name: string;
  price: number;
  image: string; // Added image property
}

interface CartItem extends Product {
  qty: number;
}

interface BillData {
  total: number;
  tax: number;
  finalAmount: number;
}

// --- EXTENDED JUNK FOOD MENU ---
const products: Product[] = [
  // IDs must be unique and consistent with C++ backend
  { id: 101, name: "Cheeseburger", price: 150, image: "🍔" },
  { id: 102, name: "Large Fries", price: 80, image: "🍟" },
  { id: 103, name: "Chicken Wings", price: 250, image: "🍗" },
  { id: 104, name: "Soda Pop", price: 60, image: "🥤" },
  { id: 105, name: "Choco Shake", price: 120, image: "🍫" },
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>(
    products.map(p => ({ ...p, qty: 0 }))
  );

  const [bill, setBill] = useState<BillData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const formatCurrency = (amount: number): string => `₹${amount.toFixed(2)}`;

  const increment = (id: number) => {
    setCart(cart.map(p =>
      p.id === id ? { ...p, qty: p.qty + 1 } : p
    ));
    setBill(null);
    setError(null);
  };

  const decrement = (id: number) => {
    setCart(cart.map(p =>
      p.id === id && p.qty > 0 ? { ...p, qty: p.qty - 1 } : p
    ));
    setBill(null);
    setError(null);
  };

  const generateBill = async () => {
    setError(null);
    setBill(null);
    setLoading(true);

    const itemsInCart = cart.filter(item => item.qty > 0);
    if (itemsInCart.length === 0) {
      setError("Please select some delicious items!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemsInCart),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }

      const data: BillData = await res.json();
      setBill(data);

    } catch (e: unknown) {
      let errorMessage = "Kitchen closed! Could not connect to the backend.";
      if (e instanceof Error) {
        errorMessage = `Order Failed: ${e.message}`;
      }
      console.error("Fetch Error:", e);
      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    // Revamped Background: Orange/Red Gradient for a "Fast Food" feel
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-yellow-300 to-red-500 p-4">
      {/* Revamped Card: Rounded, Shadowed, Darker Accent */}
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-[70%] transform hover:scale-[1.01] transition-transform duration-300">
        <h1 className="text-4xl font-black mb-8 text-center text-red-700 tracking-wider">
          🍟 Hungry Hut Order
        </h1>

        {/* --- Cart Items List --- */}
        <div className="space-y-4 mb-6 border-b-2 border-yellow-200 pb-4">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-yellow-50 transition-colors">
              <div className="flex items-center gap-3">
                {/* Item Image/Emoji */}
                <span className="text-3xl">{item.image}</span>
                
                <div>
                  <p className="font-extrabold text-lg text-gray-800">{item.name}</p>
                  <p className="text-md text-red-600 font-semibold">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 bg-red-600 rounded-full shadow-md">
                <button
                  onClick={() => decrement(item.id)}
                  className="w-8 h-8 flex items-center justify-center text-xl font-bold text-white hover:bg-red-700 rounded-full transition duration-150"
                  disabled={item.qty === 0 || loading}
                >
                  −
                </button>

                <span className="w-6 text-center font-mono font-bold text-lg text-white">
                  {item.qty}
                </span>

                <button
                  onClick={() => increment(item.id)}
                  className="w-8 h-8 flex items-center justify-center text-xl font-bold text-white hover:bg-red-700 rounded-full transition duration-150"
                  disabled={loading}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- Generate Button --- */}
        <button
          onClick={generateBill}
          disabled={loading}
          className={`w-full py-3 rounded-xl transition duration-300 font-extrabold text-lg tracking-wider ${
            loading
              ? "bg-gray-400 cursor-wait text-gray-600"
              : "bg-red-700 text-yellow-300 hover:bg-red-800 shadow-xl shadow-red-300"
          }`}
        >
          {loading ? "Chef is busy..." : "Place Order"}
        </button>

        {/* --- Status & Results --- */}
        {error && (
          <p className="text-white mt-4 text-center p-3 bg-red-700 rounded-lg font-semibold">
            🚫 {error}
          </p>
        )}

        {bill && (
          <div className="mt-8 pt-4 border-t-4 border-dashed border-gray-300 space-y-3">
            <h2 className="text-2xl font-black text-center mb-3 text-red-700">BILL</h2>
            
            <div className="flex justify-between text-gray-700 text-lg">
              <span className='font-semibold'>Subtotal:</span>
              <span className="font-mono font-bold">{formatCurrency(bill.total)}</span>
            </div>
            
            <div className="flex justify-between text-gray-700 text-lg">
              <span className='font-semibold'>Sales Tax (10%):</span>
              <span className="font-mono font-bold">{formatCurrency(bill.tax)}</span>
            </div>
            
            <div className="flex justify-between pt-3 text-3xl font-extrabold text-red-700 border-t-2 border-red-700">
              <span>GRAND TOTAL:</span>
              <span>{formatCurrency(bill.finalAmount)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}