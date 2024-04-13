import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'

export default function StatCard({ title, description }: { title: React.ReactNode, description: any }) {
  return (
    <Card className='flex-grow'>
          <CardHeader className='pt-4 pb-2'>
            <CardTitle className='flex gap-2 items-center'>{ title }</CardTitle>
          </CardHeader>
          <CardContent className='pb-4'>
            <CardDescription className='text-4xl'>{ description }</CardDescription>
          </CardContent>
        </Card>
  );
}