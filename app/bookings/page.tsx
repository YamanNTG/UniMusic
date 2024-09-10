import EmptyList from "@/components/home/EmptyList";
import Link from "next/link";

import { formatCurrency } from "@/utils/format";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import FormContainer from "@/components/form/FormContainer";
import { IconButton } from "@/components/form/Buttons";
import { fetchBookings, deleteBookingAction } from "@/utils/actions";

async function BookingsPage() {
  const bookings = await fetchBookings();
  if (bookings.length === 0) {
    return <EmptyList />;
  }
  return (
    <div className="mt-16">
      <h4 className="mb-4 capitalize">total bookings: {bookings.length}</h4>
      <Table>
        <TableCaption>A list of your recent bookings.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Class Name</TableHead>
            <TableHead>Hours Booked</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date of booking</TableHead>
            <TableHead>Starting hour</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const { id, orderTotal, startTime } = booking;
            const { id: instrumentId, name } = booking.instrument;
            const startDate = startTime.toLocaleDateString("en-US");
            const startHour = startTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const hoursBooked = 1; // Need to change functionality to store the amount of hours booked
            // for the moment can only be booked one hour at a time
            return (
              <TableRow key={id}>
                <TableCell>
                  <Link
                    href={`/instruments/${instrumentId}`}
                    className="underline text-muted-foreground tracking-wide"
                  >
                    {name}
                  </Link>
                </TableCell>
                <TableCell>{hoursBooked}</TableCell>
                <TableCell>{formatCurrency(orderTotal)}</TableCell>
                <TableCell>{startDate}</TableCell>
                <TableCell>{startHour}</TableCell>
                <TableCell>
                  <DeleteBooking bookingId={id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function DeleteBooking({ bookingId }: { bookingId: string }) {
  const deleteBooking = deleteBookingAction.bind(null, { bookingId });
  return (
    <FormContainer action={deleteBooking}>
      <IconButton actionType="delete" />
    </FormContainer>
  );
}

export default BookingsPage;
