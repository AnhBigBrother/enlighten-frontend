#!/bin/bash

OUT_DIR="../src/grpc/protobuf"
TS_PLUGIN="$(npm root)/.bin/protoc-gen-ts_proto"

protoc \
--plugin="${TS_PLUGIN}" \
--ts_proto_out="${OUT_DIR}" \
--ts_proto_opt="esModuleInterop=true" \
--ts_proto_opt="outputServices=grpc-js" \
--ts_proto_opt="snakeToCamel=false" \
--proto_path . \
./*.proto