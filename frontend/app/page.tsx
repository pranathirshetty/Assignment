"use client";
import { useState } from "react";

// 1. Define Product and Cart Item Types
interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem extends Product {
  qty: number;
}

// 2. Define Bill Data Type
interface BillData {
  total: number;
  tax: number;
  finalAmount: number;
}

const products: Product[] = [
  { id: 1, name: "Burger", price: 100 },
  { id: 2, name: "Pizza", price: 200 },
  { id: 3, name: "Cold Drink", price: 50 },
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>(
    products.map(p => ({ ...p, qty: 0 }))
  );

  const [bill, setBill] = useState<BillData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Helper to format currency
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
      setError("Please add items to the cart before generating a bill.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send only items with quantity > 0
        body: JSON.stringify(itemsInCart),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }

      const data: BillData = await res.json();
      setBill(data);

    } catch (e: unknown) {
      // Simplified error display
      let errorMessage = "Could not connect to the billing backend.";
      if (e instanceof Error) {
        errorMessage = `Request Failed: ${e.message}`;
      }
      console.error("Fetch Error:", e);
      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          🛒 Order & Bill
        </h1>

        {/* --- Cart Items List --- */}
        <div className="space-y-4 mb-6 border-b pb-4">
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-700">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(item.price)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => decrement(item.id)}
                  className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-700 hover:bg-gray-200 rounded-md transition duration-150"
                  disabled={item.qty === 0 || loading}
                >
                  −
                </button>

                <span className="w-6 text-center font-mono font-bold text-lg">
                  {item.qty}
                </span>

                <button
                  onClick={() => increment(item.id)}
                  className="w-8 h-8 flex items-center justify-center text-lg font-bold text-gray-700 hover:bg-gray-200 rounded-md transition duration-150"
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
          className={`w-full py-3 rounded-xl transition duration-300 font-semibold text-white ${
            loading
              ? "bg-indigo-400 cursor-wait"
              : "bg-indigo-600 hover:bg-indigo-700 shadow-lg"
          }`}
        >
          {loading ? "Processing..." : "Generate Bill"}
        </button>

        {/* --- Status & Results --- */}
        {error && (
          <p className="text-red-600 mt-4 text-center p-2 bg-red-50 rounded-lg border border-red-200">
            🚨 {error}
          </p>
        )}

        {bill && (
          <div className="mt-6 pt-4 border-t-4 border-dashed border-gray-200 space-y-2">
            <h2 className="text-xl font-bold text-center mb-3">Invoice</h2>
            
            <div className="flex justify-between text-gray-700">
              <span>Total Items Cost:</span>
              <span className="font-mono">{formatCurrency(bill.total)}</span>
            </div>
            
            <div className="flex justify-between text-gray-700">
              <span>Tax/GST:</span>
              <span className="font-mono">{formatCurrency(bill.tax)}</span>
            </div>
            
            <div className="flex justify-between pt-3 text-2xl font-extrabold text-indigo-700">
              <span>Final Amount:</span>
              <span>{formatCurrency(bill.finalAmount)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}