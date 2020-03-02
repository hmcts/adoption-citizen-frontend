#!/usr/bin/env bash

set -eu

git clone https://github.com/hmcts/fpla-ccd-definitions.git --branch ${DEFINITION_BRANCH}
./fpla-ccd-definitions/bin/import-ccd-roles.sh
./fpla-ccd-definitions/bin/import-ccd-definition.sh
