#!/usr/bin/env bun
import { Command } from 'commander'
import { whileUserInput } from './command'

const program = new Command()

program
  .name('yahtzee')
  .description('yahtzee for cli')
  .version('0.0.1')
  .action(async () => whileUserInput())

program.parse(process.argv)
