import Pagination from '@/app/ui/components/pagination';
import { TableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { fetchFilteredData, getPagesAmount } from '@/app/lib/data/generic';
import DatabasePromotionsTable from '@/app/ui/database/database-promotion-table';
import ClientSideExcelFilters from '@/app/ui/components/client-side-excel-filters';

export const metadata: Metadata = {
  title: 'Base de datos',
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const params = await props.searchParams;
  const query = params?.query || '';
  const currentPage = Number(params?.page || 1);

  const pageSearchParams = new URLSearchParams({ show_all: 'true' });
  const dataList: any = await fetchFilteredData({
    path: 'promotion/',
    query: '',
    currentPage: currentPage,
    urlParams: pageSearchParams,
    addPremiseQuery: true,
  });
  const data = dataList['promotions'];
  const totalPages = getPagesAmount(dataList['count']);

  return (
    <div className="w-full">
      <div className="w-full text-xl">Exportar participaciones a Excel</div>
      <Suspense
        key={query + currentPage}
        fallback={<TableSkeleton titles={['Promoción']} />}
      >
        <ClientSideExcelFilters>
          <DatabasePromotionsTable data={data} />
        </ClientSideExcelFilters>
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
