"use client";

import React from "react";
import Link from "next/link";
import { BookingTicket } from "@/types/booking";

interface ETicketModalProps {
  ticket: BookingTicket;
  onClose: () => void;
  showMyBookingsLink?: boolean;
}

// Modal បង្ហាញសំបុត្រអេឡិចត្រូនិច (E-Ticket)
export default function ETicketModal({
  ticket,
  onClose,
  showMyBookingsLink = true,
}: ETicketModalProps) {
  // បើក print dialog សម្រាប់ព្រីន ឬ save PDF
  const handlePrint = () => {
    window.print();
  };

  const backdropUrl = ticket.backdropPath
    ? `https://image.tmdb.org/t/p/w780${ticket.backdropPath}`
    : ticket.posterPath
    ? `https://image.tmdb.org/t/p/w500${ticket.posterPath}`
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg my-6 bg-slate-900 rounded-3xl border border-slate-750 shadow-2xl overflow-hidden print-ticket-target">
        {/* ប៊ូតុងបិទ */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors print:hidden"
          aria-label="Close ticket"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ក្បាលសំបុត្រ + រូបរឿង */}
        <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-950">
          <img
            src={backdropUrl}
            alt={ticket.movieTitle}
            className="w-full h-full object-cover opacity-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          {/* Logo រោងកុន */}
          <div className="absolute top-4 left-5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
              W
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
                WATCH.ME CINEMAS
              </span>
              <p className="text-[10px] text-slate-400">Electronic Admission Ticket</p>
            </div>
          </div>

          {/* លេខ Booking ID និង Status */}
          <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between">
            <div>
              <span className="text-[11px] font-mono tracking-wider text-slate-400">BOOKING ID</span>
              <p className="text-xl sm:text-2xl font-black text-white tracking-wider font-mono">
                {ticket.id}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                ticket.paymentStatus === "PAID"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : ticket.paymentStatus === "CANCELLED"
                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                  : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
              }`}
            >
              ● {ticket.paymentStatus}
            </span>
          </div>
        </div>

        {/* ព័ត៌មានលម្អិតនៃសំបុត្រ */}
        <div className="p-5 sm:p-6 space-y-4 text-slate-100">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Movie Screening
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5 line-clamp-1">
              {ticket.movieTitle}
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Date</span>
              <span className="font-bold text-slate-100">{ticket.date}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Showtime</span>
              <span className="font-bold text-amber-400">{ticket.showtime}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Format & Hall</span>
              <span className="font-bold text-indigo-300 line-clamp-1">
                {ticket.format} ({ticket.hall})
              </span>
            </div>
          </div>

          {/* កៅអីដែលបានកក់ */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400">
                Reserved Seats ({ticket.seats.length})
              </span>
              <span className="text-amber-400 font-semibold">${ticket.seatTotal.toFixed(2)}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ticket.seats.map((seat) => (
                <span
                  key={seat.id}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs font-black flex items-center gap-1"
                >
                  <svg className="w-3 h-3 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 18v3h3v-3h10v3h3v-3h1a2 2 0 002-2V8a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H6a2 2 0 00-2 2v2H3a2 2 0 00-2 2v8a2 2 0 002 2h1zm4-14h8v2H8V4zm-3 4h14v6H5V8z" />
                  </svg>
                  {seat.id} {seat.type === "vip" ? "(VIP)" : ""}
                </span>
              ))}
            </div>
          </div>

          {/* ទឹកពោត (បើមាន) */}
          {ticket.snacks && ticket.snacks.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400">Food & Drinks Add-ons</span>
                <span className="text-indigo-300 font-semibold">${ticket.snackTotal.toFixed(2)}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ticket.snacks.map((snack) => (
                  <span
                    key={snack.id}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300"
                  >
                    {snack.name} ×{snack.quantity} (${(snack.price * snack.quantity).toFixed(2)})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* បន្ទាត់កាត់សំបុត្រ */}
          <div className="relative py-3">
            <div className="border-b-2 border-dashed border-slate-700 w-full" />
            <div className="absolute -left-8 sm:-left-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-950 border border-slate-800" />
            <div className="absolute -right-8 sm:-right-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-950 border border-slate-800" />
          </div>

          {/* សរុបតម្លៃ និង QR Code សម្រាប់ស្កានចូល Hall */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                Total Amount Paid
              </span>
              <p className="text-2xl font-black text-amber-400">
                ${ticket.totalAmount.toFixed(2)}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 justify-center sm:justify-start">
                <span>Method:</span>
                <span className="font-bold text-slate-200 uppercase bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                  {ticket.paymentMethod}
                </span>
                {ticket.discount > 0 && (
                  <span className="text-emerald-400">(-${ticket.discount.toFixed(2)} Promo)</span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="p-2 bg-white rounded-xl shadow-md">
                <svg
                  className="w-24 h-24 text-slate-950"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                >
                  <rect x="0" y="0" width="30" height="30" rx="4" />
                  <rect x="5" y="5" width="20" height="20" fill="white" />
                  <rect x="9" y="9" width="12" height="12" fill="#020617" />

                  <rect x="70" y="0" width="30" height="30" rx="4" />
                  <rect x="75" y="5" width="20" height="20" fill="white" />
                  <rect x="79" y="9" width="12" height="12" fill="#020617" />

                  <rect x="0" y="70" width="30" height="30" rx="4" />
                  <rect x="5" y="75" width="20" height="20" fill="white" />
                  <rect x="9" y="79" width="12" height="12" fill="#020617" />

                  <rect x="40" y="10" width="10" height="10" />
                  <rect x="55" y="15" width="8" height="8" />
                  <rect x="42" y="25" width="14" height="6" />
                  <rect x="15" y="42" width="12" height="8" />
                  <rect x="35" y="40" width="25" height="25" rx="3" />
                  <rect x="42" y="47" width="11" height="11" fill="white" />
                  <rect x="70" y="45" width="12" height="8" />
                  <rect x="85" y="40" width="10" height="15" />
                  <rect x="40" y="75" width="10" height="15" />
                  <rect x="55" y="70" width="15" height="10" />
                  <rect x="75" y="75" width="20" height="18" />
                </svg>
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1">Scan at Hall Gate</span>
            </div>
          </div>
        </div>

        {/* ប៊ូតុង print និង My Bookings */}
        <div className="p-4 sm:p-6 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print / Save PDF</span>
          </button>

          {showMyBookingsLink && (
            <Link
              href="/my-bookings"
              onClick={onClose}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-98"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span>View in My Bookings</span>
            </Link>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
