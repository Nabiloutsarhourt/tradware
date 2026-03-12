'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { login } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, undefined)

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
                    <CardDescription className="text-center">
                        Entrez votre email et votre mot de passe pour vous connecter
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="nom@exemple.com" required />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Link href="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        {state?.error && (
                            <div className="text-sm font-medium text-destructive">{state.error}</div>
                        )}
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? 'Connexion en cours...' : 'Se connecter'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-center text-sm text-muted-foreground">
                        Vous n&apos;avez pas de compte ?{' '}
                        <Link href="/auth/register" className="font-medium text-primary hover:underline">
                            S&apos;inscrire
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
