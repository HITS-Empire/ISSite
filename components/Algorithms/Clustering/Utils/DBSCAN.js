export function DBSCAN(points) {
    const radius = 100;
    const minAmount = 1;

    const clusters = [];
    const visited = new Set();

    // Расстояние от одной точки до другой
    const distance = (firstPoint, secondPoint) => {
        return Math.sqrt(Math.pow(firstPoint.x - secondPoint.x, 2) + Math.pow(firstPoint.y - secondPoint.y, 2));
    }

    // Найти все точки в радиусе
    const findNeighbors = (pointID) => {
        const neighbors = [];
        for (let i = 0; i < points.length; i++) {
            if (distance(points[pointID], points[i]) < radius) {
                neighbors.push(i);
            }
        }
        return neighbors;
    }

    // Если точка не присутствтует ни в одном кластере
    const inAnyCluster = (pointID) => {
        for (let i = 0; i < clusters.length; i++) {
            if (clusters[i].includes(pointID)) {
                return true;
            }
        }
        return false;
    }

    // Расширить кластер
    const expandCluster = (pointID, neighbors, cluster ) => {
        cluster.push(pointID);

        for (let i = 0; i < neighbors.length; i++) {
            const neighborID = neighbors[i];
           
            if (!visited.has(neighborID)) {
                visited.add(neighborID);

                const nextNeighbors = findNeighbors(neighborID);

                if (nextNeighbors.length >= minAmount) {
                    neighbors.push(...nextNeighbors);
                }
            }
    
            if (!inAnyCluster(neighborID)) {
                cluster.push(neighborID);
            }
        }
    }

    // Найти центра кластера
    const findClusterCenter = (cluster) => {
        if (cluster.length === 0) return null;

        const sumX = cluster.reduce((acc, pointID) => acc + points[pointID].x, 0);
        const sumY = cluster.reduce((acc, pointID) => acc + points[pointID].y, 0);
        
        const centerX = sumX / cluster.length;
        const centerY = sumY / cluster.length

        return { x: centerX, y: centerY};
        
    }

    for (let pointID = 0; pointID < points.length; pointID++) {
        if (visited.has(pointID)) continue;

        visited.add(pointID);
        
        const neighbors = findNeighbors(pointID);
        
        if (neighbors.length < minAmount) continue;

        const cluster = [];
        expandCluster(pointID, neighbors, cluster);
        clusters.push(cluster);
    }

    return clusters.map(cluster => {
        const center = findClusterCenter(cluster);
        return { center, points: cluster.map(pointID => points[pointID]) };
    });
}