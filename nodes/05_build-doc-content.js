const rawText = $input.first().json.output || '';
const fileName = $input.first().json.fileName || 'prospektus.pdf';
const date      = new Date().toLocaleDateString('id-ID', {day:'2-digit', month:'long', year:'numeric'});

// Strip HTML tags for plain text Google Doc
const plainText = rawText
  .replace(/<b>/g, '').replace(/<\/b>/g, '')
  .replace(/<i>/g, '').replace(/<\/i>/g, '')
  .replace(/<code>/g, '').replace(/<\/code>/g, '')
  .replace(/<blockquote>/g, '').replace(/<\/blockquote>/g, '')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const header = `EXECUTIVE SUMMARY – IPO INTELLIGENCE SYSTEM\nFile: ${fileName}\nTanggal Ekstraksi: ${date}\n${'='.repeat(50)}\n\n`;

const content = header + plainText;

// Generate safe filename
const safeName = fileName.replace('.pdf', '').replace(/[^a-zA-Z0-9\s]/g, '').trim();
const docName = `IPO Summary – ${safeName} (${date}).txt`;

// Convert text content to binary for Google Drive upload
const binaryData = Buffer.from(content, 'utf8').toString('base64');

return [{
  json: {
    content,
    docName,
    fileName
  },
  binary: {
    data: {
      data: binaryData,
      mimeType: 'text/plain',
      fileName: docName,
      fileExtension: 'txt'
    }
  }
}];
