import { SearchX } from 'lucide-react'

import VehicleCard from '@/components/dashboard/VehicleCard'
import DynamicPagination from '@/components/dashboard/Pagination'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

import { getCategories } from '@/utils/course-actions'
import { getVehicles } from '@/utils/vehicle-actions'
import { getImageProvider } from '@/lib/utils'

export default async function VehiclesPage({ searchParams }: { searchParams: { query?: string, page?: string } }) {
  const query = searchParams?.query || '';
  const page = searchParams?.page || '1';
  
  const searchResults = await getVehicles({ query: query, page: page });
  const categories = await getCategories();
  const provider = getImageProvider();

  return (
    <div className='overflow-x-scroll'>
      {
        searchResults.vehicles.length != 0 ? searchResults.vehicles.map(vehicle => (
          <VehicleCard key={vehicle.plate} vehicle={vehicle} categories={categories} provider={provider} />
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