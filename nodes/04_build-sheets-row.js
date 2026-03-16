const raw = $input.first().json.output || '';
const fileName = $input.first().json.fileName || '';
const date = new Date().toISOString().split('T')[0];

// Simple field extraction from the LLM output text
// Extract text after bold label patterns
function extract(text, label) {
  const patterns = [
    new RegExp(`${label}[:\\s]+([^\\n]+)`, 'i'),
    new RegExp(`•\\s*${label}[:\\s]+([^\\n]+)`, 'i'),
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m && m[1]) return m[1].replace(/<[^>]*>/g, '').trim();
  }
  return '';
}

// Extract sections
const namaEmiten    = extract(raw, 'Nama emiten') || extract(raw, 'Nama');
const bidangUsaha   = extract(raw, 'Bidang usaha');
const sektor        = extract(raw, 'Sektor');
const kotaProvinsi  = extract(raw, 'Kota');
const status        = extract(raw, 'Status');
const jmlSaham      = extract(raw, 'Jumlah saham');
const harga         = extract(raw, 'Harga penawaran');
const nilaiNominal  = extract(raw, 'Nilai nominal');
const persPublik    = extract(raw, 'Persentase');
const totalDana     = extract(raw, 'Total dana');
const tglEfektif    = extract(raw, 'Tanggal efektif') || extract(raw, 'efektif');
const penawaran     = extract(raw, 'Masa penawaran');
const tglCatat      = extract(raw, 'pencatatan di BEI') || extract(raw, 'pencatatan');
const underwriter   = extract(raw, 'Penjamin Pelaksana') || extract(raw, 'underwriter');
const auditor       = extract(raw, 'KAP') || extract(raw, 'Auditor');
const bae           = extract(raw, 'BAE');
const konsHukum     = extract(raw, 'Konsultan Hukum');
const dirut         = extract(raw, 'Direktur Utama');
const komut         = extract(raw, 'Komisaris Utama');

return [{
  json: {
    tanggal: date,
    file: fileName,
    nama_emiten: namaEmiten,
    bidang_usaha: bidangUsaha,
    sektor: sektor,
    kota_provinsi: kotaProvinsi,
    status_pmdn_pma: status,
    jumlah_saham: jmlSaham,
    harga_penawaran: harga,
    nilai_nominal: nilaiNominal,
    persen_publik: persPublik,
    total_dana: totalDana,
    tgl_efektif: tglEfektif,
    masa_penawaran: penawaran,
    tgl_pencatatan: tglCatat,
    underwriter: underwriter,
    auditor: auditor,
    bae: bae,
    konsultan_hukum: konsHukum,
    direktur_utama: dirut,
    komisaris_utama: komut
  }
}];
