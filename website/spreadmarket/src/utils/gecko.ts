export const getSolPrice = async () => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-cg-demo-api-key": "CG-Mk3GxtNcw1npRXaHsAuSuTPZ",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result.solana.usd;
  } catch (error) {
    console.error("Error fetching price", error);
    return null;
  }
};
