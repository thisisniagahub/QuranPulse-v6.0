# Contributing Guidelines

Terima kasih kerana berminat untuk menyumbang kepada **NiagaHub-SuperApp**. Sila ikuti panduan ini untuk memastikan kualiti kod.

## 1. Tech Stack Standards
*   **Framework:** Next.js (App Router).
*   **Language:** TypeScript (Wajib `strict: true`).
*   **Styling:** Tailwind CSS.
*   **State Management:** React Context / Zustand (jika perlu).

## 2. Git Workflow
1.  **Branching:** Jangan commit terus ke `main`.
    *   Format Branch: `feature/nama-feature` atau `fix/nama-bug`.
    *   Contoh: `feature/redis-caching`, `fix/api-rotation`.
2.  **Commits:** Gunakan "Conventional Commits".
    *   `feat: tambah logik rotation`
    *   `fix: betulkan typo dalam .env`
    *   `docs: kemaskini PRD`

## 3. Kod Gaya (Code Style)
*   Gunakan `async/await` untuk operasi asynchronous.
*   Wajib handle error dengan `try/catch`.
*   Jangan hardcode "Secrets" atau API Key. Gunakan `process.env`.
*   Beri nama variable yang jelas (contoh: `userProfile` bukan `data`).

## 4. Definition of Done (DoD)
Sesuatu fitur dianggap siap apabila:
1.  Kod berfungsi seperti dalam PRD.
2.  Tiada error di console.
3.  Telah diuji (sekurang-kurangnya manual testing).
4.  Kod telah di-push ke repository.
