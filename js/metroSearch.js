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
        
        return Object.keys(CITY_COORDINATES).filter(city => {
            const cityLower = city.toLowerCase();
            const searchWords = searchValue.split(' ');
            return searchWords.every(word => cityLower.includes(word));
        });
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
        if (coordinates) {
            // Get population from cbsa-city layer features
            const features = map.querySourceFeatures('cbsa-city', {
                sourceLayer: 'gd24_cbsa-88j963',
                filter: ['==', ['get', 'ccity'], city]
            });
            
            if (features.length > 0) {
                const properties = features[0].properties;
                const population = properties.pop20;
                
                // Update charts with selected city's data
                updateCharts(properties);
                
                let zoomLevel = 10; // Default zoom
                if (population >= 2000000) { // Large metros
                    zoomLevel = 10;
                } else if (population >= 500000) { // Medium metros
                    zoomLevel = 11;
                } else { // Small metros
                    zoomLevel = 12;
                }

                map.flyTo({
                    center: coordinates,
                    zoom: zoomLevel,
                    essential: true,
                    duration: 2000
                });
            }
        }
        searchInput.value = city;
        selectedIndex = -1;
    }

    // Function to update results
    function updateResults(cities) {
        searchResults.innerHTML = '';
        filteredCities = cities;
        selectedIndex = -1;
        
        if (!searchInput.value.trim()) {
            searchResults.style.display = 'none';
            return;
        }

        cities.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.addEventListener('click', () => selectCity(city));
            li.addEventListener('mouseover', () => {
                selectedIndex = Array.from(searchResults.children).indexOf(li);
                updateSelection();
            });
            searchResults.appendChild(li);
        });
        
        searchResults.style.display = cities.length > 0 ? 'block' : 'none';
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