// IIFE wrap
(function(){
	var repository = [];
	var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=42';

	// starts with making an API request
	makeRequest(apiUrl, loadList);

	function makeRequest(url, callback) {
		$.ajax(url, { dataType: 'json' }).fail(function(){
			console.log('The request failed (maybe you are offline?)');
		}).then(function (response) {
			callback(response);
		});
	}

	//fetch pokemon data from API and loop it in a json 'pokemon' object
	function loadList(responseFromAPI) {
		responseFromAPI.results.forEach(function(item) {
			var data = {
				name: item.name,
				detailsUrl: item.url
			};
			// Adds the retrieved data to the Repository
			add(data);
		});

		// Populates the DOM with the loaded list
		getAll().forEach(function (item, index) {
			addListItem(item, index);
		});
	}


	//returns an array of values being pushed by the 'add()' function
	function getAll(){
		return repository;
	}

	// pushes any values from 'loadList' function to the 'repository' array
	function add(item){
		return repository.push(item);
	}

	//builds list of pokemon and append it to DOM
	function addListItem(item, index){

		// Creates appends and give class to the list 'poke-list'
		var $newListItem = $('<li class = "poke-list__item"> </li>');
		$('.item-list').append($newListItem);

		// Creates and appends the button to 'list item' and adds event listener on button that shows pokemon's detail in the modal
		var $pokemonInfoButton = $('<button class = "poke-list__button" id = "'+String(index)+'"> '+item['name']+' </button>');
		$('.poke-list__item:last-child').append($pokemonInfoButton).on('click', function(e){
			showDetails(e.target.id);
		});
	}

	//  response of '$pokemonInfoButton' event
	function showDetails(item) {
		var requestUrl = getAll()[item].detailsUrl;
		makeRequest(requestUrl, createModalWithDetails);
	}

	// creates Modal
	function createModalWithDetails(responseFromAPI) {
		var item = loadDetails(responseFromAPI);

		showModal(item);

		var modalImg = $('<div class = "modal-img"> <img src = "' + String(item.imageUrl) + '" alt = "an image of ' + String(item.name) +' " > </div>');
		$('.modal').append(modalImg);
	}

	// from 'pokemon' object fetches details: img, height and type
	function loadDetails(details) {
		// id is the same as position in array[index] + 1
		var item = getAll()[details.id - 1];
		item.imageUrl = details.sprites.front_default;
		item.height = details.height;
		item.weight = details.weight;
		// array that holds pokemon type names, iterates if there is more than one type
		item.type =[];
		details.types.forEach(function(e){
			item.type.push(' ' + e.type.name);
			return item.type;
		});

		return item;
	}

	// fires event that show modal with information
	function showModal(item) {

		$('#modal-container').html('');

		var modal = $('<div class = "modal"> <button class = "modal-close">Close</button> <h2>' + item.name + '</h2> <p>' + 'Height: '+ String(item.height) +' Decimetres <br> Weight: '+ String(item.weight)+' Hectograms <br> Type: '+ String(item.type) + ' </p> </div>');

		$('#modal-container').addClass('is-visible').append(modal);
		$('.modal-close').on('click',function(){
			hideModal(true);
		});

		// Code for closing modals with 'Esc' or clicking outside the modal
		$(window).on('keydown', function(e) {
			// var $modalContainer = document.querySelector('#modal-container');
			if (e.key === 'Escape' && $('#modal-container').hasClass('is-visible')) {
				hideModal(true);
			}
		});

		$(window).on('click', function(e) {
			if (e.target!== $('#modal-container')) {
				hideModal(true);
			}
		});
	}

	function hideModal(resolveOrReject=null) {
		$('#modal-container').removeClass('is-visible');
		if (typeof(resolveOrReject) === 'function') {
			resolveOrReject();
		}
	}
	// returning all functions values occur inside the IFEE scope
	return {
		getAll: getAll,
		add: add,
		addListItem: addListItem,
		loadList: loadList,
		loadDetails: loadDetails,
		showDetails: showDetails,
		makeRequest: makeRequest,
		showModal: showModal,
		hideModal: hideModal,
	};

}) ();//IIFE wrap
