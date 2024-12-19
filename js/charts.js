// Initialize charts when map data is loaded
function initializeCharts(map) {
    // Get data from the source
    const features = map.querySourceFeatures('cbsa-city', {
        sourceLayer: 'gd24_cbsa-88j963'
    });
    
    const dispFeatures = map.querySourceFeatures('cbsa-disp', {
        sourceLayer: 'disp24_cbsa-7y3mp4'
    });
    
    initGentrificationChart(features);
    initMetricChart(features);
    initDisplacementMetricChart(dispFeatures);
}

// Define a consistent color palette matching map layers
const chartColors = {
    primary: '#63a69b',      // Slightly darker teal
    grid: 'rgba(255, 255, 255, 0.1)',
    text: '#ffffff'
};

// Store all chart instances globally
let gentrificationChart, gentrificationChartMobile;
let metricChart, metricChartMobile;
let displacementChart, displacementChartMobile;
let currentMetroData = null;  // Store current metro data

function initGentrificationChart(features) {
    // Use exact numbers from table
    const sums = {
        1980: 246.0,
        1990: 569.0,
        2000: 731.0,
        2010: 990.0,
        2020: 1830.0
    };

    const ctx = document.getElementById('gentrificationChart').getContext('2d');
    const ctxMobile = document.getElementById('gentrificationChart-mobile').getContext('2d');
    
    const config = {
        type: 'bar',
        data: {
            labels: ['1980', '1990', '2000', '2010', '2020'],
            datasets: [{
                label: 'Gentrified Tracts',
                data: Object.values(sums),
                backgroundColor: chartColors.primary,  // Make sure this is being used
                borderColor: 'transparent',
                borderRadius: 4,
                barThickness: 'flex',
                barPercentage: 0.75
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: chartColors.grid,
                        drawBorder: false  // Remove axis line
                    },
                    ticks: {
                        color: chartColors.text,
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: chartColors.text,
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Gentrified Census Tracts Nationwide',
                    color: chartColors.text,
                    font: {
                        size: 14,
                        family: "'Inter', sans-serif",
                        weight: '700'
                    },
                    padding: 10
                }
            }
        }
    };

    // Store the chart instances
    if (gentrificationChart) gentrificationChart.destroy();
    if (gentrificationChartMobile) gentrificationChartMobile.destroy();
    
    gentrificationChart = new Chart(ctx, config);
    gentrificationChartMobile = new Chart(ctxMobile, config);
}

