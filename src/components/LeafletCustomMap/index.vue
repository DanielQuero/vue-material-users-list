<template lang="pug">
  l-map.map(:class="{'max-width': max_width}" :zoom="zoom" :center="{ lat: value.latitude, lng: value.longitude }")
    l-tile-layer(:url="url" )
    l-marker.mark(v-if="!multi" :lat-lng="{lat: value.latitude, lng: value.longitude }")
    l-marker(v-else v-for="marker in multi" :icon="marker.icon" :key="marker.id" :lat-lng="{lat: marker.latitude, lng: marker.longitude }")
      l-popup(:content="marker.popup" :options="{ className: 'custom' }" style="padding: 20px" minWidth="200")
</template>

<script>
import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet'

export default {
  name: 'LeafletCustomMapComponent',
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  props: {
    value: {
      type: Object
    },
    max_width: {
      type: Boolean,
      default: false
    },
    multi: {
      type: Array
    }
  },
  data() {
    return {
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      zoom: 3
    }
  },
  methods: {
    changeMarker(event) {
      this.value.latitude = event.latlng.lat
      this.value.longitude = event.latlng.lng
    }
  }
}
</script>

<style lang="sass">
  .map
    z-index: 1
    min-height: 220px
    &.max-width
      width: 100%
</style>
