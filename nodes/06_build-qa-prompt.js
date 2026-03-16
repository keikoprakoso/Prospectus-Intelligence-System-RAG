const docData = $input.first().json;
const chatId = $('Telegram Trigger').first().json.message.chat.id;
const msg = $('Telegram Trigger').first().json;
const text = msg.message?.text || '';
const cb = msg.callback_query?.data || '';
let question = text || cb || '';

// Strip /tanya prefix
if (question.startsWith('/tanya')) {
  question = question.replace('/tanya', '').trim();
}

// No document
if (!docData || !docData.filename) {
  return [{
    json: {
      chatId,
      noDoc: true,
      answer: `Belum ada prospektus yang diupload.\n\nSilakan kirim /dokumen dan upload file PDF prospektus terlebih dahulu.`
    }
  }];
}

// Document exists but content empty
if (!docData.content || docData.content.trim() === '') {
  return [{
    json: {
      chatId,
      noDoc: true,
      answer: `Gagal membaca isi dokumen ${docData.filename}.\n\nKemungkinan file PDF tidak bisa diekstrak teksnya (misal: PDF scan/gambar). Coba upload ulang dokumen dalam format PDF yang bisa di-copy teksnya.`
    }
  }];
}

const docText = docData.content;
const filename = docData.filename || 'prospektus';

// Trim if too long
const maxChars = 80000;
const trimmed = docText.length > maxChars
  ? docText.substring(0, maxChars) + `\n\n[...dokumen dipotong karena terlalu panjang]`
  : docText;

return [{
  json: {
    chatId,
    noDoc: false,
    filename,
    question,
    systemPrompt: `Kamu adalah asisten analisis prospektus IPO Indonesia.
WAJIB jawab dalam Bahasa Indonesia yang jelas dan formal.
Jawaban SINGKAT: 3-6 bullet atau 3-5 kalimat, maksimal 1500 karakter.
Jika informasi tidak ada di dokumen, katakan jelas bahwa tidak tersedia di prospektus ini.
Format jawaban menggunakan Telegram HTML: <b>bold</b>, <i>italic</i>.

PENTING - VALIDASI KONTEKS:
Nama perusahaan dalam prospektus ini adalah sesuai isi dokumen. Jika user menyebut nama perusahaan yang TIDAK cocok dengan isi dokumen, WAJIB sampaikan: "Dokumen yang sedang dimuat adalah prospektus <b>[nama di dokumen]</b>, bukan perusahaan yang Anda sebutkan. Berikut jawaban berdasarkan dokumen yang tersedia:"
Lanjutkan menjawab dari dokumen yang ada setelahnya.`,
    userMessage: `Dokumen prospektus: ${filename}\n\n${trimmed}\n\n--\nPertanyaan: ${question}`
  }
}];
