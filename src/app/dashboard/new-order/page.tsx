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
                <h1 className="text-3xl font-bold tracking-tight">New Translation Order</h1>
                <p className="text-muted-foreground">
                    Upload your document and instantly calculate your translation cost.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                    <CardDescription>All translations are processed securely.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="document">Document to Translate (PDF, JPG, PNG)</Label>
                            <Input id="document" name="document" type="file" accept=".pdf,.png,.jpg,.jpeg" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sourceLanguage">Source Language</Label>
                                <Select name="sourceLanguage" defaultValue="English" required>
                                    <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="English">English</SelectItem>
                                        <SelectItem value="French">French</SelectItem>
                                        <SelectItem value="Spanish">Spanish</SelectItem>
                                        <SelectItem value="German">German</SelectItem>
                                        <SelectItem value="Arabic">Arabic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="targetLanguage">Target Language</Label>
                                <Select name="targetLanguage" defaultValue="French" required>
                                    <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="English">English</SelectItem>
                                        <SelectItem value="French">French</SelectItem>
                                        <SelectItem value="Spanish">Spanish</SelectItem>
                                        <SelectItem value="German">German</SelectItem>
                                        <SelectItem value="Arabic">Arabic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Translation Type</Label>
                                <Select
                                    name="type"
                                    value={type}
                                    onValueChange={(val) => handleCalculatePrice(pages, val as string)}
                                >
                                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="certified">Certified (Official)</SelectItem>
                                        <SelectItem value="standard">Standard (Informal)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pageCount">Estimated Pages</Label>
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
                                <p className="font-semibold">Total Estimated Price</p>
                                <p className="text-sm text-muted-foreground">Based on {pages} pages ({type} translation)</p>
                            </div>
                            <div className="text-2xl font-bold text-primary">
                                €{price.toFixed(2)}
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? 'Processing...' : 'Confirm & Place Order'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
