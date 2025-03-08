import { Card } from '@/app/ui/dashboard/cards';
import {
    fetchCardData,
} from '@/app/lib/data';

// export default async function CardWrapper() {
export default async function CardWrapper({
  numberOfInvoices,
  numberOfCustomers,
  totalPaidInvoices,
  totalPendingInvoices
}: {
  numberOfInvoices: number;
  numberOfCustomers: number;
  totalPaidInvoices: number;
  totalPendingInvoices: number;
}) {
    // const {
    //     numberOfInvoices,
    //     numberOfCustomers,
    //     totalPaidInvoices,
    //     totalPendingInvoices,
    // } = await fetchCardData(); // wait for fetchLatestInvoices() to finish

  return (
    <>
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
    </>
  );
}