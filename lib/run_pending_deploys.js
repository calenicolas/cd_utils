'use strict';

const net = require('net');
const fs = require('fs');
const { exec } = require('child_process');

const pendingDeploysDirectory = "/root/deploy-service/deploy/pending/"
const doneDeploysDirectory = "/root/deploy-service/deploy/done/"

function deploy(jsonData, done = () => {}) {
    const imageName = jsonData.image_name;
    const containerName = jsonData.container_name;
    const servicePort = jsonData.service_port;
    const containerNetwork = jsonData.container_network;
    const proxyContainerName = jsonData.proxy_container_name;
    const proxyContainerNetwork = jsonData.proxy_container_network;
    const protocol = jsonData.protocol;

    const parameters = [
        imageName, containerName, servicePort, containerNetwork, proxyContainerName, proxyContainerNetwork, protocol
    ];

    const stringArguments = parameters.join(" ");

    console.log("Deploy arguments:", stringArguments);
    exec("/usr/local/sbin/deploy " + stringArguments, done);
}

function runPendingDeploys() {
    fs.readdirSync(pendingDeploysDirectory)
        .map((fileName) => {
            return {
                content: fs.readFileSync(pendingDeploysDirectory + fileName, { encoding: 'utf8' }),
                fileName: fileName
            }
        })
        .forEach((pendingDeploy) => {
            deploy(pendingDeploy.content, (error) => {
                if (error) return console.error(error);
                fs.renameSync(
                    pendingDeploysDirectory + pendingDeploy.fileName,
                    doneDeploysDirectory + pendingDeploy.fileName
                );
            });
        });
}

runPendingDeploys()