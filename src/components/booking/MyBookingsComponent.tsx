"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookingTicket } from "@/types/booking";
import {
  useBookings,
  cancelBooking,
  deleteBooking,
} from "@/services/bookingStorage";
import ETicketModal from "./ETicketModal";

export default function MyBookingsComponent() {
  const bookings = useBookings();
  const [selectedTicket, setSelectedTicket] = useState<BookingTicket | null>(null);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PAID" | "CANCELLED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  // filter សំបុត្រតាម status និង search
  const filteredBookings = useMemo(() => {
    return bookings.filter((item: BookingTicket) => {
      const matchStatus =
        filterStatus === "ALL" ? true : item.paymentStatus === filterStatus;
      const matchSearch =
        item.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [bookings, filterStatus, searchQuery]);

  // ចំនួនសំបុត្រដែលបានទិញជោគជ័យ
  const activeCount = useMemo(
    () => bookings.filter((b: BookingTicket) => b.paymentStatus === "PAID").length,
    [bookings]
  );

  // ទឹកប្រាក់សរុបដែលបានចំណាយ
  const totalSpent = useMemo(
    () =>
      bookings
        .filter((b: BookingTicket) => b.paymentStatus === "PAID")
        .reduce((sum: number, b: BookingTicket) => sum + b.totalAmount, 0),
    [bookings]
  );

  // confirm cancel ការកក់
  const handleConfirmCancel = (id: string) => {
    cancelBooking(id);
    setCancelTargetId(null);
  };

  // លុបសំបុត្រចេញពី history
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to permanently remove this ticket from history?")) {
      deleteBooking(id);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-6xl">
      {/* ក្បាលទំព័រ My Bookings */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Admission Passes
            </span>
            <span className="text-xs text-slate-400">
              {bookings.length} Total Bookings Recorded
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            My Cinema Tickets & Bookings
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Access your admission QR codes, view cinema seat receipts, or manage your bookings.
          </p>
        </div>

        {/* Stats counters */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
              Active Tickets
            </span>
            <span className="text-xl font-black text-emerald-400">
              {activeCount}
            </span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">
              Total Spent
            </span>
            <span className="text-xl font-black text-amber-400">
              ${totalSpent.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* របារ Search និង Filter */}
      <div className="my-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter status */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          {(["ALL", "PAID", "CANCELLED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterStatus === status
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {status === "ALL"
                ? `All (${bookings.length})`
                : status === "PAID"
                ? `Active (${activeCount})`
                : `Cancelled (${bookings.length - activeCount})`}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search movie or booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 pl-9"
          />
          <svg
            className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* បញ្ជីសំបុត្រ */}
      {filteredBookings.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-lg mx-auto my-10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-3xl mx-auto">
            🎟️
          </div>
          <h3 className="text-xl font-bold text-white">No Tickets Found</h3>
          <p className="text-sm text-slate-400">
            {searchQuery
              ? `No tickets match "${searchQuery}". Try a different keyword.`
              : "You haven't booked any movie tickets yet. Pick a movie from our catalog to get started!"}
          </p>
          <Link
            href="/movies"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
          >
            <span>Explore Movies</span>
            <span>→</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBookings.map((ticket) => {
            const isPaid = ticket.paymentStatus === "PAID";
            const backdropUrl = ticket.backdropPath
              ? `https://image.tmdb.org/t/p/w780${ticket.backdropPath}`
              : ticket.posterPath
              ? `https://image.tmdb.org/t/p/w500${ticket.posterPath}`
              : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80";

            return (
              <div
                key={ticket.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                {/* Banner រឿង */}
                <div className="relative h-32 w-full overflow-hidden bg-slate-950">
                  <Image
                    fill
                    unoptimized
                    src={backdropUrl}
                    alt={ticket.movieTitle}
                    className="object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

                  <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
                    <span className="font-mono text-xs font-black tracking-widest text-white bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                      #{ticket.id}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                        isPaid
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      ● {ticket.paymentStatus}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-black text-white line-clamp-1">
                      {ticket.movieTitle}
                    </h3>
                  </div>
                </div>

                {/* ព័ត៌មានលម្អិត */}
                <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-slate-400 text-[11px] block">
                          Date & Time
                        </span>
                        <span className="font-bold text-white">
                          {ticket.date} • {ticket.showtime}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">
                          Format / Hall
                        </span>
                        <span className="font-bold text-indigo-300">
                          {ticket.format} ({ticket.hall})
                        </span>
                      </div>
                    </div>

                    {/* កៅអីដែលបានកក់ */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-400">
                          Reserved Seats ({ticket.seats.length}):
                        </span>
                        <span className="text-amber-400 font-mono font-bold">
                          ${ticket.seatTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ticket.seats.map((seat) => (
                          <span
                            key={seat.id}
                            className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold"
                          >
                            {seat.id} {seat.type === "vip" ? "(VIP)" : ""}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Snacks បើមាន */}
                    {ticket.snacks && ticket.snacks.length > 0 && (
                      <div className="text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
                        <span>Snacks Add-on:</span>
                        <span className="text-slate-300 font-medium">
                          {ticket.snacks.map((s) => `${s.name} ×${s.quantity}`).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                        Total Amount
                      </span>
                      <span className="text-xl font-black text-amber-400">
                        ${ticket.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isPaid && (
                        <button
                          onClick={() => setCancelTargetId(ticket.id)}
                          className="px-3 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-colors"
                        >
                          Cancel
                        </button>
                      )}

                      {!isPaid && (
                        <button
                          onClick={() => handleDelete(ticket.id)}
                          className="px-3 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-bold transition-colors"
                        >
                          Remove
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                      >
                        <span>View E-Ticket</span>
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Popup បញ្ជាក់ការ Cancel */}
      {cancelTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto text-xl">
              ⚠️
            </div>
            <h4 className="text-lg font-bold text-white">Cancel Booking?</h4>
            <p className="text-xs text-slate-400">
              Are you sure you want to cancel booking #{cancelTargetId}? Your reserved seats will be released back to the cinema hall.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setCancelTargetId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Keep Ticket
              </button>
              <button
                onClick={() => handleConfirmCancel(cancelTargetId)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-colors"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal បង្ហាញ E-Ticket */}
      {selectedTicket && (
        <ETicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          showMyBookingsLink={false}
        />
      )}
    </div>
  );
}
