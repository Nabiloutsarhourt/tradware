import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function PricingPage() {
    const plans = [
        {
            name: 'Traduction Standard',
            price: '20 €',
            description: 'Parfait pour les documents d\'information, les manuels et les lettres.',
            features: [
                'Traducteurs professionnels natifs',
                'Livraison en 24-48 heures en général',
                'Plusieurs révisions incluses',
                'Chat direct avec le traducteur',
            ],
            href: '/auth/register',
            cta: 'Commencer',
            popular: false,
        },
        {
            name: 'Traduction Assermentée',
            price: '50 €',
            description: 'Officiellement reconnue par les tribunaux, administrations et universités.',
            features: [
                'Traducteur assermenté assigné',
                'Tampon et signature officiels',
                'Acceptée par toutes les autorités françaises',
                'Livraison numérique gratuite (PDF)',
                'Livraison papier en option',
            ],
            href: '/auth/register',
            cta: 'Commander une traduction certifiée',
            popular: true,
        },
    ]

    return (
        <div className="bg-background py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-primary">Tarifs</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Une tarification simple et transparente à la page.
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-muted-foreground">
                    Aucun frais caché. Créez un compte, téléchargez votre document et découvrez instantanément le prix final.
                </p>
                <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-4xl lg:grid-cols-2 lg:gap-x-8">
                    {plans.map((plan) => (
                        <Card key={plan.name} className={`flex flex-col justify-between ${plan.popular ? 'border-primary shadow-lg ring-1 ring-primary' : ''}`}>
                            <CardHeader>
                                {plan.popular && (
                                    <p className="mb-4 text-xs font-semibold leading-5 text-primary">LE PLUS POPULAIRE</p>
                                )}
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <CardDescription className="mt-2">{plan.description}</CardDescription>
                                <div className="mt-6 flex items-baseline gap-x-1">
                                    <span className="text-4xl font-bold tracking-tight text-foreground">{plan.price}</span>
                                    <span className="text-sm font-semibold leading-6 text-muted-foreground">/page</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="mt-8 space-y-3 text-sm leading-6 text-muted-foreground">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                                            <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="mt-auto z-10">
                                <Button
                                    asChild
                                    className="w-full"
                                    variant={plan.popular ? 'default' : 'outline'}
                                >
                                    <Link href={plan.href}>{plan.cta}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
