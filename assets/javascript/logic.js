$(document).ready(function() {

//backstretch
$(".jumbotron").backstretch("https://media.giphy.com/media/b0I9c0NXRMS1W/giphy-downsized.gif");

});


//------------------------globals----------------//
//game globals
var wins;
var losses;
var rock;
var paper;
var scissors;
var me;
var opponent;
var opponendId;
var myMove;
var moves = [''];
//firebase
var time;
var timer = 10;
var usersArray = [];
var userNode = {};
var initCalled = false;
var decrementFlag = false;
var counter = 2;
var userToken = Math.floor(Math.random()*1000000);

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAeHgUMO-OwZ6hU1xlKlDwOO5AK-DTPiUk",
  authDomain: "fir-rps-200ad.firebaseapp.com",
  databaseURL: "https://fir-rps-200ad.firebaseio.com",
  projectId: "fir-rps-200ad",
  storageBucket: "fir-rps-200ad.appspot.com",
  messagingSenderId: "938432240217"
};
firebase.initializeApp(config);
var database = firebase.database();
var myConnectionsRef = firebase.database().ref('users/count');
var movesRef = firebase.database().ref('moves');

//allow connections
myConnectionsRef.onDisconnect().set(2);
movesRef.onDisconnect().remove();

//connections count
myConnectionsRef.on('value', (snapshot) => {
  counter = snapshot.val();
  if(counter == 2){
    decrementFlag = false;
    initCalled = false;
  }
  if(counter > 0 && !decrementFlag){
    decrementFlag = true;
    counter --;
    myConnectionsRef.set(counter);
  }
  if(counter == 0 && !decrementFlag && !initCalled){
    init();
  }
});

//gameplay
movesRef.on('value', (snapshot) => {
  console.log("setting moves for gameplay...");
  moves = snapshot.val();
  console.log("moves: " + moves);

  if(counter < 1) {
    if(moves != null && moves.length == 2) {
      initCalled = false;
      console.log("checking moves...");
      let opIndex;
      let index = Math.floor(moves.indexOf(myMove)+0.5);
      console.log("Index is: " + index);

      switch(index) {
        case 0:
          opIndex = 1;
          break;
        case 1:
          opIndex = 0;
          break;
      }

      console.log("opIndex: " + opIndex);
      let opMove = moves[opIndex];
      console.log("opMoves: " + opMove);

      //conditions for moves
      //scissors
      if(myMove == 'scissors') {
        if(opMove == 'rock') {
          alert('You lost...')
        }
        if(opMove == 'paper'){
          alert('You won!')
        }
        if(opMove == 'scissors'){
          alert('You tied.')
        }
      }
      //paper
      else if(myMove == 'paper') {
        if(opMove == 'scissors'){
          alert('You lost...')
        }
        if(opMove == 'rock'){
          alert('You won!')
        }
        if(opMove == 'paper'){
          alert('You tied.')
        }
      }
      //rock
      else {
        if(opMove == 'paper'){
          alert('You lost...')
        }
        if(opMove == 'scissors'){
          alert('You won!')
        }
        if(opMove == 'rock'){
          alert('You tied.')
        }
      }

      //reset moves
      movesRef.remove();
      moves = [];

      if(!initCalled){
        init();
      }

    }
  }
});

//init game
function init() {
  console.log("initializing gameplay...");

  //elements
  rock = document.getElementsByClassName('rock');
  paper = document.getElementsByClassName('paper');
  scissors = document.getElementsByClassName('scissors');

  //click calls
  rock.onclick = playRock;
  paper.onclick = playPaper;
  scissors.onclick = playScissors;
  initCalled = true;
}


//rock play
function playRock() {
  myMove = 'rock';
  clearClicks();
  pushMove(myMove);
}

//paper play
function playPaper() {
  myMove = 'paper';
  clearClicks();
  pushMove(myMove);
}

//scissors play
function playScissors() {
  myMove = 'scissors';
  clearClicks();
  pushMove(myMove);
}

//clear clicks after turn
function clearClicks() {
  rock.onclick = '';
  paper.onclick = '';
  scissors.oncick = '';
}

//push moves to firebase
function pushMove(move) {
  if(moves == null || moves.length == 0){
    moves = [move];
  }
  else {
    moves.push(move);
  }
  let obj = {};
  obj['moves'] = moves;
  database.ref().set(obj);
}

function count() {
  if(timer == 0){
    initCalled = false;
    clearInterval(time);
    playScissors();
  }
  else {
    timer --;
    document.getElementById('timer').textContent = "Time Remaining: " + timer;
  }
}
