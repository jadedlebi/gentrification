function initializeCbsaClick(map) {
    // Define population thresholds and corresponding zoom levels
    const getZoomLevel = (population) => {
        if (population >= 2000000) {  // Large metros (e.g., Chicago, LA)
            return 10;
        } else if (population >= 500000) {  // Medium metros (e.g., Portland)
            return 11;
        } else {  // Small metros (e.g., Boise)
            return 12;
        }
    };

    function updateCharts(properties) {
        const cityName = properties.ccity;

        // Update gentrification chart
        const gentData = {
            labels: ['1980', '1990', '2000', '2010', '2020'],
            datasets: [{
                label: 'Gentrified Tracts',
                data: [
                    properties.tgent80,
                    properties.tgent90,
                    properties.tgent00,
                    properties.tgent10,
                    properties.tgent20
                ]
            }]
        };
        updateGentrificationChart(gentData, `Gentrified Tracts in ${cityName}`);

        // Update metric chart data
        const metricData = {
            demographics: {
                label: 'Population',
                data: [
                    properties.pop70,
                    properties.pop80,
                    properties.pop90,
                    properties.pop00,
                    properties.pop10,
                    properties.pop20
                ],
                title: `Population in ${cityName}`
            },
            homeValue: {
                label: 'Median Home Value',
                data: [
                    properties.mamhv70,
                    properties.mamhv80,
                    properties.mamhv90,
                    properties.mamhv00,
                    properties.mamhv10,
                    properties.mamhv20
                ],
                title: `Median Home Value in ${cityName}`
            },
            income: {
                label: 'Median Income',
                data: [
                    properties.mamhi70,
                    properties.mamhi80,
                    properties.mamhi90,
                    properties.mamhi00,
                    properties.mamhi10,
                    properties.mamhi20
                ],
                title: `Median Household Income in ${cityName}`
            },
            education: {
                label: 'College Education',
                data: [
                    properties.apctcol70,
                    properties.apctcol80,
                    properties.apctcol90,
                    properties.apctcol00,
                    properties.apctcol10,
                    properties.apctcol20
                ],
                title: `Percent in ${cityName} with 4-Year Degree or More`
            }
        };
        updateMetricChart(metricData);

        // Update displacement chart
        const dispData = {
            labels: ['1970', '1980', '1990', '2000', '2010', '2020'],
            datasets: [
                {
                    label: 'White',
                    data: [
                        properties.nhwht70,
                        properties.nhwht80,
                        properties.nhwht90,
                        properties.nhwht00,
                        properties.nhwht10,
                        properties.nhwht20
                    ],
                    borderColor: '#FFFFFF'
                },
                {
                    label: 'Black',
                    data: [
                        properties.nhblk70,
                        properties.nhblk80,
                        properties.nhblk90,
                        properties.nhblk00,
                        properties.nhblk10,
                        properties.nhblk20
                    ],
                    borderColor: '#4A90E2'
                },
                {
                    label: 'Asian',
                    data: [
                        properties.asian70,
                        properties.asian80,
                        properties.asian90,
                        properties.asian00,
                        properties.asian10,
                        properties.asian20
                    ],
                    borderColor: '#F5A623'
                },
                {
                    label: 'Hispanic',
                    data: [
                        properties.hisp70,
                        properties.hisp80,
                        properties.hisp90,
                        properties.hisp00,
                        properties.hisp10,
                        properties.hisp20
                    ],
                    borderColor: '#7ED321'
                }
            ]
        };
        updateDisplacementChart(dispData, `Population by Race in ${cityName}`);
    }

    // Click handler for eligible circles
    map.on('click', 'cbsa-el', (e) => {
        if (e.features.length > 0) {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const properties = e.features[0].properties;
            const population = parseInt(properties.pop20);
            
            // Update charts with clicked CBSA's data
            updateCharts(properties);
            
            // Fly to the clicked location
            map.flyTo({
                center: coordinates,
                zoom: getZoomLevel(population),
                duration: 1500,
                essential: true
            });
        }
    });

    // Click handler for displacement circles
    map.on('click', 'cbsa-disp', (e) => {
        if (e.features.length > 0) {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const properties = e.features[0].properties;
            const population = parseInt(properties.pop20);
            
            // Update charts with clicked CBSA's data
            updateCharts(properties);
            
            // Fly to the clicked location
            map.flyTo({
                center: coordinates,
                zoom: getZoomLevel(population),
                duration: 1500,
                essential: true
            });
        }
    });
} 