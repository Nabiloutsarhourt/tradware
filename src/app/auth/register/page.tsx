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
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your information to register for TradWare
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" name="fullName" placeholder="John Doe" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required minLength={6} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Account Type</Label>
                            <Select name="role" defaultValue="client">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select account type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="client">Client (Need a translation)</SelectItem>
                                    <SelectItem value="translator">Translator (I provide translations)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {state?.error && (
                            <div className="text-sm font-medium text-destructive">{state.error}</div>
                        )}

                        <Button type="submit" className="w-full mt-4" disabled={isPending}>
                            {isPending ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="font-medium text-primary hover:underline">
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
