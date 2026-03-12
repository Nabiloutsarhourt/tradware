'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateTranslatorProfile } from './actions'

type TranslatorProfileData = {
    languages_spoken?: string[];
    certification_url?: string;
    price_per_page?: number;
    address?: string;
    latitude?: number;
    longitude?: number;
}

export default function TranslatorProfileForm({ initialData }: { initialData: TranslatorProfileData | undefined | null }) {
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
                <Label htmlFor="languages">Langues Parlées (séparées par une virgule)</Label>
                <Input
                    id="languages"
                    name="languages"
                    placeholder="ex: Français, Anglais, Espagnol"
                    defaultValue={initialData?.languages_spoken?.join(', ') || ''}
                    required
                />
                <p className="text-xs text-muted-foreground">
                    Listez les langues pour lesquelles vous êtes officiellement certifié.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price_per_page">Tarif par Page (€)</Label>
                    <Input
                        id="price_per_page"
                        name="price_per_page"
                        type="number"
                        step="0.01"
                        placeholder="20.00"
                        defaultValue={initialData?.price_per_page || ''}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">Ville / Adresse</Label>
                    <Input
                        id="address"
                        name="address"
                        placeholder="ex: Paris, France"
                        defaultValue={initialData?.address || ''}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude (Carte)</Label>
                    <Input
                        id="latitude"
                        name="latitude"
                        type="number"
                        step="0.00000001"
                        placeholder="48.8566"
                        defaultValue={initialData?.latitude || ''}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude (Carte)</Label>
                    <Input
                        id="longitude"
                        name="longitude"
                        type="number"
                        step="0.00000001"
                        placeholder="2.3522"
                        defaultValue={initialData?.longitude || ''}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="certification">Certification Officielle (PDF/Image)</Label>
                <Input
                    id="certification"
                    name="certification"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                />
                {initialData?.certification_url && (
                    <p className="text-xs text-green-600 mt-1">
                        ✓ Certification téléchargée. ({initialData.certification_url.split('-').pop()})
                    </p>
                )}
                <p className="text-xs text-muted-foreground">
                    Nos administrateurs examineront ce document pour vérifier votre statut d&apos;assermenté.
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
