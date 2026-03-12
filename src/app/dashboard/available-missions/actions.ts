'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function claimMission(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Not authenticated')
    }

    const orderId = formData.get('orderId') as string

    // First verify user is a translator
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'translator') {
        throw new Error('Unauthorized')
    }

    // Update order status to assigned and set translator_id
    const { error } = await supabase
        .from('translation_orders')
        .update({
            status: 'assigned',
            translator_id: user.id,
            updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .eq('status', 'pending') // Only claim if it's still pending

    if (error) {
        console.error('Error claiming mission:', error)
        throw new Error('Failed to claim mission')
    }

    revalidatePath('/dashboard/available-missions')
    revalidatePath('/dashboard/orders')
    redirect('/dashboard/orders')
}
