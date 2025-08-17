import TrendingClient from './client-page'
import { fetchTrendingScams } from '@/lib/api'

export default async function TrendingPage() {
  const trendingScams = await fetchTrendingScams(20)

  return <TrendingClient scams={trendingScams} />
}