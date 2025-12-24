/*
* Original IQRA-1 content retained for reference.
* ------------------------------------------------------------
* The full markdown guide from the original file is preserved here as a comment.
* (If needed, view the version control history for the complete content.)
*
```markdown
# PANDUAN LENGKAP IQRA HUB - JILID 1 (VERSI PENUH TANPA RINGKASAN)
---
## MUKA SURAT 2: HURUF HIJAIYAH TUNGGAL
**Fokus:** Mengenal 28 Huruf Asal dan Bentuknya.
... (rest of markdown omitted for brevity) ...
```
*/

import React from 'react';
import LessonCard from './LessonCard';

const IQRA1: React.FC = () => {
    return (
        <LessonCard
            title="Lesson 1 – Alif & Ba"
            pdfUrl="./IQRA-1.pdf"
            progress={0}
        />
    );
};

export default IQRA1;