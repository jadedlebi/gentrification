function addSources() {
    map.addSource('cbsa', { // cbsa19-cnram8 (CBSA boundaries - separate from data points)
        type: 'vector',
        url: 'mapbox://jedlebi.0y0qdw2f',
    });
    
    // Single unified CBSA source (replaces cbsa-city and cbsa-disp)
    // Contains all CBSA-level aggregated data for both gentrification and displacement views
    // Configuration is centralized in sourceConfig.js for easy updates
    map.addSource('cbsa-unified', {
        type: 'vector',
        url: SOURCE_CONFIG.cbsaTilesetUrl,
    });
    
    map.addSource("central-city", { // CentralCity2010-36ay2s
        type: "vector",
        url: "mapbox://jedlebi.4p985ni3"
    });
    
    // Single unified source for tract data (replaces 6 separate sources)
    // Configuration is centralized in sourceConfig.js for easy updates
    SOURCE_CONFIG.tractSources.forEach(sourceName => {
        map.addSource(sourceName, {
            type: 'vector',
            url: SOURCE_CONFIG.tractTilesetUrl,
        });
    });
    
    // Opportunity Zones source (separate from main tract data)
    map.addSource('gdoz', { // OZ-01df8m
        type: 'vector',
        url: 'mapbox://jedlebi.6kofhy0h',
    });
}
