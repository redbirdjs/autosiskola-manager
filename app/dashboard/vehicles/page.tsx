import { SearchX } from 'lucide-react'

import VehicleCard from '@/components/dashboard/VehicleCard'
import DynamicPagination from '@/components/dashboard/Pagination'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

import { getVehicles, getCategories } from '@/utils/actions'

export default async function VehiclesPage({ searchParams }: { searchParams: { query?: string, page?: string } }) {
  const query = searchParams?.query || '';
  const page = searchParams?.page || '1';
  
  const searchResults = await getVehicles({ query: query, page: page });
  const categories = await getCategories();

  return (
    <div>
      {
        searchResults.vehicles.length != 0 ? searchResults.vehicles.map(vehicle => (
          <VehicleCard key={vehicle.plate} vehicle={vehicle} categories={categories} />
        )) : (
          <div className='flex justify-center p-10'>
            <Alert className='w-max'>
              <SearchX className='w-5 h-5' />
              <AlertTitle>No vehicles found!</AlertTitle>
              <AlertDescription>
                No vehicles found for the specified query. Please try another one.
              </AlertDescription>
            </Alert>
          </div>
        )
      }
      <DynamicPagination currentPage={page} pages={searchResults.pages} />
    </div>
  );
}