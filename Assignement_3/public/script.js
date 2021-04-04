// variable we will use to refer to movie
let current_movie = 'Fight Club'; // we will always start with this movie
let movie_id = -1; // movie id in the database
let movie_use = [550]; // list of all movie id already use, start with the id of our first film

// variable we will use to refer to a person
let current_person = ''; // name of the person
let person_id = -1; // id of the person
let list_movie_id = []; // list of movie's ids related to this person
let person_use = []; // list of all person already use in this session

// variable we use to check if the answer is already use or not
var already_in = new Boolean("false")
// variable we use to check if the answer is correct
var PPC = new Boolean("true");
// div we use to display what we want to display
let text_area = document.getElementById('area');
// number of correct answer so far
let index = 0;

// function that start the game of CineGuesseur, we first start by using a movie
function Start() {
    console.log("Here we go !")
    document.getElementById("start_button").style.visibility = "hidden";
    SearchMovie()
}

// function that will return a variable we can use to display the information we want (img, title, rd)
function SearchMovie() {
    let url = "https://api.themoviedb.org/3/search/movie?api_key=58f802e1c4ab785df2171fb8421447ba&query=" + current_movie ;
    console.log(url);
    data = ''
    fetch(url).then(res => {
        return res.json()
      }).then(data => {
        console.log('We got the data !');
        console.log(data);
        movie_id = data.results[0].id
        InsertIntoHTMLMovie(data)
        RespondToMovie()

      }).catch(error => {
        console.log('Something went wrong.');
        console.log(error)
      });
}


// function that will display the result of the search when answering a movie
function InsertIntoHTMLMovie(data) {
    text_area.innerHTML += "<p>Let's play with :</p>"
    // we want to show the first result of the query
    // console.log('Display movie : ' + data.results[0].original_title + " " + data.results[0].release_date)
    text_area.innerHTML += '<h2><a>' + data.results[0].original_title + " " + data.results[0].release_date + '</a></h2>'
    // https://image.tmdb.org/t/p/original/[poster_path] to get the image
    text_area.innerHTML += "<p><img src=https://image.tmdb.org/t/p/original" + data.results[0].poster_path + " width='30%'></p>"
}


// function that will ask for an answer, will display bar and valid button
function RespondToMovie() {
    console.log("We want an answer")
    text_area.innerHTML += "<p>Enter the name of a person (actor or director) who is link to this movie :</p>"
    text_area.innerHTML += `<input type='search' id ='answer_bar_${index}'> <button id='answer_${index}' onclick='GetRespondToMovie()'>Valid</button>`
}

// function that will get the answer of the user
function GetRespondToMovie() {
    let answer_to_movie = document.getElementById(`answer_bar_${index}`).value
    current_person = answer_to_movie
    console.log(`Answer number ${index} to the movie ` + current_movie + " --> " + answer_to_movie)
    let url = "https://api.themoviedb.org/3/search/person?api_key=58f802e1c4ab785df2171fb8421447ba&query=" + answer_to_movie ;
    console.log(url);
    data = ''
    fetch(url).then(res => {
        return res.json()
      }).then(data => {
        console.log('We got the data !');
        console.log(data);
        person_id = data.results[0].id
        console.log("The id of " + current_person + " is " + person_id);
        GetListOfMovieCast()
      }).catch(error => {
        console.log('Something went wrong.');
        console.log(error)
        DisplayGameOver()
      });
}

function GetListOfMovieCast() {
    list_movie_id = []
    let url = "https://api.themoviedb.org/3/person/" + person_id + "/movie_credits?api_key=58f802e1c4ab785df2171fb8421447ba&query=";
    fetch(url).then(res => {
        return res.json()
      }).then(data => {
        console.log('We got the data !');
        console.log(data);
        for(i=0; i < data.cast.length; i++) {
            list_movie_id.push(data.cast[i].id)
        }
        CheckRespondToMovie()

      }).catch(error => {
        console.log('Something went wrong.');
        console.log(error)
      });
      
}


