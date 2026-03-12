'use client'

import dynamic from 'next/dynamic'

// Dynamically import the MapContent component with SSR disabled
const MapContent = dynamic(
    () => import('./MapContent'),
    {
        ssr: false,
        loading: () => <div className="w-full h-full min-h-[400px] rounded-md bg-muted animate-pulse" />
    }
)

export default function TranslatorMap({ translators }: { translators: Record<string, unknown>[] }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <MapContent translators={translators as any} />
}
