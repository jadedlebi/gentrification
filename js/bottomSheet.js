document.addEventListener('DOMContentLoaded', function() {
    const bottomSheet = document.querySelector('.bottom-sheet');
    const handle = document.querySelector('.bottom-sheet-handle');
    const viewToggle = document.getElementById('viewToggle');
    let isDragging = false;
    let startY = 0;
    let currentY = 0;
    let initialY = 0;

    // Define the bounds as percentages
    const bounds = {
        min: 25,  // Expanded position (25% from top)
        max: 85   // Collapsed position (85% from top)
    };

    function setTransform(percentage) {
        const clampedPercentage = Math.max(bounds.min, Math.min(bounds.max, percentage));
        requestAnimationFrame(() => {
            bottomSheet.style.transform = `translateY(${clampedPercentage}%)`;
        });
    }

    // Reset bottom sheet when view changes
    viewToggle.addEventListener('change', function() {
        // Force reset position
        bottomSheet.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTransform(bounds.max);
        bottomSheet.classList.remove('expanded');
        
        // Clear any ongoing interactions
        isDragging = false;
        document.body.style.userSelect = '';
    });

    function onDragStart(e) {
        isDragging = true;
        startY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        const transform = window.getComputedStyle(bottomSheet).transform;
        const matrix = new DOMMatrix(transform);
        initialY = matrix.m42 / window.innerHeight * 100; // Convert to percentage
        
        bottomSheet.style.transition = 'none';
        document.body.style.userSelect = 'none';
    }

    function onDragMove(e) {
        if (!isDragging) return;

        e.preventDefault();
        currentY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        const deltaY = (currentY - startY) / window.innerHeight * 100;
        const newPercentage = initialY + deltaY;
        
        setTransform(newPercentage);
    }

    function onDragEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        document.body.style.userSelect = '';
        bottomSheet.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

        const transform = window.getComputedStyle(bottomSheet).transform;
        const matrix = new DOMMatrix(transform);
        const currentPercentage = matrix.m42 / window.innerHeight * 100;
        const midPoint = (bounds.min + bounds.max) / 2;
        
        if (currentPercentage < midPoint) {
            bottomSheet.classList.add('expanded');
            setTransform(bounds.min);
        } else {
            bottomSheet.classList.remove('expanded');
            setTransform(bounds.max);
        }
    }

    // Handle click events
    handle.addEventListener('click', (e) => {
        e.preventDefault();
        bottomSheet.classList.toggle('expanded');
        const newPercentage = bottomSheet.classList.contains('expanded') ? 
            bounds.min : bounds.max;
        
        bottomSheet.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        setTransform(newPercentage);
    });

    // Mouse events
    handle.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);

    // Touch events
    handle.addEventListener('touchstart', onDragStart, { passive: false });
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('touchend', onDragEnd);
    document.addEventListener('touchcancel', onDragEnd);

    // Prevent content scrolling when sheet is not fully expanded
    bottomSheet.addEventListener('touchmove', (e) => {
        if (!bottomSheet.classList.contains('expanded')) {
            e.preventDefault();
        }
    }, { passive: false });

    // Update the window resize handler
    window.addEventListener('resize', () => {
        const isExpanded = bottomSheet.classList.contains('expanded');
        setTransform(isExpanded ? bounds.min : bounds.max);
    });
}); 