"use client";
import { subDays, setHours, setMinutes, isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useInstrument } from "@/utils/store";
import { defaultSelected } from "@/utils/calendar";
import { fetchBookingsTimes } from "@/utils/actions";

function BookingCalendar() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>(
    defaultSelected
  );
  const [bookedTimes, setBookedTimes] = useState<Date[]>([]); // State to store booked times for the selected date

  // Handle date and time change
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDateTime(date);
      console.log("Selected Date and Time:", date);
    } else {
      setSelectedDateTime(undefined); // Set to undefined if date is null
    }
  };

  // Fetch booked times and filter based on the selected date
  useEffect(() => {
    const fetchBookedTimesForDate = async () => {
      try {
        const bookings = await fetchBookingsTimes(); // Fetch all bookings from the database
        // Filter bookings that match the selected date only
        const filteredBookings = bookings
          .filter((booking) =>
            selectedDateTime
              ? isSameDay(new Date(booking.startTime), selectedDateTime)
              : false
          )
          .map((booking) => new Date(booking.startTime));

        setBookedTimes(filteredBookings); // Set booked times for the specific selected date
      } catch (error) {
        console.error("Error fetching booked times:", error);
      }
    };

    if (selectedDateTime) {
      fetchBookedTimesForDate(); // Fetch booked times whenever the selected date changes
    } else {
      setBookedTimes([]); // Clear booked times if no date is selected
    }
  }, [selectedDateTime]);

  // Define available times from 10 AM to 10 PM
  const availableTimes = Array.from({ length: 13 }, (_, i) => {
    const hour = 10 + i; // Start from 10 AM
    const date = new Date();
    date.setHours(hour, 0, 0, 0); // Set hour and reset minutes, seconds, and milliseconds
    return date;
  });

  // Update Zustand store when selectedDateTime changes
  useEffect(() => {
    useInstrument.setState({ selectedDateTime });
  }, [selectedDateTime]);

  return (
    <div>
      <DatePicker
        selected={selectedDateTime ?? null} // Use null if selectedDateTime is undefined
        onChange={handleDateChange}
        showTimeSelect
        minDate={subDays(new Date(), 0)}
        inline
        timeFormat="HH:mm"
        timeIntervals={60}
        timeCaption="Hours"
        includeTimes={availableTimes}
        excludeTimes={bookedTimes} // Exclude only booked times for the specific selected date
        placeholderText="Select a date and time"
      />
    </div>
  );
}

export default BookingCalendar;
