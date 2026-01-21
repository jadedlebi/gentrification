// Centralized source configuration
// Update this file when data source changes
//
// Last updated: 2026-01-21 14:20:07
// Tract source: nih.gd joined with geo.census10_geo (shoreline-clipped)
// CBSA source: Aggregation query from nih.gd, geo.states, geo.cbsa_cities_xy
//
// To update: python scripts/update_tileset.py
//
// FUTURE FIELDS:
// Both tilesets support adding new fields without code changes:
// - Add fields to BigQuery tables/queries
// - Run the automation script to re-export and upload
// - New fields available via properties.newFieldName in JavaScript
// - Existing functionality remains unchanged
//
const SOURCE_CONFIG = {
    // =========================================
    // TRACT CONFIGURATION (Census tract polygons - shoreline-clipped)
    // =========================================
    tractSources: ['gd-unified'],
    dispSources: ['gd-unified'],
    
    // Mapbox tileset URL
    tractTilesetUrl: 'mapbox://jedlebi.gd-tracts',
    
    // Source layer name (set by Tippecanoe -l flag in update_tileset.py)
    tractSourceLayer: 'GD - Tract Level',
    
    // =========================================
    // CBSA CONFIGURATION (Metro area points - consolidated)
    // =========================================
    // Replaces: cbsa-city and cbsa-disp (now unified)
    
    // Mapbox tileset URL
    cbsaTilesetUrl: 'mapbox://jedlebi.cbsa-unified',
    
    // Source layer name (set by Tippecanoe -l flag in update_tileset.py)
    cbsaSourceLayer: 'GD - CBSA Level',
    
    // =========================================
    // HELPER FUNCTIONS
    // =========================================
    
    // Get source-layer name for tract layers
    getSourceLayer: function(source) {
        return this.tractSourceLayer;
    },
    
    // Get source-layer name for CBSA layers
    getCbsaSourceLayer: function() {
        return this.cbsaSourceLayer;
    }
};
