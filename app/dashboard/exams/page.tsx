import { DataTable } from '@/components/ui/data-table'
import { columns } from './columns';
import { Exam } from '@/lib/definitions'

export default function ExamsPage() {
  const exams: Exam[] = [
    {
      id: 1,
      date: new Date(Date.now()),
      category: 'B',
      student: 'Test Student|test_user',
      description: 'Test Exam',
      state: 0
    }
  ]

  return (
    <div>
      <DataTable columns={columns} data={exams} />
    </div>
  );
}