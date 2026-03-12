'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadTranslation(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Not authenticated')
    }

    const orderId = formData.get('orderId') as string
    const translationFile = formData.get('translation') as File

    if (!translationFile || translationFile.size === 0) {
        return { error: 'Please select a file to upload.' }
    }

    // File upload to storage
    const fileName = `${user.id}/translated-${orderId}-${Date.now()}-${translationFile.name}`
    const { data: fileData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, translationFile)

    if (uploadError) {
        console.error('Upload Error:', uploadError)
        return { error: 'Failed to upload document.' }
    }

    const translatedUrl = fileData?.path

    // Update order status to completed and set translated URL
    const { error } = await supabase
        .from('translation_orders')
        .update({
            status: 'completed',
            translated_document_url: translatedUrl,
            updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .eq('translator_id', user.id)

    if (error) {
        console.error('Error completing mission:', error)
        return { error: 'Failed to complete mission. Make sure you are the assigned translator.' }
    }

    revalidatePath(`/dashboard/orders/${orderId}`)
    revalidatePath('/dashboard/orders')
    return { success: true }
}
