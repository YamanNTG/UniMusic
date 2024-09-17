import { fetchReservations } from "@/utils/actions";
import Link from "next/link";
import EmptyList from "@/components/home/EmptyList";
import { formatDate, formatCurrency } from "@/utils/format";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function ReservationsPage() {
  const reservations = await fetchReservations();
  if (reservations.length === 0) return <EmptyList />;
  return (
    <div className="mt-16">
      <h4 className="mb-4 capitalize">
        total reservations : {reservations.length}
      </h4>
      <Table>
        <TableCaption>A list of your recent reservations.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Property Name</TableHead>
            <TableHead>Order Total</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Start Hour</TableHead>
            <TableHead>Hours Booked</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((item) => {
            const { id, orderTotal, startTime } = item;
            const { id: instrumentId, name } = item.instrument;
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
                <TableCell>{formatCurrency(orderTotal)}</TableCell>
                <TableCell>{startDate}</TableCell>
                <TableCell>{startHour}</TableCell>
                <TableCell>{hoursBooked}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default ReservationsPage;
