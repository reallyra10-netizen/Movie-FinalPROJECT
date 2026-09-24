"use client";

import React, { useState } from "react";

type SeatStatus = "available" | "occupied" | "selected" | "vip";

interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  price: number;
}

export interface MovieBookingCardProps {
  movieTitle?: string;
  backdropPath?: string | null;
  posterPath?: string | null;
  runtime?: number;
  voteAverage?: number;
  genres?: { id: number; name: string }[];
}

const generateSeats = (): Seat[] => {
  const rows = ["A", "B", "C", "D", "E", "F"];
  const seatsPerRow = 8;
  const occupiedIds = ["A3", "A4", "C2", "C7", "D4", "D5", "E1", "E8"];
  const vipRows = ["E", "F"];

  const seats: Seat[] = [];

  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      const id = `${row}${i}`;
      const isVip = vipRows.includes(row);
      const isOccupied = occupiedIds.includes(id);

      let status: SeatStatus = "available";
      if (isOccupied) {
        status = "occupied";
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

const showtimes = [
  { time: "13:15", format: "2D", hall: "Hall 03" },
  { time: "16:45", format: "3D", hall: "Hall 01" },
  { time: "19:30", format: "IMAX 3D", hall: "Hall 04" },
  { time: "22:15", format: "Dolby Atmos", hall: "Hall 02" },
];

const dates = [
  { day: "THU", date: "24", month: "SEP" },
  { day: "FRI", date: "25", month: "SEP" },
  { day: "SAT", date: "26", month: "SEP" },
  { day: "SUN", date: "27", month: "SEP" },
  { day: "MON", date: "28", month: "SEP" },
];

export default function MovieBookingCard({
  movieTitle = "Interstellar: Odyssey",
  backdropPath,
  posterPath,
  runtime,
  voteAverage = 8.9,
  genres = [],
}: MovieBookingCardProps) {
  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [selectedDate, setSelectedDate] = useState("24");
  const [selectedShowtime, setSelectedShowtime] = useState("19:30");
  const [isBooked, setIsBooked] = useState(false);

  const selectedSeats = seats.filter((s) => s.status === "selected");
  const totalPrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);

  const backdropUrl = backdropPath
    ? `https://image.tmdb.org/t/p/w1280${backdropPath}`
    : posterPath
    ? `https://image.tmdb.org/t/p/w780${posterPath}`
    : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1200&q=80";

  const formattedRuntime = runtime
    ? `${Math.floor(runtime / 60)}h ${runtime % 60}m`
    : "2h 15m";

  const genreNames = genres.length > 0
    ? genres.map((g) => g.name).slice(0, 2).join(" / ")
    : "Sci-Fi / Action";

  const toggleSeat = (id: string) => {
    setSeats((prev) =>
      prev.map((seat) => {
        if (seat.id !== id) return seat;
        if (seat.status === "occupied") return seat;

        if (seat.status === "selected") {
          const isVip = ["E", "F"].includes(seat.row);
          return { ...seat, status: isVip ? "vip" : "available" };
        }

        return { ...seat, status: "selected" };
      })
    );
  };

  const handleBooking = () => {
    if (selectedSeats.length > 0) {
      setIsBooked(true);
    }
  };

  const resetBooking = () => {
    setIsBooked(false);
    setSeats(generateSeats());
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-950 text-slate-100 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 my-8">
      {/* Header Banner */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-900">
        <img
          src={backdropUrl}
          alt={movieTitle}
          className="w-full h-full object-cover opacity-45 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                IMAX 3D
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
              Duration: {formattedRuntime} • Hall 01 • Grand Cinema Center
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-slate-400">Seat Price From</p>
              <p className="text-xl font-bold text-amber-400">$10.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Date Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Select Date
          </label>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {dates.map((item) => {
              const active = selectedDate === item.date;
              return (
                <button
                  key={item.date}
                  onClick={() => setSelectedDate(item.date)}
                  className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border transition-all duration-200 ${
                    active
                      ? "bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-lg shadow-amber-500/20"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <span className="text-[10px] uppercase opacity-80">{item.day}</span>
                  <span className="text-lg font-extrabold my-0.5">{item.date}</span>
                  <span className="text-[10px] uppercase opacity-80">{item.month}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Showtime Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Select Session Time
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {showtimes.map((session) => {
              const active = selectedShowtime === session.time;
              return (
                <button
                  key={session.time}
                  onClick={() => setSelectedShowtime(session.time)}
                  className={`flex flex-col items-start p-3 rounded-xl border transition-all duration-200 ${
                    active
                      ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base font-bold">{session.time}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                        active ? "bg-indigo-700 text-indigo-100" : "bg-slate-800 text-slate-400"
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

        {/* Screen Curved Line */}
        <div className="pt-4">
          <div className="relative w-full flex flex-col items-center">
            <div className="w-3/4 h-12 bg-gradient-to-b from-indigo-500/20 to-transparent blur-md rounded-t-full pointer-events-none" />
            <div className="w-4/5 h-2 bg-gradient-to-r from-transparent via-indigo-400 to-transparent rounded-full shadow-[0_0_15px_rgba(99,102,241,0.7)]" />
            <p className="text-[11px] uppercase tracking-widest text-indigo-300 font-semibold mt-2">
              Cinema Hall Screen
            </p>
          </div>
        </div>

        {/* Seat Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 py-2 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-slate-800 border border-slate-700" />
            <span className="text-slate-400">Available ($10)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-purple-900/60 border border-purple-500/50" />
            <span className="text-slate-400">VIP / Couple ($16)</span>
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

        {/* Seat Layout */}
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
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all duration-150 ${
                              isOccupied
                                ? "bg-slate-800 text-slate-600 border border-slate-700 opacity-40 cursor-not-allowed"
                                : isSelected
                                ? "bg-amber-500 text-slate-950 border border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.6)] scale-110"
                                : isVip
                                ? "bg-purple-950/70 text-purple-300 border border-purple-600/60 hover:bg-purple-800/80"
                                : "bg-slate-850 text-slate-400 border border-slate-750 hover:bg-slate-700 hover:text-white"
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

        {/* Footer Checkout Summary */}
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
                <span className="text-sm text-slate-500 italic">No seats selected</span>
              )}
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6">
            <div>
              <p className="text-xs text-slate-400 text-right">Total Payment</p>
              <p className="text-2xl font-black text-amber-400 text-right">
                ${totalPrice.toFixed(2)}
              </p>
            </div>

            <button
              disabled={selectedSeats.length === 0}
              onClick={handleBooking}
              className={`px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center gap-2 ${
                selectedSeats.length > 0
                  ? "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/25 active:scale-98 cursor-pointer"
                  : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
              }`}
            >
              <span>Book Seats</span>
            </button>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Dialog Overlay */}
      {isBooked && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white">Seats Reserved!</h3>
              <p className="text-sm text-slate-400 mt-1">
                Your ticket booking has been confirmed.
              </p>
            </div>

            <div className="bg-slate-950 border border-dashed border-slate-700 rounded-2xl p-4 text-left space-y-3">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-white text-base">{movieTitle}</h4>
                  <p className="text-xs text-slate-400">Grand Cinema • Screen 01</p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  IMAX 3D
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Date & Time</span>
                  <span className="font-semibold text-slate-200">24 SEP • {selectedShowtime}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Seats ({selectedSeats.length})</span>
                  <span className="font-semibold text-amber-400">
                    {selectedSeats.map((s) => s.id).join(", ")}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Paid</span>
                <span className="text-base font-extrabold text-amber-400">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={resetBooking}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm"
            >
              Done & Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
