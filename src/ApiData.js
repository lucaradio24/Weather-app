export async function getApiData(city) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=WFEKF8BG6B9VK87DDDPRJRFEZ`
    );

    const apiData = await response.json();

    return apiData;
  } catch {
    console.error("Errore", error);
  }
}
