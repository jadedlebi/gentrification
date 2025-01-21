// Initialize chart variables
let displacementMetricChart;
let displacementMetricChartMobile;

// Add to the top of the file
const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 100 // Debounce resize events
};

function updateCharts(properties) {
    const cityName = properties.ccity;

    // Wrap all chart updates in a setTimeout
    setTimeout(() => {
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
                label: 'Median Household Income',
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
                title: `Percent College-Educated in ${cityName}`
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
    }, 1000);
}

// Common chart options to remove legend and maintain aspect ratio
const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        title: {
            display: true,
            color: '#ffffff',
            font: {
                size: 14,
                family: "'Inter', sans-serif",
                weight: '700'
            },
            padding: 10
        }
    },
    scales: {
        y: {
            beginAtZero: false,
            grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                drawBorder: false
            },
            ticks: {
                color: '#ffffff',
                font: {
                    family: "'Inter', sans-serif"
                },
                callback: function(value, index, values) {
                    // Get the active tab to determine the format
                    const activeTab = document.querySelector('.metric-tab.active')?.dataset.tab;
                    
                    if (activeTab === 'education') {
                        return value + '%';
                    }
                    if (activeTab === 'homeValue' || activeTab === 'income') {
                        return '$' + formatValue(value);
                    }
                    return formatValue(value);
                }
            }
        },
        x: {
            grid: {
                display: false
            },
            ticks: {
                color: '#ffffff',
                font: {
                    family: "'Inter', sans-serif"
                }
            }
        }
    }
};

// Helper function to format values
function formatValue(value) {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
    }
    return value;
}

