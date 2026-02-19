export interface IqraGridRow {
    baris: string;
    kanan: string;
    kiri: string;
}

export interface IqraPageStrict {
    page: number;
    title: string;
    focus: string;
    grid: IqraGridRow[];
}

export const IQRA_1_STRICT: IqraPageStrict[] = [
    {
        "page": 1,
        "title": "Cover",
        "focus": "Title",
        "grid": [
            {
                "baris": "Title",
                "kiri": "اقرأ",
                "kanan": "چارا چڤت بلاجر ممباچ القرءان"
            },
            {
                "baris": "Subtitle",
                "kiri": "رسم عثماني",
                "kanan": "استاذ حاج أسعد همام"
            }
        ]
    },
    {
        "page": 2,
        "title": "HURUF BERBARIS",
        "focus": "أَ (A) - بَ (BA)",
        "grid": [
            {
                "baris": "Instruction",
                "kiri": "باچ تروس أ، بَ دان ستروسڽ، تيدق ڤرلو دايجا. باچ دغن ڤينديق",
                "kanan": ""
            },
            {
                "baris": "Main",
                "kiri": "أ بَ",
                "kanan": ""
            },
            { "baris": "1", "kiri": "بَ أ بَ", "kanan": "أ بَ أ" },
            { "baris": "2", "kiri": "بَ أ أ", "kanan": "أ أ بَ" },
            { "baris": "3", "kiri": "بَ بَ أ", "kanan": "أ بَ بَ" },
            { "baris": "4", "kiri": "بَ أ بَ", "kanan": "أ بَ أ" },
            { "baris": "5", "kiri": "أ أ أ", "kanan": "بَ بَ بَ" },
            { "baris": "6", "kiri": "أ بَ", "kanan": "أ بَ | أ بَ" }
        ]
    },
    {
        "page": 3,
        "title": "FATHAH",
        "focus": "بَ (BA) - تَ (TA)",
        "grid": [
            {
                "baris": "Instruction",
                "kiri": "باچ تروس أ، بَ تَ دان ستروسڽ، تيدق ڤرلو دايجا. باچ دغن ڤينديق",
                "kanan": ""
            },
            {
                "baris": "Main",
                "kiri": "بَ تَ",
                "kanan": ""
            },
            { "baris": "1", "kiri": "أ تَ بَ", "kanan": "تَ بَ أ" },
            { "baris": "2", "kiri": "تَ أ بَ", "kanan": "أ بَ تَ" },
            { "baris": "3", "kiri": "بَ تَ أ", "kanan": "أ تَ بَ" },
            { "baris": "4", "kiri": "تَ أ تَ", "kanan": "بَ أ تَ" },
            { "baris": "5", "kiri": "أ تَ بَ", "kanan": "تَ تَ أ" },
            { "baris": "6", "kiri": "أ بَ تَ", "kanan": "أ بَ تَ" }
        ]
    },
    {
        "page": 4,
        "title": "FATHAH",
        "focus": "بَ - تَ - ثَ (THA)",
        "grid": [
            { "baris": "Main", "kiri": "بَ تَ ثَ", "kanan": "" },
            { "baris": "1", "kiri": "ثَ أ بَ", "kanan": "ثَ بَ تَ" },
            { "baris": "2", "kiri": "بَ تَ ثَ", "kanan": "بَ أ ثَ" },
            { "baris": "3", "kiri": "أ تَ بَ", "kanan": "ثَ بَ ثَ" },
            { "baris": "4", "kiri": "تَ بَ تَ", "kanan": "أ ثَ ثَ" },
            { "baris": "5", "kiri": "تَ تَ أ", "kanan": "بَ ثَ ثَ" },
            { "baris": "6", "kiri": "ثَ بَ تَ", "kanan": "بَ تَ ثَ" },
            { "baris": "7", "kiri": "أ بَ تَ ثَ", "kanan": "أ بَ تَ ثَ" }
        ]
    },
    {
        "page": 5,
        "title": "FATHAH",
        "focus": "جَ (JA)",
        "grid": [
            { "baris": "Main", "kiri": "جَ", "kanan": "" },
            { "baris": "1", "kiri": "أ جَ جَ", "kanan": "ثَ أ جَ" },
            { "baris": "2", "kiri": "أ تَ جَ", "kanan": "ثَ بَ جَ" },
            { "baris": "3", "kiri": "بَ جَ ثَ", "kanan": "ثَ أ جَ" },
            { "baris": "4", "kiri": "جَ أ بَ", "kanan": "جَ أ ثَ" },
            { "baris": "5", "kiri": "تَ أ جَ", "kanan": "ثَ جَ جَ" },
            { "baris": "6", "kiri": "جَ أ جَ", "kanan": "جَ ثَ ثَ" },
            { "baris": "7", "kiri": "أ بَ تَ ثَ جَ", "kanan": "" }
        ]
    },
    {
        "page": 6,
        "title": "FATHAH",
        "focus": "جَ (JA) - حَ (HA)",
        "grid": [
            { "baris": "Main", "kiri": "جَ حَ", "kanan": "" },
            { "baris": "1", "kiri": "جَ أ حَ", "kanan": "حَ حَ ثَ" },
            { "baris": "2", "kiri": "حَ جَ تَ", "kanan": "بَ حَ ثَ" },
            { "baris": "3", "kiri": "جَ حَ تَ", "kanan": "أ حَ بَ" },
            { "baris": "4", "kiri": "جَ أ ثَ", "kanan": "حَ أ حَ" },
            { "baris": "5", "kiri": "ثَ بَ حَ", "kanan": "تَ أ حَ" },
            { "baris": "6", "kiri": "أ جَ جَ", "kanan": "أ حَ حَ" },
            { "baris": "7", "kiri": "أ بَ تَ ثَ جَ حَ", "kanan": "" }
        ]
    },
    {
        "page": 7,
        "title": "FATHAH",
        "focus": "جَ - حَ - خَ (KHO)",
        "grid": [
            { "baris": "Main", "kiri": "جَ حَ خَ", "kanan": "" },
            { "baris": "1", "kiri": "حَ أ خَ", "kanan": "جَ أ خَ" },
            { "baris": "2", "kiri": "ثَ أ خَ", "kanan": "خَ تَ جَ" },
            { "baris": "3", "kiri": "بَ أ خَ", "kanan": "تَ حَ ثَ" },
            { "baris": "4", "kiri": "جَ أ خَ", "kanan": "بَ حَ ثَ" },
            { "baris": "5", "kiri": "تَ أ خَ", "kanan": "جَ حَ ثَ" },
            { "baris": "6", "kiri": "أ خَ خَ", "kanan": "جَ حَ خَ" },
            { "baris": "7", "kiri": "أ بَ تَ ثَ جَ حَ خَ", "kanan": "" }
        ]
    },
    {
        "page": 8,
        "title": "FATHAH",
        "focus": "دَ (DA)",
        "grid": [
            { "baris": "Main", "kiri": "دَ", "kanan": "" },
            { "baris": "1", "kiri": "خَ دَ دَ", "kanan": "خَ دَ خَ" },
            { "baris": "2", "kiri": "حَ دَ ثَ", "kanan": "جَ حَ دَ" },
            { "baris": "3", "kiri": "خَ تَ دَ", "kanan": "خَ جَ دَ" },
            { "baris": "4", "kiri": "ثَ بَ دَ", "kanan": "جَ حَ خَ" },
            { "baris": "5", "kiri": "حَ بَ دَ", "kanan": "جَ دَ جَ" },
            { "baris": "6", "kiri": "حَ جَ تَ", "kanan": "خَ دَ دَ" },
            { "baris": "7", "kiri": "أ بَ تَ ثَ جَ حَ خَ دَ", "kanan": "" }
        ]
    },
    {
        "page": 9,
        "title": "FATHAH",
        "focus": "دَ (DA) - ذَ (DZA)",
        "grid": [
            { "baris": "Main", "kiri": "دَ ذَ", "kanan": "" },
            { "baris": "1", "kiri": "دَ أ ذَ", "kanan": "خَ دَ ذَ" },
            { "baris": "2", "kiri": "أ حَ دَ", "kanan": "جَ حَ ذَ" },
            { "baris": "3", "kiri": "خَ تَ دَ", "kanan": "ثَ أ ذَ" },
            { "baris": "4", "kiri": "جَ حَ خَ", "kanan": "ذَ بَ حَ" },
            { "baris": "5", "kiri": "حَ دَ ثَ", "kanan": "أ خَ ذَ" },
            { "baris": "6", "kiri": "دَ أ ذَ", "kanan": "خَ دَ ذَ" },
            { "baris": "7", "kiri": "أ بَ تَ ثَ جَ حَ خَ دَ ذَ", "kanan": "" }
        ]
    },
    {
        "page": 10,
        "title": "FATHAH",
        "focus": "رَ (RO)",
        "grid": [
            { "baris": "Main", "kiri": "رَ", "kanan": "" },
            { "baris": "1", "kiri": "دَ ذَ رَ", "kanan": "خَ ذَ رَ" },
            { "baris": "2", "kiri": "رَ حَ دَ", "kanan": "جَ رَ ذَ" },
            { "baris": "3", "kiri": "رَ حَ ثَ", "kanan": "تَ ذَ رَ" },
            { "baris": "4", "kiri": "بَ رَ دَ", "kanan": "خَ رَ جَ" },
            { "baris": "5", "kiri": "حَ ذَ رَ", "kanan": "بَ رَ تَ" },
            { "baris": "6", "kiri": "خَ خَ ذَ", "kanan": "حَ جَ رَ" },
            { "baris": "7", "kiri": "أ بَ تَ ثَ جَ حَ خَ دَ ذَ رَ", "kanan": "" }
        ]
    },
    {
        "page": 11,
        "title": "FATHAH",
        "focus": "رَ (RO) - زَ (ZAI)",
        "grid": [
            { "baris": "Main", "kiri": "رَ زَ", "kanan": "" },
            { "baris": "1", "kiri": "رَ أ زَ", "kanan": "دَ زَ رَ" },
            { "baris": "2", "kiri": "زَ دَ رَ", "kanan": "زَ خَ ذَ" },
            { "baris": "3", "kiri": "زَ حَ دَ", "kanan": "ثَ رَ زَ" },
            { "baris": "4", "kiri": "خَ رَ جَ", "kanan": "تَ زَ دَ" },
            { "baris": "5", "kiri": "بَ زَ رَ", "kanan": "ثَ حَ ذَ" },
            { "baris": "6", "kiri": "جَ أ خَ", "kanan": "زَ أ زَ" },
            { "baris": "7", "kiri": "أ بَ تَ ثَ جَ حَ خَ دَ ذَ رَ زَ", "kanan": "" }
        ]
    },
    {
        "page": 12,
        "title": "FATHAH",
        "focus": "سَ (SA)",
        "grid": [
            { "baris": "Main", "kiri": "سَ", "kanan": "" },
            { "baris": "1", "kiri": "زَ أ سَ", "kanan": "زَ رَ سَ" },
            { "baris": "2", "kiri": "سَ خَ ذَ", "kanan": "حَ سَ دَ" },
            { "baris": "3", "kiri": "سَ خَ ثَ", "kanan": "جَ زَ رَ" },
            { "baris": "4", "kiri": "سَ بَ تَ", "kanan": "ذَ رَ سَ" },
            { "baris": "5", "kiri": "سَ خَ ذَ", "kanan": "زَ حَ دَ" },
            { "baris": "6", "kiri": "سَ جَ ثَ", "kanan": "أ بَ تَ" },
            { "baris": "7", "kiri": "ثَ جَ حَ خَ دَ ذَ رَ زَ سَ", "kanan": "" }
        ]
    },
    {
        "page": 13,
        "title": "FATHAH",
        "focus": "سَ (SA) - شَ (SYA)",
        "grid": [
            { "baris": "Main", "kiri": "سَ شَ", "kanan": "" },
            { "baris": "1", "kiri": "سَ أَ شَ | سَ شَ شَ", "kanan": "زَ تَ شَ" },
            { "baris": "2", "kiri": "شَ ذَ ثَ | دَ رَ سَ", "kanan": "شَ تَ ذَ" },
            { "baris": "3", "kiri": "زَ حَ ثَ | خَ شَ بَ", "kanan": "جَ رَ سَ" },
            { "baris": "4", "kiri": "سَ شَ أ | رَ شَ ذَ", "kanan": "حَ سَ دَ" },
            { "baris": "5", "kiri": "ذَ خَ زَ | أَ سَ شَ", "kanan": "شَ زَ رَ" },
            { "baris": "6", "kiri": "خَ سَ دَ | شَ زَ جَ", "kanan": "أ بَ تَ" },
            { "baris": "7", "kiri": "ثَ جَ حَ خَ دَ ذَ رَ زَ سَ شَ", "kanan": "" }
        ]
    },
    {
        "page": 14,
        "title": "FATHAH",
        "focus": "صَ (SHO)",
        "grid": [
            { "baris": "Main", "kiri": "صَ", "kanan": "" },
            { "baris": "1", "kiri": "صَ أَ شَ | صَ شَ زَ", "kanan": "سَ رَ صَ" },
            { "baris": "2", "kiri": "صَ ثَ ذَ | دَ سَ صَ", "kanan": "شَ رَ تَ" },
            { "baris": "3", "kiri": "سَ خَ صَ | حَ صَ دَ", "kanan": "ذَ زَ صَ" },
            { "baris": "4", "kiri": "حَ ذَ رَ | شَ بَ صَ", "kanan": "سَ جَ زَ" },
            { "baris": "5", "kiri": "صَ دَ خَ | صَ جَ ذَ", "kanan": "شَ رَ زَ" },
            { "baris": "6", "kiri": "ثَ خَ صَ", "kanan": "أ بَ تَ ثَ جَ حَ" },
            { "baris": "7", "kiri": "خَ دَ ذَ رَ زَ سَ شَ صَ", "kanan": "" }
        ]
    },
    {
        "page": 15,
        "title": "FATHAH",
        "focus": "صَ (SHO) - ضَ (DHO)",
        "grid": [
            { "baris": "Main", "kiri": "صَ ضَ", "kanan": "" },
            { "baris": "1", "kiri": "صَ أَ ضَ | حَ ضَ رَ", "kanan": "أَ صَ ضَ" },
            { "baris": "2", "kiri": "شَ أَ ضَ | شَ خَ زَ", "kanan": "ضَ رَ بَ" },
            { "baris": "3", "kiri": "صَ حَ ثَ | صَ دَ زَ", "kanan": "دَ شَ ضَ" },
            { "baris": "4", "kiri": "سَ حَ ذَ | رَ صَ دَ", "kanan": "ضَ تَ ذَ" },
            { "baris": "5", "kiri": "ثَ خَ زَ | ضَ جَ ذَ", "kanan": "سَ أَ شَ" },
            { "baris": "6", "kiri": "صَ رَ ضَ", "kanan": "أ بَ تَ ثَ جَ حَ خَ" },
            { "baris": "7", "kiri": "دَ ذَ رَ زَ سَ شَ صَ ضَ", "kanan": "" }
        ]
    },
    {
        "page": 16,
        "title": "FATHAH",
        "focus": "طَ (THO)",
        "grid": [
            { "baris": "Main", "kiri": "طَ", "kanan": "" },
            { "baris": "1", "kiri": "طَ أَ ضَ | زَ طَ شَ", "kanan": "حَ جَ طَ" },
            { "baris": "2", "kiri": "تَ صَ ضَ | ذَ طَ سَ", "kanan": "زَ دَ طَ" },
            { "baris": "3", "kiri": "دَ ضَ صَ | سَ رَ طَ", "kanan": "شَ ضَ ثَ" },
            { "baris": "4", "kiri": "شَ خَ طَ | طَ حَ ذَ", "kanan": "بَ صَ ضَ" },
            { "baris": "5", "kiri": "ذَ رَ طَ | جَ زَ ضَ", "kanan": "ثَ أَ شَ" },
            { "baris": "6", "kiri": "سَ خَ طَ", "kanan": "أ بَ تَ ثَ جَ حَ خَ" },
            { "baris": "7", "kiri": "دَ ذَ رَ زَ سَ شَ صَ ضَ طَ", "kanan": "" }
        ]
    },
    {
        "page": 17,
        "title": "FATHAH",
        "focus": "طَ (THO) - ظَ (ZHO)",
        "grid": [
            { "baris": "Main", "kiri": "طَ ظَ", "kanan": "" },
            { "baris": "1", "kiri": "ظَ أَ طَ | بَ طَ ظَ", "kanan": "ظَ حَ ذَ" },
            { "baris": "2", "kiri": "سَ ضَ ظَ | دَ صَ ظَ", "kanan": "طَ حَ ذَ" },
            { "baris": "3", "kiri": "شَ أَ ظَ | سَ رَ صَ", "kanan": "زَ خَ طَ" },
            { "baris": "4", "kiri": "ثَ رَ ضَ | زَ خَ ضَ", "kanan": "تَ ضَ ظَ" },
            { "baris": "5", "kiri": "صَ دَ شَ | جَ طَ ضَ", "kanan": "شَ طَ ظَ" },
            { "baris": "6", "kiri": "أ بَ تَ ثَ جَ حَ خَ دَ ذَ", "kanan": "" },
            { "baris": "7", "kiri": "رَ زَ سَ شَ صَ ضَ طَ ظَ", "kanan": "" }
        ]
    },
    {
        "page": 18,
        "title": "FATHAH",
        "focus": "عَ (A'IN)",
        "grid": [
            { "baris": "Main", "kiri": "عَ", "kanan": "" },
            { "baris": "1", "kiri": "ظَ أَ عَ | ثَ عَ رَ", "kanan": "بَ عَ طَ" },
            { "baris": "2", "kiri": "صَ عَ زَ | صَ عَ ضَ", "kanan": "دَ حَ ظَ" },
            { "baris": "3", "kiri": "بَ عَ ثَ | سَ عَ ظَ", "kanan": "شَ طَ عَ" },
            { "baris": "4", "kiri": "جَ خَ ذَ | ضَ عَ شَ", "kanan": "زَ أَ ضَ" },
            { "baris": "5", "kiri": "عَ جَ ظَ | دَ طَ ضَ", "kanan": "طَ عَ ظَ" },
            { "baris": "6", "kiri": "أ بَ تَ ثَ جَ حَ خَ دَ ذَ", "kanan": "" },
            { "baris": "7", "kiri": "رَ زَ سَ شَ صَ ضَ طَ ظَ عَ", "kanan": "" }
        ]
    },
    {
        "page": 19,
        "title": "FATHAH",
        "focus": "عَ (A'IN) - غَ (GHOIN)",
        "grid": [
            { "baris": "Main", "kiri": "عَ غَ", "kanan": "" },
            { "baris": "1", "kiri": "غَ أَ عَ | دَ غَ ظَ", "kanan": "عَ طَ غَ" },
            { "baris": "2", "kiri": "ثَ عَ ظَ | جَ غَ ظَ", "kanan": "سَ طَ عَ" },
            { "baris": "3", "kiri": "حَ رَ ظَ | شَ غَ طَ", "kanan": "صَ رَ عَ" },
            { "baris": "4", "kiri": "زَ خَ ظَ | ضَ غَ ذَ", "kanan": "تَ غَ ضَ" },
            { "baris": "5", "kiri": "شَ رَ ظَ | طَ عَ ظَ", "kanan": "بَ غَ صَ" },
            { "baris": "6", "kiri": "أ بَ تَ ثَ جَ حَ خَ دَ ذَ رَ زَ", "kanan": "" },
            { "baris": "7", "kiri": "سَ شَ صَ ضَ طَ ظَ عَ غَ", "kanan": "" }
        ]
    },
    {
        "page": 20,
        "title": "FATHAH",
        "focus": "فَ (FA)",
        "grid": [
            { "baris": "Main", "kiri": "فَ", "kanan": "" },
            { "baris": "1", "kiri": "فَ أَ غَ | فَ عَ ضَ", "kanan": "غَ فَ صَ" },
            { "baris": "2", "kiri": "فَ تَ حَ | غَ جَ زَ", "kanan": "حَ فَ ظَ" },
            { "baris": "3", "kiri": "طَ عَ دَ | صَ فَ غَ", "kanan": "شَ خَ ضَ" },
            { "baris": "4", "kiri": "سَ غَ ظَ | خَ فَ ذَ", "kanan": "شَ غَ ضَ" },
            { "baris": "5", "kiri": "فَ زَ عَ | ثَ غَ طَ", "kanan": "ظَ فَ رَ" },
            { "baris": "6", "kiri": "أ بَ تَ ثَ جَ حَ خَ دَ ذَ رَ زَ", "kanan": "" },
            { "baris": "7", "kiri": "سَ شَ صَ ضَ طَ ظَ عَ غَ فَ", "kanan": "" }
        ]
    },
    {
        "page": 21,
        "title": "FATHAH",
        "focus": "فَ (FA) - قَ (QOF)",
        "grid": [
            { "baris": "Main", "kiri": "فَ قَ", "kanan": "" },
            { "baris": "1", "kiri": "قَ بَ ضَ | قَ طَ فَ", "kanan": "فَ رَ قَ" },
            { "baris": "2", "kiri": "ثَ غَ ظَ | فَ قَ ظَ", "kanan": "سَ عَ فَ" },
            { "baris": "3", "kiri": "حَ ذَ خَ | قَ فَ صَ", "kanan": "عَ قَ دَ" },
            { "baris": "4", "kiri": "ضَ غَ طَ | شَ فَ عَ", "kanan": "زَ قَ قَ" },
            { "baris": "5", "kiri": "أ بَ تَ ثَ جَ حَ خَ دَ ذَ", "kanan": "" },
            { "baris": "6", "kiri": "رَ زَ سَ شَ صَ ضَ", "kanan": "" },
            { "baris": "7", "kiri": "طَ ظَ عَ غَ فَ قَ", "kanan": "" }
        ]
    },
    {
        "page": 22,
        "title": "FATHAH",
        "focus": "كَ (KAF)",
        "grid": [
            { "baris": "Main", "kiri": "كَ", "kanan": "" },
            { "baris": "1", "kiri": "كَ حَ قَ | كَ قَ خَ", "kanan": "كَ قَ" },
            { "baris": "2", "kiri": "ضَ حَ كَ | عَ طَ فَ", "kanan": "شَ كَ رَ" },
            { "baris": "3", "kiri": "جَ كَ تَ | قَ كَ فَ", "kanan": "ذَ غَ سَ" },
            { "baris": "4", "kiri": "صَ دَ ثَ | غَ فَ كَ", "kanan": "زَ كَ طَ" },
            { "baris": "5", "kiri": "أ بَ تَ ثَ جَ حَ خَ دَ ذَ", "kanan": "" },
            { "baris": "6", "kiri": "رَ زَ سَ شَ صَ ضَ طَ ظَ", "kanan": "" },
            { "baris": "7", "kiri": "عَ غَ فَ قَ كَ", "kanan": "" }
        ]
    },
    {
        "page": 23,
        "title": "FATHAH",
        "focus": "لَ (LAM)",
        "grid": [
            { "baris": "Main", "kiri": "لَ", "kanan": "" },
            { "baris": "1", "kiri": "قَ لَ بَ | جَ عَ لَ", "kanan": "خَ لَ طَ" },
            { "baris": "2", "kiri": "ذَ كَ رَ | غَ لَ ظَ", "kanan": "قَ فَ صَ" },
            { "baris": "3", "kiri": "حَ لَ فَ | دَ غَ سَ", "kanan": "شَ كَ لَ" },
            { "baris": "4", "kiri": "ضَ رَ عَ | زَ تَ ظَ", "kanan": "كَ لَ لَ" },
            { "baris": "5", "kiri": "أ بَ تَ ثَ جَ حَ خَ دَ ذَ", "kanan": "" },
            { "baris": "6", "kiri": "رَ زَ سَ شَ صَ ضَ", "kanan": "" },
            { "baris": "7", "kiri": "طَ ظَ عَ غَ فَ قَ كَ لَ", "kanan": "" }
        ]
    },
    {
        "page": 24,
        "title": "FATHAH",
        "focus": "مَ (MIM)",
        "grid": [
            { "baris": "Main", "kiri": "مَ", "kanan": "" },
            { "baris": "1", "kiri": "غَ مَ ضَ | لَ مَ سَ", "kanan": "جَ مَ عَ" },
            { "baris": "2", "kiri": "فَ رَ ضَ | كَ رَ مَ", "kanan": "خَ لَ طَ" },
            { "baris": "3", "kiri": "صَ مَ دَ | ظَ لَ مَ", "kanan": "مَ رَ قَ" },
            { "baris": "4", "kiri": "شَ مَ لَ | فَ كَ حَ", "kanan": "غَ مَ مَ" },
            { "baris": "5", "kiri": "أ بَ تَ ثَ جَ حَ خَ دَ ذَ", "kanan": "" },
            { "baris": "6", "kiri": "رَ زَ سَ شَ صَ ضَ طَ ظَ", "kanan": "" },
            { "baris": "7", "kiri": "عَ غَ فَ قَ كَ لَ مَ", "kanan": "" }
        ]
    },
    {
        "page": 25,
        "title": "FATHAH",
        "focus": "نَ (NUN)",
        "grid": [
            { "baris": "Main", "kiri": "نَ", "kanan": "" },
            { "baris": "1", "kiri": "نَ ظَ فَ | نَ غَ شَ", "kanan": "طَ عَ نَ" },
            { "baris": "2", "kiri": "صَ مَ ضَ | قَ رَ نَ", "kanan": "خَ لَ قَ" },
            { "baris": "3", "kiri": "زَ مَ نَ | كَ ذَ بَ", "kanan": "جَ نَ دَ" },
            { "baris": "4", "kiri": "كَ نَ سَ | لَ حَ ظَ", "kanan": "مَ نَ نَ" },
            { "baris": "5", "kiri": "أ بَ تَ ثَ جَ حَ خَ دَ ذَ", "kanan": "" },
            { "baris": "6", "kiri": "رَ زَ سَ شَ صَ ضَ طَ ظَ", "kanan": "" },
            { "baris": "7", "kiri": "عَ غَ فَ قَ كَ لَ مَ نَ", "kanan": "" }
        ]
    },
    {
        "page": 26,
        "title": "FATHAH",
        "focus": "وَ (WAU)",
        "grid": [
            { "baris": "Main", "kiri": "وَ", "kanan": "" },
            { "baris": "1", "kiri": "وَ زَ رَ | وَ لَ غَ", "kanan": "دَ وَ مَ" },
            { "baris": "2", "kiri": "فَ طَ نَ | قَ وَ مَ", "kanan": "ظَ جَ عَ" },
            { "baris": "3", "kiri": "كَ وَ نَ | سَ كَ تَ", "kanan": "خَ وَ صَ" },
            { "baris": "4", "kiri": "شَ وَ لَ | ذَ حَ ضَ", "kanan": "وَ نَ وَ" },
            { "baris": "5", "kiri": "أ بَ تَ ثَ جَ حَ خَ دَ ذَ", "kanan": "" },
            { "baris": "6", "kiri": "رَ زَ سَ شَ صَ ضَ طَ ظَ", "kanan": "" },
            { "baris": "7", "kiri": "عَ غَ فَ قَ كَ لَ مَ نَ وَ", "kanan": "" }
        ]
    },
    {
        "page": 27,
        "title": "FATHAH",
        "focus": "هَـ (HA)",
        "grid": [
            { "baris": "Main", "kiri": "هَـ", "kanan": "" },
            { "baris": "1", "kiri": "هَـ مَ شَ | جَ هَـ دَ", "kanan": "دَ وَ هَـ" },
            { "baris": "2", "kiri": "فَ خَ عَ | طَ هَـ رَ", "kanan": "وَ ضَ حَ" },
            { "baris": "3", "kiri": "وَ هَـ ظَ | كَ مَ نَ", "kanan": "زَ هَـ قَ" },
            { "baris": "4", "kiri": "سَ هَـ لَ | ذَ غَ صَ", "kanan": "جَ هَـ هَـ" },
            { "baris": "5", "kiri": "أَ بَ تَ ثَ جَ حَ خَ دَ ذَ", "kanan": "" },
            { "baris": "6", "kiri": "رَ زَ سَ شَ صَ ضَ طَ ظَ", "kanan": "" },
            { "baris": "7", "kiri": "عَ غَ فَ قَ كَ لَ مَ نَ وَ هَـ", "kanan": "" }
        ]
    },
    {
        "page": 28,
        "title": "FATHAH",
        "focus": "ىَ (YA)",
        "grid": [
            { "baris": "Main", "kiri": "ىَ", "kanan": "" },
            { "baris": "1", "kiri": "ضَ ىَ رَ | ضَ حَ ىَ", "kanan": "زَ ىَ نَ" },
            { "baris": "2", "kiri": "سَ ىَ عَ | وَ كَ لَ", "kanan": "هَـ ىَ خَ" },
            { "baris": "3", "kiri": "طَ هَـ ظَ | شَ ىَ عَ", "kanan": "وَ قَ فَ" },
            { "baris": "4", "kiri": "هَـ ىَ مَ | جَ ذَ ثَ", "kanan": "ىَ دَ ىَ" },
            { "baris": "5", "kiri": "أَ بَ تَ ثَ جَ حَ خَ دَ ذَ رَ زَ", "kanan": "" },
            { "baris": "6", "kiri": "سَ شَ صَ ضَ طَ ظَ عَ غَ", "kanan": "" },
            { "baris": "7", "kiri": "فَ قَ كَ لَ مَ نَ وَ هَـ ىَ", "kanan": "" }
        ]
    },
    {
        "page": 29,
        "title": "ALIF vs HAMZAH",
        "focus": "أ = ءَا",
        "grid": [
            { "baris": "Header", "kiri": "أَ = ءَا", "kanan": "رَ = رَ | مَ = مَ" },
            { "baris": "1", "kiri": "بَ رَ أَ | بَ رَ رَ", "kanan": "قَ رَ أَ" },
            { "baris": "2", "kiri": "أَ مَ مَ | جَ رَ أ", "kanan": "سَ أَ لَ" },
            { "baris": "3", "kiri": "رَ زَ قَ | مَ دَ حَ", "kanan": "غَ مَ مَ" },
            { "baris": "4", "kiri": "لَ ءَ كَ | مَ شَ ءَ", "kanan": "مَ دَ مَ" },
            { "baris": "5", "kiri": "سَ ىَ رَ | جَ زَ مَ", "kanan": "كَ بَ دَ" },
            { "baris": "6", "kiri": "مَ قَ تَ | كَ لَ مَ", "kanan": "حَ سَ نَ" }
        ]
    },
    {
        "page": 30,
        "title": "REVIEW",
        "focus": "Review (Comprehensive)",
        "grid": [
            { "baris": "1", "kiri": "ثَ بَ تَ | جَ حَ خَ", "kanan": "دَ ذَ رَ" },
            { "baris": "2", "kiri": "زَ سَ شَ | أَ صَ ظَ", "kanan": "طَ ظَ عَ" },
            { "baris": "3", "kiri": "غَ فَ قَ | كَ لَ مَ", "kanan": "نَ وَ هَـ" },
            { "baris": "4", "kiri": "حَ هَـ لَ | بَ ىَ نَ", "kanan": "ءَ أَ رَ" },
            { "baris": "5", "kiri": "بَ عَ ثَ | جَ حَ خَ", "kanan": "دَ ذَ رَ" },
            { "baris": "6", "kiri": "زَ سَ شَ | أَ صَ ضَ", "kanan": "طَ ظَ عَ" },
            { "baris": "7", "kiri": "غَ فَ قَ | كَ لَ مَ", "kanan": "نَ وَ هَـ" },
            { "baris": "8", "kiri": "هَـ ىَ تَ | أَ كَ لَ", "kanan": "مَ نَ وَ" }
        ]
    },
    {
        "page": 31,
        "title": "DIFFERENCE",
        "focus": "Distinguish Sounds",
        "grid": [
            { "baris": "Title", "kiri": "بيذاكن دغن جلس انتارا:", "kanan": "ڤرهاتين!" },
            { "baris": "1", "kiri": "أَ - عَ", "kanan": "ثَ - سَ" },
            { "baris": "2", "kiri": "حَ - هَـ", "kanan": "ثَ - شَ" },
            { "baris": "3", "kiri": "جَ - زَ", "kanan": "سَ - شَ" },
            { "baris": "4", "kiri": "ذَ - زَ", "kanan": "سَ - صَ" },
            { "baris": "5", "kiri": "خَ - غَ", "kanan": "تَ - طَ" },
            { "baris": "6", "kiri": "خَ - قَ", "kanan": "ذَ - ظَ" },
            { "baris": "7", "kiri": "كَ - قَ", "kanan": "ظَ - ضَ" }
        ]
    },
    {
        "page": 32,
        "title": "UJIAN AKHIR",
        "focus": "Kelancaran 100% (Assessment)",
        "grid": [
            { "baris": "Title", "kiri": "جك بلوم ماهير، اولغكن سهيغڬ لنچر", "kanan": "ڤنيلاين انتوق بوكو ساتو" },
            { "baris": "1", "kiri": "أَ بَ تَ ثَ جَ حَ خَ دَ ذَ رَ زَ", "kanan": "" },
            { "baris": "2", "kiri": "سَ شَ صَ ضَ طَ ظَ عَ غَ", "kanan": "" },
            { "baris": "3", "kiri": "فَ قَ كَ لَ مَ نَ وَ هَـ ءَ ىَ", "kanan": "" },
            { "baris": "4", "kiri": "ىَ ءَ هَـ وَ نَ مَ لَ كَ قَ فَ", "kanan": "" },
            { "baris": "5", "kiri": "غَ عَ ظَ طَ ضَ صَ شَ سَ", "kanan": "" },
            { "baris": "6", "kiri": "زَ رَ ذَ دَ خَ حَ جَ ثَ تَ بَ أ", "kanan": "" },
            { "baris": "Footer", "kiri": "بيلا سوده لنچر دان ماهير بوليهله دڤيندهكن كڤد بوكو دوا", "kanan": "" }
        ]
    }
];
