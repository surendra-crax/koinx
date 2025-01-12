"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BitcoinData {
  bitcoin: {
    inr: number;
    inr_24h_change: number;
    usd: number;
    usd_24h_change: number;
  };
}

interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
    sparkline: string;
    data: {
      price: string;
      price_change_percentage_24h: {
        usd: number;
      };
    };
  };
}

export default function Home() {
  const [bitcoinData, setBitcoinData] = useState<BitcoinData | null>(null);
  const [trendingCoins, setTrendingCoins] = useState<TrendingCoin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const priceResponse = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr,usd&include_24hr_change=true"
        );
        const priceData = await priceResponse.json();
        setBitcoinData(priceData);

        const trendingResponse = await fetch(
          "https://api.coingecko.com/api/v3/search/trending"
        );
        const trendingData = await trendingResponse.json();
        setTrendingCoins(trendingData.coins.slice(0, 3));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#EFF2F5]">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img
                src="https://www.koinx.com/_next/static/media/Logo.5f2ad8d5.svg"
                alt="KoinX Logo"
                className="h-8"
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <img
                  src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
                  alt="Bitcoin"
                  className="w-8 h-8"
                />
                <h1 className="text-2xl font-bold">Bitcoin</h1>
                <span className="text-gray-500">BTC</span>
                <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded">
                  Rank #1
                </div>
              </div>

              <div className="flex items-baseline space-x-4 mb-6">
                <h2 className="text-3xl font-bold">
                  {bitcoinData && formatPrice(bitcoinData.bitcoin.usd)}
                </h2>
                <div
                  className={`px-2 py-1 rounded ${
                    bitcoinData && bitcoinData.bitcoin.usd_24h_change > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {bitcoinData &&
                    `${bitcoinData.bitcoin.usd_24h_change.toFixed(2)}%`}
                </div>
              </div>

              <Separator className="my-6" />

              <div className="w-full h-[400px] bg-white">
                <iframe
                  src="https://www.tradingview.com/widgetembed/?frameElementId=tradingview_76d87&symbol=BTCUSD&interval=D&hidesidetoolbar=0&hidetoptoolbar=0&symboledit=1&saveimage=1&toolbarbg=F1F3F6&studies=%5B%5D&hideideas=1&theme=Light&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=coinmarketcap.com&utm_medium=widget&utm_campaign=chart&utm_term=BTCUSD"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  frameBorder="0"
                  allowTransparency={true}
                  scrolling="no"
                  allowFullScreen={true}
                ></iframe>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Trending Coins (24h)
              </h3>
              <div className="space-y-4">
                {trendingCoins.map((coin) => (
                  <div
                    key={coin.item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={coin.item.small}
                        alt={coin.item.name}
                        className="w-6 h-6"
                      />
                      <span>{coin.item.name}</span>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-sm ${
                        coin.item.data.price_change_percentage_24h.usd > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {coin.item.data.price_change_percentage_24h.usd.toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-[#0052FE] text-white">
              <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-bold mb-4">
                  Get Started with KoinX for FREE
                </h3>
                <p className="mb-6">
                  With our range of features that you can equip for free, KoinX
                  allows you to be more educated and aware of your tax reports.
                </p>
                <img
                  src="https://www.koinx.com/_next/static/media/CryptoGuide.555c0e7d.svg"
                  alt="Crypto Guide"
                  className="mb-6 w-48"
                />
                <button className="bg-white text-black px-6 py-2 rounded-lg font-medium">
                  Get Started for FREE →
                </button>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">You May Also Like</h3>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-4">
              {trendingCoins.map((coin) => (
                <Card
                  key={coin.item.id}
                  className="p-4 min-w-[300px] flex-shrink-0"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      src={coin.item.small}
                      alt={coin.item.name}
                      className="w-6 h-6"
                    />
                    <span>{coin.item.symbol.toUpperCase()}</span>
                    <div
                      className={`px-2 py-1 rounded text-sm ${
                        coin.item.data.price_change_percentage_24h.usd > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {coin.item.data.price_change_percentage_24h.usd.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-lg font-bold">
                    {coin.item.data.price}
                  </div>
                  <img
                    src={coin.item.sparkline}
                    alt={`${coin.item.name} price graph`}
                    className="w-full h-16 mt-2"
                  />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}