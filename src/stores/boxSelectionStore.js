import { defineStore } from 'pinia';

export const useBoxSelectionStore = defineStore('boxSelection', {
  state: () => ({
    isBoxSelectionActive: false,
    selectedExtent: null, // Will store [minX, minY, maxX, maxY]
  }),
  getters: {
    // Example getter, might be useful later
    hasSelectedExtent: (state) => state.selectedExtent !== null,
    getFormattedExtent: (state) => {
      if (!state.selectedExtent) {
        return 'No selection yet.';
      }
      return (
        `Min X: ${state.selectedExtent[0].toFixed(2)}\n` +
        `Min Y: ${state.selectedExtent[1].toFixed(2)}\n` +
        `Max X: ${state.selectedExtent[2].toFixed(2)}\n` +
        `Max Y: ${state.selectedExtent[3].toFixed(2)}`
      );
    }
  },
  actions: {
    activateBoxSelection() {
      this.isBoxSelectionActive = true;
      console.log('Pinia store: Box selection ACTIVATED');
    },
    deactivateBoxSelection() {
      this.isBoxSelectionActive = false;
      console.log('Pinia store: Box selection DEACTIVATED');
    },
    setSelectedExtent(extent) {
      this.selectedExtent = extent;
      console.log('Pinia store: Selected extent UPDATED', extent);
    },
    clearSelection() {
      this.deactivateBoxSelection(); // Also deactivates the mode
      this.selectedExtent = null;
      console.log('Pinia store: Selection CLEARED');
    },
    toggleBoxSelection() {
      this.isBoxSelectionActive = !this.isBoxSelectionActive;
      console.log('Pinia store: Box selection TOGGLED to', this.isBoxSelectionActive);
      if (!this.isBoxSelectionActive) {
        // If toggled off, also clear the extent, though "Clear Selection" is more explicit
        // this.selectedExtent = null; 
        // Per instructions, "Clear Selection" handles clearing extent. Toggle just toggles active state.
        // If toggling off should also clear the box graphic on map, that's handled by Map.vue watching isBoxSelectionActive.
      }
    },
  },
});
