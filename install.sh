#!/bin/bash

cp -r sbin/* /usr/local/sbin
mkdir /usr/local/lib/cd_utils || true
cp -r lib/* /usr/local/lib/cd_utils

cp -r service/systemctl/cd-utils-deploy.service /lib/systemd/system

systemctl daemon-reload
systemctl enable cd-utils-deploy