import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns'

import { getUserData, logout } from '@/utils/user-actions'
import { getExams } from '@/utils/course-actions'

export default async function ExamsPage() {
  const user = await getUserData();
  if (!user) {
    logout();
    return;
  }
  const exams = await getExams(user.id, user.rank);

  return (
    <div>
      <DataTable columns={columns} data={exams} />
    </div>
  );
}