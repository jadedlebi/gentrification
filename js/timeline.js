function initializeTimeline(map) {
    const timeline = document.getElementById('timeline');
    const playButton = document.getElementById('playButton');
    let isPlaying = false;
    let animationFrame;

    function updateMapLayers(year) {
        const decade = year.toString().slice(2);
        const prevDecade = (year - 10).toString().slice(2);

        // Update eligible circle layer and its hover (they share same properties)
        const elLayerProps = {
            'circle-radius': [
                'case',
                ['==', year, 2020],
                [
                    'interpolate',
                    ['exponential', 0.98],
                    ['to-number', ['get', 'tel10']],
                    0, 2,
                    746, 30
                ],
                [
                    'interpolate',
                    ['exponential', 0.99],
                    ['to-number', ['get', `tel${prevDecade}`]],
                    0, 2,
                    746, 30
                ]
            ],
            filter: ['all',
                ['>', ['to-number', ['get', `tel${prevDecade}`]], 0],
                ['!=', ['get', `tel${prevDecade}`], null]
            ]
        };

        // Apply to both layers
        ['cbsa-el', 'cbsa-hover1'].forEach(layerId => {
            map.setPaintProperty(layerId, 'circle-radius', elLayerProps['circle-radius']);
            map.setFilter(layerId, elLayerProps.filter);
        });

        // Update gentrification circle layer
        map.setPaintProperty('cbsa-gent', 'circle-radius', [
            'interpolate',
            ['exponential', 0.95],
            ['to-number', ['get', `tgent${decade}`]],
            0, 0,
            142, 20
        ]);
        map.setFilter('cbsa-gent', ['all',
            ['>', ['to-number', ['get', `tgent${decade}`]], 0],
            ['!=', ['get', `tgent${decade}`], null],
            ['>', ['to-number', ['get', `tel${prevDecade}`]], 0],
            ['!=', ['get', `tel${prevDecade}`], null]
        ]);

        // Update displacement circle layer (cbsa-disp)
        map.setPaintProperty('cbsa-disp', 'circle-color', [
            'case',
            ['<', ['to-number', ['get', `cb${decade}`]], 0],
            '#af2323',
            '#17736a'
        ]);
        map.setPaintProperty('cbsa-disp', 'circle-radius', [
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
        map.setFilter('cbsa-disp', ['all',
            ['!=', ['get', `cb${decade}`], null]
        ]);

        // Update tract fill layers - only filter gentrification layers by decade
        const yearIndex = (year - 1980) / 10;
        tractSources.forEach(source => {
            // Create a filter that shows tracts up to the current year
            const decadeFilters = decades.slice(0, yearIndex + 1);
            const filter = ['any'].concat(decadeFilters);
            
            // Apply filter to gentrification fill layer
            map.setFilter(`${source}-gent-fill`, filter);
        });

        // Update displacement layers - show all tracts but update colors based on decade
        dispSources.forEach(source => {
            map.setPaintProperty(`${source}-disp-fill`, 'fill-color', [
                'interpolate',
                ['linear'],
                ['to-number', ['get', `cb${decade}`]],  // Use cb field matching current decade
                -1000, '#af2323',  // Deep red for most negative
                -500, '#e57373',  // Light red for slightly negative
                0, 'transparent', // Transparent for zero
                1000, '#64b5f6',  // Light blue for slightly positive
                5000, '#1565c0'   // Deep blue for most positive
            ]);

            // Only filter out null values for current decade AND include ccflag10 filter
            map.setFilter(`${source}-disp-fill`, [
                'all',
                ['!=', ['get', `cb${decade}`], null],
                ['==', ['get', 'ccflag10'], 1]  // Add central city filter
            ]);
        });
    }

    timeline.addEventListener('input', (e) => {
        updateMapLayers(parseInt(e.target.value));
    });

    playButton.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playButton.textContent = isPlaying ? '⏸' : '▶';
        
        if (isPlaying) {
            const animate = () => {
                let currentYear = parseInt(timeline.value);
                if (currentYear >= 2020) {
                    currentYear = 1980;
                } else {
                    currentYear += 10;
                }
                timeline.value = currentYear;
                updateMapLayers(currentYear);
                
                if (isPlaying) {
                    animationFrame = setTimeout(animate, 750);
                }
            };
            animate();
        } else {
            clearTimeout(animationFrame);
        }
    });

    // Initialize layers with 1980 data
    updateMapLayers(1980);
} 