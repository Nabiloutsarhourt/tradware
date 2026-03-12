import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/auth/actions'
import { LayoutDashboard, FileText, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    // Fetch role
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    const role = profile?.role || 'client'

    return (
        <div className="flex min-h-[calc(100vh-4rem)]">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-muted/20 px-4 py-6 flex flex-col">
                <div className="space-y-4 flex-1">
                    <div className="py-2">
                        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                            Tableau de bord
                        </h2>
                        <div className="space-y-1">
                            <Button variant="ghost" className="w-full justify-start" asChild>
                                <Link href="/dashboard">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Aperçu
                                </Link>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start" asChild>
                                <Link href="/dashboard/orders">
                                    <FileText className="mr-2 h-4 w-4" />
                                    {role === 'translator' ? 'Mes Missions' : 'Mes Commandes'}
                                </Link>
                            </Button>
                            {role === 'translator' && (
                                <Button variant="ghost" className="w-full justify-start" asChild>
                                    <Link href="/dashboard/available-missions">
                                        <FileText className="mr-2 h-4 w-4" />
                                        Missions Disponibles
                                    </Link>
                                </Button>
                            )}
                            {role === 'admin' && (
                                <>
                                    <Button variant="ghost" className="w-full justify-start" asChild>
                                        <Link href="/dashboard/admin/translators">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Gérer les Traducteurs
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" className="w-full justify-start" asChild>
                                        <Link href="/dashboard/admin/orders">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Gérer les Commandes
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="py-2">
                        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                            Compte
                        </h2>
                        <div className="space-y-1">
                            <Button variant="ghost" className="w-full justify-start" asChild>
                                <Link href="/dashboard/profile">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Paramètres
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <form action={signOut}>
                        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10" type="submit">
                            <LogOut className="mr-2 h-4 w-4" />
                            Déconnexion
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 bg-background">
                {children}
            </main>
        </div>
    )
}
