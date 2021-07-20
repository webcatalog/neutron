/* eslint-disable no-unused-vars */
/* eslint-disable header/header */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const builder = require('electron-builder');
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const del = require('del');
const { notarize } = require('electron-notarize');
const { exec } = require('child_process');

/*
https://github.com/webcatalog/standalone-builds/blob/master/build-standalone.js
*/
