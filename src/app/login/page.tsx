"use client";

import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [role, setRole] = useState("PEGAWAI");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 🔴 Sisi Kiri - Logo */}
      <div className="hidden md:flex w-1/2 bg-[#e31c1c] items-center justify-center">
        <div className="flex flex-col items-center">
          <Image
            src="/logo-jj.png" // pastikan file ada di /public/logo-jj.png
            alt="Logo Jambar Jabu"
            width={400}
            height={400}
            className="object-contain drop-shadow-lg"
            priority
          />
          <h1 className="mt-4 text-white font-bold text-3xl tracking-wide">
          </h1>
        </div>
      </div>

      {/* ⚪ Sisi Kanan - Form Login */}
      <div className="flex w-full md:w-1/2 bg-gray-50 items-center justify-center px-6">
        <form
          action="/api/login"
          method="post"
          className="bg-white shadow-lg rounded-2xl px-10 py-8 w-full max-w-sm border border-gray-100"
        >
          {/* Judul */}
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Login
          </h1>

          {/* Role Select */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Masuk Sebagai
            </label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              <option value="OWNER">Owner</option>
              <option value="PEGAWAI">Pegawai</option>
            </select>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Masukkan email"
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Masukkan password"
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          {/* Tombol Masuk */}
          <button
            type="submit"
            className="w-full bg-[#2563eb] text-white font-medium py-2 rounded-lg hover:bg-[#1d4ed8] transition-all duration-200"
          >
            Masuk
          </button>

          {/* Footer kecil */}
          <p className="text-xs text-center text-gray-500 mt-6">
            © {new Date().getFullYear()} Jambar Jabu. All rights reserved.
          </p>
        </form>
      </div>
    </div>
  );
}
