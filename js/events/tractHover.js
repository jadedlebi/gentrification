function initializeTractHover(map) {
    let hoveredStateId = null;
    let currentSource = null;
    const originalOpacity = 0.5;
    const hoverOpacity = 0.8;

    // Handle gentrification tract hovers
    tractSources.forEach(source => {
        map.on('mousemove', `${source}-gent-fill`, (e) => {
            map.getCanvas().style.cursor = 'pointer';
            
            if (e.features.length > 0) {
                // Clear previous hover state if it exists
                if (hoveredStateId !== null && currentSource !== null) {
                    map.setFilter(`${currentSource}-gent-hover-outline`, ['==', ['get', 'geoid10'], '']);
                    map.setPaintProperty(`${currentSource}-gent-fill`, 'fill-opacity', originalOpacity);
                }
                
                hoveredStateId = e.features[0].properties.geoid10;
                currentSource = source;
                
                // Set hover outline
                map.setFilter(`${source}-gent-hover-outline`, ['==', ['get', 'geoid10'], hoveredStateId]);
                
                // Increase opacity of hovered tract
                map.setPaintProperty(`${source}-gent-fill`, 'fill-opacity', [
                    'case',
                    ['==', ['get', 'geoid10'], hoveredStateId],
                    hoverOpacity,
                    originalOpacity
                ]);
            }
        });

        map.on('mouseleave', `${source}-gent-fill`, () => {
            map.getCanvas().style.cursor = '';
            if (hoveredStateId !== null && currentSource === source) {
                map.setFilter(`${source}-gent-hover-outline`, ['==', ['get', 'geoid10'], '']);
                map.setPaintProperty(`${source}-gent-fill`, 'fill-opacity', originalOpacity);
                hoveredStateId = null;
                currentSource = null;
            }
        });
    });

    // Handle displacement tract hovers
    dispSources.forEach(source => {
        map.on('mousemove', `${source}-disp-fill`, (e) => {
            map.getCanvas().style.cursor = 'pointer';
            
            if (e.features.length > 0) {
                // Clear previous hover state if it exists
                if (hoveredStateId !== null && currentSource !== null) {
                    map.setFilter(`${currentSource}-disp-hover-outline`, ['==', ['get', 'geoid10'], '']);
                    map.setPaintProperty(`${currentSource}-disp-fill`, 'fill-opacity', originalOpacity);
                }
                
                hoveredStateId = e.features[0].properties.geoid10;
                currentSource = source;
                
                // Set hover outline
                map.setFilter(`${source}-disp-hover-outline`, ['all',
                    ['==', ['get', 'geoid10'], hoveredStateId],
                    ['==', ['get', 'ccflag10'], 1]
                ]);
                
                // Increase opacity of hovered tract
                map.setPaintProperty(`${source}-disp-fill`, 'fill-opacity', [
                    'case',
                    ['==', ['get', 'geoid10'], hoveredStateId],
                    hoverOpacity,
                    originalOpacity
                ]);
            }
        });

        map.on('mouseleave', `${source}-disp-fill`, () => {
            map.getCanvas().style.cursor = '';
            if (hoveredStateId !== null && currentSource === source) {
                map.setFilter(`${source}-disp-hover-outline`, ['all',
                    ['==', ['get', 'geoid10'], ''],
                    ['==', ['get', 'ccflag10'], 1]
                ]);
                map.setPaintProperty(`${source}-disp-fill`, 'fill-opacity', originalOpacity);
                hoveredStateId = null;
                currentSource = null;
            }
        });
    });
} 