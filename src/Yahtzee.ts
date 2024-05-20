import _ from 'lodash'
import { state } from './State'

const dice = [1, 2, 3, 4, 5, 6]

function getScoreAces(nums: number[]) {
  return nums.reduce((acc, num) => (num === 1 ? acc + 1 : acc), 0)
}

function getScoreTwos(nums: number[]) {
  return nums.reduce((acc, num) => (num === 2 ? acc + 2 : acc), 0)
}

function getScoreThrees(nums: number[]) {
  return nums.reduce((acc, num) => (num === 3 ? acc + 3 : acc), 0)
}

function getScoreFours(nums: number[]) {
  return nums.reduce((acc, num) => (num === 4 ? acc + 4 : acc), 0)
}

function getScoreFives(nums: number[]) {
  return nums.reduce((acc, num) => (num === 5 ? acc + 5 : acc), 0)
}

function getScoreSixes(nums: number[]) {
  return nums.reduce((acc, num) => (num === 6 ? acc + 6 : acc), 0)
}

function getScoreThreeOfAKind(nums: number[]) {
  const counts = _.countBy(nums)
  const three = _.findKey(counts, (count) => count >= 3)
  return three ? Number(three) * counts[three] : 0
}

function getScoreFourOfAKind(nums: number[]) {
  const counts = _.countBy(nums)
  const four = _.findKey(counts, (count) => count >= 4)
  return four ? Number(four) * counts[four] : 0
}

function getScoreFullHouse(nums: number[]) {
  const counts = _.countBy(nums)
  const three = _.findKey(counts, (count) => count >= 3)
  if (!three) return 0
  const two = _.findKey(_.omit(counts, three), (count) => count >= 2)
  return three && two ? 25 : 0
}

function getScoreSmallStraight(nums: number[]) {
  const sorted = _.uniq(nums).sort().toString()
  const isSmall = sorted.includes('1,2,3,4') || sorted.includes('2,3,4,5') || sorted.includes('3,4,5,6')
  return isSmall ? 30 : 0
}

function getScoreLargeStraight(nums: number[]) {
  const sorted = _.uniq(nums).sort()
  const isLarge = sorted.length === 5 && sorted[4] - sorted[0] === 4
  return isLarge ? 40 : 0
}

function getScoreChance(nums: number[]) {
  return nums.reduce((acc, num) => acc + num, 0)
}

function isYahtzee(nums: number[]) {
  return _.uniq(nums).length === 1
}

function getScoreYahtzee(nums: number[]) {
  const counts = _.countBy(nums)
  const yahtzee = _.findKey(counts, (count) => count >= 5)
  return yahtzee ? 50 : 0
}

const getScoreMap = [
  () => 0,
  getScoreAces,
  getScoreTwos,
  getScoreThrees,
  getScoreFours,
  getScoreFives,
  getScoreSixes,
  getScoreThreeOfAKind,
  getScoreFourOfAKind,
  getScoreFullHouse,
  getScoreSmallStraight,
  getScoreLargeStraight,
  getScoreChance,
  getScoreYahtzee,
]

export class Yahtzee {
  reset() {
    console.log('초기화 합니다.')
    state.clear()
  }

  start() {
    console.log('새로운 게임을 시작합니다.')
    state.start()
  }

  roll() {
    if (2 < state.rollCount) {
      console.log('더 이상 굴릴 수 없습니다.')
      return
    }

    console.log('주사위를 굴립니다.')

    for (let i = 0; i < 5; ++i) {
      if (state.diceHold[i]) continue

      state.diceValue[i] = _.sample(dice) ?? 1
    }

    ++state.rollCount
  }

  hold(number: number) {
    if (!state.isStarted()) return
    if (2 < state.rollCount) {
      console.log('점수 확정을 해야 합니다.')
      return
    }

    const target = number - 1
    state.diceHold[target] = true
    console.log(`${number}번째 주사위를 고정합니다.`)
  }

  unhold(number: number) {
    if (!state.isStarted()) return
    if (2 < state.rollCount) {
      console.log('점수 확정을 해야 합니다.')
      return
    }

    const target = number - 1
    state.diceHold[target] = false
    console.log(`${number}번째 주사위를 재굴굴림합니다.`)
  }

  setScore(index: number) {
    if (!state.isStarted()) return
    if (0 >= index || index >= 14) {
      console.log('set 1 ~ 13 사이의 값을 입력해주세요.')
      return
    }

    if (isYahtzee(state.diceValue) && 0 !== state.score[13]) {
      state.score[13] += 100
      console.log('야찌에 추가 점수 100점이 추가 됩니다.')
      return
    }

    if (-1 !== state.score[index]) {
      console.log('이미 점수가 확정된 항목입니다.')
      return
    }

    const getScore = getScoreMap[index]
    const score = getScore(state.diceValue)

    state.score[index] = score

    console.log(`${index}번째 점수를 확정합니다.`)

    // check bonus
    const bonus = state.score.slice(1, 7).reduce((acc, score) => (0 <= score ? acc + score : acc), 0)
    if (63 <= bonus) {
      state.score[0] = 35
      console.log('보너스 35점이 추가 됩니다.')
    }

    state.nextRound()

    if (13 <= state.round) {
      console.log('게임이 종료되었습니다.')
      this.printResult()
      state.clear()
      return
    }

    this.roll()
  }

  printResult() {
    const total = state.score.reduce((acc, score) => (0 <= score ? acc + score : acc), 0)
    console.log(`총점: ${total}`)
  }

  printScoreBoard() {
    if (!state.isStarted()) return
    const s = state.score.map((score, index) => {
      return score === -1 ? '  -' : `${score}`.padStart(3, ' ')
    })

    const board = `
┌───────────┬─────┬─────────────────────┬─────┐
│ 1. Aces   │ ${s[1]} |  7. Three of a kind │ ${s[7]} |
│ 2. Twos   │ ${s[2]} |  8. Four of a kind  │ ${s[8]} |
│ 3. Threes │ ${s[3]} |  9. Full House      │ ${s[9]} |
│ 4. Fours  │ ${s[4]} | 10. Small Straight  │ ${s[10]} |
│ 5. Fives  │ ${s[5]} | 11. Large Straight  │ ${s[11]} |
│ 6. Sixes  │ ${s[6]} | 12. Chance          │ ${s[12]} |
│ Bounus    │ ${s[0]} | 13. Yahtzee         │ ${s[13]} |
└───────────┴─────┴─────────────────────┴─────┘
    `.trim()

    console.log(`Round: ${state.round + 1}`)
    console.log(board)
  }

  printDice() {
    if (!state.isStarted()) return

    const v = state.diceValue
    const hold = state.diceHold.map((hold) => (hold ? 'O' : 'X')).join('    ')

    const text = `  1    2    3    4    5
┌───┐┌───┐┌───┐┌───┐┌───┐
│ ${v[0]} ││ ${v[1]} ││ ${v[2]} ││ ${v[3]} ││ ${v[4]} │
└───┘└───┘└───┘└───┘└───┘
  ${hold}
    `
    console.log(text)
  }

  print() {
    this.printScoreBoard()
    this.printDice()
  }
}

export const yahtzee = new Yahtzee()
