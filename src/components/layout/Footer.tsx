import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-muted py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-foreground">TradWare</h3>
                        <p className="text-sm text-muted-foreground">
                            Sworn translation services made simple and secure. Recognized by French courts.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">Services</h3>
                        <ul className="space-y-2">
                            <li><Link href="/services/certified" className="text-sm text-muted-foreground hover:text-foreground">Certified Translation</Link></li>
                            <li><Link href="/services/standard" className="text-sm text-muted-foreground hover:text-foreground">Standard Translation</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">Company</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link></li>
                            <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
                            <li><Link href="/translators" className="text-sm text-muted-foreground hover:text-foreground">Join as a Translator</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-foreground">Legal</h3>
                        <ul className="space-y-2">
                            <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t border-border pt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} TradWare. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
