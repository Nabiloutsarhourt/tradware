import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileUp } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: profile } = await supabase
        .from('users')
        .select('role, full_name')
        .eq('id', user?.id)
        .single()

    const role = profile?.role || 'client'

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}</h1>
                <p className="text-muted-foreground">
                    Here is an overview of your activity.
                </p>
            </div>

            {role === 'client' && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">New Translation</CardTitle>
                            <FileUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full mt-4" asChild>
                                <Link href="/dashboard/new-order">Upload Document</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">Orders currently in progress</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {role === 'translator' && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Available Missions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">Translations ready to be claimed</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {role === 'admin' && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">€0.00</div>
                            <p className="text-xs text-muted-foreground">All time revenue</p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
