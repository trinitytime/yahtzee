import { Command } from 'commander'
import { yahtzee } from '../yahtzee.ts'

export const restart = new Command().name('restart').action(() => {
  yahtzee.reset()
  yahtzee.start()
})
