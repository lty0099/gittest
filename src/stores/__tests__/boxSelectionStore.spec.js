import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useBoxSelectionStore } from '../boxSelectionStore';

describe('Box Selection Store', () => {
  beforeEach(() => {
    // Create a new Pinia instance and make it active
    setActivePinia(createPinia());
  });

  it('initial state is correct', () => {
    const store = useBoxSelectionStore();
    expect(store.isBoxSelectionActive).toBe(false);
    expect(store.selectedExtent).toBeNull();
  });

  describe('Actions', () => {
    it('activateBoxSelection sets isBoxSelectionActive to true', () => {
      const store = useBoxSelectionStore();
      store.activateBoxSelection();
      expect(store.isBoxSelectionActive).toBe(true);
    });

    it('deactivateBoxSelection sets isBoxSelectionActive to false', () => {
      const store = useBoxSelectionStore();
      store.isBoxSelectionActive = true; // Set to true first
      store.deactivateBoxSelection();
      expect(store.isBoxSelectionActive).toBe(false);
    });

    it('setSelectedExtent updates selectedExtent', () => {
      const store = useBoxSelectionStore();
      const extent = [10, 20, 30, 40];
      store.setSelectedExtent(extent);
      expect(store.selectedExtent).toEqual(extent);
    });

    it('clearSelection resets selectedExtent and deactivates box selection', () => {
      const store = useBoxSelectionStore();
      store.isBoxSelectionActive = true;
      store.selectedExtent = [10, 20, 30, 40];
      store.clearSelection();
      expect(store.selectedExtent).toBeNull();
      expect(store.isBoxSelectionActive).toBe(false);
    });

    it('toggleBoxSelection flips isBoxSelectionActive state', () => {
      const store = useBoxSelectionStore();
      expect(store.isBoxSelectionActive).toBe(false);
      store.toggleBoxSelection();
      expect(store.isBoxSelectionActive).toBe(true);
      store.toggleBoxSelection();
      expect(store.isBoxSelectionActive).toBe(false);
    });
  });

  describe('Getters', () => {
    it('hasSelectedExtent returns false when selectedExtent is null', () => {
      const store = useBoxSelectionStore();
      store.selectedExtent = null;
      expect(store.hasSelectedExtent).toBe(false);
    });

    it('hasSelectedExtent returns true when selectedExtent is set', () => {
      const store = useBoxSelectionStore();
      store.selectedExtent = [10, 20, 30, 40];
      expect(store.hasSelectedExtent).toBe(true);
    });

    it('getFormattedExtent returns "No selection yet." when no extent is selected', () => {
      const store = useBoxSelectionStore();
      store.selectedExtent = null;
      expect(store.getFormattedExtent).toBe('No selection yet.');
    });

    it('getFormattedExtent returns formatted string when extent is selected', () => {
      const store = useBoxSelectionStore();
      store.selectedExtent = [10.123, 20.456, 30.789, 40.012];
      const expectedString =
        `Min X: 10.12\n` +
        `Min Y: 20.46\n` + // Note: .toFixed(2) rounds, so 20.456 becomes 20.46
        `Max X: 30.79\n` + // 30.789 becomes 30.79
        `Max Y: 40.01`;
      expect(store.getFormattedExtent).toBe(expectedString);
    });
     it('getFormattedExtent handles zero values correctly', () => {
      const store = useBoxSelectionStore();
      store.selectedExtent = [0, 0, 0, 0];
      const expectedString =
        `Min X: 0.00\n` +
        `Min Y: 0.00\n` +
        `Max X: 0.00\n` +
        `Max Y: 0.00`;
      expect(store.getFormattedExtent).toBe(expectedString);
    });
  });
});