function initMetricChart(features) {
    const ctx = document.getElementById('metricChart').getContext('2d');
    const ctxMobile = document.getElementById('metricChart-mobile').getContext('2d');
    let currentChart, currentChartMobile;

    function updateChart(metric) {
        const data = {
            demographics: {
                label: 'Population',
                data: [
                    148089022.0,  // 1970
                    180426392.0,  // 1980
                    231594163.0,  // 1990
                    263199606.0,  // 2000
                    293968648.0,  // 2010
                    316734968.0   // 2020
                ],
                calculation: 'Total'
            },
            homeValue: {
                label: 'Median Home Value',
                data: [
                    147464.0,  // 1970
                    181392.0,  // 1980
                    241554.0,  // 1990
                    233577.0,  // 2000
                    300282.0,  // 2010
                    400108.0   // 2020
                ],
                calculation: 'Median'
            },
            income: {
                label: 'Median Income',
                data: [
                    65052.0,  // 1970
                    57382.0,  // 1980
                    66789.0,  // 1990
                    69089.0,  // 2000
                    62706.0,  // 2010
                    79372.0   // 2020
                ],
                calculation: 'Median'
            },
            education: {
                label: 'College Education',
                data: [
                    12.2,  // 1970
                    18.0,  // 1980
                    21.8,  // 1990
                    25.0,  // 2000
                    28.6,  // 2010
                    30.9   // 2020
                ],
                calculation: 'Average'
            }
        };

        const titles = {
            demographics: 'Total Population Nationwide',
            homeValue: 'Median Home Values Nationwide',
            income: 'Median Household Income Nationwide',
            education: 'College Education Rate Nationwide'
        };

        const config = {
            type: 'bar',
            data: {
                labels: ['1970', '1980', '1990', '2000', '2010', '2020'],
                datasets: [{
                    label: `${data[metric].calculation} ${data[metric].label}`,
                    data: data[metric].data,
                    backgroundColor: chartColors.primary,  // Single color for all bars
                    borderColor: 'transparent',
                    borderRadius: 4,
                    barThickness: 'flex'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                resizeDelay: 0,
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: chartColors.grid,
                            drawBorder: false
                        },
                        ticks: {
                            color: chartColors.text,
                            font: {
                                family: "'Inter', sans-serif"
                            },
                            callback: function(value) {
                                if (metric === 'education') {
                                    return value + '%';
                                }
                                const prefix = (metric === 'homeValue' || metric === 'income') ? '$' : '';
                                if (value >= 1000000) {
                                    return prefix + (value / 1000000).toFixed(1) + 'M';
                                }
                                if (value >= 1000) {
                                    return prefix + (value / 1000).toFixed(1) + 'K';
                                }
                                return prefix + value;
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: chartColors.text,
                            font: {
                                family: "'Inter', sans-serif"
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: titles[metric],
                        color: chartColors.text,
                        font: {
                            size: 14,
                            family: "'Inter', sans-serif",
                            weight: '700'
                        },
                        padding: 10
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let value = context.parsed.y;
                                if (metric === 'education') {
                                    return value.toFixed(1) + '%';
                                }
                                if (metric === 'homeValue' || metric === 'income') {
                                    return '$' + value.toLocaleString();
                                }
                                // For demographics (population)
                                return value.toLocaleString();
                            }
                        }
                    }
                },
                layout: {
                    padding: 0  // Remove any padding
                }
            }
        };

        if (metricChart) metricChart.destroy();
        if (metricChartMobile) metricChartMobile.destroy();
        
        metricChart = new Chart(ctx, config);
        metricChartMobile = new Chart(ctxMobile, config);

        // Force a resize after creation
        window.dispatchEvent(new Event('resize'));
    }

    // Initialize with demographics data
    updateChart('demographics');
}

function initDisplacementMetricChart(features) {
    const ctx = document.getElementById('displacementMetricChart').getContext('2d');
    const ctxMobile = document.getElementById('displacementMetricChart-mobile').getContext('2d');
    let currentChart, currentChartMobile;

    // Define the demographic data
    const data = {
        Asian: {
            label: 'Asian',
            color: '#F5A623',
            data: [185664, 239175, 445313, 634118, 815323, 1165448]
        },
        Black: {
            label: 'Black',
            color: '#4A90E2',
            data: [3423916, 3191077, 3167583, 3142021, 2893834, 2821050]
        },
        Hispanic: {
            label: 'Hispanic',
            color: '#7ED321',
            data: [641686, 1611214, 2212395, 2903797, 3312002, 3622885]
        },
        White: {
            label: 'White',
            color: '#FFFFFF',
            data: [7249778, 5682070, 5833634, 5368908, 5567661, 6075793]
        }
    };

    const datasets = Object.values(data).map(group => ({
        label: group.label,
        data: group.data,
        borderColor: group.color,
        backgroundColor: group.color,
        tension: 0.4,
        fill: false
    }));

    const config = {
        type: 'line',
        data: {
            labels: ['1970', '1980', '1990', '2000', '2010', '2020'],
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'nearest',
                intersect: true,
                axis: 'x'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: chartColors.grid,
                        drawBorder: false
                    },
                    ticks: {
                        color: chartColors.text,
                        font: {
                            family: "'Inter', sans-serif"
                        },
                        callback: function(value) {
                            if (value >= 1000000) {
                                return (value / 1000000).toFixed(1) + 'M';
                            }
                            if (value >= 1000) {
                                return (value / 1000).toFixed(1) + 'K';
                            }
                            return value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: chartColors.text,
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let value = context.parsed.y;
                            return context.dataset.label + ': ' + value.toLocaleString();
                        }
                    },
                    position: 'nearest'
                },
                title: {
                    display: true,
                    text: 'Population by Race Nationwide',
                    color: chartColors.text,
                    font: {
                        size: 14,
                        family: "'Inter', sans-serif",
                        weight: '700'
                    },
                    padding: 10
                }
            }
        }
    };

    if (displacementChart) displacementChart.destroy();
    if (displacementChartMobile) displacementChartMobile.destroy();
    
    displacementChart = new Chart(ctx, config);
    displacementChartMobile = new Chart(ctxMobile, config);
}

