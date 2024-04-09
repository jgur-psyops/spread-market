// TODO hide the API key when it's not a free one we don't care about.
const API_KEY = "CG-Mk3GxtNcw1npRXaHsAuSuTPZ";
const API_BASE_URL = "https://api.coingecko.com/api/v3/simple/price";

export const getPrice = async (coinId: string) => {
  try {
    const url = new URL(API_BASE_URL);
    url.searchParams.append("ids", coinId);
    url.searchParams.append("vs_currencies", "usd");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result[coinId].usd;
  } catch (error) {
    console.error(`Error fetching price for ${coinId}`, error);
    return null;
  }
};
