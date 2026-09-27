import { useSyncExternalStore } from "react";
import { BookingTicket } from "@/types/booking";

const STORAGE_KEY = "watchme_cinema_bookings";
const EVENT_NAME = "watchme_booking_updated";

// ទាញយកសំបុត្រទាំងអស់ពី localStorage
export function getAllBookings(): BookingTicket[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: BookingTicket[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load bookings from localStorage:", error);
    return [];
  }
}

// snapshot សម្រាប់ sync ទិន្នន័យជាមួយ React
let cachedBookings: BookingTicket[] = [];
let lastRawString: string | null = null;

export function getBookingsSnapshot(): BookingTicket[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY) || "[]";

  if (raw !== lastRawString) {
    lastRawString = raw;
    try {
      cachedBookings = JSON.parse(raw);
    } catch {
      cachedBookings = [];
    }
  }
  return cachedBookings;
}

// រក្សាទុកសំបុត្រថ្មីចូល localStorage
export function saveBooking(ticket: BookingTicket): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getAllBookings();
    const updated = [ticket, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // ប្រាប់ component ផ្សេងទៀតឱ្យ update ដែរ
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: ticket }));
  } catch (error) {
    console.error("Failed to save booking:", error);
  }
}

// ស្វែងរកសំបុត្រតាម id
export function getBookingById(id: string): BookingTicket | null {
  const all = getAllBookings();
  return all.find((b) => b.id === id) || null;
}

// cancel សំបុត្រ (ដូរ status ទៅ CANCELLED)
export function cancelBooking(id: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const existing = getAllBookings();
    const index = existing.findIndex((b) => b.id === id);
    if (index === -1) return false;

    existing[index].paymentStatus = "CANCELLED";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, { detail: { id, status: "CANCELLED" } })
    );
    return true;
  } catch (error) {
    console.error("Failed to cancel booking:", error);
    return false;
  }
}

// លុបសំបុត្រចេញពី localStorage តែម្តង
export function deleteBooking(id: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const existing = getAllBookings();
    const filtered = existing.filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, { detail: { id, deleted: true } })
    );
    return true;
  } catch (error) {
    console.error("Failed to delete booking:", error);
    return false;
  }
}

// ឆែកមើលថាតើរឿងនេះ ថ្ងៃនេះ និងម៉ោងនេះ មានកៅអីណាខ្លះគេកក់ហើយ
export function getBookedSeatsForShow(
  movieTitle: string,
  date: string,
  showtime: string
): string[] {
  const all = getAllBookings();
  const matchedBookings = all.filter(
    (b) =>
      b.movieTitle.toLowerCase() === movieTitle.toLowerCase() &&
      b.date === date &&
      b.showtime === showtime &&
      b.paymentStatus === "PAID"
  );

  const bookedSeats: string[] = [];
  matchedBookings.forEach((b) => {
    b.seats.forEach((s) => {
      if (!bookedSeats.includes(s.id)) {
        bookedSeats.push(s.id);
      }
    });
  });

  return bookedSeats;
}

// រាប់ចំនួនសំបុត្រដែលបានទិញជោគជ័យ (PAID)
export function getActiveBookingCount(): number {
  return getAllBookings().filter((b) => b.paymentStatus === "PAID").length;
}

// function សម្រាប់ស្តាប់ពេលមានការកក់ថ្មី ឬ cancel
export function subscribeToBookingUpdates(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}

const emptyBookings: BookingTicket[] = [];

// custom hook សម្រាប់យកទិន្នន័យ bookings មកប្រើស្រួលក្នុង UI
export function useBookings(): BookingTicket[] {
  return useSyncExternalStore(
    subscribeToBookingUpdates,
    getBookingsSnapshot,
    () => emptyBookings
  );
}

// hook សម្រាប់យកចំនួនសំបុត្រដែលនៅមានសុពលភាព
export function useActiveTicketCount(): number {
  const bookings = useBookings();
  return bookings.filter((b) => b.paymentStatus === "PAID").length;
}
