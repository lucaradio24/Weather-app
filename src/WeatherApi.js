export async function getCitySuggestions(query, limit = 5) {
  if (!query || query.length < 2) return [];
  const key = 'c445447ee0d746a6911101437252209';
  const url = `https://api.weatherapi.com/v1/search.json?key=${key}&q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json(); // array di {name, region, country, lat, lon}
    return data.slice(0, limit);
  } catch (e) {
    console.error('city suggestions error', e);
    return [];
  }
}

export async function getCityNameFromCoords(lat, lon){
  const key = 'c445447ee0d746a6911101437252209';
  const url = `https://api.weatherapi.com/v1/search.json?key=${key}&q=${lat},${lon}`

  try {
    const res = await fetch(url);
    if(res.ok){
      const data = await res.json()
      return data[0]?.name;
    } else {
      console.error('Errore risposta API', res.status)
    }

  }

  catch (e){
    console.error('Get city name from coords error', e);
    return null
  }
}