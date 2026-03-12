import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-muted py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">TradWare</h3>
                        <p className="text-sm text-muted-foreground">
                            Des services de traduction assermentée simples et sécurisés. Reconnus par les tribunaux français.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">Services</h3>
                        <ul className="space-y-2">
                            <li><Link href="/services/certified" className="text-sm text-muted-foreground hover:text-foreground">Traduction Assermentée</Link></li>
                            <li><Link href="/services/standard" className="text-sm text-muted-foreground hover:text-foreground">Traduction Standard</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">Entreprise</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">À Propos</Link></li>
                            <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
                            <li><Link href="/translators" className="text-sm text-muted-foreground hover:text-foreground">Rejoindre en tant que Traducteur</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">Légal</h3>
                        <ul className="space-y-2">
                            <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Politique de Confidentialité</Link></li>
                            <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Conditions Générales d'Utilisation</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-border pt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} TradWare. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    )
}
