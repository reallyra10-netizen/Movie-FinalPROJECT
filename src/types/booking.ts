// ស្ថានភាពកៅអី
export type SeatStatus = "available" | "occupied" | "selected" | "vip";

// ព័ត៌មានកៅអីមួយ
export interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  price: number;
}

// មុខម្ហូប និងភេសជ្ជៈ
export interface SnackItem {
  id: string;
  name: string;
  nameKhmer: string;
  category: "popcorn" | "drink" | "combo" | "snack";
  price: number;
  icon: string;
  description: string;
  quantity: number;
}

// ម៉ោងបញ្ចាំង
export interface Showtime {
  time: string;
  format: string;
  hall: string;
}

// កាលបរិច្ឆេទបញ្ចាំង
export interface BookingDate {
  day: string;
  date: string;
  month: string;
  year: number;
  fullDate: string;
  displayDate: string;
  isToday: boolean;
}

// វិធីបង់ប្រាក់
export type PaymentMethod = "KHQR" | "CARD" | "CASH";

// ព័ត៌មានសំបុត្រដែលកក់រួច
export interface BookingTicket {
  id: string;
  movieId?: number | string;
  movieTitle: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  date: string;
  showtime: string;
  hall: string;
  format: string;
  seats: {
    id: string;
    price: number;
    type: "regular" | "vip";
  }[];
  snacks: {
    id: string;
    name: string;
    nameKhmer: string;
    quantity: number;
    price: number;
  }[];
  seatTotal: number;
  snackTotal: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "PAID" | "PENDING" | "CANCELLED";
  customerName?: string;
  customerPhone?: string;
  createdAt: string;
}
