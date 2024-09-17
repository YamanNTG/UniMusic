import EmptyList from "@/components/home/EmptyList";
import { fetchClasses, deleteClassAction } from "@/utils/actions";
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

async function ClassesPage() {
  const classes = await fetchClasses();

  if (classes.length === 0) {
    return (
      <EmptyList
        heading="No classes to display."
        message="Don't hesitate to create a class"
      />
    );
  }

  return (
    <div className="mt-16">
      <h4 className="capitalize mb-4">Active Classes: {classes.length}</h4>
      <Table>
        <TableCaption>A list of all your Classes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Instrument Name</TableHead>
            <TableHead>Hourly Rate </TableHead>
            <TableHead>Total Income</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((item) => {
            const { id: instrumentId, name, price } = item;
            const { orderTotalSum } = item;
            return (
              <TableRow>
                <TableCell>
                  <Link
                    href={`/instruments/${instrumentId}`}
                    className="underline text-muted-foreground tracking-wide"
                  >
                    {name}
                  </Link>
                </TableCell>
                <TableCell>{formatCurrency(price)}</TableCell>
                <TableCell>{formatCurrency(orderTotalSum)}</TableCell>
                <TableCell className="flex items-center gap-x-2">
                  <Link href={`/classes/${instrumentId}/edit`}>
                    <IconButton actionType="edit"></IconButton>
                  </Link>
                  <DeleteClass instrumentId={instrumentId} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function DeleteClass({ instrumentId }: { instrumentId: string }) {
  const deleteClass = deleteClassAction.bind(null, { instrumentId });
  return (
    <FormContainer action={deleteClass}>
      <IconButton actionType="delete" />
    </FormContainer>
  );
}

export default ClassesPage;
