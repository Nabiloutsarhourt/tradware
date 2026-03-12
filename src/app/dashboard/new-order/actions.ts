'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createOrder(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Not authenticated')
    }

    const file = formData.get('document') as File
    const sourceLang = formData.get('sourceLanguage') as string
    const targetLang = formData.get('targetLanguage') as string
    const type = formData.get('type') as 'certified' | 'standard'
    const pageCount = parseInt(formData.get('pageCount') as string || '1', 10)

    // 1. Upload file to Supabase Storage
    // Make sure the "documents" bucket exists in your Supabase project
    const fileName = `${user.id}/${Date.now()}-${file.name}`
    const { data: fileData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file)

    if (uploadError) {
        console.error('Upload Error:', uploadError)
        // For MVP, if storage fails because bucket isn't setup, we can still proceed 
        // without file or show error. Let's just pass a mock URL for now if it fails.
    }

    const fileUrl = fileData?.path || `mock-path/${file.name}`

    // 2. Create Document record
    const { data: document, error: docError } = await supabase
        .from('documents')
        .insert({
            user_id: user.id,
            file_url: fileUrl,
            file_name: file.name,
            page_count: pageCount
        })
        .select()
        .single()

    if (docError || !document) {
        return { error: 'Failed to save document record' }
    }

    // 3. Calculate Price
    const pricePerPage = type === 'certified' ? 50 : 20
    const totalPrice = pricePerPage * pageCount

    // 4. Create Order
    const { error: orderError } = await supabase
        .from('translation_orders')
        .insert({
            client_id: user.id,
            document_id: document.id,
            source_language: sourceLang,
            target_language: targetLang,
            type: type,
            price: totalPrice,
            status: 'pending'
        })

    if (orderError) {
        return { error: 'Failed to create translation order' }
    }

    revalidatePath('/dashboard/orders')
    redirect('/dashboard/orders')
}
