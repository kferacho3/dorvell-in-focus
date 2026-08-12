import { ChannelLanding } from '@/components/editorial/ChannelLanding'
import { getChannelByKey } from '@/lib/cms/channel-settings'

import type { Metadata } from 'next'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  // Titles come from the CMS so a channel rename never requires a code change.
  const channel = await getChannelByKey('motion')
  return { title: channel.label, description: channel.description }
}

export default function MotionChannelPage() {
  return <ChannelLanding channel="motion" />
}
