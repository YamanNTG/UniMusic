"use client";

import React from "react";
import BookingForm from "./BookingForm";
import ConfirmBooking from "./ConfirmBooking";
import { useInstrument } from "@/utils/store";

function BookingContainer() {
  const { selectedDateTime } = useInstrument((state) => state);
  if (
    !selectedDateTime ||
    isNaN(selectedDateTime.getTime()) ||
    (selectedDateTime.getHours() === 0 && selectedDateTime.getMinutes() === 0)
  ) {
    return null;
  }
  return (
    <div className="w-full">
      <BookingForm />

      <ConfirmBooking />
    </div>
  );
}

export default BookingContainer;
