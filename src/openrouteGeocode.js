// src/openrouteGeocode.js

const getLatLongFromAddress = async (address) => {
  const apiKey = process.env.OPENROUTE_API
  if (!apiKey) throw new Error('OPENROUTE_API key not set in environment')
  const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}`
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Geocode API error: ${response.status}`)
  const data = await response.json()
  if (
    data &&
    data.features &&
    data.features.length > 0 &&
    data.features[0].geometry &&
    data.features[0].geometry.coordinates
  ) {
    const [lng, lat] = data.features[0].geometry.coordinates
    return { lat, lng }
  }
  throw new Error('No coordinates found for address')
}

module.exports = getLatLongFromAddress
