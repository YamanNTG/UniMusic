"use client";

import { useInstrument } from "@/utils/store";
import { Booking } from "@/utils/types";
import BookingCalendar from "./BookingCalendar";
import BookingContainer from "./BookingContainer";
import { useEffect } from "react";

type BookingWrapperProps = {
  instrumentId: string;
  price: number;
  bookings: Booking[];
};

function BookingWrapper({
  instrumentId,
  price,
  bookings,
}: BookingWrapperProps) {
  useEffect(() => {
    useInstrument.setState({
      instrumentId,
      price,
      bookings,
    });
  }, []);
  return (
    <div>
      <BookingCalendar />
      <BookingContainer />
    </div>
  );
}

export default BookingWrapper;
