// Search functionality
function initializeSearch(map) {
    const searchInput = document.getElementById('metroAreaSearch');
    const searchResults = document.getElementById('searchResults');
    let selectedIndex = -1;
    let filteredCities = [];

    // Function to filter cities
    function filterCities(searchValue) {
        if (!searchValue) return [];
        searchValue = searchValue.toLowerCase();
        
        // Add debug logging
        console.log('CITY_COORDINATES available:', CITY_COORDINATES);
        console.log('Search value:', searchValue);
        
        const filtered = Object.keys(CITY_COORDINATES).filter(city => {
            const cityLower = city.toLowerCase();
            const searchWords = searchValue.split(' ');
            return searchWords.every(word => cityLower.includes(word));
        });
        
        console.log('Filtered cities:', filtered);
        return filtered;
    }

    // Function to highlight selected item
    function updateSelection() {
        const items = searchResults.querySelectorAll('li');
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Function to select a city
    function selectCity(city) {
        searchResults.style.display = 'none';
        const coordinates = CITY_COORDINATES[city];
        
        if (!coordinates) {
            console.error('No coordinates found for city:', city);
            return;
        }
        
        console.log('1. selectCity called with:', city);
        console.log('2. Current coordinates:', coordinates);
        
        // Adjust initial zoom and animation parameters
        map.flyTo({
            center: coordinates,
            zoom: 5.5,  // Start with a slightly wider view
            speed: 2, // Slightly slower animation
            curve: 1.2, // Gentler animation curve
            essential: true
        });

        // Keep existing idle event handler
        map.once('idle', () => {
            const point = map.project(coordinates);
            console.log('4. Projected point:', point);
            
            // Query with a small buffer around the point
            const features = map.queryRenderedFeatures([
                [point.x - 5, point.y - 5],
                [point.x + 5, point.y + 5]
            ], {
                layers: ['cbsa-el', 'cbsa-disp'] // Query both layers
            });
            
            console.log('5. Features found:', features);
            
            if (features.length > 0) {
                const properties = features[0].properties;
                console.log('6. Selected feature data:', properties);
                
                // Adjust zoom based on population
                let zoomLevel = 10;
                if (properties.pop20) {
                    if (properties.pop20 >= 2000000) {
                        zoomLevel = 9;
                    } else if (properties.pop20 >= 500000) {
                        zoomLevel = 10;
                    } else {
                        zoomLevel = 11;
                    }
                }

                // Update zoom if needed
                if (map.getZoom() !== zoomLevel) {
                    map.flyTo({
                        center: coordinates,
                        zoom: zoomLevel,
                        essential: true,
                        duration: 1000
                    });
                }

                // Update charts with the data
                updateCharts(properties);
            } else {
                console.error('No features found at coordinates:', coordinates);
            }
        });
        
        // Update input and clear results
        searchInput.value = city;
        selectedIndex = -1;
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
    }

    // Function to update results
    function updateResults(cities) {
        searchResults.innerHTML = ''; // Clear existing results
        filteredCities = cities;
        selectedIndex = -1;
        
        if (!searchInput.value.trim()) {
            searchResults.style.display = 'none';
            return;
        }

        // Add debug logging
        console.log('Updating results with cities:', cities);

        cities.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.style.padding = '8px 12px';
            li.style.cursor = 'pointer';
            li.addEventListener('click', () => selectCity(city));
            li.addEventListener('mouseover', () => {
                selectedIndex = Array.from(searchResults.children).indexOf(li);
                updateSelection();
            });
            searchResults.appendChild(li);
        });
        
        // Make sure the results container is visible and properly positioned
        if (cities.length > 0) {
            searchResults.style.display = 'block';
            searchResults.style.position = 'absolute';
            searchResults.style.zIndex = '1000';
            
            // Position the results below the search input
            const inputRect = searchInput.getBoundingClientRect();
            searchResults.style.top = `${inputRect.bottom}px`;
            searchResults.style.left = `${inputRect.left}px`;
            searchResults.style.width = `${inputRect.width}px`;
        } else {
            searchResults.style.display = 'none';
        }
    }

    // Input event listener
    searchInput.addEventListener('input', (e) => {
        const searchValue = e.target.value.trim();
        if (searchValue.length >= 1) {
            const filteredCities = filterCities(searchValue);
            updateResults(filteredCities);
        } else {
            searchResults.style.display = 'none';
        }
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        if (!searchResults.style.display || searchResults.style.display === 'none') {
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, filteredCities.length - 1);
                updateSelection();
                break;

            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, 0);
                updateSelection();
                break;

            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < filteredCities.length) {
                    selectCity(filteredCities[selectedIndex]);
                }
                break;

            case 'Escape':
                searchResults.style.display = 'none';
                selectedIndex = -1;
                break;
        }
    });

    // Click outside to close results
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
            selectedIndex = -1;
        }
    });
}

function populateMetroSearch(map) {
    initializeSearch(map);
} 