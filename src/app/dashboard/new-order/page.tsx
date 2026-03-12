'use client'

import { useState } from 'react'
import { createOrder } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function NewOrderPage() {
    const [pages, setPages] = useState(1)
    const [type, setType] = useState('certified')
    const [price, setPrice] = useState(50)
    const [isPending, setIsPending] = useState(false)

    const handleCalculatePrice = (newPages: number, newType: string) => {
        setPages(newPages)
        setType(newType)
        const pricePerPage = newType === 'certified' ? 50 : 20
        setPrice(pricePerPage * newPages)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsPending(true)
        const formData = new FormData(e.currentTarget)
        formData.append('pageCount', pages.toString())

        try {
            await createOrder(formData)
        } catch (err) {
            console.error(err)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Nouvelle Commande de Traduction</h1>
                <p className="text-muted-foreground">
                    Téléchargez votre document et calculez instantanément le coût de votre traduction.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Détails de la Commande</CardTitle>
                    <CardDescription>Toutes les traductions sont traitées de manière sécurisée.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="document">Document à Traduire (PDF, JPG, PNG)</Label>
                            <Input id="document" name="document" type="file" accept=".pdf,.png,.jpg,.jpeg" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sourceLanguage">Langue Source</Label>
                                <Select name="sourceLanguage" defaultValue="Anglais" required>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner une langue" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Anglais">Anglais</SelectItem>
                                        <SelectItem value="Français">Français</SelectItem>
                                        <SelectItem value="Espagnol">Espagnol</SelectItem>
                                        <SelectItem value="Allemand">Allemand</SelectItem>
                                        <SelectItem value="Arabe">Arabe</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="targetLanguage">Langue Cible</Label>
                                <Select name="targetLanguage" defaultValue="Français" required>
                                    <SelectTrigger><SelectValue placeholder="Sélectionner une langue" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Anglais">Anglais</SelectItem>
                                        <SelectItem value="Français">Français</SelectItem>
                                        <SelectItem value="Espagnol">Espagnol</SelectItem>
                                        <SelectItem value="Allemand">Allemand</SelectItem>
                                        <SelectItem value="Arabe">Arabe</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Type de Traduction</Label>
                                <Select
                                    name="type"
                                    value={type}
                                    onValueChange={(val) => handleCalculatePrice(pages, val as string)}
                                >
                                    <SelectTrigger><SelectValue placeholder="Sélectionner un type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="certified">Assermentée (Officielle)</SelectItem>
                                        <SelectItem value="standard">Standard (Informelle)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pageCount">Pages Estimées</Label>
                                <Input
                                    id="pageCount"
                                    type="number"
                                    min="1"
                                    value={pages}
                                    onChange={(e) => handleCalculatePrice(parseInt(e.target.value) || 1, type)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-semibold">Prix Total Estimé</p>
                                <p className="text-sm text-muted-foreground">Basé sur {pages} pages (Traduction {type === 'certified' ? 'Assermentée' : 'Standard'})</p>
                            </div>
                            <div className="text-2xl font-bold text-primary">
                                €{price.toFixed(2)}
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? 'Traitement en cours...' : 'Confirmer et Commander'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
