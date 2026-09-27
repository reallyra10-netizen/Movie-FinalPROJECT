import { Metadata } from "next";
import MyBookingsComponent from "@/components/booking/MyBookingsComponent";

export const metadata: Metadata = {
  title: "My Cinema Bookings & Tickets - Watch.ME",
  description: "View your reserved cinema tickets, admission QR codes, and booking history.",
};

export default function MyBookingsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 py-10 pt-24 sm:pt-28">
      <MyBookingsComponent />
    </main>
  );
}
