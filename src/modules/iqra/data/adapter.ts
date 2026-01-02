import { IqraPageStrict, IqraGridRow } from './iqra-1-strict';
import { IqraVolume, IqraSection, IqraRow, IqraSegment } from './types';

export const adaptStrictToVolume = (level: number, strictPages: IqraPageStrict[]): IqraVolume => {
    return {
        id: `iqra-${level}`,
        title: `IQRA ${level}`,
        pages: strictPages.map(page => adaptPage(page))
    };
};

const adaptPage = (page: IqraPageStrict): IqraSection => {
    return {
        id: `p-${page.page}`,
        title: page.title,
        focus: page.focus,
        rows: page.grid.map((row, idx) => adaptRow(row, idx)),
        image: `/src/assets/iqra/pages/iqra-${page.page}.png` // Placeholder image path logic
    };
};

const adaptRow = (row: IqraGridRow, idx: number): IqraRow => {
    // Extract content, splitting by space to get individual letters/words
    // In RTL, the first items in the array should appear on the Right.
    // 'kanan' data is for the Right side, 'kiri' is for the Left side.

    const kananItems = row.kanan ? row.kanan.trim().split(/\s+/).filter(Boolean) : [];
    const kiriItems = row.kiri ? row.kiri.trim().split(/\s+/).filter(Boolean) : [];

    // Push kanan first (so they are 0,1,2.. and appear first in RTL flow)
    const cells: string[] = [...kananItems, ...kiriItems];

    // Create detailed segments for interactivity
    const segments: IqraSegment[] = cells.map((text, i) => ({
        id: `r${idx}-c${i}`,
        text: text,
        // We could add heuristic transliteration or audio maps here later
    }));

    return {
        id: `r-${idx}`,
        label: row.baris,
        cells: cells,
        segments: segments,
        // row.fokus does not exist on IqraGridRow, so we default to undefined or remove it.
        // If the page needs checking, we use page.focus
    };
};
