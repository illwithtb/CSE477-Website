//variables
//constant variables
const piano = document.querySelector(".piano");
const white_key_letters = document.querySelector(".piano-white-key-letters");
const black_key_letters = document.querySelector(".piano-black-key-letters");
const great_old_one = document.querySelector(".the-great-old-one");
const text = document.querySelector(".piano-text p");

const secret_code = "weseeyou"
const a_key = document.getElementById("key-a");
const s_key = document.getElementById("key-s");
const d_key = document.getElementById("key-d");
const f_key = document.getElementById("key-f");
const g_key = document.getElementById("key-g");
const h_key = document.getElementById("key-h");
const j_key = document.getElementById("key-j");
const k_key = document.getElementById("key-k");
const l_key = document.getElementById("key-l");
const semi_col_key = document.getElementById("key-;");
const w_key = document.getElementById("key-w");
const e_key = document.getElementById("key-e");
const t_key = document.getElementById("key-t");
const y_key = document.getElementById("key-y");
const u_key = document.getElementById("key-u");
const o_key = document.getElementById("key-o");
const p_key = document.getElementById("key-p");

const sound = {65:"http://carolinegabriel.com/demo/js-keyboard/sounds/040.wav",
                87:"http://carolinegabriel.com/demo/js-keyboard/sounds/041.wav",
                83:"http://carolinegabriel.com/demo/js-keyboard/sounds/042.wav",
                69:"http://carolinegabriel.com/demo/js-keyboard/sounds/043.wav",
                68:"http://carolinegabriel.com/demo/js-keyboard/sounds/044.wav",
                70:"http://carolinegabriel.com/demo/js-keyboard/sounds/045.wav",
                84:"http://carolinegabriel.com/demo/js-keyboard/sounds/046.wav",
                71:"http://carolinegabriel.com/demo/js-keyboard/sounds/047.wav",
                89:"http://carolinegabriel.com/demo/js-keyboard/sounds/048.wav",
                72:"http://carolinegabriel.com/demo/js-keyboard/sounds/049.wav",
                85:"http://carolinegabriel.com/demo/js-keyboard/sounds/050.wav",
                74:"http://carolinegabriel.com/demo/js-keyboard/sounds/051.wav",
                75:"http://carolinegabriel.com/demo/js-keyboard/sounds/052.wav",
                79:"http://carolinegabriel.com/demo/js-keyboard/sounds/053.wav",
                76:"http://carolinegabriel.com/demo/js-keyboard/sounds/054.wav",
                80:"http://carolinegabriel.com/demo/js-keyboard/sounds/055.wav",
                186:"http://carolinegabriel.com/demo/js-keyboard/sounds/056.wav",
				59: "http://carolinegabriel.com/demo/js-keyboard/sounds/056.wav"};

const creepy_audio = "https://orangefreesounds.com/wp-content/uploads/2020/09/Creepy-piano-sound-effect.mp3?_=1";
const pressed_key_color = "#963E3E";

//global variables
var inputs = "";
var summoned = false;

// show corresponding keyboard keys when piano hovered over
piano.addEventListener("mouseover", showKeys);
piano.addEventListener("mouseleave", hideKeys);

// piano plays according to button presses
document.addEventListener("keydown", keyPressed);

// piano keyboard letters appear
function showKeys(){
	white_key_letters.style.opacity = '1';
	black_key_letters.style.opacity = '1';
}

// piano keyboard letters disapear
function hideKeys(){
	white_key_letters.style.opacity = '0';
	black_key_letters.style.opacity = '0';
}

// deals with keys pressed
// e: key pressed
function keyPressed(e){
	//variables
	let key = 0;
	let orignal_color = "#FFF";

	// checks if the great one is has not been summoned
	if (!summoned){
		// checks if button pressed corrolates to keyboard
		if (e.keyCode == 65){
			key = a_key	
			inputs = "";
		}else if (e.keyCode == 83){
			key = s_key;
			inputs += "s";
		}else if (e.keyCode == 68){
			key = d_key;
			inputs = "";
		}else if (e.keyCode == 70){
			key = f_key;
			inputs = "";
		}else if (e.keyCode == 71){
			key = g_key;
			inputs = "";
		}else if (e.keyCode == 72){
			key = h_key;
			inputs = "";
		}else if (e.keyCode == 74){
			key = j_key;
			inputs = "";
		}else if (e.keyCode == 75){
			key = k_key;
			inputs = "";
		}else if (e.keyCode == 76){
			key = l_key;
			inputs = "";
		}else if (e.keyCode == 59 || e.keyCode == 186){ //; is has a different key for different browsers
			key = semi_col_key;
			inputs = "";
		}else if (e.keyCode == 87){
			key = w_key;
			inputs += "w";
		}else if (e.keyCode == 69){
			key = e_key;
			inputs += "e";
		}else if (e.keyCode == 84){
			key = t_key;
			inputs = "";
		}else if (e.keyCode == 89){
			key = y_key;
			inputs += "y";
		}else if (e.keyCode == 85){
			key = u_key;
			inputs += "u";
		}else if (e.keyCode == 79){
			key = o_key;
			inputs += "o";
		}else if (e.keyCode == 80){
			key = p_key;
			inputs = "";
		}

		// Play note corresponding to key pressed
		let note = new Audio(sound[e.keyCode]);
		note.play();

		// change key color
		orignal_color = key.style.backgroundColor; //save original color
		key.style.backgroundColor = pressed_key_color; // sets new color
		setTimeout(function() {key.style.backgroundColor = orignal_color}, 200); // changes color back after .2 seconds

		// checks if secrect code has been inputted
		if(inputs.includes(secret_code)){
			summonGreatOldOne();
		}
	}
}

// Actions to do when the great one is summoned
const summonGreatOldOne = function(){
	// sets global var to true
	summoned = true;

	// plays creepy audio
	let spooky_sound = new Audio(creepy_audio);
	spooky_sound.play();

	// picture slowly appears
	great_old_one.style.opacity = 1;
	
	// change text
	text.innerHTML = "I have awoken.";
}