// here we want to see check if the actor play in the movie, for that we will use the id of the movie
function CheckRespondToMovie() {
    // console.log("Here is the result" + data)
    // console.log(data.results)
    console.log(list_movie_id)
    console.log(movie_id)
    PPC = false
    already_in = false
    for (i=0; i < list_movie_id.length; i++) {
        if (movie_id == list_movie_id[i] && !PPC) {
            PPC = true
            console.log(movie_id, list_movie_id[i], PPC)
        }
    }

    if(person_use.includes(person_id)) {
        already_in = true
    }

    if (!PPC) {
        DisplayGameOver()
    }
    else if (already_in) {
        DisplayAlreadyIn()
    }
    else if (PPC)
    {
        console.log("Good job !")
        document.getElementById(`answer_bar_${index}`).style.visibility = "hidden"
        document.getElementById(`answer_${index}`).style.visibility = "hidden"
        index += 1
        person_use.push(person_id)
        console.log("person_use " + person_use)
        DisplayGoodJobMessage()
        SearchPerson()
    }

}

function SearchPerson() {
    let url = "https://api.themoviedb.org/3/search/person?api_key=58f802e1c4ab785df2171fb8421447ba&query=" + current_person ;
    console.log(url);
    data = ''
    fetch(url).then(res => {
        return res.json()
      }).then(data => {
        console.log('We got the data !');
        console.log(data);
        InsertIntoHTMLPerson(data)
        RespondToPerson()

      }).catch(error => {
        console.log('Something went wrong.');
        console.log(error)
      });
}


// function taht will display the result of the search
function InsertIntoHTMLPerson(data) {
    text_area.innerHTML += "<p>Let's play with :</p>"
    // we want to show the first result of the query
    // console.log('Display movie : ' + data.results[0].original_title + " " + data.results[0].release_date)
    text_area.innerHTML += '<h2><a>' + data.results[0].name + " " + data.results[0].known_for_department + '</a></h2>'
    // https://image.tmdb.org/t/p/original/[poster_path] to get the image
    text_area.innerHTML += "<p><img src=https://image.tmdb.org/t/p/original" + data.results[0].profile_path + " width='30%'></p>"
}


// function that will ask for an answer and check it
function RespondToPerson() {
    console.log("We want an answer")
    text_area.innerHTML += "<p>Enter the name of a movie related to this person :</p>"
    text_area.innerHTML += `<input class='inputbar' type='search' id ='answer_bar_${index}'> <button class='buttonInput' id='answer_${index}' onclick='GetRespondToActor()'>Valid</button>`
}

function GetRespondToActor() {
    let answer_to_actor = document.getElementById(`answer_bar_${index}`).value
    current_movie = answer_to_actor
    console.log(`Answer number ${index} to the actor ` + current_person + " --> " + answer_to_actor)
    let url = "https://api.themoviedb.org/3/search/movie?api_key=58f802e1c4ab785df2171fb8421447ba&query=" + answer_to_actor ;
    console.log(url);
    data = ''
    fetch(url).then(res => {
        return res.json()
      }).then(data => {
        console.log('We got the data !');
        console.log(data);
        movie_id = data.results[0].id
        CheckRespondToActor()

      }).catch(error => {
        console.log('Something went wrong.');
        console.log(error)
        DisplayGameOver(text_area)
      });
}

function CheckRespondToActor() {
    // console.log("Here is the result" + data)
    // console.log(data.results)
    // console.log("know for" + data.results[i].known_for)
    PPC = false
    already_in = false
    for (i=0; i < list_movie_id.length; i++) {
        if (movie_id === list_movie_id[i] && !PPC) {
            PPC = true
            console.log(movie_id, list_movie_id[i], PPC)
        }
    }

    if(movie_use.includes(movie_id)) {
        already_in = true
    }

    if (!PPC) {
        DisplayGameOver()
    }
    else if (already_in) {
        DisplayAlreadyIn()
    }
    else if (PPC && !already_in)
    {
        console.log("Good job !")
        document.getElementById(`answer_bar_${index}`).style.visibility = "hidden"
        document.getElementById(`answer_${index}`).style.visibility = "hidden"
        index += 1
        movie_use.push(movie_id)
        console.log("movie_use " + movie_use)
        DisplayGoodJobMessage()
        SearchMovie()
    }
}


// display a line when correct answer
function DisplayGoodJobMessage() {
    text_area.innerHTML += (`<p>Correct, guess number ${index}.</p>`)
}

// display the end of the game and the result of this round
function DisplayGameOver() {
    text_area.innerHTML += (`<p class="red_message">WRONG one, try with another proposition !</p>`)
}

// display the end of the game and the result of this round
function DisplayAlreadyIn() {
    text_area.innerHTML += (`<p class="red_message">Already use, try with another proposition !</p>`)
}
