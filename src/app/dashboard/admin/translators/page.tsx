import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'
import { verifyTranslator } from './actions'

export default async function AdminTranslatorsPage() {
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

    const { data: translators } = await supabase
        .from('translators')
        .select(`
      id,
      languages_spoken,
      certification_url,
      is_verified,
      created_at,
      users!id (full_name, email)
    `)
        .order('created_at', { ascending: false })

    const translatorList = translators || []

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Gérer les Traducteurs</h1>
                <p className="text-muted-foreground">
                    Examinez les informations d&apos;identification et approuvez les traducteurs assermentés.
                </p>
            </div>

            <div className="grid gap-4">
                {translatorList.length === 0 ? (
                    <Card>
                        <CardContent className="py-10 text-center">
                            <p className="text-muted-foreground">Aucun traducteur enregistré pour le moment.</p>
                        </CardContent>
                    </Card>
                ) : (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    translatorList.map((t: any) => (
                        <Card key={t.id} className="flex flex-col md:flex-row md:items-center justify-between p-6">
                            <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                    <h3 className="font-semibold">{t.users?.full_name}</h3>
                                    <Badge variant={t.is_verified ? "default" : "secondary"}>
                                        {t.is_verified ? "Vérifié" : "En attente"}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{t.users?.email}</p>
                                <div className="flex gap-2 flex-wrap mt-2">
                                    {t.languages_spoken?.map((lang: string) => (
                                        <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                                    ))}
                                </div>
                                {t.certification_url && (
                                    <a href={`/path-to-storage/${t.certification_url}`} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mt-2 block">
                                        Voir le Document de Certification
                                    </a>
                                )}
                            </div>

                            <div className="mt-4 md:mt-0 flex items-center space-x-2">
                                {t.is_verified ? (
                                    <form action={verifyTranslator}>
                                        <input type="hidden" name="translatorId" value={t.id} />
                                        <input type="hidden" name="isVerified" value="false" />
                                        <Button variant="outline" size="sm" type="submit" className="text-destructive hover:text-destructive">
                                            <XCircle className="mr-2 h-4 w-4" /> Révoquer la Vérification
                                        </Button>
                                    </form>
                                ) : (
                                    <form action={verifyTranslator}>
                                        <input type="hidden" name="translatorId" value={t.id} />
                                        <input type="hidden" name="isVerified" value="true" />
                                        <Button variant="default" size="sm" type="submit" className="bg-green-600 hover:bg-green-700">
                                            <CheckCircle className="mr-2 h-4 w-4" /> Approuver le Traducteur
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
