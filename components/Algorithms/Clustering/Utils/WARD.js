export function WARD(points, k) {
    // Найти центра кластера
    const findClusterCenter = (cluster) => {
        let centerX = 0;
        let centerY = 0;

        for (let point of cluster) {
            centerX += point.x;
            centerY += point.y;
        }

        centerX /= cluster.length;
        centerY /= cluster.length;
    
        return { x: centerX, y: centerY};
    }

    let clusters = points.map(point => [point]);

    while (clusters.length > k) {
        let minDistance = Infinity;
        let closestCluster = [];

        for (let i = 0; i < clusters.length; i++) {
            for (let j = i + 1; j < clusters.length; j++) {
                let firstCenter = findClusterCenter(clusters[i]);
                let secondCenter = findClusterCenter(clusters[j]);

                let distance = Math.sqrt(Math.pow(firstCenter.x - secondCenter.x, 2) + Math.pow(firstCenter.y - secondCenter.y, 2));

                if (distance < minDistance) {
                    minDistance = distance;
                    closestCluster = [i, j];
                }
            }
        }
        
        clusters[closestCluster[0]] = clusters[closestCluster[0]].concat(clusters[closestCluster[1]]);
        clusters.splice(closestCluster[1], 1);
    }

    return clusters.map(cluster => {
        return {center: findClusterCenter(cluster), points: cluster};
    });
}
