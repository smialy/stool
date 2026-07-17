import { describe, it, expect, vi } from 'vitest';

import { elapsed } from '../../src/utils/time.mjs';

describe('elapsed', () => {
    it('returns a function', () => {
        expect(typeof elapsed()).toBe('function');
    });

    it('reports milliseconds for short durations', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
        const stop = elapsed();
        vi.setSystemTime(new Date('2025-01-01T00:00:00.050Z'));
        expect(stop()).toBe('50ms');
        vi.useRealTimers();
    });

    it('reports seconds for durations >= 1000ms', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
        const stop = elapsed();
        vi.setSystemTime(new Date('2025-01-01T00:00:01.500Z'));
        expect(stop()).toBe('1.5sec');
        vi.useRealTimers();
    });

    it('produces a non-decreasing value over time', async () => {
        const stop = elapsed();
        const first = parseInt(stop(), 10);
        await new Promise((r) => setTimeout(r, 5));
        const second = parseInt(stop(), 10);
        expect(second).toBeGreaterThanOrEqual(first);
    });
});