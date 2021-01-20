window.cardId = 1;

// Materialize Initialization
let currentId = 0;
let volumes = '';
document.addEventListener('DOMContentLoaded', function() {
	M.Tabs.init(document.querySelectorAll('.tabs'), { swipeable: true });
	var elems = document.querySelectorAll('.modal');
	var elems = document.querySelectorAll('select');
	$('.modal2').modal();
	$('.modal1').modal();
	$('select').formSelect();
	
	// Delete search results when clicking on other tabs
	var videoFeed = document.getElementById('videoFeed');
	var collection = document.getElementById('collection');
	var searchResults = document.getElementById('search-results');

	videoFeed.addEventListener('click', function() {
		while(searchResults.firstChild && searchResults.removeChild(searchResults.firstChild));
	})

	collection.addEventListener('click', function() {
		while(searchResults.firstChild && searchResults.removeChild(searchResults.firstChild));
	})		

	// Add volumes to card
	const addVolumeToCard = document.getElementById('addVolumeToCard');

	addVolumeToCard.addEventListener('click', function() {
		console.log(currentId);
		console.log(volumes);
		volumes.innerHTML = document.getElementById('volumeSelect').M_FormSelect.input.value;
		var el = document.getElementById("volumeSelect").option;
		console.log(el);

		for (var i = 0; i < el.length; i++) {
			el[i].selected = false;
		}
	})
})

// Adds volumes from checkboxes to the paragraphs in the specified card.
function addVolume(id) {
	$('.modal2').modal('open');
	currentId = id;
	volumes = document.querySelector(`.volumes[data-cardId="${currentId}"]`);
}

// SERVICE WORKER

//See if the browser supports Service Workers, if so try to register one
if("serviceWorker" in navigator){
	navigator.serviceWorker.register("sw.js").then(function(registering){
// Registration was successful
	console.log("Browser: Service Worker registration is successful with the scope",registering.scope);
	}).catch(function(error){
//The registration of the service worker failed
	console.log("Browser: Service Worker registration failed with the error",error);
	})};

//Asking for permission with the Notification API
if(typeof Notification!==typeof undefined){ //First check if the API is available in the browser
	Notification.requestPermission().then(function(result){ 
		//If accepted, then save subscriberinfo in database
		if(result==="granted"){
			console.log("Browser: User accepted receiving notifications, save as subscriber data!");
			navigator.serviceWorker.ready.then(function(serviceworker){ //When the Service Worker is ready, generate the subscription with our Serice Worker's pushManager and save it to our list
				const VAPIDPublicKey="BI8_35kccmRI80sLkSDKz5DNa_XgyXABX5W7Ut7oD0Bj20om5IgwlzdRZ8pv6mfmFT4pUYz-za8jI6Kr1jzXhCg"; // Fill in your VAPID publicKey here
				const options={applicationServerKey:VAPIDPublicKey,userVisibleOnly:true} //Option userVisibleOnly is neccesary for Chrome
				serviceworker.pushManager.subscribe(options).then((subscription)=>{
          //POST the generated subscription to our saving script (this needs to happen server-side, (client-side) JavaScript can't write files or databases)
					let subscriberFormData=new FormData();
					subscriberFormData.append("json",JSON.stringify(subscription));
					fetch("data/saveSubscription.php",{method:"POST",body:subscriberFormData});
				});
			});
		}
	}).catch((error)=>{
		console.log(error);
	});
}