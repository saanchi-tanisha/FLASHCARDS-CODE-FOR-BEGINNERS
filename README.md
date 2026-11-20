# FLASHCARDS-CODE-FOR-BEGINNERS

## About the Project
I built this flashcard website from scratch to help beginners learn basic coding concepts in an interactive way. It is made using HTML, CSS, and JavaScript, with all the default flashcard decks stored in a `data.json` file. 

*(Note: My local workspace folder and Hackatime project are named `Basic Calculator` because I originally started testing a calculator there before pivoting halfway through to build this flashcard app.)*

## Features

-**18 Topic Decks:** Covers core programming logic, loops, HTML, CSS, JavaScript, APIs, Git, and personal notes from building the site.

-**3D Card Flip & Audio:** Click any flashcard, which flips followed by a high pitched sound effect generated using Web Audio API.

-**Create & Delete Custom Cards:** Use the Creat Flashcard Button to add your own questions to any deck and if you don't wish to store them around, just remove that certain custom flashcard using the delete button. 

*(Note: Originally formed flashcards stored under every deck and topic cannot be deleted. It is to maintain the original theme of the website.)

-**Random 5-Card Quiz:** Click the "Random 5-Card Quiz" button to test yourself with 5 shuffled questions pulled from across all decks.

## How to Use
- **Live Site:** Open [Flashcards - Code for Beginners](https://saanchi-tanisha.github.io/FLASHCARDS-CODE-FOR-BEGINNERS/) directly in your browser.
- **Run Locally:** Clone or download this repository, open the folder in VS Code, and launch `index.html` using the **OPEN ON Live Server** extension so `fetch("data.json")` loads properly.

## What I Learned
- How to pull flashcard data from a `data.json` file and show it on the webpage with JavaScript.
- How to save custom flashcards in `localStorage` so they don't disappear when I refresh the page.
- How to fix broken CSS and JS file paths when moving files around, and why `fetch()` needs Live Server instead of opening the HTML file directly.
- How to use Git commands in the terminal to commit changes and host the site live on GitHub Pages.
