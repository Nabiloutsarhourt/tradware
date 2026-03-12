'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTranslatorProfile(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Not authenticated')
    }

    const languagesRaw = formData.get('languages') as string
    const languages = languagesRaw ? languagesRaw.split(',').map(l => l.trim()) : []
    const certificationFile = formData.get('certification') as File | null

    const pricePerPageRaw = formData.get('price_per_page')
    const pricePerPage = pricePerPageRaw ? parseFloat(pricePerPageRaw as string) : null

    const address = formData.get('address') as string | null

    const latRaw = formData.get('latitude')
    const latitude = latRaw ? parseFloat(latRaw as string) : null

    const lngRaw = formData.get('longitude')
    const longitude = lngRaw ? parseFloat(lngRaw as string) : null

    let certificationUrl = null

    if (certificationFile && certificationFile.size > 0) {
        const fileName = `${user.id}/cert-${Date.now()}-${certificationFile.name}`
        const { data: fileData, error: uploadError } = await supabase.storage
            .from('documents') // Reusing documents bucket for simplicity
            .upload(fileName, certificationFile)

        if (uploadError) {
            console.error('Upload Error:', uploadError)
        } else {
            certificationUrl = fileData?.path
        }
    }

    // Check if translator profile exists
    const { data: existingProfile } = await supabase
        .from('translators')
        .select('id, certification_url')
        .eq('id', user.id)
        .single()

    const updates: Record<string, unknown> = {
        id: user.id,
        languages_spoken: languages,
    }

    if (pricePerPage !== null && !isNaN(pricePerPage)) updates.price_per_page = pricePerPage
    if (address) updates.address = address
    if (latitude !== null && !isNaN(latitude)) updates.latitude = latitude
    if (longitude !== null && !isNaN(longitude)) updates.longitude = longitude

    if (certificationUrl) {
        updates.certification_url = certificationUrl
    } else if (existingProfile?.certification_url) {
        updates.certification_url = existingProfile.certification_url
    }

    const { error } = await supabase
        .from('translators')
        .upsert(updates)

    if (error) {
        return { error: 'Failed to update profile' }
    }

    revalidatePath('/dashboard/profile')
    return { success: true }
}
