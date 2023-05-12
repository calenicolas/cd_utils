'use strict';

const net = require('net');
const unixSocketServer = net.createServer();
const { exec } = require('child_process');

unixSocketServer.listen('/tmp/cd-utils/deploy-service', () => {
    console.log('now listening');
});

unixSocketServer.on('data', (data) => {
    const jsonData = JSON.parse(data);

    const gitRepo = jsonData.git_repo;
    const imageName = jsonData.image_name;
    const containerName = jsonData.container_name;
    const servicePort = jsonData.service_port;
    const containerNetwork = jsonData.container_network;
    const proxyContainerName = jsonData.proxy_container_name;
    const proxyContainerNetwork = jsonData.proxy_container_network;
    const protocol = jsonData.protocol;

    const arguments = [gitRepo, imageName, containerName, servicePort, containerNetwork, proxyContainerName, proxyContainerNetwork, protocol];
    const stringArguments = arguments.join(" ");

    exec("deploy " + arguments, () => {});
});