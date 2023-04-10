disable("submit");

function finish() { // ... need to disable buttons
  alert(`Your score is ${unchecked_total}.`);
}

// declare global variable to store roll total
// score is total of unchecked boxes
let diceSum = 0;
let boxSum = 45;

// Add event listeners to text activating corresp chkbx
let table = document.getElementsByTagName('table');

const checkBoxes = table[0].getElementsByTagName('input');
const txt = document.getElementsByName('txt')


// loop over 9 text numbers
for(let i = 0; i < txt.length; i++) {
  // Add event listener that checks box below txt
  txt[i].addEventListener('click', function () {
    if(checkBoxes[i].checked === true) {
      checkBoxes[i].checked = false;
      return;
    }
    checkBoxes[i].checked = true;
  });
}

// check if sum of selected boxes equal to sum else alert
document.getElementById("submitBtn").addEventListener('click', submitCheckBox);


/**
    Submits user selected checkbox values if criteria met.
    Disables sumbit button and enables roll dice one.
    Alerts user if sum of selected boxes not equal to dice roll sum.
    Updates sum of enabled checkboxes after user submission.
    Resets result line.
     */

// MODIFY TO HANDLE ALERT AFTER S-UBMIT
function submitCheckBox() {
  let sum = 0;
  let boxOne = -1;
  let boxTwo = -1;
  for(let i = 0; i < checkBoxes.length; i++) {
    if (checkBoxes[i].checked) {
      sum += i + 1;
      if(boxOne === -1) {
        boxOne = i;
      }
      else {
        boxTwo = i;
      }
    }
  }

  // alert and exit function if selected boxes unequal to dice roll
  if (sum != diceSum) {
    alert("The total of the boxes you selected does not match the dice roll. Please make another selection and try again.");
    return;
  }

  // only disable and uncheck when acceptable SUBMITTED sum
  checkBoxes[boxOne].disabled = true;
  checkBoxes[boxOne].checked = false;
  // Shade txt box background
  change_background(boxOne);

  if(boxTwo != -1) {
    checkBoxes[boxTwo].disabled = true;
    checkBoxes[boxTwo].checked = false; 
    // Shade txt box background
    change_background(boxTwo);
  }
 
  // decrement sum of remaining boxes
  boxSum -= sum;

  // reset result
  document.getElementById("result").innerHTML = "";

  disable("submit");
  enable("dice");
}

/**
     Disables button per given class name.
     @param {string} The class name of element to disable
     @return {string} The result of rolling two dice.
     */
function disable(className) {
  document.getElementsByClassName(className)[0].disabled = true;
}

/**
     Enables button per given class name.
     @param {string} The class name of element to enable
     @return {string} The result of rolling two dice.
     */
function enable(className1) {
  document.getElementsByClassName(className1)[0].disabled = false;
}

/**
     Returns the result of rolling two dice.
     Here are some possible return values.
     . '1 + 2 = 3'
     . '6 + 4 = 10'
     . '3 + 5 = 8'
     . '2 + 2 = 4'
     The probability distribution of the return values
     is the same as rolling two fair dice in real life.
     @return {string} The result of rolling two dice.
     */
    function roll_dice() {
        // disable roll dice button
        disable("dice");
        // enable submit box selection button
        let r1 = Math.floor(1 + 6 * Math.random());
        // Roll single die if only 1 checkbox remains
        let checkboxDis = document.querySelectorAll('input[type="checkbox"]:disabled');
        if (checkboxDis.length == 8 || boxSum <= 6){
          return r1;
        }
        let r2 = Math.floor(1 + 6 * Math.random());
        diceSum = r1 + r2;
        return `${r1} + ${r2} = ${r1 + r2}`;
    };

// Add event handler for roll dice
let diceSect = document.getElementsByClassName("dice");

const rollButton = diceSect[0].addEventListener('click', function() {
  document.getElementById("result").innerHTML = roll_dice();
  enable("submit");
  });

// Event listener for give up button
// Send ajax POST req to write score to scores.txt
document.getElementById("quitBtn").addEventListener('click', function(){
  let ok = confirm(`Your score is ${boxSum}`);
  if(ok) {
    disable("submit");
    disable("dice");
    disable("quit");

    // User done --> post request to score.php to write score to file
    make_post_request(boxSum);
  }
});

// Function to change individual text box class
// Allows CSS to apply background color

function change_background(num) {
  let temp = String(num + 1);
  const text = document.getElementById(temp);
  text.className = "shade";
}

