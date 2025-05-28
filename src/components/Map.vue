<template>
  <div ref="mapContainer" class="map-container"></div>
  <BoxSelection class="box-selection" />
</template>

<script>
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import DragBox from 'ol/interaction/DragBox'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import Polygon from 'ol/geom/Polygon'
import { Style, Stroke } from 'ol/style'
// import {platformModifierKeyOnly} from 'ol/events/condition'; // Example condition
import { useBoxSelectionStore } from '@/stores/boxSelectionStore'
import BoxSelection from './BoxSelection.vue'

export default {
  name: 'MapComponent',
  components: { BoxSelection },
  data() {
    return {
      map: null, // To store the OpenLayers map instance
      dragBoxInteraction: null,
      boxSelectionSource: null,
      boxSelectionLayer: null,
      // store: useBoxSelectionStore(), // Not here for Options API, see 'computed' or 'created'
    }
  },
  computed: {
    // Make store accessible in methods and template via this.store
    store() {
      return useBoxSelectionStore()
    },
    isBoxSelectionActiveInStore() {
      return this.store.isBoxSelectionActive
    },
  },
  watch: {
    // Watch the computed property that reflects store state
    isBoxSelectionActiveInStore(newValue, oldValue) {
      console.log(
        'Map.vue: Watched isBoxSelectionActiveInStore changed from',
        oldValue,
        'to',
        newValue,
      )
      if (newValue) {
        this.enableDragBoxInteraction()
      } else {
        this.disableDragBoxInteraction()
      }
    },
  },
  mounted() {
    this.initMap()
    // Initial check in case the mode is already active when component mounts
    if (this.store.isBoxSelectionActive) {
      this.enableDragBoxInteraction()
    }
  },
  methods: {
    initMap() {
      if (!this.$refs.mapContainer) {
        console.error('Map container not found.')
        return
      }

      this.boxSelectionSource = new VectorSource()
      this.boxSelectionLayer = new VectorLayer({
        source: this.boxSelectionSource,
        style: new Style({
          stroke: new Stroke({
            color: 'rgba(0, 0, 255, 1.0)', // Blue color for the box
            width: 2,
          }),
        }),
      })

      this.map = new Map({
        // Store the map instance
        target: this.$refs.mapContainer,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          this.boxSelectionLayer, // Add the selection layer to the map
        ],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      })
    },
    // Renamed from activateDragBox
    enableDragBoxInteraction() {
      if (!this.map) {
        console.error('Map not initialized for DragBox.')
        return
      }
      if (this.dragBoxInteraction) {
        // Already active
        console.log('Map.vue: DragBox interaction already enabled.')
        return
      }

      console.log('Map.vue: Enabling DragBox interaction.')
      // Note: disableDragBoxInteraction (which clears graphics) is called by watcher when isBoxSelectionActive turns false
      // or by clearSelection in store. If activating, we assume graphics are already clear or should be.
      // this.clearBoxSelectionGraphic(); // Clear any previous box before drawing a new one if activating.

      this.dragBoxInteraction = new DragBox({})
      this.map.addInteraction(this.dragBoxInteraction)

      this.dragBoxInteraction.on('boxend', () => {
        const extent = this.dragBoxInteraction.getGeometry().getExtent()
        console.log('Map.vue: Box selected extent:', extent)

        this.clearBoxSelectionGraphic() // Clear previous graphic
        const polygon = Polygon.fromExtent(extent)
        const feature = new Feature(polygon)
        this.boxSelectionSource.addFeature(feature)

        this.store.setSelectedExtent(extent) // Update store
        // As per previous reasoning, selection mode stays active until toggled or cleared.
        // If one-shot selection is desired, call: this.store.deactivateBoxSelection();
      })

      this.dragBoxInteraction.on('boxstart', () => {
        console.log('Map.vue: Box selection started.')
        // Optionally clear graphic on start for better UX
        // this.clearBoxSelectionGraphic();
      })
    },
    // Renamed from deactivateDragBox
    disableDragBoxInteraction() {
      console.log('Map.vue: Disabling DragBox interaction.')
      if (this.map && this.dragBoxInteraction) {
        this.map.removeInteraction(this.dragBoxInteraction)
        this.dragBoxInteraction = null // Important to set to null
      }
      this.clearBoxSelectionGraphic() // Clear visual representation
    },
    clearBoxSelectionGraphic() {
      if (this.boxSelectionSource) {
        this.boxSelectionSource.clear()
        console.log('Map.vue: Cleared box selection graphic.')
      }
    },
  },
  beforeUnmount() {
    // Clean up map resources
    if (this.map) {
      this.disableDragBoxInteraction() // Ensure interaction is removed and graphics cleared
      if (this.boxSelectionLayer) {
        this.map.removeLayer(this.boxSelectionLayer)
        this.boxSelectionLayer = null
      }
      if (this.boxSelectionSource) {
        this.boxSelectionSource = null
      }
      this.map.setTarget(null)
      this.map = null
    }
    // Watchers are usually automatically cleaned up by Vue for Options API.
  },
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%; /* You can adjust this as needed */
  border: 1px solid #ccc;
}
.box-selection {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
