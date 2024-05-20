import { Command } from 'commander'
import { restart } from './restart.ts'
import { yahtzee } from '../Yahtzee.ts'

export const userInput = new Command()
  .name('>')
  .helpOption(false)
  .hook('postAction', () => {})
  .exitOverride(() => {
    throw new Error('unknown command')
  })
  .action(() => {})

userInput.command('exit').action(() => {
  console.log('exit')
  process.exit(0)
})

userInput.command('roll').action(() => {
  yahtzee.roll()
})

userInput.command('hold [number1] [number2] [number3] [number4] [number5]').action((num1, num2, num3, num4, num5) => {
  const numbers = [num1, num2, num3, num4, num5]

  for (let i = 0; i < 5; ++i) {
    if (numbers[i] && 1 <= numbers[i] && numbers[i] <= 5) {
      yahtzee.hold(numbers[i])
    }
  }
})

userInput.command('unhold [number1] [number2] [number3] [number4] [number5]').action((num1, num2, num3, num4, num5) => {
  const numbers = [num1, num2, num3, num4, num5]

  for (let i = 0; i < 5; ++i) {
    if (numbers[i] && 1 <= numbers[i] && numbers[i] <= 5) {
      yahtzee.unhold(numbers[i])
    }
  }
})

userInput.command('set [pos]').action((pos) => {
  yahtzee.setScore(pos)
})

const start = new Command().name('start').action(() => {
  yahtzee.start()
  yahtzee.roll()
})

userInput.addCommand(start)
userInput.addCommand(restart)

function splitInput(input: string): string[] {
  return input.split(' ').map((part) => part.trim())
}

export async function whileUserInput() {
  process.stdout.write('> ')
  for await (const chunk of Bun.stdin.stream() as unknown as AsyncIterableIterator<Uint8Array>) {
    const input = Buffer.from(chunk).toString()

    try {
      userInput.parse(splitInput(input), { from: 'user' })
    } catch (e) {
      //
    }

    yahtzee.print()
    process.stdout.write('> ')
  }
}
