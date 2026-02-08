export const npmReadme = `# konthaina-khqr (npm)

KHQR / EMVCo merchant-presented QR payload generator for Bakong (Cambodia), inspired by \`konthaina/khqr-php\`.

## Install

\`\`\`bash
npm i konthaina-khqr
\`\`\`

## Quick usage

### Individual (Tag 29)

\`\`\`ts
import { KHQRGenerator } from "konthaina-khqr";

const { qr, md5 } = new KHQRGenerator("individual")
  .setStatic(true) // static QR (no timestamp)
  .setBakongAccountId("john_smith@devb")
  .setMerchantName("John Smith")
  .setCurrency("USD")
  // .setAmount("1.00") // usually leave empty for static
  .setMerchantCity("Phnom Penh")
  .generate();

console.log(qr);
console.log(md5);
console.log(KHQRGenerator.verify(qr)); // true/false
\`\`\`

### Merchant (Tag 30)

\`\`\`ts
import { KHQRGenerator } from "konthaina-khqr";

const { qr } = new KHQRGenerator("merchant")
  .setBakongAccountId("dev_merchant@devb")
  .setMerchantId("YOUR_MERCHANT_ID")
  .setAcquiringBank("Dev Bank")
  .setMerchantName("Dev Store")
  .setCurrency("KHR")
  .setAmount("1000")
  .generate();
\`\`\`

## API

- \`new KHQRGenerator("individual" | "merchant")\`
- \`.setStatic(boolean)\` (static QR sets POI=11 and omits timestamp; dynamic uses Tag 99 sub-tag 00)
- \`.setBakongAccountId(string)\`
- \`.setMerchantName(string)\`
- \`.setMerchantCity(string)\`
- \`.setCurrency("KHR" | "USD")\`
- \`.setAmount(number|string)\`
- \`.setBillNumber(string)\`
- \`.setMobileNumber(string)\`
- \`.setStoreLabel(string)\`
- \`.setTerminalLabel(string)\`
- \`.setPurposeOfTransaction(string)\`
- \`.setMerchantAlternateLanguagePreference(string)\`
- \`.setMerchantNameAlternateLanguage(string)\`
- \`.setMerchantCityAlternateLanguage(string)\`
- merchant-only:
  - \`.setMerchantId(string)\`
  - \`.setAcquiringBank(string)\`
- individual optional:
  - \`.setAccountInformation(string)\`
  - \`.setAcquiringBank(string)\`

### Helpers

- \`KHQRGenerator.verify(qr: string): boolean\`
- \`verifyCrc(qr: string): boolean\`
- \`decodeTlv(qr: string): Record<string,string>\`

## Dev

\`\`\`bash
npm i
npm run build
npm test
\`\`\`
`;

export const pipReadme = `# konthaina-khqr

KHQR / EMVCo merchant-presented QR payload generator for **Bakong / Cambodia** (NBC KHQR spec v2.7-style TLV) with **CRC-16/CCITT-FALSE** verification.

> This package generates the **payload string** (the EMV tag-length-value text) that you can encode into a QR image.

## Install

\`\`\`bash
pip install konthaina-khqr
\`\`\`

Optional: generate QR images (PNG) using \`qrcode\`:

\`\`\`bash
pip install "konthaina-khqr[qrcode]"
\`\`\`

## Features
- Static & Dynamic KHQR
- Correct KHR (116) / USD (840)
- Stable static QR (no timestamp)
- CRC-16 verification
- Decode / verify helpers
- CLI + PNG QR support

## Quick start

\`\`\`python
from konthaina_khqr import KHQRGenerator, MerchantType, Currency

result = (
    KHQRGenerator(MerchantType.INDIVIDUAL)
    .set_bakong_account_id("john_smith@devb")
    .set_merchant_name("John Smith")
    .set_currency(Currency.USD)
    .set_amount(100.50)
    .set_merchant_city("Phnom Penh")
    .generate()
)

print(result.qr)     # KHQR payload string
print(result.md5)    # md5 of payload
\`\`\`

## Verify / decode

\`\`\`python
from konthaina_khqr import verify, decode

ok = verify(result.qr)
data = decode(result.qr)   # simple TLV decode
\`\`\`

## CLI

\`\`\`bash
khqr --type individual --bakong john_smith@devb --name "John Smith" --amount 1.25 --currency USD
\`\`\`

Generate a PNG (requires extras):

\`\`\`bash
khqr --type individual --bakong john_smith@devb --name "John Smith" --amount 1.25 --currency USD --png out.png
\`\`\`

## Development

\`\`\`bash
python -m venv .venv
. .venv/bin/activate  # Windows: .venv\\Scripts\\activate
pip install -e ".[dev]"
pytest
ruff check .
mypy src
\`\`\`
`;

