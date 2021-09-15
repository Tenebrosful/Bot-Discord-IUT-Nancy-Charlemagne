#!/bin/bash

if [[ ! -d "logs" ]]
then
    mkdir logs
fi

if [[ ! -d "logs/main" ]]
then
    mkdir logs/main
fi

timestamp=$(date +%d_%m_%Y_%H_%M_%S)

ts-node index.ts > logs/main/$timestamp.log 2>&1