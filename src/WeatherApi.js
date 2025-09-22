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