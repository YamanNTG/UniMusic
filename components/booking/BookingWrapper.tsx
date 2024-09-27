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
  isOwner: boolean;
};

function BookingWrapper({
  instrumentId,
  price,
  bookings,
  isOwner,
}: BookingWrapperProps) {
  useEffect(() => {
    useInstrument.setState({
      instrumentId,
      price,
      bookings,
    });
  }, [instrumentId, price, bookings]);

  return (
    <div>
      {isOwner ? (
        <BookingCalendar />
      ) : (
        <>
          <BookingCalendar />
          <BookingContainer />
        </>
      )}
    </div>
  );
}

export default BookingWrapper;
