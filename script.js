/* The first line imports the initializeApp function from the Firebase App module. 
This function is responsible for initializing and configuring the Firebase app in 
your JavaScript application. It is necessary to call this function before using any
 other Firebase services or features.

The second line imports the getDatabase function from the Firebase Realtime Database module.
This function allows you to get a reference to the Firebase Realtime Database instance, 
which you can use to read from and write data to the database.
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
  remove,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// The link for the firebase database
const appSettings = {
  databaseURL:
    " https://realtime-database-747aa-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Connecting the project with firebase
const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDb = ref(database, "shoppingList");

// DOM variables
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingList = document.getElementById("shopping-list");
const clearBtn = document.getElementById("clear-button");

// Event listener for Enter key press on input field
inputFieldEl.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent the default form submission behavior
    addButtonEl.click(); // Trigger the click event of the "Add to Cart" button
  }
});

// Create the list of items and push the item to Firebase, ignore empty input field value.
addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  if (inputValue.trim() !== "") {
    // Capitalize the first letter of every list item
    shoppingList.innerHTML += `<li> ${inputValue
      .charAt(0)
      .toUpperCase()}${inputValue.slice(1).toLowerCase()} </li>`;
    // Push to Firebase Realtime Database
    push(shoppingListInDb, inputValue);
  }
  // Reset the input field to empty value after submission
  inputFieldEl.value = "";
});

// Delete items
clearBtn.addEventListener("click", function () {
  // Remove all items from the list
  shoppingList.innerHTML = "";
  // Remove all items from the Firebase database
  set(shoppingListInDb, null);
});

// Fetching the data from the database
onValue(shoppingListInDb, function (snapshot) {
  shoppingList.innerHTML = ""; // Clear the existing list
  if (snapshot.exists()) {
    // Converting the object to an array of key value pairs
    let shoppingListEntries = Object.entries(snapshot.val());

    // Looping through the array and displaying items on the screen
    for (let i = 0; i < shoppingListEntries.length; i++) {
      let [key, value] = shoppingListEntries[i];
      let formattedItem =
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      /*shoppingList.innerHTML += `<li>${formattedItem}</li>`;*/
      let listItem = document.createElement("li");
      listItem.textContent = formattedItem;
      listItem.dataset.key = key; // Set the key as a data attribute
      shoppingList.appendChild(listItem);
    }
  } else {
    console.log("No data found in the database.");
  }
});

// Event listener for clicking on list items
shoppingList.addEventListener("click", function (event) {
  // Check if the clicked element is a list item
  if (event.target.tagName === "LI") {
    // Get the text of the clicked list item
    const listItemText = event.target.innerText.trim();
    console.log(listItemText);
    const listItemKey = event.target.dataset.key;
    console.log(listItemKey);

    // Remove the list item from the screen
    event.target.remove();

    // Remove the corresponding item from the Firebase Realtime Database
    remove(ref(database, `shoppingList/${listItemKey}`));
  }
});
