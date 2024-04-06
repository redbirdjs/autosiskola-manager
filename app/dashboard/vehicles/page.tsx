import { getVehicles } from '@/utils/actions'

import { VehicleCard } from '@/components/dashboard/VehicleCard'
import DynamicPagination from '@/components/dashboard/Pagination'

export default async function VehiclesPage({ searchParams }: { searchParams: { query?: string, page?: string } }) {
  const query = searchParams?.query || '';
  const page = searchParams?.page || '1';
  
  const searchResults = await getVehicles({ query: query, page: page });

  return (
    <div>
      {
        searchResults.vehicles.map(vehicle => (
          <VehicleCard key={vehicle.plate} vehicle={vehicle} />
        ))
      }
      <DynamicPagination currentPage={page} pages={searchResults.pages} />
    </div>
  );
}