import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'gold';
    
    // Cek apakah API key tersedia
    const apiKey = process.env.NEWS_API_KEY || process.env.MEDIASTACK_API_KEY;
    
    if (!apiKey) {
      // Return mock data jika tidak ada API key
      return NextResponse.json({
        data: [
          {
            title: "Harga Emas Menguat di Tengah Ketidakpastian Global",
            description: "Harga emas naik 2% hari ini karena investor mencari aset safe haven di tengah ketidakpastian ekonomi global.",
            url: "#",
            image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400",
            published_at: new Date().toISOString(),
            source: { name: "Mock Data" }
          },
          {
            title: "Investasi Emas Semakin Populer di Tahun 2026",
            description: "Semakin banyak investor yang beralih ke emas sebagai perlindungan inflasi dan diversifikasi portofolio.",
            url: "#",
            image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400",
            published_at: new Date(Date.now() - 86400000).toISOString(),
            source: { name: "Mock Data" }
          },
          {
            title: "Tren Perhiasan Emas Modern: Minimalis dan Elegan",
            description: "Desain perhiasan emas modern semakin diminati dengan gaya minimalis yang elegan dan timeless.",
            url: "#",
            image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400",
            published_at: new Date(Date.now() - 172800000).toISOString(),
            source: { name: "Mock Data" }
          }
        ]
      });
    }

    // Gunakan API asli jika ada API key
    const keywords = category === 'silver' ? 'silver' : 'gold';
    const response = await axios.get(
      `https://api.mediastack.com/v1/news?access_key=${apiKey}&keywords=${keywords}&languages=id,en&limit=10&sort=published_desc`
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("News API Error:", error);
    // Return fallback data on error
    return NextResponse.json({
      data: [
        {
          title: "Informasi Harga Emas Terkini",
          description: "Update harga emas dan perak terbaru akan segera tersedia.",
          url: "#",
          image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400",
          published_at: new Date().toISOString(),
          source: { name: "TokoDaffa" }
        }
      ]
    });
  }
}
