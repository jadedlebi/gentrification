function initializeZoomLayers(map) {
    map.on('zoom', () => {
        const zoomLevel = map.getZoom();
        const toggleElement = document.getElementById('viewToggle');
        const isDisplacement = toggleElement ? toggleElement.checked : false;
        
        if (zoomLevel >= 8) {
            // Hide all circle layers including hovers
            map.setLayoutProperty('cbsa-el', 'visibility', 'none');
            map.setLayoutProperty('cbsa-gent', 'visibility', 'none');
            map.setLayoutProperty('cbsa-disp', 'visibility', 'none');
            map.setLayoutProperty('cbsa-hover1', 'visibility', 'none');
            map.setLayoutProperty('cbsa-hover2', 'visibility', 'none');
            
            if (isDisplacement) {
                // Show displacement tract layers
                dispSources.forEach(source => {
                    map.setLayoutProperty(`${source}-disp-fill`, 'visibility', 'visible');
                    map.setLayoutProperty(`${source}-disp-outline`, 'visibility', 'visible');
                    map.setLayoutProperty(`${source}-disp-hover-outline`, 'visibility', 'visible');
                });
                // Hide gentrification tract layers
                tractSources.forEach(source => {
                    map.setLayoutProperty(`${source}-gent-fill`, 'visibility', 'none');
                    map.setLayoutProperty(`${source}-gent-outline`, 'visibility', 'none');
                    map.setLayoutProperty(`${source}-gent-hover-outline`, 'visibility', 'none');
                });
            } else {
                // Show gentrification tract layers
                tractSources.forEach(source => {
                    map.setLayoutProperty(`${source}-gent-fill`, 'visibility', 'visible');
                    map.setLayoutProperty(`${source}-gent-outline`, 'visibility', 'visible');
                    map.setLayoutProperty(`${source}-gent-hover-outline`, 'visibility', 'visible');
                });
                // Hide displacement tract layers
                dispSources.forEach(source => {
                    map.setLayoutProperty(`${source}-disp-fill`, 'visibility', 'none');
                    map.setLayoutProperty(`${source}-disp-outline`, 'visibility', 'none');
                    map.setLayoutProperty(`${source}-disp-hover-outline`, 'visibility', 'none');
                });
            }
        } else {
            // Show appropriate circle layers based on view mode
            if (isDisplacement) {
                map.setLayoutProperty('cbsa-el', 'visibility', 'none');
                map.setLayoutProperty('cbsa-gent', 'visibility', 'none');
                map.setLayoutProperty('cbsa-disp', 'visibility', 'visible');
                // Reset hover2 filter before showing
                map.setFilter('cbsa-hover2', ['==', ['get', 'geoid10'], '']);
                map.setLayoutProperty('cbsa-hover2', 'visibility', 'visible');
                map.setLayoutProperty('cbsa-hover1', 'visibility', 'none');
            } else {
                map.setLayoutProperty('cbsa-el', 'visibility', 'visible');
                map.setLayoutProperty('cbsa-gent', 'visibility', 'visible');
                map.setLayoutProperty('cbsa-disp', 'visibility', 'none');
                // Reset hover1 filter before showing
                map.setFilter('cbsa-hover1', ['==', ['get', 'geoid10'], '']);
                map.setLayoutProperty('cbsa-hover1', 'visibility', 'visible');
                map.setLayoutProperty('cbsa-hover2', 'visibility', 'none');
            }
            
            // Hide all tract layers
            tractSources.forEach(source => {
                map.setLayoutProperty(`${source}-gent-fill`, 'visibility', 'none');
                map.setLayoutProperty(`${source}-gent-outline`, 'visibility', 'none');
                map.setLayoutProperty(`${source}-gent-hover-outline`, 'visibility', 'none');
            });
            dispSources.forEach(source => {
                map.setLayoutProperty(`${source}-disp-fill`, 'visibility', 'none');
                map.setLayoutProperty(`${source}-disp-outline`, 'visibility', 'none');
                map.setLayoutProperty(`${source}-disp-hover-outline`, 'visibility', 'none');
            });
        }
    });
} 