const Gameboard = (() => {
  const squares = Array.from(document.getElementsByClassName("square"));
  return { squares };
})();

const Player = (name, isComputer = false) => {
  return { name, isComputer };
};

const GameController = (() => {
  let currentPlayer;
  const humanPlayer = Player("X");
  const computerPlayer = Player("O", true);
  let vsComputer = false;
  let gameOver = false;

  const playerTurnDiv = document.getElementById("player-turn");
  const endMessageDiv = document.getElementById("end-message");
  const restartBtn = document.getElementById("restart-btn");
  const vsHumanBtn = document.getElementById("vs-human");
  const vsComputerBtn = document.getElementById("vs-computer");

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function init(vsAI = false) {
    vsComputer = vsAI;
    currentPlayer = humanPlayer;
    gameOver = false;
    Gameboard.squares.forEach((square) => {
      square.textContent = "";
      square.removeAttribute("data-winning");
    });
    updateMessage("");
    updateTurn();
    restartBtn.style.display = "none";
  }

  function checkWin(player) {
    for (const [a, b, c] of winningCombinations) {
      if (
        Gameboard.squares[a].textContent === player.name &&
        Gameboard.squares[b].textContent === player.name &&
        Gameboard.squares[c].textContent === player.name
      ) {
        gameOver = true;
        [a, b, c].forEach((i) =>
          Gameboard.squares[i].setAttribute("data-winning", "true")
        );
        updateMessage(`${player.name} wins!`);
        return true;
      }
    }
    return false;
  }

  function checkTie() {
    if (Gameboard.squares.every((square) => square.textContent !== "")) {
      gameOver = true;
      updateMessage("It's a tie!");
      return true;
    }
    return false;
  }

  function switchPlayer() {
    currentPlayer = vsComputer
      ? currentPlayer === humanPlayer
        ? computerPlayer
        : humanPlayer
      : currentPlayer === humanPlayer
      ? Player("O")
      : humanPlayer;
  }

  function updateMessage(message) {
    endMessageDiv.textContent = message;
    if (gameOver) restartBtn.style.display = "inline-block";
  }

  function updateTurn() {
    playerTurnDiv.textContent = `${currentPlayer.name}'s turn`;
  }

  function handleClick(squareIndex) {
    if (gameOver || Gameboard.squares[squareIndex].textContent !== "") return;

    const square = Gameboard.squares[squareIndex];
    square.textContent = currentPlayer.name;

    if (checkWin(currentPlayer) || checkTie()) return;

    switchPlayer();
    updateTurn();

    if (vsComputer && currentPlayer.isComputer) {
      setTimeout(computerMove, 500); // Delay for better UX
    }
  }

  function computerMove() {
    const availableSquares = Gameboard.squares.filter(
      (square) => square.textContent === ""
    );
    const move =
      availableSquares[Math.floor(Math.random() * availableSquares.length)];
    const index = Gameboard.squares.indexOf(move);
    handleClick(index);
  }

  const addClickListeners = () => {
    Gameboard.squares.forEach((square) => {
      square.addEventListener("click", () => {
        const index = parseInt(square.getAttribute("data-index"));
        handleClick(index);
      });
    });
  };

  vsHumanBtn.addEventListener("click", () => init(false));
  vsComputerBtn.addEventListener("click", () => init(true));
  restartBtn.addEventListener("click", () => init(vsComputer));

  init();
  addClickListeners();

  return { init };
})();
