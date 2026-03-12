'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateTranslatorProfile } from './actions'

export default function TranslatorProfileForm({ initialData }: { initialData: any }) {
    const [isPending, setIsPending] = useState(false)
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPending(true)
        setMessage('')
        const formData = new FormData(e.currentTarget)
        try {
            const res = await updateTranslatorProfile(formData)
            if (res.error) {
                setMessage(res.error)
            } else {
                setMessage('Profil mis à jour avec succès.')
            }
        } catch (err) {
            console.error(err)
            setMessage('Une erreur est survenue.')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="languages">Languages Spoken (comma separated)</Label>
                <Input
                    id="languages"
                    name="languages"
                    placeholder="e.g. English, French, Spanish"
                    defaultValue={initialData?.languages_spoken?.join(', ') || ''}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    List the languages you are officially certified to translate.
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="certification">Official Court Certification (PDF/Image)</Label>
                <Input
                    id="certification"
                    name="certification"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                />
                {initialData?.certification_url && (
                    <p className="text-xs text-green-600 mt-1">
                        ✓ Certification uploaded. ({initialData.certification_url.split('-').pop()})
                    </p>
                )}
                <p className="text-xs text-muted-foreground">
                    Our admins will review your document to verify your sworn status.
                </p>
            </div>

            {message && (
                <div className={`text-sm font-medium ${message.includes('success') ? 'text-green-600' : 'text-destructive'}`}>
                    {message}
                </div>
            )}

            <Button type="submit" disabled={isPending}>
                {isPending ? 'Enregistrement...' : 'Enregistrer les Informations'}
            </Button>
        </form>
    )
}
