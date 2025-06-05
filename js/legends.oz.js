function initializeLegend(map) {
    // Create legend container
    const legend = document.createElement('div');
    legend.className = 'map-legend';
    legend.innerHTML = `
        <div class="legend-header">
            <h4 class="legend-title">Legend</h4>
            <span class="legend-toggle">▼</span>
        </div>
        <div class="legend-content">
            <!-- Content will be dynamically updated -->
        </div>
    `;

    // Add legend to map
    map.getContainer().appendChild(legend);

    // Toggle legend expansion
    const header = legend.querySelector('.legend-header');
    const content = legend.querySelector('.legend-content');
    const toggle = legend.querySelector('.legend-toggle');

    header.addEventListener('click', () => {
        content.classList.toggle('expanded');
        toggle.style.transform = content.classList.contains('expanded') ? 'rotate(180deg)' : '';
    });

    // Update legend content based on zoom and view mode
    function updateLegend() {
        const zoomLevel = map.getZoom();
        const isDisplacement = document.getElementById('viewToggle').checked;
        const legendContent = legend.querySelector('.legend-content');

        let html = '';

        if (zoomLevel < 8) {
            if (isDisplacement) {
                html = `
                    <div class="legend-item">
                        <div class="legend-color" style="background: #af2323;"></div>
                        <span>Black Population Loss</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: #17736a;"></div>
                        <span>Black Population Gain</span>
                    </div>
                `;
            } else {
                html = `
                    <div class="legend-item">
                        <div class="legend-color" style="background: #5BD6FF;"></div>
                        <span>Eligible Tracts</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: #00343B;"></div>
                        <span>Gentrified Tracts</span>
                    </div>
                `;
            }
        } else {
            if (isDisplacement) {
                html = `
                    <div class="legend-item">
                        <div class="legend-color rect" style="background: #1565c0;"></div>
                        <span>Significant Black Population Gain</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color rect" style="background: #64b5f6;"></div>
                        <span>Moderate Black Population Gain</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color rect" style="background: #424242;"></div>
                        <span>No Significant Change</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color rect" style="background: #ef5350;"></div>
                        <span>Moderate Black Population Loss</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color rect" style="background: #af2323;"></div>
                        <span>Significant Black Population Loss</span>
                    </div>
                    <div class="legend-item" style="margin-top: 20px;">
                        <div class="legend-color rect" style="border: 2px solid #EB2F89; background: transparent;"></div>
                        <span>Opportunity Zone</span>
                    </div>
                `;
            } else {
                html = `
                    <div class="legend-item">
                        <div class="legend-color rect" style="background: #B2EBF2;"></div>
                        <span>Gentrified by 1980</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color rect" style="background: #80DEEA;"></div>
                        <span>Gentrified by 1990</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color rect" style="background: #00ACC1;"></div>
                        <span>Gentrified by 2000</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color rect" style="background: #006064;"></div>
                        <span>Gentrified by 2010</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color rect" style="background: #002b2d;"></div>
                        <span>Gentrified by 2020</span>
                    </div>
                    <div class="legend-item" style="margin-top: 20px;">
                        <div class="legend-color rect" style="border: 2px solid #EB2F89; background: transparent;"></div>
                        <span>Opportunity Zone</span>
                    </div>
                `;
            }
        }

        legendContent.innerHTML = html;
    }

    // Update legend on zoom and view toggle
    map.on('zoom', updateLegend);
    document.getElementById('viewToggle').addEventListener('change', updateLegend);
    document.getElementById('viewToggle-mobile').addEventListener('change', updateLegend);

    // Initial update
    updateLegend();
}