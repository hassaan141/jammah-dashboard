import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json()
    
    if (!address || !address.trim()) {
      return NextResponse.json({ lat: null, lng: null })
    }

    const apiKey = process.env.OPENROUTE_API || ''
    
    const response = await fetch(
      `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].geometry.coordinates
      return NextResponse.json({ lat, lng })
    }
    
    return NextResponse.json({ lat: null, lng: null })
  } catch (error) {
    console.error('Geocoding error:', error)
    return NextResponse.json({ lat: null, lng: null })
  }
}