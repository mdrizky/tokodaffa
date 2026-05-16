import { NextResponse } from 'next/server';
import { fetchWorldGoldPrice, calculateSmartPricing } from '@/services/gold.service';

export async function GET() {
  try {
    const rawData = await fetchWorldGoldPrice();
    const smartPrices = calculateSmartPricing(rawData.priceUSD, rawData.exchangeRate);
    
    // Simulate buyback as 5% lower than 24K price
    const buybackPrice = Math.round(smartPrices['24K'] * 0.95);

    return NextResponse.json({
      prices: smartPrices,
      buyback: buybackPrice,
      meta: {
        source: rawData.source,
        timestamp: new Date().toISOString(),
        currency: 'IDR'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch smart pricing' },
      { status: 500 }
    );
  }
}
