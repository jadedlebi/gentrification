function addLayers() {
    map.addLayer({ // eligible circle
        id: 'cbsa-el',
        type: 'circle', 
        source: 'cbsa-city',
        'source-layer': 'gd24_cbsa-88j963',
        filter: ['all',
            ['>', ['to-number', ['get', 'tel70']], 0],
            ['!=', ['get', 'tel70'], null]
        ],
        paint: {
            'circle-radius': [
                'interpolate',
                ['exponential', 0.99],
                ['to-number', ['get', 'tel70']],
                0, 2,
                746, 30
            ],
            'circle-color': '#9CCEC5',
            'circle-opacity': 0.4,
            'circle-stroke-color': '#000000',
            'circle-stroke-width': 1,
            'circle-stroke-opacity': 0.8
        }
    });
    map.addLayer({ // gentrification circle
        id: 'cbsa-gent',
        type: 'circle',
        source: 'cbsa-city',
        'source-layer': 'gd24_cbsa-88j963', 
        filter: ['all',
            ['>', ['to-number', ['get', 'tgent80']], 0],
            ['!=', ['get', 'tgent80'], null],
            ['>', ['to-number', ['get', 'tel70']], 0],
            ['!=', ['get', 'tel70'], null]
        ],
        paint: {
            'circle-radius': [
                'interpolate',
                ['exponential', 0.95],
                ['to-number', ['get', 'tgent80']],
                0, 0,
                142, 20
            ],
            'circle-color': '#001f1a',
            'circle-opacity': 0.8
        }
    });
    map.addLayer({ // cbsa hover for gentrification
        id: 'cbsa-hover1',
        type: 'circle',
        source: 'cbsa-city',
        'source-layer': 'gd24_cbsa-88j963', 
        filter: ['all',
            ['>', ['to-number', ['get', 'tel70']], 0],
            ['!=', ['get', 'tel70'], null]
        ],
        paint: {
            'circle-radius': [
                'interpolate',
                ['exponential', 0.99],
                ['to-number', ['get', 'tel70']],
                0, 2,
                746, 30
            ],
            'circle-color': 'transparent',
            'circle-stroke-color': 'white',
            'circle-stroke-width': 2,
            'circle-opacity': 0
        },
        layout: {
                visibility: 'none'
        }
    });
    map.addLayer({ // cbsa fill
        id: 'cbsa-layer',
        type: 'fill',
        source: 'cbsa',
        'source-layer': 'cbsa19-cnram8',
        paint: {
            'fill-color': 'transparent'
        }
    });
    map.addLayer({ // cbsa outline
        id: 'cbsa-outline',
        type: 'line',
        source: 'cbsa',
        'source-layer': 'cbsa19-cnram8',
        paint: {
            'line-color': 'light gray',
            'line-width': 1
        },
        layout: {
            visibility: 'none'
        }
    });
    map.addLayer({ // central city fill
        id: "cc-tracts",
        type: "fill",
        before: "building",
        source: "central-city",
        "source-layer": "CentralCity2010-36ay2s",
        paint: {
            "fill-outline-color": "#AAA9A9",
            "fill-color": "#AAA9A9",
            "fill-opacity": 0.15
        },
    });

    map.addLayer({ // total displacement circle
        id: 'cbsa-disp',
        type: 'circle',
        source: 'cbsa-disp',
        'source-layer': 'disp_cbsa-1oi7p6',
        paint: {
            'circle-color': [
                'case',
                ['<', ['to-number', ['get', 'cb80']], 0],
                '#af2323',
                '#17736a'
            ],
            'circle-opacity': 0.5,
            'circle-radius': [
                'interpolate',
                ['exponential', 0.999],
                ['*',
                    ['*',
                        ['/',
                            ['abs', ['to-number', ['get', 'cb80']]],
                            ['abs', ['to-number', ['get', 'popchg80']]]
                        ],
                        ['/',
                            ['to-number', ['get', 'pop70']],
                            100000 // Normalize population by dividing by 100k
                        ]
                    ],
                    100
                ],
                0, 0.5,
                200, 30
            ]
        },
        filter: ['all',
            ['!=', ['get', 'cb80'], null]
        ],
        layout: {
            'visibility': 'none'
        }
    });
    map.addLayer({ // cbsa hover for displacement
        id: 'cbsa-hover2',
        type: 'circle',
        source: 'cbsa-disp',
        'source-layer': 'disp_cbsa-1oi7p6', 
        filter: ['all',
            ['!=', ['get', 'cb80'], null]
        ],
        paint: {
            'circle-radius': [
                'interpolate',
                ['exponential', 0.999],
                ['*',
                    ['*',
                        ['/',
                            ['abs', ['to-number', ['get', 'cb80']]],
                            ['abs', ['to-number', ['get', 'popchg80']]]
                        ],
                        ['/',
                            ['to-number', ['get', 'pop70']],
                            100000 // Normalize population by dividing by 100k
                        ]
                    ],
                    100
                ],
                0, 0.5,
                200, 30
            ],
            'circle-color': 'transparent',
            'circle-stroke-color': 'white',
            'circle-stroke-width': 2,
            'circle-opacity': 0
        },
        layout: {
                visibility: 'none'
        }
    });
    
    tractSources.forEach(source => {
        map.addLayer({ // gentrification fill
            id: `${source}-gent-fill`,
            type: 'fill',
            before: 'building',
            source: source,
            'source-layer': `${source.replace('gd', 'gd_c')}-${sourceLayerSuffixes[source]}`, // Map to specific source layer suffix
            paint: {
                "fill-outline-color": "#000000",
                "fill-color": [
                    "case",
                        ["==", ["get", "gent80"], 1], "#c2ede5",
                        ["==", ["get", "gent90"], 1], "#7fcec2",
                        ["==", ["get", "gent00"], 1], "#3da697",
                        ["==", ["get", "gent10"], 1], "#0d7264",
                        ["==", ["get", "gent20"], 1], "#001f1a",
                        ["case", 
                            ["all", 
                            ["==", ["get", "g80_20"], 1],
                            ["==", ["get", "gent80"], 0],
                            ["==", ["get", "gent90"], 0],
                            ["==", ["get", "gent00"], 0],
                            ["==", ["get", "gent10"], 0],
                            ["==", ["get", "gent20"], 0]
                            ],
                            "transparent",
                            "transparent"
                        ]
                ],
                "fill-opacity": 0.5
            },
            layout: {
                visibility: 'none'
            },
            filter: decades[0]
        });
        map.addLayer({ // gentrification outline
            id: `${source}-gent-outline`,
            type: 'line',
            source: source,
            'source-layer': `${source.replace('gd', 'gd_c')}-${sourceLayerSuffixes[source]}`, // Map to specific source layer suffix
            paint: {
                'line-color':
                ["case", 
                    ["all", 
                        ["==", ["get", "g80_20"], 1],
                        ["==", ["get", "gent80"], 0],
                        ["==", ["get", "gent90"], 0],
                        ["==", ["get", "gent00"], 0],
                        ["==", ["get", "gent10"], 0],
                        ["==", ["get", "gent20"], 0]
                    ],
                    "transparent",
                    "transparent"
                ],
                'line-width': 1,
                'line-opacity': 0.8
            },
            layout: {
                visibility: 'none'
            },
            filter: decades[0]
        });
        map.addLayer({ // gentrification hover outline
            id: `${source}-gent-hover-outline`,
            type: 'line',
            source: source,
            'source-layer': `${source.replace('gd', 'gd_c')}-${sourceLayerSuffixes[source]}`,
            paint: {
                'line-color': '#ffffff',
                'line-width': 2,
                'line-opacity': 0.8
            },
            filter: ['==', ['get', 'geoid10'], ''],
            layout: {
                visibility: 'none'
            },
        });
    });

    dispSources.forEach(source => {
        map.addLayer({ // displacement fill
            id: `${source}-disp-fill`,
            type: 'fill',
            before: 'building',
            source: source,
            'source-layer': `${source.replace('gd', 'gd_c')}-${sourceLayerSuffixes[source]}`,
            paint: {
                'fill-color': [
                    'interpolate',
                    ['linear'],
                    ['to-number', ['get', 'cb80']],
                    -1000, '#af2323',  // Deep red for most negative
                    -500, '#e57373',   // Light red for slightly negative
                    0, 'transparent',    // Transparent for zero
                    1000, '#64b5f6',    // Light blue for slightly positive
                    5000, '#1565c0'    // Deep blue for most positive
                ],
                'fill-opacity': [
                    'case',
                    ['==', ['get', 'cb80'], null],
                    0,
                    0.7
                ]
            },
            layout: {
                visibility: 'none'
            }
        });
        map.addLayer({ // displacement outline
            id: `${source}-disp-outline`,
            type: 'line',
            source: source,
            'source-layer': `${source.replace('gd', 'gd_c')}-${sourceLayerSuffixes[source]}`, // Map to specific source layer suffix
            paint: {
                'line-color': 'transparent',
                'line-width': 1,
                'line-opacity': 0.8
            },
            layout: {
                visibility: 'none'
            }
        });
        map.addLayer({ // displacement hover outline
            id: `${source}-disp-hover-outline`,
            type: 'line',
            source: source,
            'source-layer': `${source.replace('gd', 'gd_c')}-${sourceLayerSuffixes[source]}`,
            paint: {
                'line-color': '#ffffff',
                'line-width': 2,
                'line-opacity': 0.8
            },
            filter: ['all', 
                ['==', ['get', 'geoid10'], '']
            ],
            layout: {
                visibility: 'none'
            },
        });    
    });
}