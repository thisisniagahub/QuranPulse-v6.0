/**
 * Generates a responsive grid column class based on the number of items.
 * Mobile first approach: 
 * - Default: grid-cols-1 or 2
 * - sm: grid-cols-min(items, 3)
 * - md: grid-cols-min(items, 4)
 * - lg: grid-cols-min(items, 6)
 */
export const getResponsiveGridClass = (itemCount: number): string => {
    if (itemCount <= 0) return 'grid-cols-1';

    const cols = {
        base: Math.min(itemCount, 2),
        sm: Math.min(itemCount, 3),
        md: Math.min(itemCount, 4),
        lg: Math.min(itemCount, 6)
    };

    return `grid grid-cols-${cols.base} sm:grid-cols-${cols.sm} md:grid-cols-${cols.md} lg:grid-cols-${cols.lg} gap-4`;
};
