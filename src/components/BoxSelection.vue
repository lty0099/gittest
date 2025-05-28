<template>
  <div class="box-selection-container">
    <div class="box-selection-controls">
      <button @click="handleToggleBoxSelection" :class="buttonClass">
        {{ buttonText }}
      </button>
      <button @click="handleClearSelection" class="control-button clear-button" :disabled="!store.selectedExtent">
        Clear Selection
      </button>
    </div>
    <div v-if="store.selectedExtent" class="selected-extent-display">
      <h4>Selected Extent:</h4>
      <pre>{{ store.getFormattedExtent }}</pre>
    </div>
  </div>
</template>

<script>
import { useBoxSelectionStore } from '../stores/boxSelectionStore';

export default {
  name: 'BoxSelection',
  setup() {
    const store = useBoxSelectionStore();
    return { store }; // Expose store to the template and options API hooks
  },
  computed: {
    buttonText() {
      return this.store.isBoxSelectionActive ? 'Deactivate Box Selection' : 'Activate Box Selection';
    },
    buttonClass() {
      return {
        'control-button': true,
        'activate-button': !this.store.isBoxSelectionActive,
        'deactivate-button': this.store.isBoxSelectionActive, // New class for "Deactivate" state
      };
    }
  },
  methods: {
    handleToggleBoxSelection() {
      this.store.toggleBoxSelection();
    },
    handleClearSelection() {
      this.store.clearSelection();
    }
    // Removed updateDisplayExtent as store handles this
    // Removed event emissions as store handles communication
  }
};
</script>

<style scoped>
.box-selection-container {
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 5px;
}

.box-selection-controls {
  display: flex;
  gap: 10px; /* Adds space between the buttons */
  margin-bottom: 10px; /* Space between buttons and extent display */
}

.control-button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.activate-button {
  background-color: #4CAF50; /* Green */
  color: white;
}

.activate-button:hover {
  background-color: #45a049;
}

.deactivate-button { /* Style for the button when it means "Deactivate" */
  background-color: #ff9800; /* Orange */
  color: white;
}

.deactivate-button:hover {
  background-color: #f57c00;
}

.clear-button {
  background-color: #f44336; /* Red */
  color: white;
}

.clear-button:hover {
  background-color: #da190b;
}

.clear-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.selected-extent-display {
  margin-top: 15px;
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.selected-extent-display h4 {
  margin-top: 0;
  margin-bottom: 5px;
  font-size: 16px;
}

pre {
  white-space: pre-wrap; /* Allows wrapping and preserves formatting */
  word-wrap: break-word;
  background: #efefef;
  padding: 8px;
  border-radius: 3px;
}
</style>
