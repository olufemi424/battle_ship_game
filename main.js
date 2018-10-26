// THE VIEW

// CREATE AN OBJECT FOR THE VIEW
var view = {
  displayMessage: function(msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },

  displayHit: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },

  displayMiss: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

// CREATE AN OBJECT FOR THE MODEL

var model = {
  boardSize: 7,
  numShip: 3,
  shipLength: 3,
  shipSunk: 0,

  // ARRAY OF LOCATIONS AND HITS LOCATION FOR EACH STATE OF THE SHIPS
  ships: [
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] }
  ],
  // ships: [
  //   { locations: ["06", "16", "26"], hits: ["", "", ""] },
  //   { locations: ["24", "34", "44"], hits: ["", "", ""] },
  //   { locations: ["10", "11", "12"], hits: ["", "", ""] }
  // ],

  //   FIRE FUNCTION TO DETERMINE IF THERE IS A HIT OR MISS
  fire: function(guess) {
    //   LOOPING THRU THE ARRAY OF SHIPS
    for (var i = 0; i < this.numShip; i++) {
      var ship = this.ships[i];
      //  LOOPING THRU THE INNER ARAYS IN SHIPS[LOCATION]
      var index = ship.locations.indexOf(guess);
      // var locations = ship.locations;
      // var index = locations.indexOf(guess); //OR

      //CHECK IF SHIP HAS BEEN HIT
      if (ship.hits[index] === "hit") {
        view.displayMessage("Oops, you already hit that location!");
        return true;
      } else if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("hit!");
        //IF THE SHIP IS SUNK, INCREMENT THE NUMBER OF isSunk BY 1
        if (this.isSunk(ship)) {
          view.displayMessage("you sunk my battle ship!");
          this.shipSunk++;
        }
        // RETURN TRUE IF WE FIND A HIT
        return true;
      }
    }
    // OTHERWISE RETURN FALSE, ITS A MISS
    //UPDATE THE UI
    view.displayMiss(guess);
    view.displayMessage("You Missed!");
    return false;
  },

  isSunk: function(ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },

  // //GENERATE SHIP LOCATIONS
  generateShipLocations: function() {
    var locations;
    // FOR EACH LOCATION
    for (var i = 0; i < this.numShip; i++) {
      do {
        // GENRATE A NEW LOCATION
        locations = this.generateShip();
        // WHILE LOCATION IS NOT COLLIDING
      } while (this.collision(locations));
      // SET LOCATION
      this.ships[i].locations = locations;
    }

    console.log("Ships array: ");
    console.log(this.ships);
  },

  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    if (direction === 1) {
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(
        Math.random() * (this.boardSize - (this.shipLength + 1))
      );
    } else {
      row = Math.floor(
        Math.random() * (this.boardSize - (this.shipLength + 1))
      );
      col = Math.floor(Math.random() * this.boardSize);
    }

    var newShipLocations = [];

    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      } else {
        newShipLocations.push(row + i + "" + col);
      }
    }
    return newShipLocations;
  },

  collision: function(locations) {
    for (var i = 0; i < this.numShip; i++) {
      var ship = this.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  }
};

// CREATE AN OBJECT FOR THE CONTROLLER
var controler = {
  guesses: 0,
  processGuess: function(guess) {
    // GET THE STRING VALUE OF THE GUESS INPUT
    var location = parseGuess(guess);

    //IF LOCATION IS VALID, INCREMENT THE NUMBER OF GUESS AND FIRE
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      //CHECK TO SEE IF ALL SHIPS HAVE BEEN HIT
      if (hit && model.shipSunk === model.numShip) {
        view.displayMessage(
          "You sank all my battle shit, in " + this.guesses + " guesses"
        );
      }
    }
  }
};

//FUNCTIONS TO TEST FOR VALIDATION OF THE GUESS INPUT AND RETURN STRING VALUE OF THE GUESS INPUT
function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
  // CHECK FOR VALIDATION OF THE GUESS INPUT
  if (guess === null || guess.length !== 2) {
    alert("Oops, please enter a letter and a number on the board");
  } else {
    //IF INPUT IS VALID, GRAB EACH OF THE LETTER BY USING THE charAT() METHOD.
    var firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);

    //CHECK TO MAKE SURE THEY ARE BOTH NUMBER
    if (isNaN(row) || isNaN(column)) {
      alert("Oops! that isnt on the board.");
    } else if (
      row < 0 ||
      row >= model.boardSize ||
      column < 0 ||
      column >= model.boardSize
    ) {
      alert("Oops! that is off the board.");
    } else {
      return row + column;
    }
  }
  return null;
}

//SECOND STAGE IS GETTING THE GUESS VALUE AFTER THE CLICK, AND PASS IT TO THE CONTROLLER
function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controler.processGuess(guess);
  // RESET THE FROM INPUT AFTER EACH INPUT HAS BEEN RETRIEVED AND PASSED TO THE CONTROLLER
  guessInput.value = "";
}

//FUNCTION GET THE KEY PRESS EVENT TO FIRE
function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.onclick();
    return false;
  }
}

window.onload = init;

//THIS IS WHERE THE GAME START
//ASSIGN A FUNCTION FOR THE FIRE CLIKC BUTTON
function init() {
  var firetButton = document.getElementById("fireButton");
  firetButton.onclick = handleFireButton;

  //GETTING THE KEY PRESS EVENT(ENTER/RETURN BUTTON) TO FIRE
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;

  // GENERATE NEW LOCATATION // THE CHEAT
  model.generateShipLocations();
}
