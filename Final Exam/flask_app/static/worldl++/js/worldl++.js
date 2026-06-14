// global variables
var socket;
var word_of_day;
var guess = '';
var curr_row = 1;
var curr_column = 1;
var game_over = false;
var grid_created = false;

// constant colors
const grey = "#707070";
const yellow = "#D1BC69";
const green = "#55A252";
const white = "#FFFFFF";
const black = "#000000";
const light_grey = "BABABA";

// keyboard input for guesses
document.addEventListener("keydown", keyPressed);

    $(document).ready(function(){
        socket = io.connect('http://' + document.domain + ':' + location.port + '/worldl');
        socket.on('connect', function() {
            console.log('connected')
            socket.emit('get_word', {});
        });

        socket.on('return_word', async function(data) {
            document.getElementById('word');
            word_of_day = data.word;
            console.log(word_of_day);

            if (grid_created == false){
                createGrid();
                grid_created = true;
            }
        })
    });  

    async function createGrid(){
        multiplyNode(document.querySelector('.letter_box'), word_of_day.length, true);
        multiplyNode(document.querySelector('.word_row'), word_of_day.length, true);
    }

    //https://stackoverflow.com/questions/30267973/how-to-repeat-div-element-n-times-in-html
    // creates boxes in a n x n grid
    function multiplyNode(node, count, deep) {
        for (var i = 0, copy; i < count - 1; i++) {
            copy = node.cloneNode(deep);
            node.parentNode.insertBefore(copy, node);
        }
    }

    // key input from external or site website
    function keyPressed(input){
        let letter = ''
        let regex = /^[a-zA-Z]+$/;
        // converts if keyboard input used
        if (typeof input == "object"){
            letter = input.key;
        }
        else{
            letter = input;
        }

        // different function based on key pressed
        if (letter == "enter" || letter == "Enter"){
            guessWord();
        }
        else if (letter == "back" || letter == "Backspace"){
            undoLetter();
        }
        else if(regex.test(letter) && letter.length == 1 && game_over == false){
            guessLetter(letter);
        }          
    }

    // change texts in boxes to reflect guess
    function guessLetter(letter){
        var box_text = getBox(curr_row, curr_column, true);
        box_text.innerHTML = letter.toUpperCase();
        if (curr_column <= word_of_day.length){
            curr_column += 1;
        }      
    }

    // undo letter from grid
    function undoLetter(){
        if (curr_column > 1){
            curr_column -= 1;
        } 
        box = getBox(curr_row, curr_column, true);
        box.innerHTML = '';
    }

    // submit word to guess
    async function guessWord(){
        var guess = '';
        var valid;

        // guess word only if it is the length of the word
        if (curr_column == word_of_day.length+1){
            guess = getGuess(curr_row);
            valid = validateWord(guess);

            if (valid == true){
                await checkGuess(guess, curr_row)
                curr_row += 1;
                curr_column = 1;
                updateKeyboard(guess);
            }
            else{
                alert("not a valid word")
            }

            if (guess == word_of_day){
                gameEnd(true);
            }
            else if (curr_row == word_of_day.length+1 ){
                gameEnd(false);
            }
        } 
    }

    function gameEnd(won){
        if (won == true){
            alert("GAME WON!!!!");
            game_over = true;
        }
        else{
            alert("GAME LOST :(");
        }
    }


    // check letters of guess and update accordingly
    //grey: not in word; yellow: in word, wrong spot; green: correct
    async function checkGuess(guess, row){
        let box_color = grey;
        for (let i = 1; i <= word_of_day.length; i++ ){
            // yellow if letter is in word
            if (word_of_day.includes(guess[i-1])){
                box_color = yellow;
                // green if letter is in right place
                if (word_of_day[i-1] == guess[i-1]){
                    box_color = green;
                }
            }
            // other box is grey
            else{
                box_color = grey;
            }

            // update box and font color
            let box = getBox(row, i);
            box.style.background = box_color;
            let text = getBox(row, i, true);
            text.style.color = white;
            await delay(600);
        }
    }

    //changes keyboard colors based on guess
    //grey: not in word; yellow: in word, wrong spot; green: correct
    function updateKeyboard(guess){
        let color;
        for (let i = 0; i < guess.length; i++){
            // yellow if letter is in word
            if (word_of_day.includes(guess[i])){
                color = yellow;
                // green if letter is in right place
                if (word_of_day[i] == guess[i]){
                    color = green;
                }
            }
            // other box is grey
            else{
                color = grey;
            }
            // update key color
            let key = document.getElementById(guess[i]);
            key.style.background = color;
        }
    }

    // get word to guess from boxes
    function getGuess(row){
        let word = '';
        // go through every box in row and get contents
        for (let i = 1; i <= word_of_day.length; i++ ){
            word += getBox(row, i, true).innerHTML;
        }
        return word.toLowerCase();
    }

    // return element from wordle grid
    function getBox(row, column, text=false){
        let query = '';
        if (text == true){
            query = ".word_row:nth-child(" + row  + ") .letter_box:nth-child(" + column + ") p";
        }
        else{
            query = ".word_row:nth-child(" + row  + ") .letter_box:nth-child(" + column + ")";
        }
        return document.querySelector(query);
    }

    // validates that guess is a real english word
    function validateWord(guess){
        var data_d = {"word" : guess}
        var valid;
        // SEND DATA TO SERVER VIA jQuery.ajax({})
        jQuery.ajax({
            url: "/validateword",
            data: data_d,
            type: "POST",
            async: false,
            success:function(retruned_data){
                if (retruned_data == 0){
                    valid = false;
                }
                if (retruned_data == 1){
                    valid = true;
                }

            },
        });
        return valid;
    }

    // delay for any amount of milliseconds
    function delay(milliseconds){
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }

    
    


    