import { create } from "zustand";
import { Booking } from "./types";
// Define the state's shape
type InstrumentState = {
  instrumentId: string;
  price: number;
  bookings: Booking[];
  selectedDateTime: Date | undefined;
};

// Create the store
export const useInstrument = create<InstrumentState>(() => {
  return {
    instrumentId: "",
    price: 0,
    bookings: [],
    selectedDateTime: undefined,
  };
});