export const composerReadme = `# konthaina/khqr-php

KHQR / EMVCo merchant-presented QR payload generator for PHP (Bakong / Cambodia).
Includes CRC16 (CRC-16/CCITT-FALSE), MD5, and a verification helper.

> Namespace: \`Konthaina\\Khqr\`  
> Main class: \`Konthaina\\Khqr\\KHQRGenerator\`

---

## Features

- Generate **KHQR** payload string (EMV Tag-Length-Value format)
- Supports **Individual** and **Merchant** account structures
- Supports **Static QR** and **Dynamic QR**
- Optional fields: amount, bill number, mobile number, store label, terminal label, purpose, alternate language, etc.
- CRC16 calculation + verification
- Returns \`md5\` hash of the full QR payload string

---

## Requirements

- PHP >= 8.0
- Composer

---

## Installation

### Install via Composer (Packagist)
\`\`\`bash
composer require konthaina/khqr-php
\`\`\`

---

## Quick Start

### Generate Dynamic QR (default)
Dynamic QR usually includes \`POI=12\` and may include timestamp/reference.
If you set an amount, the QR becomes fixed-amount.

\`\`\`php
<?php

require __DIR__ . '/vendor/autoload.php';

use Konthaina\\Khqr\\KHQRGenerator;

$khqr = new KHQRGenerator(KHQRGenerator::MERCHANT_TYPE_INDIVIDUAL);

$result = $khqr->setBakongAccountId('kon_thaina@cadi')
    ->setMerchantName('Konthaina Co., Ltd.')
    ->setCurrency('USD')
    ->setAmount(25.75)
    ->setMerchantCity('Phnom Penh')
    ->setBillNumber('#12345')
    ->generate();

echo $result['qr'] . PHP_EOL;
echo "md5: {$result['md5']}\\n";
echo "timestamp: {$result['timestamp']}\\n";
echo "verify: " . (KHQRGenerator::verify($result['qr']) ? "OK" : "FAIL") . PHP_EOL;
\`\`\`

---

## Static QR vs Dynamic QR

### Static QR (recommended: no amount)
Static QR should be stable (same string every time).
In this library, \`setStatic(true)\` will:
- Set POI (Tag 01) to **11**
- Disable timestamp (Tag 99) for better compatibility

\`\`\`php
$result = (new KHQRGenerator(KHQRGenerator::MERCHANT_TYPE_INDIVIDUAL))
    ->setStatic(true)
    ->setBakongAccountId('kon_thaina@cadi')
    ->setMerchantName('Konthaina Co., Ltd.')
    ->setCurrency('USD')
    // Do NOT setAmount() for static QR
    ->setMerchantCity('Phnom Penh')
    ->generate();

echo $result['qr'] . PHP_EOL;
echo "md5: {$result['md5']}\\n";       // stable
echo "verify: " . (KHQRGenerator::verify($result['qr']) ? "OK" : "FAIL") . PHP_EOL;
\`\`\`

### Dynamic QR (with amount)
Dynamic QR is the default mode (no need to call \`setStatic(false)\`).

\`\`\`php
$result = (new KHQRGenerator(KHQRGenerator::MERCHANT_TYPE_INDIVIDUAL))
    ->setBakongAccountId('kon_thaina@cadi')
    ->setMerchantName('Konthaina Co., Ltd.')
    ->setCurrency('USD')
    ->setAmount(25.75)
    ->generate();
\`\`\`

> Note: If you remove amount but keep Dynamic mode (\`POI=12\`), some scanner apps may treat it as invalid.
> For "no amount" QR, use **Static** (\`setStatic(true)\`).

---

## Merchant Type Examples

### Individual (Tag 29)
\`\`\`php
$khqr = new KHQRGenerator(KHQRGenerator::MERCHANT_TYPE_INDIVIDUAL);

$result = $khqr->setBakongAccountId('john_smith@devb')
    ->setMerchantName('John Smith')
    ->setAccountInformation('85512233455')     // optional
    ->setAcquiringBank('Dev Bank')             // optional (individual)
    ->setCurrency('USD')
    ->setAmount(5.00)
    ->generate();

echo $result['qr'];
\`\`\`

### Merchant (Tag 30)
\`\`\`php
$khqr = new KHQRGenerator(KHQRGenerator::MERCHANT_TYPE_MERCHANT);

$result = $khqr->setBakongAccountId('merchant@bank')
    ->setMerchantId('123456')
    ->setMerchantName('ABC Store')
    ->setAcquiringBank('ABC Bank')
    ->setCurrency('KHR')
    ->setAmount(50000)
    ->generate();

echo $result['qr'];
\`\`\`

---

## Verify KHQR (CRC)

\`\`\`php
use Konthaina\\Khqr\\KHQRGenerator;

$isValid = KHQRGenerator::verify($qrString);
\`\`\`

---

## Returned structure

\`\`\`php
[
  'qr' => '000201...',
  'timestamp' => '1700000000000', // null for static mode
  'type' => 'individual|merchant',
  'md5' => '...'
]
\`\`\`

---

## Fields / Limits

The generator truncates fields based on common KHQR limits used in the code:

| Field | Max Length |
|-------|------------|
| Bakong account id | 32 |
| Merchant name | 25 |
| Merchant ID | 32 |
| Acquiring bank | 32 |
| Account information | 32 |
| City | 15 |
| Bill number | 25 |
| Mobile number | 25 |
| Store label | 25 |
| Terminal label | 25 |
| Purpose | 25 |
| Language preference | 2 |
| Merchant name alternate | 25 |
| City alternate | 15 |
| UPI account info | 31 |

> Note: EMV length uses **byte length**. If you use Khmer/Unicode characters, byte length may differ from character count.

---

## License

MIT
`;
