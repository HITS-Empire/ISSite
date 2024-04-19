import { sleep } from "../../../../../utils/helpers";

export function randomPath(size) {
    const path = new Array(size).fill(0).map((_, i) => i + 1);
    for (let i = path.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [path[i], path[j]] = [path[j], path[i]];
    }
    return path;
};

export async function pathOfTravelingSalesman({
    setBestFitness,
    setPopulation,
    bestFitness,
    setBestPath,
    population,
    bestPath, 
    vertices,
    ctx, 
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

    const POPULATION_SIZE = 200;

    let generation = 0;

    const newPopulation = [];
    for (let i = 0; i < POPULATION_SIZE / 2; i++) {
        const firstPath = population[Math.floor(Math.random() * (i + 1))];
        const secondPath  = population[Math.floor(Math.random() * (i + 1))];

        const newFirstPath = crossover(firstPath , secondPath);
        const newSecondPath = crossover(secondPath, firstPath );
        
        newPopulation.push(mutate(newFirstPath));
        newPopulation.push(mutate(newSecondPath));
    }

    newPopulation.sort((a, b) => fitness(a) - fitness(b));

    setPopulation(newPopulation);

    const newBestPath = newPopulation[0];
    
    const newBestFitness = fitness(newBestPath);

    if (newBestFitness < bestFitness) {
        setBestPath(newBestPath);
        setBestFitness(newBestFitness);
    }
    console.log(newBestPath);
    ctx.beginPath();
    ctx.moveTo(vertices[newBestPath[0] - 1].x, vertices[newBestPath[0] - 1].y);
    ctx.strokeStyle = 'gray';

    for (let i = 0; i < newBestPath.length; i++) {
        ctx.lineTo(vertices[newBestPath[i] - 1].x, vertices[newBestPath[i] - 1].y);
    }

    ctx.closePath();
    ctx.stroke();

    await sleep(500);

    ctx.beginPath();
    ctx.moveTo(vertices[newBestPath[0] - 1].x, vertices[newBestPath[0] - 1].y);
    ctx.strokeStyle = 'white';

    for (let i = 0; i < newBestPath.length; i++) {
        ctx.lineTo(vertices[newBestPath[i] - 1].x, vertices[newBestPath[i] - 1].y);
    }

    ctx.closePath();
    ctx.stroke();

    generation += 1;

    if (bestFitness > 0.999 || generation > 100) {
        return;
    }
}