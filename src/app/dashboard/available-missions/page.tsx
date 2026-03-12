import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { claimMission } from './actions'
import { redirect } from 'next/navigation'

export default async function AvailableMissionsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user?.id)
        .single()

    if (profile?.role !== 'translator') {
        redirect('/dashboard')
    }

    // Get available missions (orders that are pending and matching certification?)
    // For MVP, we'll just show all pending orders
    const { data: missions } = await supabase
        .from('translation_orders')
        .select(`
      id,
      status,
      type,
      price,
      source_language,
      target_language,
      created_at,
      documents(file_name, page_count)
    `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    const availableMissions = missions || []

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Missions Disponibles</h1>
                <p className="text-muted-foreground">
                    Parcourez et acceptez les demandes de traduction des clients.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {availableMissions.length === 0 ? (
                    <Card className="col-span-full">
                        <CardContent className="py-10 text-center">
                            <p className="text-muted-foreground">Aucune mission disponible pour le moment.</p>
                        </CardContent>
                    </Card>
                ) : (
                    availableMissions.map((mission: any) => (
                        <Card key={mission.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{mission.documents?.file_name}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {mission.source_language} → {mission.target_language}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="uppercase text-xs">{mission.type}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-muted/50 p-3 rounded-md">
                                        <div>
                                            <p className="text-sm font-medium">Pages</p>
                                            <p className="text-sm text-muted-foreground">{mission.documents?.page_count}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">Gain estimé</p>
                                            <p className="text-lg font-bold text-primary">{mission.price} €</p>
                                        </div>
                                    </div>
                                    <form action={claimMission}>
                                        <input type="hidden" name="orderId" value={mission.id} />
                                        <Button type="submit" className="w-full">
                                            Accepter la Mission
                                        </Button>
                                    </form>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
