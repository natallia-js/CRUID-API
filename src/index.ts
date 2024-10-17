import cluster from 'node:cluster';

const inClusterMode = Boolean(process.env.MULTI);

if (!inClusterMode) {
    console.log(`Starting the application not in cluster mode`);
    //const BasePORT = process.env.PORT;
} else {
    if (cluster.isPrimary) {
        await import('@processes/main');
    } else {
        await import('@processes/worker');
    }
}
