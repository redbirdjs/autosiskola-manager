import { getVehicles } from '@/utils/actions'

import { VehicleCard } from '@/components/dashboard/VehicleCard'

export default async function VehiclesPage() {
  const searchResluts = await getVehicles({ query: '', page: '1' });

  return (
    <div>
      {
        searchResluts.vehicles.map(vehicle => (
          <VehicleCard key={vehicle.plate} vehicle={vehicle} />
        ))
      }
    </div>
  );
}