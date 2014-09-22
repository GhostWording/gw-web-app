describe('TextDetailController', function() {

beforeEach(module('app/texts/TextDetailController'));

	var $rootScope, mocks;

	beforeEach(module(function($provide) {
    $provide.value('currentAreaName', 'mockCurrentArea');
		$provide.value('currentIntention', {
			IntentionId: '456',
			Label: 'mockCurrentIntention'
		});
		$provide.value('currentText', {
			TextId: '789',
			Content: 'mockCurrentText'
		});
		$provide.value('favouritesSvc', {
			addFavourite: jasmine.createSpy(),
			setFavourite: jasmine.createSpy(),
			isExisting: jasmine.createSpy()
		});
    $provide.value('currentRecipientSvc', {
      getIdOfRecipient: jasmine.createSpy()
    });
		$provide.value('$modal', {
			open: jasmine.createSpy()
		});
		$provide.value('tagLabelsSvc', {
			labelsFromStyleTagIds: jasmine.createSpy()
		});
		$provide.value('currentRecipient', {
			Id: '333'
		});
	}));

	beforeEach(inject(function (_$rootScope_, _$controller_, $q) {
		mocks = {
			modal: {
				open: jasmine.createSpy()
			}
		};
		$controller = _$controller_;
		$rootScope = _$rootScope_;
		$controller('TextDetailController', {
			$scope: $rootScope
		});
	}));

	xit('should have the correct text details attached to the scope', function() {
		expect($rootScope.currentIntention).toEqual({IntentionId: '456',Label: 'mockCurrentIntention'});
		expect($rootScope.currentText).toEqual({TextId: '789', Content: 'mockCurrentText'});
		expect($rootScope.txt.Content).toEqual('mockCurrentText');
	});

	xit('should call the method to attach tags based on labels', inject(function(tagLabelsSvc) {
		expect(tagLabelsSvc.labelsFromStyleTagIds).toHaveBeenCalled();
	}));

	xit('should attach the correct value of recipient id to the scope', inject(function(currentRecipient) {
//		expect($rootScope.recipientId).toEqual('333');
    expect($rootScope.recipientId).toEqual(undefined);

    currentRecipient = null;
		$controller('TextDetailController', {$scope: $rootScope, currentRecipient: currentRecipient});
//    expect($rootScope.recipientId).toEqual('');
		expect($rootScope.recipientId).toEqual(undefined);
	}));

	describe('edit', function() {

		xit('should change edit text flag to true', function() {
			expect($rootScope.editText).toBe(false);
			$rootScope.edit();
			expect($rootScope.editText).toBe(true);
		});

	});

	describe('send', function() {

		xit('shoud attach an open modal dialog to the scope', inject(function($modal) {
			$rootScope.send();
			expect($modal.open).toHaveBeenCalled();
		}));

	});

	describe('setFavourite', function() {

		xit('should call the set favourite method of the favourite service with the correct arguments',
			inject(function(currentText, currentAreaName, currentIntention, favouritesSvc) {

			favouritesSvc.isExisting.andReturn(true);
			$rootScope.recipientId = '123';
			$rootScope.setFavourite();
			expect(favouritesSvc.setFavourite).toHaveBeenCalledWith(currentText, currentAreaName, currentIntention, true);
		}));

	});

	describe('isFavourite', function() {

		xit('should call the isExisting method of the favourite service with the correct arguments', inject(function(currentText, favouritesSvc) {
			$rootScope.isFavourite();
			expect(favouritesSvc.isExisting).toHaveBeenCalledWith(currentText);
		}));

		xit('should equal to the value that the isExisting method returns', inject(function(favouritesSvc) {
			favouritesSvc.isExisting.andReturn(false);
			expect($rootScope.isFavourite()).toEqual(false);
			favouritesSvc.isExisting.andReturn(true);
			expect($rootScope.isFavourite()).toEqual(true);
		}));

	});

});