// Helper functions for calculations
function sumFeatureValues(features, property) {
    return features.reduce((sum, feature) => {
        const value = feature.properties[property];
        return sum + (value && !isNaN(value) ? Number(value) : 0);
    }, 0);
}

function medianFeatureValues(features, property) {
    const values = features
        .map(f => f.properties[property])
        .filter(v => v && !isNaN(v))
        .sort((a, b) => a - b);
    
    const mid = Math.floor(values.length / 2);
    return values.length % 2 === 0 
        ? (values[mid - 1] + values[mid]) / 2 
        : values[mid];
}

function averageFeatureValues(features, property) {
    const values = features
        .map(f => f.properties[property])
        .filter(v => v && !isNaN(v));
    
    return values.reduce((sum, val) => sum + Number(val), 0) / values.length;
}

// Add these new update functions for metro context
function updateGentrificationChart(data, title) {
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: chartColors.grid,
                        drawBorder: false  // Remove axis line
                    },
                    ticks: {
                        color: chartColors.text,
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: chartColors.text,
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: title,
                    color: chartColors.text,
                    font: {
                        size: 14,
                        family: "'Inter', sans-serif",
                        weight: '700'
                    },
                    padding: 10
                }
            }
        }
    };

    // Add these properties to match the styling
    config.data.datasets[0].backgroundColor = chartColors.primary;
    config.data.datasets[0].borderColor = 'transparent';
    config.data.datasets[0].borderRadius = 4;
    config.data.datasets[0].barThickness = 'flex';
    config.data.datasets[0].barPercentage = 0.75;

    if (gentrificationChart) gentrificationChart.destroy();
    if (gentrificationChartMobile) gentrificationChartMobile.destroy();

    const ctx = document.getElementById('gentrificationChart').getContext('2d');
    const ctxMobile = document.getElementById('gentrificationChart-mobile').getContext('2d');
    
    gentrificationChart = new Chart(ctx, config);
    gentrificationChartMobile = new Chart(ctxMobile, config);
}

