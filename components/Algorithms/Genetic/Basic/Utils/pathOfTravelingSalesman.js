export function randomPath(size) {
    const path = new Array(size).fill(0).map((_, i) => i + 1);
    for (let i = path.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [path[i], path[j]] = [path[j], path[i]];
    }
    return path;
};

export function refreshField({
    data,
    canvas,
    ctx,
    vertices,
    lines
}) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 3;
    ctx.strokeStyle = "#140029";

    lines.forEach(({ from, to }) => {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.closePath();
        ctx.stroke();
    });

    ctx.lineWidth = 8;
    ctx.fillStyle = data.generation > 10 ? "#3fa643" : "#9747ff"
    ctx.strokeStyle = ctx.fillStyle;

    for (let i = 0; i < data.bestPath.length; i++) {
        const firstVertex = vertices[data.bestPath[i] - 1];
        const secondVertex = vertices[data.bestPath[(i + 1) % data.bestPath.length] - 1];

        ctx.beginPath();
        ctx.moveTo(firstVertex.x, firstVertex.y);
        ctx.lineTo(secondVertex.x, secondVertex.y);
        ctx.closePath();
        ctx.stroke();
    }

    vertices.forEach((vertex) => {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 10, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    });
}

export function pathOfTravelingSalesman({
    data,
    canvas,
    ctx,
    vertices,
    lines,
    setStatus
}) {
    const fitness = (path) => {
        let totalDistance = 0;

        for (let i = 0; i < path.length - 1; i++) {
            const cityA = path[i];
            const cityB = path[i + 1];

            const firstVertex = vertices[cityA - 1];
            const secondVertex = vertices[cityB - 1];

            totalDistance += Math.sqrt((firstVertex.x - secondVertex.x) ** 2 + (firstVertex.y - secondVertex.y) ** 2);
            
        }

        return 1 / totalDistance;
    };

    const mutate = (path) => {
        const newPath = [...path];

        for (let i = 0; i < newPath.length; i++) {
            if (Math.random() < 0.7) {
                const j = Math.floor(Math.random() * newPath.length);
                [newPath[i], newPath[j]] = [newPath[j], newPath[i]];
            }
        }

        return newPath;
    };

    const crossover = (firstPath, secondPath) => {
        const newPath = new Array(vertices.length).fill(-1);
        const usedGens = new Set();

        const separator = Math.floor(Math.random() * vertices.length);
        
        for (let i = 0; i < separator; i++) {
            newPath[i] = firstPath[i];
            usedGens.add(newPath[i]);
        }

        for (let i = separator; i < vertices.length; i++) {
            if (!usedGens.has(secondPath[i])) {
                newPath[i] = secondPath[i];
                usedGens.add(secondPath[i]);
            }
        }
        
        for (let i = 0; i < vertices.length; i++) {
            if (newPath[i] === -1) {
                for (let j = 0; j < vertices.length; j++) {
                    if (!usedGens.has(firstPath[j])) {
                        newPath[i] = firstPath[j];
                        usedGens.add(firstPath[j]);
                        break;
                    }
                }
            }
        }

        return newPath;
    };

    const newPopulation = [];
    for (let i = 0; i < data.population.length / 2; i++) {
        const firstPath = data.population[Math.floor(Math.random() * (i + 1))];
        const secondPath  = data.population[Math.floor(Math.random() * (i + 1))];

        const newFirstPath = crossover(firstPath , secondPath);
        const newSecondPath = crossover(secondPath, firstPath);
        
        newPopulation.push(mutate(newFirstPath));
        newPopulation.push(mutate(newSecondPath));
    }

    newPopulation.sort((a, b) => fitness(b) - fitness(a));

    const newBestPath = newPopulation[0];
    const newBestFitness = fitness(newBestPath);

    data.population = newPopulation;
    data.generation++;

    if (newBestFitness > data.bestFitness) {
        data.bestPath = newBestPath;
        data.bestFitness = newBestFitness;

        refreshField({ data, canvas, ctx, vertices, lines });
    }

    if (data.generation > 10) {
        refreshField({ data, canvas, ctx, vertices, lines });
        setStatus(2);
    }
}
