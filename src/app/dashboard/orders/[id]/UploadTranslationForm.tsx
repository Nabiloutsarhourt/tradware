'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { uploadTranslation } from './actions'

export default function UploadTranslationForm({ orderId }: { orderId: string }) {
    const [isPending, setIsPending] = useState(false)
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPending(true)
        setMessage('')
        const formData = new FormData(e.currentTarget)
        formData.append('orderId', orderId)
        try {
            const res = await uploadTranslation(formData)
            if (res.error) {
                setMessage(res.error)
            } else {
                setMessage('Translation uploaded successfully.')
            }
        } catch (err) {
            console.error(err)
            setMessage('An error occurred.')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="translation">Upload Completed Translation (PDF/Image)</Label>
                <Input
                    id="translation"
                    name="translation"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    required
                />
                <p className="text-xs text-muted-foreground">
                    Ensure the document has been fully translated, signed, and certified if applicable.
                </p>
            </div>

            {message && (
                <div className={`text-sm font-medium ${message.includes('success') ? 'text-green-600' : 'text-destructive'}`}>
                    {message}
                </div>
            )}

            <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Uploading...' : 'Submit Translation'}
            </Button>
        </form>
    )
}
