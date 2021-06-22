#!/usr/bin/env node
const notifier = require('update-notifier');
const sade = require('sade');
const { error } = require('./util');
const pkg = require('./package');

const ver = process.version;
const min = pkg.engines.node;
if (
    ver
        .substring(1)
        .localeCompare(min.match(/\d+/g).join('.'), 'en', { numeric: true }) === -1
) {
    return error(
        `You are using Node ${ver} but sciterjs-cli requires Node ${min}. Please upgrade Node to continue!`,
        1
    );
}

const commands = require('./commands');

notifier({ pkg }).notify();

process.on('unhandledRejection', (reason, promise) => {
    if (reason instanceof Error) {
        if (reason.stack) {
            console.error(`process.on('unhandledRejection') ${reason.stack}`);
        } else {
            console.error(
                `process.on('unhandledRejection') ${reason.name}: ${reason.message}`
            );
        }
    } else {
        console.error(`process.on('unhandledRejection') ${reason}`);
    }
    // error(err.stack || err.message);
});

let prog = sade('sciterjs-cli').version(pkg.version);

const createCommand = prog
    .command('create [template] [dest]')
    .describe('Create a new application');

commands.createOptions.forEach(option => {
    createCommand.option(option.name, option.description, option.default);
});

createCommand.action(commands.create);

prog.parse(process.argv);