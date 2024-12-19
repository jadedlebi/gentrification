// Function to initialize reset button functionality
function initializeResetButton(map) {
    const resetButton = document.getElementById('resetView');
    const searchInput = document.getElementById('metroAreaSearch');
    const searchResults = document.getElementById('searchResults');

    // National level data
    const nationalData = {
        gentData: {
            labels: ['1980', '1990', '2000', '2010', '2020'],
            datasets: [{
                label: 'Gentrified Tracts',
                data: [246, 569, 731, 990, 1830],
                backgroundColor: '#63a69b',
                borderColor: 'transparent',
                borderRadius: 4,
                barThickness: 'flex',
                barPercentage: 0.75
            }]
        },
        // Metric chart data
        metricData: {
            demographics: {
                label: 'Population',
                data: [203302031, 226545805, 248709873, 281421906, 308745538, 331449281],
                title: 'Population Nationwide'
            },
            homeValue: {
                label: 'Median Home Value',
                data: [17000, 47200, 79100, 119600, 181400, 229800],
                title: 'Median Home Value Nationwide'
            },
            income: {
                label: 'Median Income',
                data: [8734, 16841, 30056, 41994, 51914, 64994],
                title: 'Median Household Income Nationwide'
            },
            education: {
                label: 'College Education',
                data: [10.7, 16.2, 20.3, 24.4, 28.2, 32.9],
                title: 'Percent Nationwide with 4-Year Degree or More'
            }
        },
        // Displacement chart data
        dispData: {
            labels: ['1970', '1980', '1990', '2000', '2010', '2020'],
            datasets: [
                {
                    label: 'White',
                    data: [169624253, 180256366, 188128296, 194552774, 196817552, 191697647],
                    borderColor: '#FFFFFF'
                },
                {
                    label: 'Black',
                    data: [22321696, 26482349, 29986060, 34658190, 38929319, 41104983],
                    borderColor: '#4A90E2'
                },
                {
                    label: 'Asian',
                    data: [1538721, 3500439, 6968359, 10242998, 14674252, 19886049],
                    borderColor: '#F5A623'
                },
                {
                    label: 'Hispanic',
                    data: [9294509, 14608673, 22354059, 35305818, 50477594, 62080044],
                    borderColor: '#7ED321'
                }
            ]
        }
    };

    resetButton.addEventListener('click', () => {
        // Reset map view
        map.flyTo({
            center: [-96, 37.8],
            zoom: 3.7,
            essential: true
        });

        // Clear search
        if (searchInput) searchInput.value = '';
        if (searchResults) searchResults.style.display = 'none';

        // Simply reload the page to reset everything to initial state
        location.reload();
    });
} 