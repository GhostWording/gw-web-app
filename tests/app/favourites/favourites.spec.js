describe('favouritesSvc', function() {

	beforeEach(module('app/favourites'));

	describe('isExistingFavourite', function() {
		var mockFavourites = [
			{favouriteText: 'a'},
			{favouriteText: 'b'},
			{favouriteText: 'c'}
		];

		it('should return false if current favourite does not exist in the favourites array', inject(function(favouritesSvc) {
			expect(favouritesSvc.isExistingFavourite(mockFavourites, 'favouriteText', 'd')).toEqual(false);
		}));

		it('should return true if current favourite exists in the favourites array', inject(function(favouritesSvc) {
			expect(favouritesSvc.isExistingFavourite(mockFavourites, 'favouriteText', 'a')).toEqual(true);
		}));

	});

	describe('setFavourites', function() {

		it('should set the favourites entry of localStorage with the correct argument', inject(function(favouritesSvc, localStorage) {
			var mockFavourites = [];
			spyOn(localStorage, 'set');
			favouritesSvc.setFavourites(mockFavourites);
			expect(localStorage.set).toHaveBeenCalledWith('favourites', []);
		}));

	});

	describe('addFavourite', function() {

		it('should set favourites with current item if there are no other favourites', inject(function(favouritesSvc) {
			favouritesSvc.favourites = null;
			var currentFavourite = {
				textId: 'a'
			};
			expect(favouritesSvc.favourites).toBe(null);
			favouritesSvc.addFavourite(currentFavourite);
			expect(favouritesSvc.favourites.length).toBe(1);
			expect(favouritesSvc.favourites).toEqual([{textId: 'a'}]);
		}));

		it('should add an additional favourite to the favourites array', inject(function(favouritesSvc) {
			favouritesSvc.favourites = [
				{textId: 'a'},
				{textId: 'b'}
			];
			var currentFavourite = {
				textId: 'c'
			};
			expect(favouritesSvc.favourites.length).toBe(2);
			favouritesSvc.addFavourite(currentFavourite);
			expect(favouritesSvc.favourites.length).toBe(3);
			expect(favouritesSvc.favourites[2]).toEqual({textId: 'c'});
		}));

		it('should not add an additional favourite to the favourites array if it already exists', inject(function(favouritesSvc) {
			favouritesSvc.favourites = [
				{textId: 'a'},
				{textId: 'b'}
			];
			var currentFavourite = {
				textId: 'a'
			};
			expect(favouritesSvc.favourites.length).toBe(2);
			favouritesSvc.addFavourite(currentFavourite);
			expect(favouritesSvc.favourites.length).toBe(2);
			expect(favouritesSvc.favourites[1]).toEqual({textId: 'b'});
		}));

	});

	describe('removeFavourite', function() {

		var mockFavourites, currentFavourite;
		beforeEach(function() {
			mockFavourites = [
				{textId: 'a'},
				{textId: 'b'},
				{textId: 'c'}
			];
			currentFavourite = {
				textId: 'b'
			};
		});

		it('should remove a favourite from the favourites array', inject(function(favouritesSvc) {	
			favouritesSvc.removeFavourite(mockFavourites, 'textId', currentFavourite.textId);
			expect(mockFavourites.length).toEqual(2);
			expect(mockFavourites[1].textId).toEqual('c');
		}));

		it('should not remove a favourite from the favourites array if the item does not exist', inject(function(favouritesSvc) {	
			currentFavourite = {
				textId: 'd'
			};
			favouritesSvc.removeFavourite(mockFavourites, 'textId', currentFavourite.textId);
			expect(mockFavourites.length).toEqual(3);
			expect(mockFavourites[2].textId).toEqual('c');
		}));

		it('should call the set localstorage method', inject(function(favouritesSvc) {
			spyOn(favouritesSvc, 'setFavourites');
			favouritesSvc.removeFavourite(mockFavourites, 'textId', currentFavourite.textId);
			expect(favouritesSvc.setFavourites).toHaveBeenCalledWith(mockFavourites);
		}));

	});

});