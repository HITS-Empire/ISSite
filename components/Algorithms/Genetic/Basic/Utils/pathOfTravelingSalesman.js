import { sleep } from "../../../../../utils/helpers";


export async function pathOfTravelingSalesman(vertices, ctx, maxAmountOfPopulations) {

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

        for (let i = 0; i < path.length - 1; i++) {
            const cityA = path[i];
            const cityB = path[i + 1];
            //console.log(cityB - 1, cityA - 1);
            const firstVertex = vertices[cityA - 1];
            const secondVertex = vertices[cityB - 1];
            //  console.log(path);
            //console.log(firstVertex,secondVertex);
            totalDistance += Math.sqrt((firstVertex.x - secondVertex.x) ** 2 + (firstVertex.y - secondVertex.y) ** 2);
        }
        return 1 / totalDistance;
    };


    const mutate = (path, mutationRate) => {
        const newPath = [...path];

        let i = 0;
        while(i < newPath.length) {
            if (Math.random() < mutationRate) {
                const j = Math.floor(Math.random() * newPath.length);
                if (i !== j) {
                    [newPath[i], newPath[j]] = [newPath[j], newPath[i]];
                    i++;
                }
            }
        }
        return newPath;
    };


    const crossover = (parentA, parentB) => {
        const child = new Array(parentA.length).fill(0);
        const usedCities = new Set();
        
        let end = Math.floor(Math.random() * parentA.length);
        for (let i = 0; i < end; i++) {
            child[i] = parentA[i];
            usedCities.add(parentA[i]);
        }
        
        let index = end;
        for (let i = end; i < parentA.length; i++) {
            if (!usedCities.has(parentB[i])) {
                child[index] = parentB[i];
                usedCities.add(parentB[i]);
                end++;
                index++;
            }
        }

        while (end < parentA.length) {
            if (!usedCities.has(parentA[end])) {
                child[index] = parentA[end];
                index++;
                usedCities.add(parentA[end]);
            }
            end++;
        }

        while (index !== parentA.length) {
            for (let i = 0; i < parentA.length; i++) {
                if (!usedCities.has(parentA[i]) && child[index] === 0) {
                    child[index] = parentA[i];
                }
            }
            index++;
        }
        return child;
        /*
   
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
        */
    };


    function factorial(n) {
        if (n === 0) {
            return 1;
        }
        return n * factorial(n - 1);
    }

    const sizeOfPopulation = 200;
    const chanceOfMutation = 0.01;

    let population = Array.from({ length: sizeOfPopulation }, () =>
        randomPath(vertices.length)
    );
    let bestPath = population[0];
    let bestFitness = fitness(bestPath);
   
    for (let i = 1; i < population.length; i++) {
        const newFitness = fitness(population[i]);

        if (newFitness > bestFitness) {
            bestPath = population[i];
            bestFitness = newFitness;
        }
    }

    let generation = 0;

    const loop = async () => {
        const newPopulation = [];
        for (let i = 0; i < sizeOfPopulation / 2; i++) {
            const parentA = population[Math.floor(Math.random() % Math.floor(sizeOfPopulation / 2))];
            const parentB = population[Math.floor(sizeOfPopulation / 2) + Math.floor(Math.random() % sizeOfPopulation)];

            const childA = crossover(parentA, parentB);
            const childB = crossover(parentB, parentA);

            newPopulation.push(mutate(childA, chanceOfMutation));
            newPopulation.push(mutate(childB, chanceOfMutation));
        }

        population = newPopulation;
        population.sort((a, b) => fitness(b) - fitness(a));
       
        const newBestPath = population[0];
        const newBestFitness = fitness(newBestPath);

        if (newBestFitness > bestFitness) {
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

        if (generation === maxAmountOfPopulations) {
            return;
        }
    };
/*
    const parentA = [1,2,3];
    const parentB = [3,1,2];
    console.log(crossover(parentA,parentB));
    console.log(crossover(parentB,parentA));
  */
 
    for (let i = 0; i < maxAmountOfPopulations; i++) {
        loop();
        await sleep(100);
    }
    return bestPath;
}
