const base_url = "https://api.jikan.moe/v3";

function searchManga(event) {

    event.preventDefault();

    const form = new FormData(this);
    const query = form.get("search");

    fetch(`${base_url}/search/manga?q=${query}&page=1`)
        .then(res => res.json())
        .then(updateDom)
        .catch(err => console.warn(err.message));
}

function updateDom(data) {

    const searchResults = document.getElementById('search-results');

    const mangaByCategories = data.results
        .reduce((acc, manga) => {

            const {
                type
            } = manga;
            if (acc[type] === undefined) acc[type] = [];
            acc[type].push(manga);
            return acc;

        }, {});

    searchResults.innerHTML = Object.keys(mangaByCategories).map(key => {

        const mangasHTML = mangaByCategories[key]
            .sort((a, b) => a.episodes - b.episodes)
            .map(manga => {
                return `
                    <div class="card white">
                        <div class="card-image">
                            <img src="${manga.image_url}">
                        </div>
                        <div class="card-content white">
                            <span class="card-title white">${manga.title}</span>
                            <p class="white">${manga.synopsis}</p>
                        </div>
                        <div class="card-action">
                            <button onclick="addToCollection(${manga.mal_id})" class="btn">Add</button>
                        </div>
                    </div>
                `
            }).join("");


        return `
                <section>
                    <h3>${key.toUpperCase()}</h3>
                    <div class="kemicofa-row">${mangasHTML}</div>
                </section>
            `
    }).join("");
}

// Adds the info in a card on the Collection Page
async function addToCollection(id) {
     const bookData = await fetch(`${base_url}/manga/${id}`)
        .then(res => res.json())
        .catch(err => console.warn(err.message));
    console.log(bookData);
    return addCard(bookData);
}

function addCard(data) {
    const collectionCard = `<div class="card medium">
        <div class="card-image waves-effect waves-block waves-light">
          <img class="activator" src="${data.image_url}">
        </div>
        <div class="card-content white">
          <button onclick="addVolume(${window.id})" class="addVolume btn right deep-purple waves-effect waves-deep-purple waves-ripple"><i class="material-icons">library_add</i></button>
          <span class="card-title activator grey-text text-darken-4 white">${data.title}<i class="material-icons right white">more_vert</i></span>  
          <p class="volumes white" data-cardId="${window.id}"></p>
        </div>
        <div class="card-reveal">
          <span class="card-title grey-text text-darken-4 white">Synopsis<i class="material-icons right white">close</i></span>
          <p class="flow-text white">${data.synopsis}</p>
        </div>
         <div class="card-action">
         <a target="_blank" href="https://www.bookdepository.com/search?searchTerm=${data.title}">Bookdepository</a>
      </div>
      </div>`;
      window.id++;
      test3.insertAdjacentHTML('beforeend', collectionCard);
}

function pageLoaded() {
    const form = document.getElementById('search_form');
    form.addEventListener("submit", searchManga);

//     addToCollection.addEventListener('click', function () {
//         const collectionCard = `<div class="card small">
//     <div class="card-image waves-effect waves-block waves-light">
//     <img class="activator" src="${manga.image_url}">
//     </div>
//     <div class="card-content white">
//     <button class="btn right deep-purple darken-4"><i class="material-icons">library_add</i></button>
//     <span class="card-title activator grey-text text-darken-4">${manga.title}<i class="material-icons right">more_vert</i></span>      
//     </div>
//     <div class="card-reveal">
//     <span class="card-title grey-text text-darken-4">Synopsis<i class="material-icons right">close</i></span>
//     <p class="flow-text white">${manga.synopsis}</p>
//     </div>
//     <div class="card-action">
//     <a target="_blank" href="https://www.bookdepository.com/search?searchTerm=${manga.title}">Bookdepository</a>
// </div>`
//         test3.insertAdjacentHTML('beforeend', collectionCard);
//     })
}


window.addEventListener("load", pageLoaded);