import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import TranslatorMap from '@/components/map/TranslatorMap'
import { MapPin } from 'lucide-react'

export const metadata = {
    title: 'Rechercher un Traducteur | Tradware',
    description: 'Comparez et trouvez les traducteurs assermentés disponibles sur la carte.'
}

export default async function SearchPage() {
    const supabase = await createClient()

    // Fetch verified translators with their profiles
    const { data: translators } = await supabase
        .from('translators')
        .select(`
            id,
            languages_spoken,
            price_per_page,
            latitude,
            longitude,
            address,
            users!id (full_name)
        `)
        .eq('is_verified', true)

    // Transform the data to match the expected props for MapContent
    type SupabaseTranslator = { id: string; languages_spoken: string[]; price_per_page: number; latitude: number; longitude: number; address: string; users: { full_name: string } | { full_name: string }[] | null };
    const formattedTranslators = translators?.map((t: SupabaseTranslator) => {
        const userName = Array.isArray(t.users) ? t.users[0]?.full_name : t.users?.full_name;
        return {
            id: t.id,
            full_name: userName || 'Traducteur Anonyme',
            languages_spoken: t.languages_spoken,
            price_per_page: t.price_per_page,
            latitude: t.latitude,
            longitude: t.longitude,
            address: t.address
        }
    }) || []

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="bg-muted/30 border-b px-6 py-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Trouver un Traducteur</h1>
                    <p className="text-muted-foreground">
                        Comparez les prix et localisez les traducteurs assermentés près de chez vous.
                    </p>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Scrollable List Section */}
                <div className="w-full lg:w-1/3 xl:w-1/4 h-full overflow-y-auto border-r bg-background p-4 space-y-4">
                    <h2 className="font-semibold text-lg mb-4">{formattedTranslators.length} Traducteurs Disponibles</h2>

                    {formattedTranslators.length === 0 ? (
                        <p className="text-muted-foreground text-sm">Aucun traducteur vérifié pour le moment.</p>
                    ) : (
                        formattedTranslators.map((t) => (
                            <Card key={t.id} className="hover:border-primary transition-colors cursor-default">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-base truncate pr-2">{t.full_name}</h3>
                                        <Badge variant="secondary" className="font-bold bg-primary/10 text-primary whitespace-nowrap">
                                            {t.price_per_page} € / p.
                                        </Badge>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {t.languages_spoken.map((lang: string) => (
                                            <Badge key={lang} variant="outline" className="text-xs">
                                                {lang}
                                            </Badge>
                                        ))}
                                    </div>

                                    {t.address && (
                                        <div className="flex items-start text-xs text-muted-foreground mt-2">
                                            <MapPin className="h-3 w-3 mr-1 mt-0.5 shrink-0" />
                                            <span className="line-clamp-2">{t.address}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Map Section */}
                <div className="hidden lg:block lg:w-2/3 xl:w-3/4 h-full relative z-0">
                    <TranslatorMap translators={formattedTranslators} />
                </div>
            </div>
        </div>
    )
}
