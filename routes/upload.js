const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const { ocrImageBuffer, extractPdfText, parseTransactionsFromText } = require('../utils/ocr');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/receipt', auth, upload.single('file'), async (req,res)=>{
  try {
    const file = req.file;
    let text='';
    if (file.mimetype==='application/pdf') text = await extractPdfText(file.buffer);
    else if (file.mimetype.startsWith('image/')) text = await ocrImageBuffer(file.buffer);
    else return res.status(400).json({message:'Unsupported file'});
    const parsed = parseTransactionsFromText(text);
    res.json({ text, parsed });
  } catch {
    res.status(500).json({ message:'OCR error' });
  }
});

module.exports = router;
