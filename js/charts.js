// Register the plugin globally at the top of your charts.js file
Chart.register({
    id: 'gentrificationPeriod',
    beforeDraw: (chart) => {
        const data = chart.data;
        if (!data.gentDecade) return;

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
        
        ctx.save();
        ctx.fillStyle = 'rgba(128, 128, 128, 0.2)';
        ctx.fillRect(xStart, top, xEnd - xStart, bottom - top);
        
        ctx.fillStyle = 'rgba(128, 128, 128, 0.8)';
        ctx.font = `italic ${chart.height * 0.04}px "Inter"`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const text = data.multipleGent ? 
            'First Decade of Gentrification' : 
            'Decade of Gentrification';
        
        ctx.translate((xStart + xEnd) / 2, (top + bottom) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(text, 0, 0);
        
        ctx.restore();
    }
});

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
    primary: '#00BCD4',      // Bright cyan/turquoise blue
    secondary: '#0097A7',    // Slightly darker shade for hover/secondary states
    grid: 'rgba(255, 255, 255, 0.1)',
    text: '#ffffff',
    background: '#2d2d2d'
};

// Store all chart instances globally
let gentrificationChart, gentrificationChartMobile;
let metricChart, metricChartMobile;
let displacementChart, displacementChartMobile;
let currentMetroData = {
    demographics: {
        label: 'Population',
        data: [148089022.0, 180426392.0, 231594163.0, 263199606.0, 293968648.0, 316734968.0],
        title: 'Total Population Nationwide'
    },
    homeValue: {
        label: 'Median Home Value',
        data: [147464.0, 181392.0, 241554.0, 233577.0, 300282.0, 400108.0],
        title: 'Median Home Value Nationwide'
    },
    income: {
        label: 'Median Income',
        data: [65052.0, 57382.0, 66789.0, 69089.0, 62706.0, 79372.0],
        title: 'Median Household Income Nationwide'
    },
    education: {
        label: 'College Education',
        data: [12.2, 18.0, 21.8, 25.0, 28.6, 30.9],
        title: 'Percent College-Educated Nationwide'
    }
};

// First, define the decade colors
const decadeColors = {
    1970: '#E0F7FA', // Lighter cyan for 1970 to differentiate from 1980
    1980: '#B2EBF2',
    1990: '#80DEEA',
    2000: '#00ACC1',
    2010: '#006064',
    2020: '#002b2d'
};

function createBarChart(ctx, data, labels) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: labels.map(year => decadeColors[year]), // Map each year to its color
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

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
                backgroundColor: ['1980', '1990', '2000', '2010', '2020'].map(year => decadeColors[year]),
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
                    backgroundColor: ['1970', '1980', '1990', '2000', '2010', '2020'].map(year => decadeColors[year]),
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
            data: [1807309, 3376128, 6922358, 11743570, 16894536, 23368702]
        },
        Black: {
            label: 'Black',
            color: '#4A90E2',
            data: [17524977, 22091289, 27760174, 33801582, 38532917, 42786721]
        },
        Hispanic: {
            label: 'Hispanic',
            color: '#7ED321',
            data: [3908700, 13276158, 21865806, 34553452, 53085825, 64065370]
        },
        White: {
            label: 'White',
            color: '#FFFFFF',
            data: [124403989, 140280124, 173393057, 179328114, 181761662, 177603312]
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
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 40,
                        boxHeight: 2,  // Make the boxes very thin to appear as lines
                        color: '#ffffff',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        },
                        padding: 15
                    }
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
                    text: 'Population by Race in Urban Areas Nationwide',
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
            dataset.tension = 0.4;
            dataset.fill = false;
        });
    }

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
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 40,
                        boxHeight: 1,  // Make the boxes very thin to appear as lines
                        color: '#ffffff',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        },
                        padding: 15
                    }
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
        // Remove active class from all tabs
        document.querySelectorAll('.metric-tab').forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        e.target.classList.add('active');
        // Sync mobile tabs
        const tabType = e.target.dataset.tab;
        document.querySelectorAll(`#metricTabs-mobile .metric-tab[data-tab="${tabType}"]`)
            .forEach(t => t.classList.add('active'));
        // Update chart with current data
        updateMetricChart(currentMetroData);
    });
});

// Also update mobile tabs
document.querySelectorAll('#metricTabs-mobile .metric-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        // Remove active class from all mobile tabs
        document.querySelectorAll('#metricTabs-mobile .metric-tab').forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        e.target.classList.add('active');
        // Sync desktop tabs
        const tabType = e.target.dataset.tab;
        document.querySelectorAll(`#metricTabs .metric-tab[data-tab="${tabType}"]`)
            .forEach(t => t.classList.add('active'));
        // Update chart with current data
        updateMetricChart(currentMetroData);
    });
}); 
