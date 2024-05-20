class State {
  #running = false

  round = 0
  rollCount = 0
  diceValue = [1, 2, 3, 4, 5]
  diceHold = [false, false, false, false, false]
  score = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]

  clear() {
    this.#running = false

    this.round = 0
    this.rollCount = 0
    this.diceValue = [1, 2, 3, 4, 5]
    this.diceHold = [false, false, false, false, false]
    this.score = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
  }

  start() {
    this.#running = true
  }

  isStarted() {
    return this.#running
  }

  nextRound() {
    this.rollCount = 0
    this.diceValue = [1, 2, 3, 4, 5]
    this.diceHold = [false, false, false, false, false]
    ++this.round
  }
}

export const state = new State()
