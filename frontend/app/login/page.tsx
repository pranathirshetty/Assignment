"use client";
import { useState } from "react";
import { login } from "../firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const user = await login(email, password);
      if (user) {
        alert(`Welcome back ${user.email}`);
        router.replace("/home");
      }
    } catch (err) {
      alert("Login failed ");
      console.error(err);
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative" 
      style={{ 
        backgroundImage: `url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop')` 
      }}
    >
      {/* Dark Overlay for consistent "Hungry Hut" vibe */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 bg-black/75 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 w-full max-w-[400px] text-center shadow-2xl mx-4">
        <h1 className="text-4xl font-black italic text-white mb-2 tracking-tighter uppercase">
          Hungry Hut
        </h1>
        <p className="text-gray-400 mb-8 font-medium">Welcome Back</p>

        <div className="space-y-4">
          <input
            className="bg-white/5 border border-white/10 w-full p-4 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6600] transition-all"
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="bg-white/5 border border-white/10 w-full p-4 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff6600] transition-all"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={handleLogin}
            className="w-full bg-[#ff6600] hover:bg-[#ff8533] text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            Login 
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="w-full bg-[#00aa44] hover:bg-[#00c850] text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
          >
            Sign up instead 
          </button>
        </div>
      </div>
    </div>
  );
}