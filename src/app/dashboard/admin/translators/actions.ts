'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function verifyTranslator(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Not authenticated')
    }

    // Ensure user is an admin
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        throw new Error('Unauthorized')
    }

    const translatorId = formData.get('translatorId') as string
    const isVerified = formData.get('isVerified') === 'true'

    const { error } = await supabase
        .from('translators')
        .update({ is_verified: isVerified })
        .eq('id', translatorId)

    if (error) {
        console.error('Error verifying translator:', error)
        throw new Error('Failed to update verification status')
    }

    revalidatePath('/dashboard/admin/translators')
}
