const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');

async function ocrImageBuffer(buffer) {
  const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
  return text;
}

async function extractPdfText(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

function parseTransactionsFromText(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  return lines.map((line,i)=>({ amount: 100+i, type:'expense', category:'auto', description: line, date:new Date() }));
}

module.exports = { ocrImageBuffer, extractPdfText, parseTransactionsFromText };
