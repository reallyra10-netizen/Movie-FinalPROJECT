"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Seat, SeatStatus, BookingDate, SnackItem, BookingTicket, PaymentMethod } from "@/types/booking";
import SnacksSelection, { initialSnackItems } from "./booking/SnacksSelection";
import CheckoutPayment from "./booking/CheckoutPayment";
import ETicketModal from "./booking/ETicketModal";
import { saveBooking, getBookedSeatsForShow } from "@/services/bookingStorage";

export interface MovieBookingCardProps {
  movieTitle?: string;
  movieId?: number | string;
  backdropPath?: string | null;
  posterPath?: string | null;
  runtime?: number;
  voteAverage?: number;
  genres?: { id: number; name: string }[];
}

// បង្កើតបញ្ជី 7 ថ្ងៃបន្ទាប់សម្រាប់ឱ្យភ្ញៀវរើស
const generateUpcomingDates = (daysCount = 7): BookingDate[] => {
  const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const fullDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const fullMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const dates: BookingDate[] = [];
  const now = new Date();

  for (let i = 0; i < daysCount; i++) {
    const d = new Date();
    d.setDate(now.getDate() + i);

    const day = dayNames[d.getDay()];
    const date = d.getDate().toString();
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    const fullDate = `${year}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${date.padStart(2, "0")}`;
    const displayDate = `${fullDayNames[d.getDay()]}, ${date} ${fullMonthNames[d.getMonth()]} ${year}`;

    dates.push({
      day,
      date,
      month,
      year,
      fullDate,
      displayDate,
      isToday: i === 0,
    });
  }

  return dates;
};

// ម៉ោង និងសាលបញ្ចាំង
const showtimes = [
  { time: "13:15", format: "2D Digital", hall: "Hall 03" },
  { time: "16:45", format: "3D Cinema", hall: "Hall 01" },
  { time: "19:30", format: "IMAX 3D", hall: "Hall 04 (Grand)" },
  { time: "22:15", format: "Dolby Atmos", hall: "Hall 02 (VIP)" },
];

// បង្កើត layout កៅអី (ជួរ A-D ធម្មតា $10, E-F VIP $16)
const generateSeats = (extraOccupied: string[] = [], selectedIds: string[] = []): Seat[] => {
  const rows = ["A", "B", "C", "D", "E", "F"];
  const seatsPerRow = 8;
  const defaultOccupied = ["A3", "A4", "C2", "C7", "D4", "D5", "E1", "E8"];
  const allOccupied = Array.from(new Set([...defaultOccupied, ...extraOccupied]));
  const vipRows = ["E", "F"];

  const seats: Seat[] = [];

  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      const id = `${row}${i}`;
      const isVip = vipRows.includes(row);
      const isOccupied = allOccupied.includes(id);
      const isSelected = selectedIds.includes(id);

      let status: SeatStatus = "available";
      if (isOccupied) {
        status = "occupied";
      } else if (isSelected) {
        status = "selected";
      } else if (isVip) {
        status = "vip";
      }

      seats.push({
        id,
        row,
        number: i,
        status,
        price: isVip ? 16 : 10,
      });
    }
  });

  return seats;
};

