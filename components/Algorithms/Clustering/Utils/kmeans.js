export function kMeans(points) {
    // Количество кластеров
    const k = 4;
    
    // Создать стартовые кластеры
    let clusters = [];
    for (let i = 0; i < k && i < points.length; i++) {
        let index = Math.floor(0 + Math.random() * points.length);
        clusters.push({ center: points[i], points: [] });
    }
    
    // Найти новые кластеры
    let findNewClusters = (points, clusters) => {
        let newClusters = clusters.map(() => ({ center: null, points: [] }));
        
        points.forEach(point => {
            let minDistance = Infinity;
            let closestCluster = null;
            
            clusters.forEach((cluster, index) => {
                if (cluster.center.x !== undefined) {
                    const distance = Math.sqrt(Math.pow(point.x - cluster.center.x, 2) + Math.pow(point.y - cluster.center.y, 2));
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestCluster = index;
                    }
                }
            });
            newClusters[closestCluster].points.push(point);
        });

        return newClusters;
    }

    // Обновить координаты центра кластера
    let updateClusterCenters = (clusters) => {
        let newClusters = clusters.map(cluster => {
            if (cluster.points.length === 0) return cluster;
            let sumX = cluster.points.reduce((acc, point) => acc + point.x, 0);
            let sumY = cluster.points.reduce((acc, point) => acc + point.y, 0);
            return { center: { x: sumX / cluster.points.length, y: sumY / cluster.points.length }, points: cluster.points };
        });

        return newClusters;
    }

    // Сравнить новый и предыдущий кластеры
    let clustersEqual = (clusters1, clusters2) => {
        if (clusters1.length !== clusters2.length) return false;
        for (let i = 0; i < clusters1.length; i++) {
            if (!clusters1[i] || !clusters2[i] || clusters1[i].points.length !== clusters2[i].points.length) return false;
            for (let j = 0; j < clusters1[i].points.length; j++) {
                if (clusters1[i].points[j].x !== clusters2[i].points[j].x || clusters1[i].points[j].y !== clusters2[i].points[j].y) {
                    return false;
                }
            }
        }
        return true;
    }

    let previousClusters = [];
    while (!clustersEqual(previousClusters, clusters)) {
        previousClusters = JSON.parse(JSON.stringify(clusters));
        clusters = findNewClusters(points, clusters);
        clusters = updateClusterCenters(clusters);
    }

    return clusters;
}
