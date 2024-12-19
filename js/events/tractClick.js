function initializeTractClick(map) {
    function getGentWhen(properties) {
        const {gent80, gent90, gent00, gent10, gent20} = properties;
        
        if (gent80 === 0 && gent90 === 0 && gent00 === 0 && gent10 === 0 && gent20 === 0) {
            return "Not Gentrified";
        }
        
        // Find first decade of gentrification
        const decades = [[1980, gent80], [1990, gent90], [2000, gent00], [2010, gent10], [2020, gent20]];
        const gentYears = decades.filter(([_, val]) => val === 1).map(([year, _]) => year);
        
        if (gentYears.length === 0) return null;
        return gentYears.join(", ");
    }

    function getFirstGentDecade(properties) {
        const {gent80, gent90, gent00, gent10, gent20} = properties;
        const decades = [
            [1980, gent80],
            [1990, gent90],
            [2000, gent00],
            [2010, gent10],
            [2020, gent20]
        ];

        // Find first decade where gentrification occurred
        const firstGent = decades.find(([_, val]) => val === 1);
        return firstGent ? firstGent[0] : null;
    }

    function updateTractView(e) {
        if (e.features.length === 0) return;
        
        const properties = e.features[0].properties;
        const gentWhen = getGentWhen(properties);
        
        // HTML content for both desktop and mobile
        const tractInfoHTML = `
            <div style="color: #ffffff; text-align: center; padding: 20px;">
                <h3 style="margin: 5px 0;">GEOID: ${properties.geoid10}</h3>
                <h3 style="margin: 5px 0;">${properties.neighborho}, ${properties.place}</h3>
                <h1 style="line-height:20px; margin: 10px 0; color:#63a69b; font-size: 3.5vh;">
                    ${gentWhen === "Not Gentrified" ? gentWhen : `Gentrified (${gentWhen})`}
                </h1>
            </div>
        `;

        // Update desktop and mobile containers
        const container = document.getElementById('gentrificationContainer');
        const containerMobile = document.getElementById('gentrificationContainer-mobile');
        container.innerHTML = tractInfoHTML;
        containerMobile.innerHTML = tractInfoHTML;

        // After setting the HTML content
        container.classList.add('tract-view');
        containerMobile.classList.add('tract-view');

        // Add tract-view class to chart containers
        document.getElementById('metricContainer').classList.add('tract-view');
        document.getElementById('metricContainer-mobile').classList.add('tract-view');
        document.getElementById('displacementMetricContainer').classList.add('tract-view');
        document.getElementById('displacementMetricContainer-mobile').classList.add('tract-view');

        // Add this where you add other tract-view classes
        document.querySelector('.bottom-sheet').classList.add('tract-view');

        // Add cleanup when clicking elsewhere or resetting view
        function resetTractView() {
            container.classList.remove('tract-view');
            containerMobile.classList.remove('tract-view');
            document.getElementById('metricContainer').classList.remove('tract-view');
            document.getElementById('metricContainer-mobile').classList.remove('tract-view');
            document.getElementById('displacementMetricContainer').classList.remove('tract-view');
            document.getElementById('displacementMetricContainer-mobile').classList.remove('tract-view');
            document.querySelector('.bottom-sheet').classList.remove('tract-view');
        }

        // Add this to your reset button handler or other appropriate place
        document.getElementById('resetView').addEventListener('click', resetTractView);

        // Create metric data object
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
                title: `Population in Tract ${properties.geoid10}`
            },
            homeValue: {
                label: 'Median Home Value',
                data: [
                    properties.amhv70,
                    properties.amhv80,
                    properties.amhv90,
                    properties.amhv00,
                    properties.amhv10,
                    properties.amhv20
                ],
                title: `Median Home Value in Tract ${properties.geoid10}`
            },
            income: {
                label: 'Median Income',
                data: [
                    properties.amhi70,
                    properties.amhi80,
                    properties.amhi90,
                    properties.amhi00,
                    properties.amhi10,
                    properties.amhi20
                ],
                title: `Median Income in Tract ${properties.geoid10}`
            },
            education: {
                label: 'College Education',
                data: [
                    properties.pctcol70,
                    properties.pctcol80,
                    properties.pctcol90,
                    properties.pctcol00,
                    properties.pctcol10,
                    properties.pctcol20
                ],
                title: `Percent in Tract ${properties.geoid10} with 4-Year Degree or More`
            }
        };

        // Remove existing click handlers
        ['', '-mobile'].forEach(suffix => {
            document.querySelectorAll(`#metricTabs${suffix} .metric-tab`).forEach(tab => {
                tab.replaceWith(tab.cloneNode(true));
            });
        });

        // Add new click handlers with tract data
        ['', '-mobile'].forEach(suffix => {
            document.querySelectorAll(`#metricTabs${suffix} .metric-tab`).forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const tabType = e.target.dataset.tab;
                    
                    // Remove active class from all tabs (both desktop and mobile)
                    document.querySelectorAll('.metric-tab').forEach(t => {
                        if (t.dataset.tab === tabType) {
                            t.classList.add('active');
                        } else {
                            t.classList.remove('active');
                        }
                    });
                    
                    // Create a copy of the metric data to avoid modifying the original
                    const currentMetricData = JSON.parse(JSON.stringify(metricData));
                    
                    // If education tab is clicked, divide the data by 100
                    if (tabType === 'education') {
                        currentMetricData.education.data = currentMetricData.education.data.map(val => val / 100);
                    }
                    
                    // Update both desktop and mobile charts
                    updateMetricChart(currentMetricData);
                });
            });
        });

        // Initial update with current active tab
        updateMetricChart(metricData);

        // Update displacement chart with tract-level data
        const firstGentDecade = getFirstGentDecade(properties);
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
            ],
            gentDecade: firstGentDecade,
            multipleGent: gentWhen.includes(',')
        };
        updateDisplacementChart(dispData, `Population by Race in Tract ${properties.geoid10}`);
    }

    // Add click handlers for both gentrification and displacement tract layers
    tractSources.forEach(source => {
        map.on('click', `${source}-gent-fill`, updateTractView);
        map.on('click', `${source}-disp-fill`, updateTractView);
    });
} 
