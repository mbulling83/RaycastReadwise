# Raycast Readwise
This extension enables you to access all your Readwise highlights from Raycast.

## Getting started
We're still in dev mode right now, so you'll need to [Create an Extension in Raycast](https://developers.raycast.com/basics/create-your-first-extension) and then clone this repo into that folder to make it work. 

After you've cloned this repo successfully, you then need to build the extension. First, make sure that you have node installed - [directions are here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

Once you have node installed, run "npm install && npm run dev" in the folder where the extension is. Note that you need to keep the terminal running where you make this command otherwise the extension will disappear from your Raycast.

The next time that you open Raycast, you should see three options at the top of your list: Readwise Books, Readwise Articles and Readwise Highlights.

After you've selected one of them, you should be asked for your Readwise Access Token - this is a one time thing and is stored in your local preferences for making requests to the Readwise API. 

Use cmd+k to then see all the things that you do to explore your books, highlights and articles. 

## On the roadmap

- [ ] Refactor the code to reduce duplication
<<<<<<< HEAD
- [ ] See the tags for a book or highlight-_
=======
- [ ] See the tags for a book or highlight
>>>>>>> 2031c7deaff7a59e6817528f22726c522d9dc192
- [ ] Add notes to highlights 
- [ ] Add tags to highlights

