#!/bin/bash

EXTENSION_ROOT=$(cd "$(dirname "$0")/../"; pwd);


if [ -d "$EXTENSION_ROOT/build" ]; then
	rm -rf "$EXTENSION_ROOT/build";
fi;


mkdir "$EXTENSION_ROOT/build";
cp -R "$EXTENSION_ROOT/source/"* "$EXTENSION_ROOT/build/";

