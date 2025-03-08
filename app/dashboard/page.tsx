import CardWrapper from '@/app/ui/dashboard/card-wrapper';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import {
    InvoiceForm,
    Revenue,
    LatestInvoiceRaw,
} from '@/app/lib/definitions';
import postgres from 'postgres';

export default async function Page() {
    const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

    const invoiceCountsPromise = sql`SELECT 
    (SELECT COUNT(*) FROM invoices) AS invoice_count,
    (SELECT COUNT(*) FROM customers) AS customer_count,
    SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid,
    SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending
FROM invoices;
`;
    const revenuePromise = sql<Revenue[]>`SELECT * FROM revenue`;
    const latestInvoicesPromise = sql<LatestInvoiceRaw[]>`SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;


    // Wait for all promises to resolve and extract the required values from the query results
    const [invoiceCountsResult, revenueResult, latestInvoicesResult] = await Promise.all([
        invoiceCountsPromise,
        revenuePromise,
        latestInvoicesPromise,
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Uncomment if want to slow down the loading more to see loading sprite
    ]);

    // Extract the counts from invoice counts result
    const {
        invoice_count: numberOfInvoices,
        customer_count: numberOfCustomers,
        paid: totalPaidInvoices,
        pending: totalPendingInvoices
    } = invoiceCountsResult?.[0];
    
    const revenue = revenueResult;
    const latestInvoices = latestInvoicesResult.map((invoice) => ({
        id: invoice.id,
        name: invoice.name,
        image_url: invoice.image_url,
        email: invoice.email,
        amount: invoice.amount.toString()
    }));

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CardWrapper numberOfInvoices={numberOfInvoices} numberOfCustomers={numberOfCustomers} totalPaidInvoices={totalPaidInvoices} totalPendingInvoices={totalPendingInvoices}
                />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <RevenueChart revenue={revenue} />
                <LatestInvoices latestInvoices={latestInvoices} />
            </div>
        </main>
    );
}