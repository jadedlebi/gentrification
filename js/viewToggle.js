// Initialize view toggle functionality
function initializeViewToggle(map) {
    const viewToggle = document.getElementById('viewToggle');
    const viewToggleMobile = document.getElementById('viewToggle-mobile');
    const bottomSheet = document.querySelector('.bottom-sheet');
    const gentCharts = document.querySelector('.gent-charts');
    const dispCharts = document.querySelector('.disp-charts');
        
    // Set initial states
    document.getElementById('metricContainer').style.display = 'block';
    document.getElementById('displacementMetricContainer').style.display = 'none';
    
    gentCharts.classList.add('active');
    
    function handleToggleChange() {
        const isDisplacement = this.checked;
        const sidebar = document.getElementById('sidebar');
        const gentCharts = document.querySelector('.gent-charts');
        const dispCharts = document.querySelector('.disp-charts');
        const zoomLevel = map.getZoom();  // Get current zoom level
        
        // Only toggle circle layers if zoom level is below 8
        if (zoomLevel < 8) {
            map.setLayoutProperty('cbsa-el', 'visibility', isDisplacement ? 'none' : 'visible');
            map.setLayoutProperty('cbsa-gent', 'visibility', isDisplacement ? 'none' : 'visible');
            map.setLayoutProperty('cbsa-disp', 'visibility', isDisplacement ? 'visible' : 'none');
        }
        
        // Toggle tract layer groups
        tractSources.forEach(source => {
            map.setLayoutProperty(`${source}-gent-fill`, 'visibility', isDisplacement ? 'none' : 'visible');
            map.setLayoutProperty(`${source}-gent-outline`, 'visibility', isDisplacement ? 'none' : 'visible');
            map.setLayoutProperty(`${source}-gent-hover-outline`, 'visibility', isDisplacement ? 'none' : 'visible');
        });

        dispSources.forEach(source => {
            map.setLayoutProperty(`${source}-disp-fill`, 'visibility', isDisplacement ? 'visible' : 'none');
            map.setLayoutProperty(`${source}-disp-outline`, 'visibility', isDisplacement ? 'visible' : 'none');
            map.setLayoutProperty(`${source}-disp-hover-outline`, 'visibility', isDisplacement ? 'visible' : 'none');
        });
        
        // Add/remove class for displacement view
        if (isDisplacement) {
            sidebar.classList.add('displacement-view');
            gentCharts.style.display = 'none';
            dispCharts.style.display = 'block';
        } else {
            sidebar.classList.remove('displacement-view');
            gentCharts.style.display = 'block';
            dispCharts.style.display = 'none';
        }
        
        // Toggle containers
        document.getElementById('metricContainer').style.display = isDisplacement ? 'none' : 'block';
        document.getElementById('displacementMetricContainer').style.display = isDisplacement ? 'block' : 'none';
    }
    
    // Add event listeners to both toggles
    viewToggle.addEventListener('change', handleToggleChange);
    viewToggleMobile.addEventListener('change', handleToggleChange);
    
    // Keep toggles in sync
    viewToggle.addEventListener('change', () => {
        viewToggleMobile.checked = viewToggle.checked;
    });
    viewToggleMobile.addEventListener('change', () => {
        viewToggle.checked = viewToggleMobile.checked;
    });
} 