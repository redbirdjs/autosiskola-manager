import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'

import { getExams } from '@/utils/actions'

export default async function ExamsPage() {
  const exams = await getExams();

  return (
    <div>
      <DataTable columns={columns} data={exams} />
    </div>
  );
}