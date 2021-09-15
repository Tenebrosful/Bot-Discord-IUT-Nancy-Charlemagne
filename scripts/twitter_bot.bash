#!/bin/bash

if [[ ! -d "logs" ]]
then
    mkdir logs
fi

if [[ ! -d "logs/twitter" ]]
then
    mkdir logs/twitter
fi

timestamp=$(date +%d_%m_%Y_%H_%M_%S)

ts-node twitter.ts > logs/twitter/$timestamp.log 2>&1