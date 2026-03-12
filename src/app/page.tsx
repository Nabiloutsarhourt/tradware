import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, FileCheck2, Globe, ShieldCheck } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-24 sm:py-32 lg:px-8 bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
            Des Traductions Assermentées de Confiance
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Faites traduire officiellement vos documents par des experts assermentés reconnus par les tribunaux français. Rapide, sécurisé et entièrement en ligne.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link href="/auth/register">
                Commencer la Traduction <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">Voir les Tarifs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">La Traduction Simplifiée</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Tout ce dont vous avez besoin pour vos traductions officielles
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              {[
                {
                  name: 'Traducteurs Assermentés',
                  description: 'Tous nos traducteurs sont inscrits et reconnus par les juridictions officielles françaises.',
                  icon: ShieldCheck,
                },
                {
                  name: 'Tarification Instantanée',
                  description: 'Téléchargez votre document et voyez instantanément le coût transparent de votre traduction.',
                  icon: FileCheck2,
                },
                {
                  name: 'Multilingue',
                  description: 'Nous prenons en charge des dizaines de langues source et cible pour répondre à vos besoins.',
                  icon: Globe,
                },
              ].map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-foreground">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <feature.icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  )
}
