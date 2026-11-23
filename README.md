# การบัญชีสำหรับนักกฎหมายภาษีอากร: แอปประจำเล่ม

แอปประจำบทของตำรา การบัญชีสำหรับนักกฎหมายภาษีอากร (หลักสูตรนิติศาสตรมหาบัณฑิต) โดย ดร.วิทยา อรุณศิริเพ็ชร และ อ.พงษ์ธร ดวงปัญญา · Dr.VIT & PD | TaxBiz Clear

เว็บแอป: https://drvitpd.github.io/tax-law-accounting-textbook/ (หน้าบท `chNN.html`)

## โครงสร้าง
- `site/src/chNN.html` แอปรายบท (ต้นฉบับ)
- `site/brand.json` ชื่อแบรนด์ ชื่อเล่ม และแฮชรหัสเข้าแอป
- `site/build_site.py` สร้าง `docs/` (หน้าสารบัญ หน้าบท gate.js และ QR ใน `docs/qr/`)
- `docs/` ไฟล์ที่ GitHub Pages ใช้ (Settings → Pages → main · /docs)

## เปลี่ยนแบรนด์หรือรหัส
- โลโก้: แทนไฟล์ `docs/brand/logo.png` (แนวนอน) และ `logo-stacked.png` (หน้ากั้นรหัส)
- รหัส: แก้ `gate_hash` ใน `site/brand.json` แล้วรัน `python3 site/build_site.py`

รหัสเข้าแอปกันการเข้าโดยบังเอิญเท่านั้น ไม่ใช่ระบบความปลอดภัย
