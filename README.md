# PokerHandEvaluator
Poker Hand Evaluator Code Challenge

From command line, run "npm start".

Index.js ingests an "input.txt" file in the same location. As long as this file:
* contains lines of ten two-digit pairs (delimited by a space)
* where each pair represents a playing card
* the first five cards belongs to one player ("Black") 
* and the last five belong to the other player ("White")

then the code will evaluate each hand as a numeric value, with each rank of poker hand designated in the most significant digits and the card values themselves designated in the less significant digits.  This will allow each hand to be compared to any other hand and either the winner or a tie will be output in the console.

