import { IQRA_1_STRICT } from './iqra-1-strict';
import { IQRA_2_STRICT } from './iqra-2-strict';
import { IQRA_3_STRICT } from './iqra-3-strict';
import { IQRA_4_STRICT } from './iqra-4-strict';
import { IQRA_5_STRICT } from './iqra-5-strict';
import { IQRA_6_STRICT } from './iqra-6-strict';
import { IqraPageStrict } from './iqra-1-strict';

export * from './iqra-1-strict'; // Export types from 1

export const IQRA_MASTER_DATA: Record<number, IqraPageStrict[]> = {
    1: IQRA_1_STRICT,
    2: IQRA_2_STRICT,
    3: IQRA_3_STRICT,
    4: IQRA_4_STRICT,
    5: IQRA_5_STRICT,
    6: IQRA_6_STRICT
};

export const getIqraVolume = (volume: number): IqraPageStrict[] => {
    return IQRA_MASTER_DATA[volume] || [];
};

export const getIqraPage = (volume: number, page: number): IqraPageStrict | undefined => {
    const volData = getIqraVolume(volume);
    return volData.find(p => p.page === page);
};
