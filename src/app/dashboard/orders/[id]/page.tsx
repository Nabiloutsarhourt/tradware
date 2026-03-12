import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import UploadTranslationForm from './UploadTranslationForm'

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return notFound()
    }

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    const role = profile?.role || 'client'

    const { data: order } = await supabase
        .from('translation_orders')
        .select(`
      *,
      documents!document_id (file_name, page_count, file_url),
      client:users!client_id (full_name),
      translator:translators!translator_id (id)
    `)
        .eq('id', params.id)
        .single()

    if (!order) {
        return notFound()
    }

    // Security check: Only client or assigned translator or admin can view
    if (role === 'client' && order.client_id !== user.id) return notFound()
    if (role === 'translator' && order.translator_id !== user.id && order.status !== 'pending') return notFound()

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Détails de la Commande</h1>
                    <p className="text-muted-foreground">Vue détaillée de la demande de traduction.</p>
                </div>
                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="text-base uppercase">
                    {order.status}
                </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Document Source</CardTitle>
                        <CardDescription>Détails sur la traduction demandée.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Nom du Fichier</p>
                            <p className="text-base">{order.documents?.file_name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Langues</p>
                            <p className="text-base">{order.source_language} → {order.target_language}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Type</p>
                            <p className="text-base capitalize">{order.type}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Client</p>
                            <p className="text-base">{order.client?.full_name}</p>
                        </div>
                    </CardContent>
                    {role === 'translator' && (
                        <CardFooter>
                            <Button variant="outline" className="w-full">
                                <Download className="mr-2 h-4 w-4" /> Télécharger l&apos;Original
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Livraison de la Traduction</CardTitle>
                        <CardDescription>État d&apos;avancement et options de livraison.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {order.status === 'completed' ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm">
                                    Cette traduction est terminée et prête à être téléchargée.
                                </div>
                                <Button className="w-full">
                                    <Download className="mr-2 h-4 w-4" /> Télécharger la Traduction
                                </Button>
                            </div>
                        ) : role === 'translator' && order.translator_id === user.id ? (
                            <UploadTranslationForm orderId={order.id} />
                        ) : (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                L&apos;état actuel de la traduction est : {order.status}.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
