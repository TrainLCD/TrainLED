#!/bin/bash
yum install -y wget
wget https://github.com/protocolbuffers/protobuf/releases/download/v25.1/protoc-25.1-linux-x86_64.zip
unzip protoc-25.1-linux-x86_64.zip -d protoc
export PATH=$PATH:./protoc/bin
npm install --legacy-peer-deps