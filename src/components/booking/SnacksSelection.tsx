"use client";

import React, { useState } from "react";
import { SnackItem } from "@/types/booking";

// បញ្ជីមុខទំនិញ snacks & ភេសជ្ជៈ
export const initialSnackItems: SnackItem[] = [
  {
    id: "snack-1",
    name: "VIP Couple Combo",
    nameKhmer: "ឈុតគូស្នេហ៍ VIP",
    category: "combo",
    price: 9.5,
    icon: "🍿🥤🥤",
    description: "1x Large Caramel Popcorn + 2x Soft Drinks (Coke / Sprite) + 1x M&Ms",
    quantity: 0,
  },
  {
    id: "snack-2",
    name: "Classic Cinema Combo",
    nameKhmer: "ឈុតបុរាណ Popcorn & Coke",
    category: "combo",
    price: 6.5,
    icon: "🍿🥤",
    description: "1x Medium Butter Popcorn + 1x Regular Soft Drink",
    quantity: 0,
  },
  {
    id: "snack-3",
    name: "Caramel Popcorn (L)",
    nameKhmer: "ពោតលីង ការ៉ាមែល (ធំ)",
    category: "popcorn",
    price: 4.5,
    icon: "🍿",
    description: "Crispy freshly popped corn coated in rich sweet golden caramel",
    quantity: 0,
  },
  {
    id: "snack-4",
    name: "Cheese & Butter Popcorn (L)",
    nameKhmer: "ពោតលីង រសជាតិឈីស (ធំ)",
    category: "popcorn",
    price: 4.5,
    icon: "🧀",
    description: "Savory cheddar cheese powder dusted over hot buttered popcorn",
    quantity: 0,
  },
  {
    id: "snack-5",
    name: "Coca-Cola Zero (Large)",
    nameKhmer: "កូកាកូឡា ហ្សេរ៉ូ (ធំ)",
    category: "drink",
    price: 2.5,
    icon: "🥤",
    description: "Chilled ice-cold Coca-Cola Zero Sugar (32oz cup)",
    quantity: 0,
  },
  {
    id: "snack-6",
    name: "Sprite Cool Lemon (Large)",
    nameKhmer: "ស្ព្រាយ ក្រូចឆ្មា (ធំ)",
    category: "drink",
    price: 2.5,
    icon: "🍋",
    description: "Crisp and refreshing lemon-lime sparkling soft drink",
    quantity: 0,
  },
  {
    id: "snack-7",
    name: "Cheesy Nachos & Dip",
    nameKhmer: "បំពង Nachos ជាមួយទឹកជ្រលក់ឈីស",
    category: "snack",
    price: 4.0,
    icon: "🌮",
    description: "Crunchy tortilla chips served with warm melted cheddar dip & jalapeños",
    quantity: 0,
  },
  {
    id: "snack-8",
    name: "Mineral Water (Dasani)",
    nameKhmer: "ទឹកបរិសុទ្ធ",
    category: "drink",
    price: 1.25,
    icon: "💧",
    description: "Refreshing purified natural drinking water (500ml)",
    quantity: 0,
  },
];

// props ទទួលពី parent component
interface SnacksSelectionProps {
  snacks: SnackItem[];
  onChange: (updated: SnackItem[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SnacksSelection({
  snacks,
  onChange,
  onNext,
  onBack,
}: SnacksSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // បន្ថែម ឬបន្ថយចំនួន (+ / -)
  const updateQuantity = (id: string, delta: number) => {
    const next = snacks.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    onChange(next);
  };

  // គណនាតម្លៃសរុប snacks
  const totalSnacksPrice = snacks.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalSnackCount = snacks.reduce((sum, item) => sum + item.quantity, 0);

  // filter តាមប្រភេទ
  const filteredSnacks =
    selectedCategory === "all"
      ? snacks
      : snacks.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            Step 2 of 3
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Food & Drinks Add-ons
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enjoy your movie with our fresh popcorn, combos, and ice-cold beverages.
          </p>
        </div>

        {/* ប៊ូតុង filter តាម category */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          {[
            { id: "all", label: "All Items" },
            { id: "combo", label: "🔥 Combos" },
            { id: "popcorn", label: "🍿 Popcorn" },
            { id: "drink", label: "🥤 Drinks" },
            { id: "snack", label: "🌮 Snacks" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* បញ្ជីទំនិញ snacks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredSnacks.map((item) => {
          const isSelected = item.quantity > 0;
          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="text-3xl p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-base font-extrabold text-amber-400">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="font-extrabold text-white text-sm line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-amber-400/80 font-medium">
                    {item.nameKhmer}
                  </p>
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* ប៊ូតុង + និង - */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Quantity:</span>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={item.quantity === 0}
                    className="w-7 h-7 rounded-lg bg-slate-850 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-white font-mono">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm transition-colors shadow-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ប៊ូតុង back និងបន្តទៅបង់ប្រាក់ */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            ← Back to Seats
          </button>

          <div className="text-xs text-slate-400">
            Selected snacks:{" "}
            <span className="font-bold text-white">
              {totalSnackCount > 0 ? `${totalSnackCount} items` : "None"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Snack Subtotal</span>
            <span className="text-xl font-black text-amber-400">
              ${totalSnacksPrice.toFixed(2)}
            </span>
          </div>

          <button
            onClick={onNext}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all duration-200 shadow-lg shadow-amber-500/25 flex items-center gap-2 active:scale-98 cursor-pointer"
          >
            <span>Proceed to Payment</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
