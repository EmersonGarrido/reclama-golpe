import HomeClient from './client-page'
import { fetchScams, fetchTrendingScams } from '@/lib/api'

export default async function Home() {
  const [scamsData, trendingScams] = await Promise.all([
    fetchScams({ limit: 12, sortBy: 'createdAt', order: 'desc' }),
    fetchTrendingScams(5),
  ])

  return <HomeClient scamsData={scamsData} trendingScams={trendingScams} />
}