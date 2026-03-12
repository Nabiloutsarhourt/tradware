import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function OrdersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user?.id)
        .single()

    const role = profile?.role || 'client'

    let orders: any[] = []

    if (role === 'client') {
        const { data } = await supabase
            .from('translation_orders')
            .select(`
        id,
        status,
        type,
        price,
        source_language,
        target_language,
        created_at,
        documents(file_name)
      `)
            .eq('client_id', user?.id)
            .order('created_at', { ascending: false })

        orders = data || []
    } else if (role === 'translator') {
        const { data } = await supabase
            .from('translation_orders')
            .select(`
        id,
        status,
        type,
        price,
        source_language,
        target_language,
        created_at,
        documents(file_name)
      `)
            .eq('translator_id', user?.id)
            .order('created_at', { ascending: false })

        orders = data || []
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return <Badge variant="secondary">En attente d'attribution</Badge>
            case 'assigned': return <Badge variant="default" className="bg-blue-500">Attribuée</Badge>
            case 'in_progress': return <Badge variant="default" className="bg-yellow-500">En cours</Badge>
            case 'completed': return <Badge variant="default" className="bg-green-500">Terminée</Badge>
            case 'cancelled': return <Badge variant="destructive">Annulée</Badge>
            default: return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {role === 'translator' ? 'Mes Missions' : 'Mes Commandes'}
                </h1>
                <p className="text-muted-foreground">
                    Consultez et suivez l'état de vos commandes de traduction.
                </p>
            </div>

            <div className="grid gap-4">
                {orders.length === 0 ? (
                    <Card>
                        <CardContent className="py-10 text-center">
                            <p className="text-muted-foreground">Vous n'avez pas encore de commandes.</p>
                        </CardContent>
                    </Card>
                ) : (
                    orders.map((order: any) => (
                        <Card key={order.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                                <div className="space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-semibold">{order.documents?.file_name}</h3>
                                        {getStatusBadge(order.status)}
                                        <Badge variant="outline" className="uppercase text-xs">{order.type}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {order.source_language} to {order.target_language}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Commandé le {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>

                                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                                    <div className="text-right mr-4">
                                        <p className="font-bold text-lg">€{order.price}</p>
                                    </div>
                                    {order.status === 'completed' ? (
                                        <Button variant="outline" size="sm">
                                            <Download className="mr-2 h-4 w-4" /> Télécharger
                                        </Button>
                                    ) : (
                                        <Button variant="secondary" size="sm">
                                            <Eye className="mr-2 h-4 w-4" /> Voir les détails
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
