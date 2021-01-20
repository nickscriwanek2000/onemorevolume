// Algorithm to use the barcode which occurs the most (better accuracy)
function order_by_occurence(arr) {
    var counts = {};
    arr.forEach(function(value) {
        if(!counts[value]){
            counts[value] = 0;
        }
        counts[value]++;
    });

    return Object.keys(counts).sort(function(curKey, nextKey) {
        return counts[curKey] < counts[nextKey];
    });
}
// Start the camerafeed and configure QuaggaJS to read EAN (ISBN) codes
Quagga.init({
    inputStream : {
      name : "Live",
      type : "LiveStream",
      target: document.querySelector('#barcode-scanner'),    // Or '#yourElement' (optional)
      constraints: {
        width: 440,
        height: 800,
        facingMode: "environment",
    }},
    decoder : {
      readers : ["ean_reader"]
    }
  }, function(err) {
      if (err) {
          console.log(err);
          return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
  });

var last_result = [];
Quagga.onDetected(function(result) {
    var last_code = result.codeResult.code;
    last_result.push(last_code);
    if (last_result.length > 20) {
        code = order_by_occurence(last_result)[0];
        last_result = [];
        Quagga.stop();
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "https://www.googleapis.com/books/v1/volumes?q=isbn="+ result.codeResult.code,
    
            success: function(data){
                console.log(data.items[0].volumeInfo);
                var mangaTitle = data.items[0].volumeInfo.title,
                    mangaMangaka = data.items[0].volumeInfo.authors,
                    mangaCover = data.items[0].volumeInfo.imageLinks.thumbnail,
                    mangaPublisher = data.items[0].volumeInfo.publisher,
                    mangaSynopsis = data.items[0].volumeInfo.description,
                    mangaPageCount = data.items[0].volumeInfo.pageCount

                document.getElementById('mangaTitle').innerHTML = mangaTitle;
                console.log(data.volumeInfo);
                var elem = document.querySelector('.modal');
                var instance = M.Modal.getInstance(elem);
                instance.open();
                // Adding Book Info to Collection page
                var btnAdd = document.getElementById('btn');
                var tryAgain = document.getElementById('tryAgain');
                var newItem = document.getElementById('newItem');
                var id = 1;

                // Quagga will reinitialize so you can retry
                tryAgain.addEventListener('click', function() {
                    Quagga.init({
                        inputStream : {
                          name : "Live",
                          type : "LiveStream",
                          target: document.querySelector('#barcode-scanner')    // Or '#yourElement' (optional)
                        },
                        decoder : {
                          readers : ["ean_reader"]
                        }
                      }, function(err) {
                          if (err) {
                              console.log(err);
                              return
                          }
                          console.log("Initialization finished. Ready to start");
                          Quagga.start();
                      });
                })
                // Adds the info in a card on the Collection Page
                btnAdd.addEventListener('click', function() {
                    const card =
                    `<div class="card medium">
                    <div class="card-image waves-effect waves-block waves-light">
                      <img class="activator" src="${mangaCover}">
                    </div>
                    <div class="card-content white">
                      <button onclick="addVolume(${window.id})" class="addVolume btn right deep-purple waves-effect waves-deep-purple waves-ripple"><i class="material-icons">library_add</i></button>
                      <span class="card-title activator grey-text text-darken-4 white">${mangaTitle}<i class="material-icons right white">more_vert</i></span>  
                      <p class="volumes white" data-cardId="${window.id}"></p>
                    </div>
                    <div class="card-reveal">
                      <span class="card-title grey-text text-darken-4 white">Synopsis<i class="material-icons right white">close</i></span>
                      <p class="flow-text white">${mangaSynopsis}</p>
                    </div>
                     <div class="card-action">
                     <a target="_blank" href="https://www.bookdepository.com/search?searchTerm=${mangaTitle}">Bookdepository</a>
                  </div>
                  </div>`
                test3.insertAdjacentHTML('beforeend', card);
                window.id++;
                })
                            }
                        })
                    }
                })