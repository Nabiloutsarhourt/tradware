import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { ModeToggle } from '@/components/mode-toggle'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className="border-b bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-primary">
                            TradWare
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            <Link href="/services" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium">
                                Services
                            </Link>
                            <Link href="/search" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium">
                                Rechercher
                            </Link>
                            <Link href="/pricing" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium">
                                Tarifs
                            </Link>
                            <Link href="/translators" className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium">
                                Pour les Traducteurs
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <Button asChild variant="default">
                                <Link href="/dashboard">Tableau de bord</Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="ghost">
                                    <Link href="/auth/login">Connexion</Link>
                                </Button>
                                <Button asChild variant="default">
                                    <Link href="/auth/register">S'inscrire</Link>
                                </Button>
                            </>
                        )}
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </nav>
    )
}
