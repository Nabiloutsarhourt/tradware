'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix for default marker icons in Next.js
const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

type TranslatorPreview = {
    id: string;
    full_name: string;
    languages_spoken: string[];
    price_per_page: number;
    latitude: number;
    longitude: number;
    address?: string;
}

export default function MapContent({ translators }: { translators: TranslatorPreview[] }) {
    // Center map on Paris by default, or the first translator if available
    const center: [number, number] = translators.length > 0 && translators[0].latitude
        ? [translators[0].latitude, translators[0].longitude]
        : [48.8566, 2.3522] // Paris center

    return (
        <MapContainer center={center} zoom={6} scrollWheelZoom={false} className="w-full h-full rounded-md z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {translators.map((t) => (
                t.latitude && t.longitude ? (
                    <Marker key={t.id} position={[t.latitude, t.longitude]} icon={icon}>
                        <Popup>
                            <div className="font-sans">
                                <h3 className="font-bold text-sm mb-1">{t.full_name}</h3>
                                <p className="text-xs text-muted-foreground mb-1">
                                    {t.languages_spoken.join(', ')}
                                </p>
                                <p className="text-sm font-semibold text-primary">
                                    {t.price_per_page} € / page
                                </p>
                                {t.address && (
                                    <p className="text-xs mt-1 text-gray-500">{t.address}</p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ) : null
            ))}
        </MapContainer>
    )
}
