"use client";

import React from "react";
import BookingForm from "./BookingForm";
import ConfirmBooking from "./ConfirmBooking";
import { useInstrument } from "@/utils/store";

function BookingContainer() {
  const { selectedDateTime } = useInstrument((state) => state);
  if (!selectedDateTime || !selectedDateTime.getTime()) {
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
