import { sleep } from "../../../../../utils/helpers";

export function pathOfTravelingSalesman(vertices, ctx) {

    const randomPath = (size) => {
        const path = new Array(size).fill(0).map((_, i) => i + 1);
        for (let i = path.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [path[i], path[j]] = [path[j], path[i]];
        }
        return path;
    };

    const fitness = (path) => {
        let totalDistance = 0;
        for (let i = 0; i < path.length; i++) {
            const cityA = path[i];
            const cityB = path[(i + 1) % path.length];

            const firstVertex = vertices[cityA - 1];
            const secondVertex = vertices[cityB - 1];
            
            totalDistance += Math.sqrt((firstVertex.x - secondVertex.x) ** 2 + (firstVertex.y - secondVertex.y) ** 2);
        }
        return 1 / totalDistance;
    };

    const mutate = (path, mutationRate) => {
        const newPath = [...path];
        for (let i = 0; i < newPath.length; i++) {
            if (Math.random() < mutationRate) {
                const j = Math.floor(Math.random() * newPath.length);
                [newPath[i], newPath[j]] = [newPath[j], newPath[i]];
            }
        }
        return newPath;
    };

    const crossover = (parentA, parentB) => {
        const child = new Array(vertices.length).fill(0);
        const usedCities = new Set();
    
        const crossoverPointA = Math.floor(Math.random() * vertices.length);
        const crossoverPointB = Math.floor(Math.random() * vertices.length);
    
        let start = Math.min(crossoverPointA, crossoverPointB);
        let end = Math.max(crossoverPointA, crossoverPointB);
    
        for (let i = start; i <= end; i++) {
            child[i] = parentA[i];
            usedCities.add(parentA[i]);
        }
    
        let index = 0;
        for (let i = 0; i < vertices.length; i++) {
            if (index === start) {
                index = end + 1;
            }
            if (!usedCities.has(parentB[i])) {
                child[index] = parentB[i];
                usedCities.add(parentB[i]);
                index++;
            }
        }
    
        return child;
    };

    function factorial(n) {
        if (n === 0) {
            return 1;
        }
        return n * factorial(n - 1);
    }

    const POPULATION_SIZE = factorial(vertices.length);
    const MUTATION_RATE = 0.01;
    const CROSSOVER_RATE = 0.7;
    const MAX_GENERATIONS = 1000;

    let population = Array.from({ length: POPULATION_SIZE }, () =>
        randomPath(vertices.length)
    );

    console.log(population);

    let bestPath = population[0];
    let bestFitness = fitness(bestPath);
    
    for (let i = 1; i < population.length; i++) {
        const newFitness = fitness(population[i]);
        if (newFitness < bestFitness) {
            bestPath = population[i];
            bestFitness = newFitness;
        }
    }

    let generation = 0;

    const loop = async () => {

        population.sort((a, b) => fitness(a) - fitness(b));

        const newPopulation = [];
        for (let i = 0; i < POPULATION_SIZE / 2; i++) {
            const parentA = population[Math.floor(Math.random() * (i + 1))];
            const parentB = population[Math.floor(Math.random() * (i + 1))];

            if (Math.random() < CROSSOVER_RATE) {
                const childA = crossover(parentA, parentB);
                const childB = crossover(parentB, parentA);

                newPopulation.push(mutate(childA, MUTATION_RATE));
                newPopulation.push(mutate(childB, MUTATION_RATE));
            } else {
                newPopulation.push(parentA);
                newPopulation.push(parentB);
            }
        }

        population = newPopulation;

        const newBestPath = population[0];
        const newBestFitness = fitness(newBestPath);

        if (newBestFitness < bestFitness) {
            bestPath = newBestPath;
            bestFitness = newBestFitness;
        }

        ctx.beginPath();
        ctx.moveTo(vertices[bestPath[0] - 1].x, vertices[bestPath[0] - 1].y);
        ctx.strokeStyle = 'gray';
        
        for (let i = 0; i < bestPath.length; i++) {
            ctx.lineTo(vertices[bestPath[i] - 1].x, vertices[bestPath[i] - 1].y);
        }
        
        ctx.closePath();
        ctx.stroke();
        
        await sleep(500);

        ctx.beginPath();
        ctx.moveTo(vertices[bestPath[0] - 1].x, vertices[bestPath[0] - 1].y);
        ctx.strokeStyle = 'white';
        
        for (let i = 0; i < bestPath.length; i++) {
            ctx.lineTo(vertices[bestPath[i] - 1].x, vertices[bestPath[i] - 1].y);
        }
        
        ctx.closePath();
        ctx.stroke();

        generation += 1;


        console.log(bestFitness);
        console.log(bestPath);
        if (bestFitness > 0.99999999 && generation >= MAX_GENERATIONS) {
            return;
        }

        setTimeout(loop, 0);
    };

    loop();

    return bestPath;
}