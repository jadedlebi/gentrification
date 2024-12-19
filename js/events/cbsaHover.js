function initializeCbsaHover(map) {
    let hoveredCbsaId = null;
    const originalElOpacity = 0.4;
    const originalDispOpacity = 0.5;
    let popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: [0, -15]
    });

    // For gentrification view
    map.on('mousemove', 'cbsa-el', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        
        if (e.features.length > 0) {
            if (hoveredCbsaId !== null) {
                map.setFilter('cbsa-hover1', ['==', ['get', 'cbsa_code'], '']);
            }
            hoveredCbsaId = e.features[0].properties.cbsa_code;
            
            // Get the current year from the timeline
            const timeline = document.getElementById('timeline');
            const year = parseInt(timeline.value);
            const prevDecade = (year - 10).toString().slice(2);
            
            map.setFilter('cbsa-hover1', ['all',
                ['==', ['get', 'cbsa_code'], hoveredCbsaId],
                ['>', ['to-number', ['get', `tel${prevDecade}`]], 0],
                ['!=', ['get', `tel${prevDecade}`], null]
            ]);
            map.setLayoutProperty('cbsa-hover1', 'visibility', 'visible');

            map.setPaintProperty('cbsa-el', 'circle-opacity', [
                'case',
                ['==', ['get', 'cbsa_code'], hoveredCbsaId],
                1,
                originalElOpacity
            ]);

            popup
                .setLngLat(e.features[0].geometry.coordinates)
                .setHTML(e.features[0].properties.ccity)
                .addTo(map);
        }
    });

    // For displacement view
    map.on('mousemove', 'cbsa-disp', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        
        if (e.features.length > 0) {
            if (hoveredCbsaId !== null) {
                map.setFilter('cbsa-hover2', ['==', ['get', 'cbsa_code'], '']);
            }
            hoveredCbsaId = e.features[0].properties.cbsa_code;
            
            // Get the current year from the timeline
            const timeline = document.getElementById('timeline');
            const year = parseInt(timeline.value);
            const decade = year.toString().slice(2);
            const prevDecade = (year - 10).toString().slice(2);
            
            map.setFilter('cbsa-hover2', ['all',
                ['==', ['get', 'cbsa_code'], hoveredCbsaId],
                ['!=', ['get', `cb${decade}`], null]
            ]);
            map.setLayoutProperty('cbsa-hover2', 'visibility', 'visible');

            // Update circle radius for current decade
            map.setPaintProperty('cbsa-hover2', 'circle-radius', [
                'interpolate',
                ['exponential', 0.999],
                ['*',
                    ['*',
                        ['/',
                            ['abs', ['to-number', ['get', `cb${decade}`]]],
                            ['abs', ['to-number', ['get', `popchg${decade}`]]]
                        ],
                        ['/',
                            ['to-number', ['get', `pop${prevDecade}`]],
                            100000
                        ]
                    ],
                    100
                ],
                0, 0.5,
                200, 30
            ]);

            // Set opacity and color for hovered feature
            map.setPaintProperty('cbsa-disp', 'circle-color', [
                'case',
                ['==', ['get', 'cbsa_code'], hoveredCbsaId],
                [
                    'case',
                    ['<', ['to-number', ['get', `cb${decade}`]], 0],
                    '#ff4444',
                    '#1aaf9f'
                ],
                [
                    'case',
                    ['<', ['to-number', ['get', `cb${decade}`]], 0],
                    '#af2323',
                    '#17736a'
                ]
            ]);

            map.setPaintProperty('cbsa-disp', 'circle-opacity', [
                'case',
                ['==', ['get', 'cbsa_code'], hoveredCbsaId],
                0.8,
                originalDispOpacity
            ]);

            popup
                .setLngLat(e.features[0].geometry.coordinates)
                .setHTML(e.features[0].properties.ccity)
                .addTo(map);
        }
    });

    map.on('mouseleave', 'cbsa-el', () => {
        map.getCanvas().style.cursor = '';
        if (hoveredCbsaId !== null) {
            map.setFilter('cbsa-hover1', ['==', ['get', 'cbsa_code'], '']);
            map.setLayoutProperty('cbsa-hover1', 'visibility', 'none');
            map.setPaintProperty('cbsa-el', 'circle-opacity', originalElOpacity);
        }
        hoveredCbsaId = null;
        popup.remove();
    });

    map.on('mouseleave', 'cbsa-disp', () => {
        map.getCanvas().style.cursor = '';
        if (hoveredCbsaId !== null) {
            map.setFilter('cbsa-hover2', ['==', ['get', 'cbsa_code'], '']);
            map.setLayoutProperty('cbsa-hover2', 'visibility', 'none');
            
            // Get current decade for resetting color
            const timeline = document.getElementById('timeline');
            const year = parseInt(timeline.value);
            const decade = year.toString().slice(2);
            
            // Reset color using current decade
            map.setPaintProperty('cbsa-disp', 'circle-color', [
                'case',
                ['<', ['to-number', ['get', `cb${decade}`]], 0],
                '#af2323',
                '#17736a'
            ]);
            map.setPaintProperty('cbsa-disp', 'circle-opacity', originalDispOpacity);
        }
        hoveredCbsaId = null;
        popup.remove();
    });
} 