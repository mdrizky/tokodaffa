/**
 * TokoDaffa WhatsApp Helper Terpusat
 * Semua aksi customer diarahkan ke WhatsApp
 */

const DEFAULT_WA = '6281365555411';

export function getWaNumber(storeInfo?: any): string {
  return storeInfo?.whatsapp || DEFAULT_WA;
}

export function buildWaUrl(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, '').replace(/^0/, '62');
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function waProductInquiry(product: any, storeInfo?: any): string {
  const formatPrice = (p: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);
  const msg = `Halo TokoDaffa 👋\n\nSaya tertarik dengan produk berikut:\n\n📿 *${product.name}*\n💎 Kadar: ${product.kadar}\n⚖️ Berat: ${product.weight}g\n💰 Estimasi: ${formatPrice(product.price)}\n📦 Stok: ${product.stock > 0 ? `Ada (${product.stock} pcs)` : 'Habis'}\n\nApakah masih tersedia? Terima kasih 🙏`;
  return buildWaUrl(getWaNumber(storeInfo), msg);
}

export function waReservation(data: {
  name: string;
  productName: string;
  visitDate?: string;
  visitTime?: string;
  notes?: string;
  type?: string;
}, storeInfo?: any): string {
  const typeLabel: Record<string, string> = {
    view: 'Melihat/Mencoba Produk',
    buy: 'Ingin Membeli',
    custom: 'Custom Design',
    service: 'Layanan Servis/Sepuh',
  };
  const msg = `Halo TokoDaffa 👋\n\nSaya ingin melakukan reservasi:\n\n👤 Nama: ${data.name}\n🎯 Tujuan: ${typeLabel[data.type || 'view'] || 'Melihat Produk'}\n📿 Produk: ${data.productName}${data.visitDate ? `\n📅 Rencana Kunjungan: ${data.visitDate}${data.visitTime ? ` pukul ${data.visitTime}` : ''}` : ''}${data.notes ? `\n📝 Catatan: ${data.notes}` : ''}\n\nMohon konfirmasi ketersediaannya. Terima kasih! 🙏`;
  return buildWaUrl(getWaNumber(storeInfo), msg);
}

export function waCalculatorResult(calc: {
  kadar: string;
  weight: string;
  ongkos: number;
  total: number;
}, storeInfo?: any): string {
  const formatPrice = (p: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(p);
  const msg = `Halo TokoDaffa 👋\n\nSaya baru gunakan kalkulator di website.\n\n📊 Hasil Simulasi:\n💎 Kadar: ${calc.kadar}\n⚖️ Berat: ${calc.weight}g\n🛠️ Ongkos: ${formatPrice(calc.ongkos)}\n💰 *Estimasi Total: ${formatPrice(calc.total)}*\n\nSaya ingin konsultasi lebih lanjut. Terima kasih 🙏`;
  return buildWaUrl(getWaNumber(storeInfo), msg);
}

export function waServiceInquiry(serviceName: string, customMsg?: string, storeInfo?: any): string {
  const msg = customMsg || `Halo TokoDaffa 👋\n\nSaya ingin tanya tentang layanan: *${serviceName}*\n\nBisa info lebih lanjut? Terima kasih 🙏`;
  return buildWaUrl(getWaNumber(storeInfo), msg);
}

export function waBuyback(storeInfo?: any): string {
  const msg = `Halo TokoDaffa 👋\n\nSaya ingin melakukan buyback emas.\n\nBerapa harga beli emas hari ini? Dan bagaimana prosedurnya?\n\nTerima kasih 🙏`;
  return buildWaUrl(getWaNumber(storeInfo), msg);
}

export function waGeneralContact(storeInfo?: any): string {
  const msg = `Halo TokoDaffa 👋\n\nSaya ingin bertanya tentang produk/layanan Anda. Bisa dibantu? Terima kasih 🙏`;
  return buildWaUrl(getWaNumber(storeInfo), msg);
}

export function waBlogArticle(title: string, storeInfo?: any): string {
  const msg = `Halo TokoDaffa 👋\n\nSaya baru membaca artikel "${title}" di website Anda.\n\nSaya ingin tahu lebih lanjut. Bisa dibantu? 🙏`;
  return buildWaUrl(getWaNumber(storeInfo), msg);
}

export function waReseller(storeInfo?: any): string {
  const msg = `Halo TokoDaffa 👋\n\nSaya tertarik dengan program reseller/kerjasama dengan TokoDaffa Gold.\n\nBisa info lebih lanjut mengenai syarat dan ketentuannya? Terima kasih 🙏`;
  return buildWaUrl(getWaNumber(storeInfo), msg);
}