export default function MovieBookingCard({
  movieTitle = "Interstellar: Odyssey",
  movieId,
  backdropPath,
  posterPath,
  runtime,
  voteAverage = 8.9,
  genres = [],
}: MovieBookingCardProps) {
  // ជំហានបច្ចុប្បន្ន: "seats" | "snacks" | "checkout"
  const [currentStep, setCurrentStep] = useState<"seats" | "snacks" | "checkout">("seats");

  const availableDates = useMemo(() => generateUpcomingDates(7), []);
  const [selectedDate, setSelectedDate] = useState<BookingDate>(availableDates[0]);
  const [selectedShowtime, setSelectedShowtime] = useState(showtimes[2]);

  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [snacks, setSnacks] = useState<SnackItem[]>(() =>
    initialSnackItems.map((s) => ({ ...s }))
  );
  const [completedTicket, setCompletedTicket] = useState<BookingTicket | null>(null);

  // កៅអីដែលបានកក់រួចពីមុន (LocalStorage)
  const bookedSeatIds = useMemo(() => {
    return getBookedSeatsForShow(
      movieTitle,
      selectedDate.displayDate,
      selectedShowtime.time
    );
  }, [movieTitle, selectedDate.displayDate, selectedShowtime.time]);

  const seats = useMemo(() => {
    return generateSeats(bookedSeatIds, selectedSeatIds);
  }, [bookedSeatIds, selectedSeatIds]);

  // កៅអី និង snacks ដែលភ្ញៀវបានរើស
  const selectedSeats = useMemo(() => {
    return seats.filter((s) => selectedSeatIds.includes(s.id));
  }, [seats, selectedSeatIds]);

  const selectedSnacks = useMemo(() => {
    return snacks.filter((s) => s.quantity > 0);
  }, [snacks]);

  const seatTotal = useMemo(() => {
    return selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  }, [selectedSeats]);

  const snackTotal = useMemo(() => {
    return selectedSnacks.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [selectedSnacks]);

  const backdropUrl = backdropPath
    ? `https://image.tmdb.org/t/p/w1280${backdropPath}`
    : posterPath
    ? `https://image.tmdb.org/t/p/w780${posterPath}`
    : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80";

  const formattedRuntime = runtime
    ? `${Math.floor(runtime / 60)}h ${runtime % 60}m`
    : "2h 15m";

  const genreNames =
    genres.length > 0
      ? genres.map((g) => g.name).slice(0, 2).join(" / ")
      : "Sci-Fi / Action";

  // ពេលភ្ញៀវចុចរើស ឬដោះកៅអី
  const toggleSeat = (id: string) => {
    const isOccupied = bookedSeatIds.includes(id) || ["A3", "A4", "C2", "C7", "D4", "D5", "E1", "E8"].includes(id);
    if (isOccupied) return;

    setSelectedSeatIds((prev) =>
      prev.includes(id) ? prev.filter((sId) => sId !== id) : [...prev, id]
    );
  };

  const handleDateChange = (item: BookingDate) => {
    setSelectedDate(item);
    setSelectedSeatIds([]);
  };

  const handleShowtimeChange = (session: (typeof showtimes)[0]) => {
    setSelectedShowtime(session);
    setSelectedSeatIds([]);
  };

  // ពេលបង់ប្រាក់ជោគជ័យ -> បង្កើតសំបុត្រ និង save ចូល LocalStorage
  const handlePaymentSuccess = ({
    method,
    discount,
    totalAmount,
    customerName,
    customerPhone,
  }: {
    method: PaymentMethod;
    discount: number;
    totalAmount: number;
    customerName: string;
    customerPhone: string;
  }) => {
    const bookingId = `WME-${Date.now().toString().slice(-6)}`;

    const newTicket: BookingTicket = {
      id: bookingId,
      movieId,
      movieTitle,
      posterPath,
      backdropPath,
      date: selectedDate.displayDate,
      showtime: selectedShowtime.time,
      hall: selectedShowtime.hall,
      format: selectedShowtime.format,
      seats: selectedSeats.map((s) => ({
        id: s.id,
        price: s.price,
        type: ["E", "F"].includes(s.row) ? "vip" : "regular",
      })),
      snacks: selectedSnacks.map((snk) => ({
        id: snk.id,
        name: snk.name,
        nameKhmer: snk.nameKhmer,
        quantity: snk.quantity,
        price: snk.price,
      })),
      seatTotal,
      snackTotal,
      discount,
      totalAmount,
      paymentMethod: method,
      paymentStatus: "PAID",
      customerName,
      customerPhone,
      createdAt: new Date().toISOString(),
    };

    saveBooking(newTicket);
    setCompletedTicket(newTicket);
    setSelectedSeatIds([]);
  };

  // reset ទាំងអស់ពេលកក់ចប់
  const resetBooking = () => {
    setCompletedTicket(null);
    setCurrentStep("seats");
    setSelectedSeatIds([]);
    setSnacks(initialSnackItems.map((s) => ({ ...s })));
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 text-slate-100 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 my-8">
      {/* Header: រូបរឿង + ព័ត៌មានរឿង */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-900">
        <Image
          fill
          unoptimized
          src={backdropUrl}
          alt={movieTitle}
          className="object-cover opacity-45 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {selectedShowtime.format}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {genreNames}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                {voteAverage ? voteAverage.toFixed(1) : "8.9"} (TMDB)
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white line-clamp-1">
              {movieTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Duration: {formattedRuntime} • {selectedShowtime.hall} • WATCH.ME Cinema
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-400">Regular / VIP</p>
              <p className="text-xl font-bold text-amber-400">$10 / $16</p>
            </div>

            <Link
              href="/my-bookings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs font-bold text-amber-400 border border-slate-700/80 shadow-md backdrop-blur-md transition-all hover:scale-102"
            >
              <span>🎟️ My Tickets</span>
            </Link>
          </div>
        </div>
      </div>

      {/* របារបង្ហាញជំហាន (Step 1, 2, 3) */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                currentStep === "seats"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                  : selectedSeats.length > 0
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              1
            </span>
            <span
              className={`text-xs font-bold ${
                currentStep === "seats" ? "text-amber-400" : "text-slate-400"
              }`}
            >
              Seats & Time
            </span>
          </div>

          <div
            className={`flex-1 h-0.5 mx-3 transition-colors ${
              currentStep !== "seats" ? "bg-amber-500" : "bg-slate-800"
            }`}
          />

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                currentStep === "snacks"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                  : currentStep === "checkout"
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              2
            </span>
            <span
              className={`text-xs font-bold ${
                currentStep === "snacks" ? "text-amber-400" : "text-slate-400"
              }`}
            >
              Food & Drinks
            </span>
          </div>

          <div
            className={`flex-1 h-0.5 mx-3 transition-colors ${
              currentStep === "checkout" ? "bg-amber-500" : "bg-slate-800"
            }`}
          />

          {/* Step 3 */}
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                currentStep === "checkout"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              3
            </span>
            <span
              className={`text-xs font-bold ${
                currentStep === "checkout" ? "text-amber-400" : "text-slate-400"
              }`}
            >
              Payment
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* ជំហាន 1: រើសថ្ងៃ ម៉ោង និងកៅអី */}
        {currentStep === "seats" && (
          <div className="space-y-8 animate-fadeIn">
            {/* រើសថ្ងៃ */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Select Date (Next 7 Days)
                </label>
                <span className="text-xs font-medium text-amber-400">
                  {selectedDate.displayDate}
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-2.5">
                {availableDates.map((item) => {
                  const active = selectedDate.fullDate === item.fullDate;
                  return (
                    <button
                      key={item.fullDate}
                      onClick={() => handleDateChange(item)}
                      className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                        active
                          ? "bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg shadow-amber-500/20 scale-102"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <span className="text-[10px] uppercase opacity-80">
                        {item.isToday ? "Today" : item.day}
                      </span>
                      <span className="text-base sm:text-lg font-extrabold my-0.5">
                        {item.date}
                      </span>
                      <span className="text-[10px] uppercase opacity-80">
                        {item.month}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* រើសម៉ោង និង Format */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Select Session Time & Format
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {showtimes.map((session) => {
                  const active = selectedShowtime.time === session.time;
                  return (
                    <button
                      key={session.time}
                      onClick={() => handleShowtimeChange(session)}
                      className={`flex flex-col items-start p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                        active
                          ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30 scale-102"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-base font-bold">{session.time}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            active
                              ? "bg-indigo-700 text-indigo-100"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {session.format}
                        </span>
                      </div>
                      <span
                        className={`text-xs mt-1 ${
                          active ? "text-indigo-200" : "text-slate-500"
                        }`}
                      >
                        {session.hall}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* អេក្រង់រោងកុន */}
            <div className="pt-4">
              <div className="relative w-full flex flex-col items-center">
                <div className="w-3/4 h-12 bg-gradient-to-b from-indigo-500/20 to-transparent blur-md rounded-t-full pointer-events-none" />
                <div className="w-4/5 h-2 bg-gradient-to-r from-transparent via-indigo-400 to-transparent rounded-full shadow-[0_0_15px_rgba(99,102,241,0.7)]" />
                <p className="text-[11px] uppercase tracking-widest text-indigo-300 font-semibold mt-2">
                  Cinema Hall Screen
                </p>
              </div>
            </div>

            {/* សម្គាល់ពណ៌កៅអី */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md bg-slate-800 border border-slate-700" />
                <span className="text-slate-400">Regular ($10)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md bg-purple-900/60 border border-purple-500/50" />
                <span className="text-slate-400">VIP Couple ($16)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md bg-amber-500 border border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <span className="text-slate-400">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-md bg-slate-700 border border-slate-600 opacity-40" />
                <span className="text-slate-400">Occupied</span>
              </div>
            </div>

            {/* ប្លង់កៅអី (A ដល់ F) */}
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[480px] flex flex-col items-center gap-2.5">
                {["A", "B", "C", "D", "E", "F"].map((rowLabel) => {
                  const rowSeats = seats.filter((s) => s.row === rowLabel);

                  return (
                    <div key={rowLabel} className="flex items-center gap-3">
                      <span className="w-5 text-xs font-bold text-slate-500 text-center">
                        {rowLabel}
                      </span>

                      <div className="flex items-center gap-2">
                        {rowSeats.map((seat, idx) => {
                          const isOccupied = seat.status === "occupied";
                          const isSelected = seat.status === "selected";
                          const isVip = seat.status === "vip";
                          const isAisle = idx === 4;

                          return (
                            <React.Fragment key={seat.id}>
                              {isAisle && <div className="w-6 sm:w-8" />}
                              <button
                                disabled={isOccupied}
                                onClick={() => toggleSeat(seat.id)}
                                title={`${seat.id} - ${
                                  isOccupied
                                    ? "Occupied"
                                    : isVip
                                    ? "VIP ($16)"
                                    : "Available ($10)"
                                }`}
                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all duration-150 ${
                                  isOccupied
                                    ? "bg-slate-800 text-slate-600 border border-slate-700 opacity-40 cursor-not-allowed"
                                    : isSelected
                                    ? "bg-amber-500 text-slate-950 border border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.6)] scale-110"
                                    : isVip
                                    ? "bg-purple-950/70 text-purple-300 border border-purple-600/60 hover:bg-purple-800/80 cursor-pointer"
                                    : "bg-slate-855 text-slate-400 border border-slate-750 hover:bg-slate-700 hover:text-white cursor-pointer"
                                }`}
                              >
                                <span>{seat.number}</span>
                              </button>
                            </React.Fragment>
                          );
                        })}
                      </div>

                      <span className="w-5 text-xs font-bold text-slate-500 text-center">
                        {rowLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* បង្ហាញកៅអីដែលរើស និងតម្លៃសរុប */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-auto">
                <p className="text-xs text-slate-400">Selected Seats</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map((s) => (
                      <span
                        key={s.id}
                        className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold"
                      >
                        {s.id} (${s.price})
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500 italic">
                      Please click on available seats above
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6">
                <div>
                  <p className="text-xs text-slate-400 text-right">Seat Total</p>
                  <p className="text-2xl font-black text-amber-400 text-right">
                    ${seatTotal.toFixed(2)}
                  </p>
                </div>

                <button
                  disabled={selectedSeats.length === 0}
                  onClick={() => setCurrentStep("snacks")}
                  className={`px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center gap-2 ${
                    selectedSeats.length > 0
                      ? "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/25 active:scale-98 cursor-pointer"
                      : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                  }`}
                >
                  <span>Continue to Food & Drinks</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ជំហាន 2: រើសទឹក និងពោត */}
        {currentStep === "snacks" && (
          <SnacksSelection
            snacks={snacks}
            onChange={setSnacks}
            onNext={() => setCurrentStep("checkout")}
            onBack={() => setCurrentStep("seats")}
          />
        )}

        {/* ជំហាន 3: បង់ប្រាក់ */}
        {currentStep === "checkout" && (
          <CheckoutPayment
            movieTitle={movieTitle}
            date={selectedDate.displayDate}
            showtime={selectedShowtime.time}
            hall={selectedShowtime.hall}
            format={selectedShowtime.format}
            selectedSeats={selectedSeats}
            selectedSnacks={selectedSnacks}
            seatTotal={seatTotal}
            snackTotal={snackTotal}
            onBack={() => setCurrentStep("snacks")}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
      </div>

      {/* បង្ហាញសំបុត្រ E-Ticket ពេលបង់លុយរួច */}
      {completedTicket && (
        <ETicketModal
          ticket={completedTicket}
          onClose={resetBooking}
          showMyBookingsLink={true}
        />
      )}
    </div>
  );
}
