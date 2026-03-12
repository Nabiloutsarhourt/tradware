import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AdminOrdersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user?.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/dashboard')
    }

    const { data: orders } = await supabase
        .from('translation_orders')
        .select(`
      id,
      status,
      type,
      price,
      source_language,
      target_language,
      created_at,
      documents(file_name, page_count),
      client:users!client_id (full_name, email),
      translator:translators!translator_id (id)
    `)
        .order('created_at', { ascending: false })

    const orderList = orders || []

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
                <h1 className="text-3xl font-bold tracking-tight">Gestion des Commandes</h1>
                <p className="text-muted-foreground">
                    Supervisez toutes les commandes de traduction de la plateforme.
                </p>
            </div>

            <div className="grid gap-4">
                {orderList.length === 0 ? (
                    <Card>
                        <CardContent className="py-10 text-center">
                            <p className="text-muted-foreground">Aucune commande passée pour le moment.</p>
                        </CardContent>
                    </Card>
                ) : (
                    orderList.map((order: any) => (
                        <Card key={order.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-semibold">{order.documents?.file_name}</h3>
                                        {getStatusBadge(order.status)}
                                        <Badge variant="outline" className="uppercase text-xs">{order.type}</Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="font-medium text-foreground">Client :</span> {order.client?.full_name}
                                        </div>
                                        <div>
                                            <span className="font-medium text-foreground">Langues :</span> {order.source_language} vers {order.target_language}
                                        </div>
                                        <div>
                                            <span className="font-medium text-foreground">Date :</span> {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                        </div>
                                        <div>
                                            <span className="font-medium text-foreground">ID Traducteur :</span> {order.translator?.id || 'Non attribué'}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 md:mt-0 flex flex-col items-end space-y-2">
                                    <div className="text-right">
                                        <p className="font-bold text-lg">{order.price} €</p>
                                        <p className="text-xs text-muted-foreground">{order.documents?.page_count} pages</p>
                                    </div>
                                    <Button variant="secondary" size="sm" asChild>
                                        <Link href={`/dashboard/orders/${order.id}`}>
                                            <Eye className="mr-2 h-4 w-4" /> Voir les détails
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
