export async function getApiData(city) {
  try {
    let cityString;
    if (typeof city === 'string') {
      cityString = city;
    } else {
      cityString = `${city.lat},${city.lon}`;
    }

    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityString}?unitGroup=metric&key=WFEKF8BG6B9VK87DDDPRJRFEZ`
    );

    const apiData = await response.json();

    return apiData;
  } catch (error) {
    console.error("Errore in getApiData", error);
    throw error
  }
}
