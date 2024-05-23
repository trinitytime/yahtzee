import { Command } from 'commander'
import { yahtzee } from '../Yahtzee.ts'

export const restart = new Command().name('restart').action(() => {
  yahtzee.reset()
  yahtzee.start()
})
