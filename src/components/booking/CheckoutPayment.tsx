"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PaymentMethod, Seat, SnackItem } from "@/types/booking";

interface CheckoutPaymentProps {
  movieTitle: string;
  date: string;
  showtime: string;
  hall: string;
  format: string;
  selectedSeats: Seat[];
  selectedSnacks: SnackItem[];
  seatTotal: number;
  snackTotal: number;
  onBack: () => void;
  onPaymentSuccess: (paymentDetails: {
    method: PaymentMethod;
    discount: number;
    totalAmount: number;
    customerName: string;
    customerPhone: string;
  }) => void;
}

// ជំហានទី ៣៖ ទូទាត់ប្រាក់ (KHQR, Card, Cash)
export default function CheckoutPayment({
  movieTitle,
  date,
  showtime,
  hall,
  format,
  selectedSeats,
  selectedSnacks,
  seatTotal,
  snackTotal,
  onBack,
  onPaymentSuccess,
}: CheckoutPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("KHQR");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // timer 3 នាទីសម្រាប់ KHQR
  const [timeLeft, setTimeLeft] = useState(180);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (paymentMethod !== "KHQR") return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentMethod]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // គណនាតម្លៃ និង discount
  const rawTotal = seatTotal + snackTotal;
  const discountAmount = (rawTotal * discountPercent) / 100;
  const finalTotal = Math.max(0, rawTotal - discountAmount);

  // ឆែក promo code (WATCHME10 ឬ STUDENT20)
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    const code = promoCode.trim().toUpperCase();

    if (code === "WATCHME10") {
      setDiscountPercent(10);
      setAppliedPromo("WATCHME10 (-10%)");
    } else if (code === "STUDENT20" || code === "CINEMA20") {
      setDiscountPercent(20);
      setAppliedPromo(`${code} (-20%)`);
    } else {
      setPromoError("Invalid code. Try WATCHME10 or STUDENT20");
    }
  };

  // ពេលចុចបង់ប្រាក់
  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({
        method: paymentMethod,
        discount: discountAmount,
        totalAmount: finalTotal,
        customerName: customerName.trim() || "Guest Customer",
        customerPhone: customerPhone.trim() || "012 345 678",
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
          Step 3 of 3
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
          Review & Secure Checkout
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Verify your booking information and complete payment with Bakong KHQR or Credit Card.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* សង្ខេបការបញ្ជាទិញ (Order Summary) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
              Order Summary
            </h4>

            <div className="border-b border-slate-800 pb-3">
              <h5 className="font-extrabold text-white text-base">{movieTitle}</h5>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-400">
                <span>{date}</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">{showtime}</span>
                <span>•</span>
                <span className="text-indigo-300 font-medium">
                  {format} ({hall})
                </span>
              </div>
            </div>

            {/* បញ្ជីកៅអី */}
            <div className="flex items-start justify-between text-xs">
              <div>
                <span className="text-white font-bold">
                  Seats ({selectedSeats.length}):
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedSeats.map((s) => (
                    <span
                      key={s.id}
                      className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold"
                    >
                      {s.id}
                    </span>
                  ))}
                </div>
              </div>
              <span className="font-extrabold text-slate-200">
                ${seatTotal.toFixed(2)}
              </span>
            </div>

            {/* បញ្ជី snacks */}
            {selectedSnacks.length > 0 && (
              <div className="border-t border-slate-800/80 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-white">
                  <span>Food & Beverage:</span>
                  <span>${snackTotal.toFixed(2)}</span>
                </div>
                {selectedSnacks.map((snack) => (
                  <div
                    key={snack.id}
                    className="flex justify-between text-slate-400 text-[11px]"
                  >
                    <span>
                      {snack.name} × {snack.quantity}
                    </span>
                    <span>${(snack.price * snack.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ប្រអប់ Promo Code */}
            <div className="border-t border-slate-800/80 pt-3">
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. WATCHME10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <p className="text-emerald-400 text-xs mt-1.5 flex items-center gap-1 font-semibold">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Coupon {appliedPromo} applied!
                </p>
              )}

              {promoError && (
                <p className="text-red-400 text-xs mt-1.5">{promoError}</p>
              )}
            </div>

            {/* គណនាតម្លៃសរុបចុងក្រោយ */}
            <div className="border-t-2 border-dashed border-slate-800 pt-3 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>${rawTotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Taxes & Cinema Fees</span>
                <span className="text-emerald-400 font-medium">Included ($0.00)</span>
              </div>
              <div className="flex justify-between items-center pt-2 text-white">
                <span className="text-sm font-extrabold uppercase">Total Payment</span>
                <span className="text-2xl font-black text-amber-400">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* ព័ត៌មានអ្នកកក់ (Optional) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Customer Details (Optional)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chan Dara"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. 012 888 999"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ជ្រើសរើសវិធីបង់ប្រាក់ */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">
              Choose Payment Method
            </h4>

            {/* ប៊ូតុងរើសវិធីបង់ប្រាក់ */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("KHQR")}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === "KHQR"
                    ? "bg-rose-950/40 border-rose-500 text-rose-300 shadow-md shadow-rose-900/20"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-xs font-black tracking-widest text-rose-500">
                  KHQR
                </span>
                <span className="text-[10px] font-bold">Bakong / ABA</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("CARD")}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === "CARD"
                    ? "bg-indigo-950/40 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-900/20"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-xs font-black">💳 CARD</span>
                <span className="text-[10px] font-bold">Visa / Master</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("CASH")}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  paymentMethod === "CASH"
                    ? "bg-emerald-950/40 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-900/20"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                <span className="text-xs font-black">💵 CASH</span>
                <span className="text-[10px] font-bold">Pay at Counter</span>
              </button>
            </div>

            {/* KHQR Code + Timer */}
            {paymentMethod === "KHQR" && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col items-center text-center space-y-3">
                <div className="w-full max-w-[240px] bg-rose-600 rounded-t-xl py-1.5 px-3 flex items-center justify-between shadow-md">
                  <span className="text-white text-xs font-black tracking-widest uppercase">
                    KHQR
                  </span>
                  <span className="text-[10px] text-rose-100 font-semibold">
                    Bakong Member
                  </span>
                </div>

                <div className="relative p-3 bg-white rounded-b-xl rounded-t-none max-w-[240px] w-full shadow-2xl flex flex-col items-center">
                  <div className="w-full text-center pb-1 border-b border-gray-200 mb-2">
                    <p className="text-[11px] font-extrabold text-gray-900 uppercase tracking-tight">
                      WATCH.ME CINEMAS
                    </p>
                    <p className="text-[9px] text-gray-500 font-medium">
                      USD Account • Instant Settlement
                    </p>
                  </div>

                  <div className="relative w-48 h-48 flex items-center justify-center p-1 bg-white rounded-lg">
                    {/* Image qr code */}
                    <Image
                      src="/khqr-code.png"
                      alt="Bakong KHQR Payment"
                      width={192}
                      height={192}
                      className="w-full h-full object-contain"
                      priority
                    />

                    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg opacity-30">
                      <div className="w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent animate-pulse" />
                    </div>
                  </div>

                  <div className="w-full mt-2 pt-1 border-t border-gray-200">
                    <p className="text-sm font-black text-rose-600">
                      ${finalTotal.toFixed(2)} USD
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Expires in:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {formatTimer(timeLeft)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Scan with any Bakong-enabled app (ABA, Wing, ACLEDA, Sathapana, etc.)
                </p>
              </div>
            )}

            {/* Form សម្រាប់ Card */}
            {paymentMethod === "CARD" && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    defaultValue="4242 •••• •••• 4242"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      defaultValue="12/28"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">CVV</label>
                    <input
                      type="password"
                      defaultValue="888"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ព័ត៌មានបង់ប្រាក់នៅកន្លែង (Cash) */}
            {paymentMethod === "CASH" && (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center space-y-2 text-xs text-slate-300">
                <div className="text-3xl">🎫</div>
                <h5 className="font-extrabold text-white text-sm">
                  Pay at Cinema Ticket Counter
                </h5>
                <p className="text-slate-400 max-w-xs mx-auto">
                  Your seat will be reserved immediately. Please present your booking ID at the counter 15 minutes before showtime.
                </p>
              </div>
            )}

            {/* ប៊ូតុងបង់ប្រាក់ */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm tracking-wide transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying & Reserving Seats...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Pay ${finalTotal.toFixed(2)}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ត្រឡប់ក្រោយ */}
          <button
            type="button"
            onClick={onBack}
            className="w-full py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 text-xs font-bold transition-colors"
          >
            ← Back to Food & Drinks
          </button>
        </div>
      </div>
    </div>
  );
}
