let balance = 0;

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = { A: 2, B: 4, C: 6, D: 8 };
const SYMBOLS_VALUES = { A: 5, B: 4, C: 3, D: 2 };

function deposit() {
  const amount = parseFloat(document.getElementById("depositAmount").value);
  if (isNaN(amount) || amount <= 0) {
    document.getElementById("message").innerText = "Invalid deposit amount!";
    return;
  }
  balance += amount;
  document.getElementById("balance").innerText = balance;
  document.getElementById("message").innerText = "Deposit successful!";
}

function play() {
  const lines = parseInt(document.getElementById("lines").value);
  const bet = parseInt(document.getElementById("bet").value);

  if (lines < 1 || lines > 3) {
    document.getElementById("message").innerText = "Lines must be 1-3!";
    return;
  }

  if (bet <= 0 || bet * lines > balance) {
    document.getElementById("message").innerText = "Invalid bet!";
    return;
  }

  balance -= bet * lines;

  const reels = spin();
  const rows = transpose(reels);
  displaySlots(rows);

  const winnings = getWinnings(rows, bet, lines);
  balance += winnings;

  document.getElementById("balance").innerText = balance;
  document.getElementById("message").innerText =
    winnings > 0 ? `You won $${winnings}! ` : "No win, try again!";
}

function spin() {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
}

function transpose(reels) {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  return rows;
}

function displaySlots(rows) {
  const cells = document.querySelectorAll(".slot-cell");

  let index = 0;
  for (const row of rows) {
    for (const symbol of row) {
      cells[index].innerText = symbol;
      index++;
    }
  }
}

function getWinnings(rows, bet, numberOfLines) {
  let winnings = 0;
  for (let row = 0; row < numberOfLines; row++) {
    const symbols = rows[row];
    let allSame = true;
    for (const symbol of symbols) {
      if (symbol !== symbols[0]) {
        allSame = false;
        break;
      }
    }
    if (allSame) winnings += bet * SYMBOLS_VALUES[symbols[0]];
  }
  return winnings;
}