function updateMetricChart(data) {
    // Store the metro data when it's passed in
    if (data) {
        // For education data, multiply by 100 to get correct percentage
        if (data.education) {
            data.education.data = data.education.data.map(value => value * 100);
        }
        currentMetroData = data;
    }

    const activeTab = document.querySelector('.metric-tab.active').dataset.tab;
    const currentData = currentMetroData ? currentMetroData[activeTab] : {
        // Default national data
        demographics: {
            label: 'Population',
            data: [148089022.0, 180426392.0, 231594163.0, 263199606.0, 293968648.0, 316734968.0],
            title: 'Total Population Nationwide'
        },
        homeValue: {
            label: 'Median Home Value',
            data: [17000, 47200, 79100, 119600, 188400, 229800],
            title: 'Median Home Value Nationwide'
        },
        income: {
            label: 'Median Income',
            data: [8734, 17710, 30056, 41994, 51914, 67521],
            title: 'Median Income Nationwide'
        },
        education: {
            label: 'College Educated',
            data: [10.7, 16.2, 20.3, 24.4, 28.2, 32.9],
            title: 'Percent College Educated Nationwide'
        }
    }[activeTab];
    
    const config = {
        type: 'bar',
        data: {
            labels: ['1970', '1980', '1990', '2000', '2010', '2020'],
            datasets: [{
                label: currentData.label,
                data: currentData.data,
                backgroundColor: chartColors.primary,
                borderColor: 'transparent',
                borderRadius: 4,
                barThickness: 'flex'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 0,
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: chartColors.grid,
                        drawBorder: false
                    },
                    ticks: {
                        color: chartColors.text,
                        font: {
                            family: "'Inter', sans-serif"
                        },
                        callback: function(value) {
                            if (activeTab === 'education') {
                                return value + '%';
                            }
                            const prefix = (activeTab === 'homeValue' || activeTab === 'income') ? '$' : '';
                            if (value >= 1000000) {
                                return prefix + (value / 1000000).toFixed(1) + 'M';
                            }
                            if (value >= 1000) {
                                return prefix + (value / 1000).toFixed(1) + 'K';
                            }
                            return prefix + value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: chartColors.text,
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: currentData.title,
                    color: chartColors.text,
                    font: {
                        size: 14,
                        family: "'Inter', sans-serif",
                        weight: '700'
                    },
                    padding: 10
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let value = context.parsed.y;
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
    // Add tension to each dataset
    if (data.datasets) {
        data.datasets.forEach(dataset => {
            dataset.tension = 0.4;  // Increase smoothness of the curves
            dataset.fill = false;   // Ensure no fill under the lines
        });
    }

    // Keep all original config
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'nearest',
                intersect: true,
                axis: 'x'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: chartColors.grid,
                        drawBorder: false
                    },
                    ticks: {
                        color: chartColors.text,
                        font: {
                            family: "'Inter', sans-serif"
                        },
                        callback: function(value) {
                            if (value >= 1000000) {
                                return (value / 1000000).toFixed(1) + 'M';
                            }
                            if (value >= 1000) {
                                return (value / 1000).toFixed(1) + 'K';
                            }
                            return value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: chartColors.text,
                        font: {
                            family: "'Inter', sans-serif"
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let value = context.parsed.y;
                            return context.dataset.label + ': ' + value.toLocaleString();
                        }
                    },
                    position: 'nearest'
                },
                title: {
                    display: true,
                    text: title,
                    color: chartColors.text,
                    font: {
                        size: 14,
                        family: "'Inter', sans-serif",
                        weight: '700'
                    },
                    padding: 10
                }
            }
        }
    };

    // Only add the new plugin for shading
    if (data.gentDecade) {
        config.plugins = [{
            id: 'gentrificationPeriod',
            beforeDraw: (chart) => {
                const {ctx} = chart;
                const {left, right, top, bottom} = chart.chartArea;
                const labels = chart.data.labels;
                const startYear = data.gentDecade - 10;
                const endYear = data.gentDecade;
                
                const startIdx = labels.indexOf(startYear.toString());
                const endIdx = labels.indexOf(endYear.toString());
                
                if (startIdx === -1 || endIdx === -1) return;
                
                const xScale = chart.scales.x;
                const xStart = xScale.getPixelForValue(labels[startIdx]);
                const xEnd = xScale.getPixelForValue(labels[endIdx]);
                
                // Draw shaded area (keep same color)
                ctx.save();
                ctx.fillStyle = 'rgba(128, 128, 128, 0.2)';
                ctx.fillRect(xStart, top, xEnd - xStart, bottom - top);
                
                // Updated text styling
                ctx.fillStyle = 'rgba(128, 128, 128, 0.8)';
                ctx.font = 'italic 25px "Inter"'; // Increased size and added italic
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                const text = data.multipleGent ? 
                    'First Decade of Gentrification' : 
                    'Decade of Gentrification';
                
                // Rotate and position text
                ctx.translate((xStart + xEnd) / 2, (top + bottom) / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.fillText(text, 0, 0);
                
                ctx.restore();
            }
        }];
    }

    if (displacementChart) displacementChart.destroy();
    if (displacementChartMobile) displacementChartMobile.destroy();
    
    const ctx = document.getElementById('displacementMetricChart').getContext('2d');
    const ctxMobile = document.getElementById('displacementMetricChart-mobile').getContext('2d');
    
    displacementChart = new Chart(ctx, config);
    displacementChartMobile = new Chart(ctxMobile, config);
}

// Set up tab click handlers
document.querySelectorAll('.metric-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        document.querySelectorAll('.metric-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        updateMetricChart();  // Call without data to use stored currentMetroData
    });
});

// Also update mobile tabs
document.querySelectorAll('#metricTabs-mobile .metric-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        document.querySelectorAll('#metricTabs-mobile .metric-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        updateMetricChart();  // Call without data to use stored currentMetroData
    });
}); 