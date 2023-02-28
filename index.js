//display a chess board with pieces arranged for chess960
//randomize starting positions of non-pawn pieces for white with 2 constraints
//1 there must be a bishop of each colour square
//2 the king must be between its rooks
//black's pieces are equal-and-opposite to white (white king f1 -> black king f8)
//pawns shall be placed on the second and seventh ranks as normal

//start off with displaying pieces as unicode in a table
//present first board upon page load and have prominent button to re-shuffle board
//have coords
//light and dark squares

//define piece unicode
//could also write unicode directly and not declare variables - also a readability issue
//light and dark square bishops distinguished for later validation
//same for rooks

var whitePawn = "\u2659";
var blackPawn = "\u265F";


var whiteKing = "\u2654";
var whiteQueen = "\u2655";
var whiteRookOne = "\u2656";
var whiteRookTwo = "\u2656";
var whiteLightBishop = "\u2657";
var whiteDarkBishop = "\u2657";
var whiteKnightOne = "\u2658";
var whiteKnightTwo = "\u2658";

var blackKing = "\u265A";
var blackQueen = "\u265B";
var blackRookOne = "\u265C";
var blackRookTwo = "\u265C";
var blackLightBishop = "\u265D";
var blackDarkBishop = "\u265D";
var blackKnightOne = "\u265E";
var blackKnightTwo = "\u265E";

//func to place pawns on board
function placePawns(colourPawn, selector) {
    let rankTableHeadings = document.querySelectorAll(selector);
    for (let i = 0; i < rankTableHeadings.length; i++) {
        rankTableHeadings[i].innerHTML = colourPawn;
    }
}

//fisher-yates algorithm to shuffle piece positions
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}  

//assign white piece locations 
function assignWhiteLocations(){
    //each non-pawn piece - bishops should likely have square colour specified - rooks will not have greater/lesser file specified
    const whitePieces = [whiteQueen, whiteKnightOne, whiteKnightTwo];
    //ensure there is a light and dark bishop
    const evenNumbers = [2, 4, 6, 8];
    const oddNumbers = [1, 3, 5, 7];
    shuffle(evenNumbers);
    shuffle(oddNumbers);
    const whitePieceLocations = new Map();
    whitePieceLocations.set(evenNumbers[0], whiteLightBishop);
    whitePieceLocations.set(oddNumbers[0], whiteDarkBishop);
    //take these numbers out to remove dupes
    evenNumbers.shift();
    oddNumbers.shift();
    const fileNumbers = evenNumbers.concat(oddNumbers);
    fileNumbers.sort(function(a, b){return a - b});
    //ensure king between rooks
    const largestNumbers = fileNumbers.slice(2, fileNumbers.length - 1);
    var largeRookFile = fileNumbers.indexOf(largestNumbers[Math.floor(Math.random()*largestNumbers.length)]);
    const middleNumbers = fileNumbers.slice(1, largeRookFile);
    var kingFile = fileNumbers.indexOf(middleNumbers[Math.floor(Math.random()*middleNumbers.length)])
    const smallestNumbers = fileNumbers.slice(0, kingFile);
    var smallRookFile = fileNumbers.indexOf(smallestNumbers[Math.floor(Math.random()*smallestNumbers.length)]);
    whitePieceLocations.set(fileNumbers[largeRookFile], whiteRookOne);
    whitePieceLocations.set(fileNumbers[kingFile], whiteKing);
    whitePieceLocations.set(fileNumbers[smallRookFile], whiteRookTwo);
    fileNumbers.splice(largeRookFile, 1);
    fileNumbers.splice(kingFile, 1);
    fileNumbers.splice(smallRookFile, 1);
    shuffle(whitePieces);
        for (let i = 0; i < 3; i++) {
            whitePieceLocations.set(fileNumbers[i], whitePieces[i]);
        }
    return whitePieceLocations;
}

function placeWhitePieces(){
    let whitePieceLocations = assignWhiteLocations();
    let rankTableHeadings = document.querySelectorAll("th.rankA");
    let keys = Array.from(whitePieceLocations.keys());
    let j = 0;
    for (const i of whitePieceLocations.entries()) {
        let test = keys[j] - 1;
        rankTableHeadings[test].innerHTML = whitePieceLocations.get(i[0]);
        j++;
}
    return whitePieceLocations;
}

function placeBlackPieces(){
    let blackPieceLocations = placeWhitePieces();
    let rankTableHeadings = document.querySelectorAll("th.rankH");
    let pieces = Array.from(blackPieceLocations.keys());
    let j = 0;
    for (key of blackPieceLocations.keys()){
        if (blackPieceLocations.get(key) == "\u2654") {
            blackPieceLocations.set(key, "\u265A");
        } else if (blackPieceLocations.get(key) == "\u2655"){
            blackPieceLocations.set(key, "\u265B")
        } else if (blackPieceLocations.get(key) == "\u2656"){
            blackPieceLocations.set(key, "\u265C")
        } else if (blackPieceLocations.get(key) == "\u2657"){
            blackPieceLocations.set(key, "\u265D")
        } else if (blackPieceLocations.get(key) == "\u2658"){
            blackPieceLocations.set(key, "\u265E")
        }
    }
    for (i of blackPieceLocations.entries()){
        let pieceMinusOne = pieces[j] - 1;
        rankTableHeadings[pieceMinusOne].innerHTML = blackPieceLocations.get(i[0]);
        j++;
    }

}


//func to place all pieces
function placePieces() {
    placePawns(whitePawn, "th.rankB");
    placePawns(blackPawn, "th.rankG");
    placeBlackPieces();
}

//call that actually displays everything
placePieces();