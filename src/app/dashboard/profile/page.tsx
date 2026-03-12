import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import TranslatorProfileForm from './TranslatorProfileForm'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
        .from('users')
        .select('role, full_name, email')
        .eq('id', user?.id)
        .single()

    const role = profile?.role || 'client'

    let translatorData = null
    if (role === 'translator' || role === 'admin') {
        const { data: tData } = await supabase
            .from('translators')
            .select('*')
            .eq('id', user?.id)
            .single()
        translatorData = tData
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Paramètres du Profil</h1>
                <p className="text-muted-foreground">
                    Gérez les paramètres et préférences de votre compte.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Informations Personnelles</CardTitle>
                    <CardDescription>Informations de base concernant votre compte.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Nom Complet</p>
                            <p className="text-base">{profile?.full_name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <p className="text-base">{profile?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Rôle</p>
                            <Badge variant="outline" className="capitalize">{role === 'translator' ? 'Traducteur' : role === 'client' ? 'Client' : 'Admin'}</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {role === 'translator' && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Informations du Traducteur</CardTitle>
                                <CardDescription>Gérez vos langues et certifications officielles.</CardDescription>
                            </div>
                            <Badge variant={translatorData?.is_verified ? "default" : "secondary"}>
                                {translatorData?.is_verified ? "Traducteur Assermenté Vérifié" : "En attente de vérification"}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <TranslatorProfileForm initialData={translatorData || {}} />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