function updateGentrificationChart(data, title, retryCount = 0) {
    const maxRetries = 5;
    
    // Get containers
    const container = document.getElementById('gentrificationContainer');
    const containerMobile = document.getElementById('gentrificationContainer-mobile');
    
    // Get or create tract info wrappers
    const tractInfoWrapper = container.querySelector('.tract-info-wrapper');
    const tractInfoWrapperMobile = containerMobile.querySelector('.tract-info-wrapper');
    
    // Hide tract info if it exists
    if (tractInfoWrapper) tractInfoWrapper.style.display = 'none';
    if (tractInfoWrapperMobile) tractInfoWrapperMobile.style.display = 'none';
    
    // Create canvas elements if they don't exist
    if (!document.getElementById('gentrificationChart')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'gentrificationChart';
        container.appendChild(canvas);
    }
    
    if (!document.getElementById('gentrificationChart-mobile')) {
        const canvasMobile = document.createElement('canvas');
        canvasMobile.id = 'gentrificationChart-mobile';
        containerMobile.appendChild(canvasMobile);
    }
    
    // Show canvas elements
    const canvas = document.getElementById('gentrificationChart');
    const canvasMobile = document.getElementById('gentrificationChart-mobile');
    canvas.style.display = 'block';
    canvasMobile.style.display = 'block';
    
    const ctx = canvas.getContext('2d');
    const ctxMobile = canvasMobile.getContext('2d');
    
    if ((!ctx || !ctxMobile) && retryCount < maxRetries) {
        console.log(`Chart canvas not ready yet, retry ${retryCount + 1} of ${maxRetries}`);
        setTimeout(() => {
            updateGentrificationChart(data, title, retryCount + 1);
        }, 200);
        return;
    }
    
    if (!ctx || !ctxMobile) {
        console.error('Failed to get chart context after all retries');
        return;
    }

    // Rest of your existing chart creation code...
    const config = {
        type: 'bar',
        data: {
            ...data,
            datasets: [{
                ...data.datasets[0],
                backgroundColor: data.labels.map(year => decadeColors[year]),
                borderColor: 'transparent',
                borderRadius: 4,
                barThickness: 'flex',
                barPercentage: 0.75
            }]
        },
        options: {
            ...chartConfig,
            ...commonChartOptions,
            maintainAspectRatio: false,
            responsive: true,
            layout: {
                padding: {
                    top: 10,
                    bottom: 10
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            },
            plugins: {
                ...commonChartOptions.plugins,
                title: {
                    ...commonChartOptions.plugins.title,
                    text: title
                }
            }
        }
    };
    
    if (gentrificationChart) gentrificationChart.destroy();
    if (gentrificationChartMobile) gentrificationChartMobile.destroy();
    
    gentrificationChart = new Chart(ctx, config);
    gentrificationChartMobile = new Chart(ctxMobile, config);
}

function updateMetricChart(data) {
    // Store the metro data when it's passed in
    if (data) {
        // Create a deep copy and transform education data before storing
        currentMetroData = JSON.parse(JSON.stringify(data));
        if (currentMetroData.education) {
            // Check if any value is less than 1 (indicating raw percentage)
            const needsConversion = currentMetroData.education.data.some(value => value && value < 1);
            if (needsConversion) {
                currentMetroData.education.data = currentMetroData.education.data.map(value => 
                    // Only multiply non-null values that are less than 1
                    value && value < 1 ? value * 100 : value
                );
            }
        }
    }

    const activeTab = document.querySelector('.metric-tab.active').dataset.tab;
    const currentData = currentMetroData ? currentMetroData[activeTab] : {
        label: data[activeTab].label,
        data: data[activeTab].data
    };
    
    const config = {
        type: 'bar',
        data: {
            labels: ['1970', '1980', '1990', '2000', '2010', '2020'],
            datasets: [{
                label: currentData.label,
                data: currentData.data,
                backgroundColor: ['1970', '1980', '1990', '2000', '2010', '2020'].map(year => decadeColors[year]),
                borderColor: 'transparent',
                borderRadius: 4,
                barThickness: 'flex'
            }]
        },
        options: {
            ...chartConfig,
            ...commonChartOptions,
            plugins: {
                ...commonChartOptions.plugins,
                title: {
                    ...commonChartOptions.plugins.title,
                    text: currentData.title
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const activeTab = document.querySelector('.metric-tab.active').dataset.tab;
                            const value = context.parsed.y;
                            
                            if (activeTab === 'education') {
                                return value.toFixed(1) + '%';
                            }
                            if (activeTab === 'homeValue' || activeTab === 'income') {
                                return '$' + value.toLocaleString();
                            }
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    };
    
    if (metricChart) metricChart.destroy();
    if (metricChartMobile) metricChartMobile.destroy();

    const ctx = document.getElementById('metricChart').getContext('2d');
    const ctxMobile = document.getElementById('metricChart-mobile').getContext('2d');
    
    metricChart = new Chart(ctx, config);
    metricChartMobile = new Chart(ctxMobile, config);
}

function updateDisplacementChart(data, title) {
    // Get all existing chart instances
    const charts = Object.values(Chart.instances);
    
    // Find and destroy any charts using our canvas elements
    charts.forEach(chart => {
        if (chart.canvas.id === 'displacementMetricChart' || 
            chart.canvas.id === 'displacementMetricChart-mobile') {
            chart.destroy();
        }
    });

    // Add tension to each dataset
    data.datasets = data.datasets.map(dataset => ({
        ...dataset,
        tension: 0.4
    }));

    const config = {
        type: 'line',
        data: data,
        options: {
            ...chartConfig,
            ...commonChartOptions,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        },
                        padding: 15
                    }
                },
                title: {
                    ...commonChartOptions.plugins.title,
                    text: title
                }
            }
        }
    };
    
    const ctx = document.getElementById('displacementMetricChart').getContext('2d');
    const ctxMobile = document.getElementById('displacementMetricChart-mobile').getContext('2d');
    
    displacementMetricChart = new Chart(ctx, config);
    displacementMetricChartMobile = new Chart(ctxMobile, config);
}

function showTractInfo() {
    const container = document.getElementById('gentrificationContainer');
    const containerMobile = document.getElementById('gentrificationContainer-mobile');
    
    // Show tract info
    const tractInfoWrapper = container.querySelector('.tract-info-wrapper');
    const tractInfoWrapperMobile = containerMobile.querySelector('.tract-info-wrapper');
    if (tractInfoWrapper) tractInfoWrapper.style.display = 'block';
    if (tractInfoWrapperMobile) tractInfoWrapperMobile.style.display = 'block';
    
    // Hide charts
    const canvas = document.getElementById('gentrificationChart');
    const canvasMobile = document.getElementById('gentrificationChart-mobile');
    if (canvas) canvas.style.display = 'none';
    if (canvasMobile) canvasMobile.style.display = 'none';
}

// Add resize observer to handle container size changes
function initializeChartResizing() {
    const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
            const charts = Chart.getChart(entry.target.querySelector('canvas')?.id);
            if (charts) {
                charts.resize();
            }
        });
    });

    // Observe all chart containers
    ['gentrificationContainer', 'metricContainer', 'displacementMetricContainer'].forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            resizeObserver.observe(container);
        }
    });
}

// Call this when initializing your charts
initializeChartResizing(); 