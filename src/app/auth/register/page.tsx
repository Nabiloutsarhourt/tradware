'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(signup, undefined)

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Créer un compte</CardTitle>
                    <CardDescription className="text-center">
                        Entrez vos informations pour vous inscrire sur TradWare
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Nom Complet</Label>
                            <Input id="fullName" name="fullName" placeholder="Jean Dupont" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="nom@exemple.com" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input id="password" name="password" type="password" required minLength={6} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Type de compte</Label>
                            <Select name="role" defaultValue="client">
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez le type de compte" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="client">Client (J&apos;ai besoin d&apos;une traduction)</SelectItem>
                                    <SelectItem value="translator">Traducteur (Je fournis des traductions)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {state?.error && (
                            <div className="text-sm font-medium text-destructive">{state.error}</div>
                        )}

                        <Button type="submit" className="w-full mt-4" disabled={isPending}>
                            {isPending ? 'Création en cours...' : 'Créer le Compte'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-center text-sm text-muted-foreground">
                        Vous avez déjà un compte ?{' '}
                        <Link href="/auth/login" className="font-medium text-primary hover:underline">
                            Se connecter
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
