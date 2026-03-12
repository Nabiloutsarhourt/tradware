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
                <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Basic info about your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                            <p className="text-base">{profile?.full_name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <p className="text-base">{profile?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Role</p>
                            <Badge variant="outline" className="capitalize">{role}</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {role === 'translator' && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Translator Credentials</CardTitle>
                                <CardDescription>Manage your languages and official certifications.</CardDescription>
                            </div>
                            <Badge variant={translatorData?.is_verified ? "default" : "secondary"}>
                                {translatorData?.is_verified ? "Verified Sworn Translator" : "Pending Verification"}
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
