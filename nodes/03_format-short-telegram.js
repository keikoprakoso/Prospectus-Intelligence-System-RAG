const rawText = $input.first().json.output || '';
const cleanText = rawText.replace(/^```[\w]*\n?/m, '').replace(/\n?```$/m, '').trim();
const chatId  = $input.first().json.chatId;

// Ambil hanya Tier 1 sections dari output LLM
// Potong sebelum Tier 2 marker
const tier2Markers = ['👥 MANAJEMEN', '💰 PENGGUNAAN DANA', '🏛️ PEMEGANG SAHAM', '⚠️ RISIKO UTAMA'];
let shortText = cleanText;
let cutIndex = shortText.length;

for (const marker of tier2Markers) {
  const idx = shortText.indexOf(marker);
  if (idx > 0 && idx < cutIndex) cutIndex = idx;
}

shortText = shortText.substring(0, cutIndex).trim();

// Trim ke maks 3800 chars untuk satu pesan
if (shortText.length > 3800) {
  shortText = shortText.substring(0, 3780) + '\n<i>... (ringkasan dipotong)</i>';
}

// Close any unclosed <b> and <i> tags after trimming
const bOpen = (shortText.match(/<b>/g) || []).length;
const bClose = (shortText.match(/<\/b>/g) || []).length;
const iOpen = (shortText.match(/<i>/g) || []).length;
const iClose = (shortText.match(/<\/i>/g) || []).length;
for (let n = 0; n < bOpen - bClose; n++) shortText += '</b>';
for (let n = 0; n < iOpen - iClose; n++) shortText += '</i>';

// Tambahkan hint chatbot di bawah
const hint = `\n\n━━━━━━━━━━━━━━━━━━━━\n💬 <b>Punya pertanyaan lebih lanjut?</b>\nKetik langsung pertanyaanmu, misalnya:\n<i>"Apa rencana penggunaan dana IPO ini?"</i>\n<i>"Siapa pemegang saham terbesarnya?"</i>\n<i>"Apa saja risiko utama perusahaan ini?"</i>`;

return [{
  json: {
    shortText: shortText + hint,
    chatId
  }
}];
