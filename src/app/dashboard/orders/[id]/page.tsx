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
                    <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
                    <p className="text-muted-foreground">Detailed view of the translation request.</p>
                </div>
                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="text-base uppercase">
                    {order.status}
                </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Source Document</CardTitle>
                        <CardDescription>Details about the requested translation.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">File Name</p>
                            <p className="text-base">{order.documents?.file_name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Languages</p>
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
                                <Download className="mr-2 h-4 w-4" /> Download Original
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Translation Delivery</CardTitle>
                        <CardDescription>Fulfillment status and delivery options.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {order.status === 'completed' ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm">
                                    This translation has been completed and is ready for download.
                                </div>
                                <Button className="w-full">
                                    <Download className="mr-2 h-4 w-4" /> Download Translation
                                </Button>
                            </div>
                        ) : role === 'translator' && order.translator_id === user.id ? (
                            <UploadTranslationForm orderId={order.id} />
                        ) : (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                                Translation is currently {order.status}.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
