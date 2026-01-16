// Centralized source configuration
// Update this file when data source changes
//
// Last updated: 2026-01-16 14:51:41
// Tract source: hdma1-242116.nih.gd_geo
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
    // TRACT CONFIGURATION (Census tract polygons)
    // =========================================
    tractSources: ['gd-unified'],
    dispSources: ['gd-unified'],
    
    // Mapbox tileset URL
    tractTilesetUrl: 'mapbox://jedlebi.gd-tracts',
    
    // Source layer name (actual name from Mapbox tileset)
    tractSourceLayer: 'Gentrification Tracts - 2026-01-16',
    
    // =========================================
    // CBSA CONFIGURATION (Metro area points - consolidated)
    // =========================================
    // Replaces: cbsa-city and cbsa-disp (now unified)
    
    // Mapbox tileset URL
    cbsaTilesetUrl: 'mapbox://jedlebi.cbsa-unified',
    
    // Source layer name (actual name from Mapbox tileset)
    cbsaSourceLayer: 'CBSA Unified Data - 2026-01-16',
    
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
