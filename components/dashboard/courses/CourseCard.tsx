import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import JoinCourseSheet from '@/components/dashboard/courses/JoinCourseSheet'

export default async function CourseCard({ category }: { category: { name: string, id: number } }) {
  return (
    <Card className='min-w-[300px]'>
      <CardHeader className='flex flex-col items-center gap-5'>
        <p className='font-normal'>Category</p>
        <CardTitle className='px-5 py-5 text-white bg-black rounded-lg'>{ category.name }</CardTitle>
        <hr className='w-full' />
      </CardHeader>
      <CardContent className='flex flex-col items-center gap-2'>
        <CardDescription className='flex flex-col items-center gap-2'>Click on the button to enroll to the course.</CardDescription>
        <JoinCourseSheet category={category} />
      </CardContent>
    </Card>
  );
}