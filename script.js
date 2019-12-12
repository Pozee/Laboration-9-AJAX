const apiUrl = "https://forverkliga.se/JavaScript/api/crud.php";
let userKey = "q7mLw"; // Använder den här nyckeln om inget annat anges.
//s7kbs

window.addEventListener("load", () => { // Load
  let genKey = document.querySelector("#gen-key")
  genKey.addEventListener("click", event => { // Genererar en API nyckel när någon trycker på knappen.
    fetch(apiUrl + "?requestKey")
      .then(response => response.json())
      .then(data => {
        let showKey = document.querySelector("#show-key");
        showKey.innerHTML = data.key;
      });
  })

  let login = document.querySelector("#login-btn") // Uppdaterar värdet i variablen userKey till det som står i text fältet.
  login.addEventListener("click", event => {
    let showKey = document.querySelector("#show-key");
    let keyValue = document.querySelector("#key-value").value;
    userKey = keyValue;
    document.querySelector("#login-status").innerHTML = "Du är nu inloggad!";
    document.querySelector("#login-status").style.color="green";
    getData(userKey , 5);
  })

  let saveBook = document.querySelector("#save-book") // Hanterar det som händer när man trycker på lägg till bok knapppen.
  saveBook.addEventListener("click", event => {
    let title = document.querySelector("#boktitel").value
    let author = document.querySelector("#författare").value
    addData(title, author, userKey)
    getData(userKey, 5)
  })

  let getBooks = document.querySelector("#get-book") // Hanterar det som händer när man trycker på Hämta böcker knappen.
  getBooks.addEventListener("click", event => {
    getData(userKey, 5)
  })

}); // Load end


function addData(title, author, key) { // Funktion för att spara vår bok till servern.
  let url = `${apiUrl}?key=${key}&title=${title}&author=${author}&+op=insert&please`; //Lägger ihop en url med key och operation och variablarna för att skicka med title och author.
  fetch(url) // Skickar vår url till servern och tar sedan hand om svaret.
    .then(response => response.json())
    .then(data => {
      let laTillBok = document.querySelector("#la-till-bok")
      laTillBok.innerHTML = "Boken är tillagd!";
      document.querySelector("#boktitel").value = "" // Tömmer text fälten efter att vi har lagt till vår bok.
      document.querySelector("#författare").value = "" // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    });
}

function getData(key, triesLeft) { // Funktion för att hämta alla böcker som tillhör nyckeln.
  let url = `${apiUrl}?key=${key}&op=select`; // Lägger ihop en url med key och operation.
  let bookList = document.querySelector("#bok-lista");
  fetch(url) // Skickar vår url till servern och tar sedan hand om svaret.
    .then(response => response.json())
    .then(books => {
      if (books.status === "success") { // Kollar om vi lyckades hämta alla böcker.
        let getBookStatus = document.querySelector("#get-book-status");
        getBookStatus.innerHTML = "Lyckades hämta data från API. "+"(Försök kvar: "+triesLeft+"/5)";
        getBookStatus.style.color = "green";
        books.data.forEach(element => { // Loopar igenom vår array och lägger title och author i en ny li.
          let bookElement = document.createElement("li")
          bookElement.innerHTML = element.title + " av " + element.author + ".";
          bookList.appendChild(bookElement);
        });
      } else if (books.status === "error") { // Får vi tillbaka ett error hamnar vi här.
        let errorWrapper = document.querySelector(".error-wrapper")
        let errorMessage = document.createElement("p")
        errorMessage.innerHTML = books.message;
        errorWrapper.appendChild(errorMessage)
        let getBookStatus = document.querySelector("#get-book-status");
        getBookStatus.innerHTML = "API error. " +  books.message + " , försök kvar (" + triesLeft +"/5)";
        getBookStatus.style.color = "red";
        if(triesLeft >= 1) 
          getData(key, triesLeft-1)
        }
    })
    bookList.innerHTML = "";
}

   