export function initializeCanvas() {
    // Create and insert canvas
    const container = document.querySelector('.roi-container');
    if (!container) return null;

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    const states = [
        { orange: 0, grey: 0 },
        { orange: 0.2, grey: 0.3 },
        { orange: 0.5, grey: 0.6 },
        { orange: 1, grey: 1 }
    ];

    let currentState = 0;
    let targetState = 0;
    let currentStops = { orange: 0, grey: 0 };

    function resizeCanvas() {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }

    function drawGrid(perspectiveScale = 5) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const gridColor = ctx.createLinearGradient(0, 0, 0, canvas.height);

        gridColor.addColorStop(currentStops.orange, '#F89645');
        gridColor.addColorStop(currentStops.grey, '#EAECF0');

        ctx.strokeStyle = gridColor;

        const depth = 20;
        const verticalCount = 12;
        const initialSpacing = 100;

        let y = canvas.height;

        for (let i = 0; i <= depth; i++) {
            const factor = i / depth;
            const spacing = initialSpacing * Math.pow(1 - factor, 2);
            y -= spacing;

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        const gap = 200;
        const centerX = canvas.width / 2;
        const totalWidth = (verticalCount - 1) * gap;
        const startX = centerX - totalWidth / 2;

        for (let i = 0; i < verticalCount; i++) {
            const x = startX + i * gap;
            const upperX = centerX + (x - centerX) / perspectiveScale;

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, canvas.height);
            ctx.lineTo(upperX, 0);
            ctx.stroke();
        }
    }

    function animateGradient() {
        const target = states[targetState];

        const baseSpeed = 0.02;
        let speedMultiplier = 1;

        if (
            (targetState === 3 && currentState === 2) ||
            (targetState === 2 && currentState === 3)
        ) {
            speedMultiplier = 1.5;
        }

        const animationSpeed = baseSpeed * speedMultiplier;

        let orangeDone = false;
        let greyDone = false;

        if (Math.abs(currentStops.orange - target.orange) > 0.01) {
            currentStops.orange += (target.orange - currentStops.orange) * animationSpeed;
        } else {
            currentStops.orange = target.orange;
            orangeDone = true;
        }

        if (Math.abs(currentStops.grey - target.grey) > 0.01) {
            currentStops.grey += (target.grey - currentStops.grey) * animationSpeed;
        } else {
            currentStops.grey = target.grey;
            greyDone = true;
        }

        drawGrid();

        if (!orangeDone || !greyDone) {
            requestAnimationFrame(animateGradient);
        } else {
            currentState = targetState;
        }
    }

    function nextState() {
        targetState = (targetState + 1) % states.length;
        animateGradient();
    }

    function prevState() {
        targetState = (targetState - 1 + states.length) % states.length;
        animateGradient();
    }

    function initialize() {
        resizeCanvas();
        drawGrid();
    }

    // Initial setup
    initialize();
    window.addEventListener('resize', initialize);

    // Return control functions
    return {
        nextState,
        prevState,
        initialize
    };
}