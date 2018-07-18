const fs = require('fs');

const options = { encoding: 'utf8', flag: 'r' };
var filename = 'input.txt';

var Hand = [];

//define card ranks
var Ranks = [];
for (i = 2; i < 10; i++) {
    var rank = i.toString;
    Ranks.push('' + i);
}
Ranks.push('T', 'J', 'Q', 'K', 'A');

var HandName = [
    'High Card',
    'One Pair',
    'Two Pair',
    'Three of a Kind',
    'Straight',
    'Flush',
    'Full House',
    'Four of a Kind',
    'Straight Flush',
    'Royal Flush'
]

//Promise: Read input file
function readInput(input) {
    return new Promise((resolve, reject) => {
        fs.readFile(input, options, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}

//Read input file
readInput(filename)
    .then((response) => {
        //create object from data
        //create array of data from input per carriage return
        var Hands = response.split('\n');
        Hands.forEach((hand, index) => {
            if (hand.length !== 29) { //if entry has more or less than 29 characters, throw error
                err = new Error('Invalid data in input, line ' + (index + 1));
                throw err;
            }
            //create object for each player and hand with (for now) empty value
            var black_cards = hand.substring(0, 14);
            var white_cards = hand.substring(15, 29);
            Hand.push({
                'Winner': '',
                'Black': {
                    'cards': black_cards,
                    'value': 0
                },
                'White': {
                    'cards': white_cards,
                    'value': 0
                }
            });
        });
    })
    .then(() => {
        //evaluate hands
        console.log('Results: \n');
        Hand.forEach((hand, index) => {
            hand.Black.value = evaluate(hand.Black.cards);
            hand.White.value = evaluate(hand.White.cards);
            hand.Winner = (hand.Black.value > hand.White.value) ? 'Black' : 'White';
            if (hand.Black.value == hand.White.value) {
                hand.Winner = 'Tie';
            }
            console.log((hand.Winner == 'Tie') ? 'Tie.' : hand.Winner + ' wins.');
        })
        console.log('\n');
    })
    .catch((err) => {
        console.log(err);
    });

function evaluate(hand) { //hand is array of 5 two-digit values, face + suit
    //split input into array
    var cards = hand.split(' ');
    //sort cards in reverse order based on Ranks array
    cards.sort((a, b) => { return Ranks.indexOf(b[0]) - Ranks.indexOf(a[0]) });
    var total = 0;
    var handname = 0;
    var checkvalue = cards[0][0];
    //baseline hand value (turning highest to lowest card into a 10 digit value)    
    cards.forEach((card, idx) => {
        total += (parseInt(Ranks.indexOf(card[0])) + 2) * Math.pow(10, ((4 - idx) * 2));
    });
    for (var i = 1; i < cards.length; i++) {
        if (cards[i][0] == cards[i - 1][0]) {
            //one pair
            handname = 1;
            checkvalue = cards[i][0];
            if (i < 4 && cards[i][0] == cards[i + 1][0]) {
                //three of a kind
                handname = 3;
                if (i < 3 && cards[i][0] == cards[i + 2][0]) {
                    //four of a kind
                    handname = 7;
                }
            }
            if (handname < 2) {
                //check for second pair
                for (ii = i + 1; ii < cards.length - 1; ii++) {
                    if (cards[ii][0] == cards[ii + 1][0]) {
                        //two pair
                        handname = 2;
                    }
                }
            }
            break;
        }
    }
    //check for straight
    if (handname === 0 && Ranks.indexOf(cards[0][0]) == parseInt(Ranks.indexOf(cards[4][0])) + 4) {
        //straight (last card is 4 less than first card, with no duplicates)
        handname = 4;
    }
    //check for flush
    if (cards[0][1] == cards[1][1] && cards[1][1] == cards[2][1] && cards[2][1] == cards[3][1] && cards[3][1] == cards[4][1]) {
        //flush
        if (handname == 4) {
            //straight flush
            handname = 8;
            if (cards[0][0] == 'A') {
                //royal flush
                handname = 9;
            }
        } else {
            handname = 5;
        }
    }
    //check for full house
    if ((handname == 2 || handname == 3) && ((cards[0][0] == cards[2][0]) || (cards[2][0] == cards[4][0]))) {
        //full house (two pair or three of a kind where middle card matches either first or last)
        handname = 6;
        checkvalue = cards[2][0];
    }
    total += (handname * 1000000000000) + (parseInt(Ranks.indexOf(checkvalue)) + 2) * 10000000000;
    return (total);
}