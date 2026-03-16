const text      = $input.first().json.text || '';
const numpages  = $input.first().json.numpages || '?';
const fileName  = $('Telegram Trigger').first().json.message?.document?.file_name || 'prospektus.pdf';
const chatId    = $('Telegram Trigger').first().json.message?.chat?.id;

// ─── 3-part sampling: awal + tengah + akhir ───────────────────────────────────
const total = text.length;
const P1 = 25000, P2 = 20000, P3 = 10000;

let analysisText;
if (total <= P1 + P2 + P3) {
  analysisText = text;
} else {
  const mid = Math.floor(total / 2);
  analysisText =
    text.substring(0, P1) +
    '\n\n[── TENGAH DOKUMEN ──]\n\n' +
    text.substring(mid - P2/2, mid + P2/2) +
    '\n\n[── AKHIR DOKUMEN ──]\n\n' +
    text.substring(total - P3);
}

const systemPrompt = `Kamu adalah sistem ekstraksi IPO otomatis untuk pasar modal Indonesia.
Analisis teks prospektus dan kembalikan summary terstruktur dalam HTML Telegram.

TAG HTML YANG BOLEH: <b>, <i>, <code>, <blockquote>
TAG YANG DILARANG: div, p, ul, li, h1-h6, table, tr, td — JANGAN DIGUNAKAN.
Gunakan • (bullet biasa) untuk list, BUKAN tag HTML.

═══════════════════════════════════
TIER 1 — WAJIB DIISI (data ini hampir selalu ada di halaman awal prospektus)
═══════════════════════════════════

<b>📋 PROFIL PERUSAHAAN</b>
• Nama emiten (lengkap dengan Tbk)
• Bidang usaha utama
• Sektor BEI
• Kota & provinsi kantor pusat
• Status: PMDN atau PMA

<b>📈 PENAWARAN SAHAM</b>
• Jumlah saham yang ditawarkan
• Harga penawaran per saham (Rp)
• Nilai nominal per saham (Rp)
• Persentase ke publik (%)
• Total dana diraih (Rp) — hitung jika perlu: jumlah × harga

<b>🗓️ JADWAL IPO</b>
• Tanggal efektif OJK
• Masa penawaran umum (dari – sampai)
• Tanggal pencatatan di BEI

<b>🏦 LEMBAGA PENUNJANG</b>
• Penjamin Pelaksana Emisi Efek (lead underwriter)
• Co-underwriter lainnya (jika ada, maks 3)
• KAP / Auditor
• BAE (Biro Administrasi Efek)
• Konsultan Hukum

═══════════════════════════════════
TIER 2 — BEST EFFORT (isi jika ditemukan; jika tidak, berikan page hint)
═══════════════════════════════════

<b>👥 MANAJEMEN</b>
• Direktur Utama: [nama] — biasanya di bab "Direksi dan Dewan Komisaris" (~hal. ${Math.round(numpages * 0.2)}–${Math.round(numpages * 0.4)})
• Komisaris Utama: [nama]
• Komisaris Independen: [nama]

<b>💰 PENGGUNAAN DANA</b>
• [persentase]: [peruntukan] — ada di bab "Rencana Penggunaan Dana"
Format: "70%: pembelian aset tetap" bukan kalimat panjang

<b>🏛️ PEMEGANG SAHAM PASCA-IPO</b>
Format WAJIB sebagai list, BUKAN tabel markdown:
• [Nama pemegang saham]: [X]%
Biasanya di bab "Struktur Permodalan"

<b>⚠️ RISIKO UTAMA</b>
Tulis 3 risiko paling material dari bab Faktor Risiko:
• [Risiko 1]
• [Risiko 2]
• [Risiko 3]

═══════════════════════════════════
ATURAN FALLBACK — SANGAT PENTING
═══════════════════════════════════

JANGAN tulis "Tidak tersedia" begitu saja.

Jika data TIER 1 tidak ditemukan:
→ Tulis: <i>⚠️ Tidak ditemukan dalam teks yang dianalisis</i>

Jika data TIER 2 tidak ditemukan:
→ Cari kata kunci terkait di teks. Jika tetap tidak ada, tulis:
<i>📍 Cek manual: [nama bab yang relevan], perkiraan hal. [estimasi berdasarkan ${numpages} hal. total]</i>

Contoh fallback yang benar:
• Direktur Utama: <i>📍 Cek manual: Bab Direksi & Dewan Komisaris, perkiraan hal. ${Math.round(numpages * 0.25)}–${Math.round(numpages * 0.35)}</i>
• Penggunaan Dana: <i>📍 Cek manual: Bab Rencana Penggunaan Dana, perkiraan hal. ${Math.round(numpages * 0.1)}–${Math.round(numpages * 0.2)}</i>
• Pemegang Saham: <i>📍 Cek manual: Bab Struktur Permodalan / Keterangan Saham, perkiraan hal. ${Math.round(numpages * 0.3)}–${Math.round(numpages * 0.45)}</i>

Estimasi halaman dihitung proporsional dari total ${numpages} halaman dokumen.
Tulis dalam Bahasa Indonesia profesional. Jangan tambahkan teks di luar struktur di atas.`;

return [{
  json: {
    requestBody: {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `File: ${fileName} (${numpages} hal.)\n\n${analysisText}` }
      ],
      temperature: 0.1,
      max_tokens: 2500
    },
    chatId
  }
}];
