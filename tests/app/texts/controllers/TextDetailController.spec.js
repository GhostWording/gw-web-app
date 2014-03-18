describe('TextDetailController', function() {

beforeEach(module('app/texts/TextDetailController'));

	var $rootScope, mocks;

	beforeEach(inject(function (_$rootScope_, $controller, $q) {
		mocks = {
			currentArea: {
				AreaId: '9876'
			},
			currentIntention: 'mockCurrentIntention',
			currentText: {
				TextId: '1234',
				IntentionId: '5678',
				Content: 'mockCurrentText'
			},
			favouritesSvc: {
				addFavourite: jasmine.createSpy()
			},
			tagLabelsSvc: {
				labelsFromStyleTagIds: jasmine.createSpy()
			},
			modal: {
				open: jasmine.createSpy()
			}
		};
		$rootScope = _$rootScope_;
		$controller('TextDetailController', {
			$scope: $rootScope,
			currentText: mocks.currentText,
			currentArea: mocks.currentArea,
			currentIntention: mocks.currentIntention,
			favouritesSvc: mocks.favouritesSvc,
			tagLabelsSvc: mocks.tagLabelsSvc,
			$modal: mocks.modal
		});
	}));

	it('should have the correct text details attached to the scope', function() {
		expect($rootScope.currentArea).toEqual({AreaId: '9876'});
		expect($rootScope.currentIntention).toEqual('mockCurrentIntention');
		expect($rootScope.currentText).toEqual({
			TextId: '1234',
			IntentionId: '5678',
			Content: 'mockCurrentText'
		});
		expect($rootScope.txt.editableText).toEqual('mockCurrentText');
	});

	it('should call the method to attach tags based on labels', function() {
		expect(mocks.tagLabelsSvc.labelsFromStyleTagIds).toHaveBeenCalled();
	});
	describe('edit', function() {
		
		it('should change edit text flag to true', function() {
			expect($rootScope.editText).toBe(false);
			$rootScope.edit();
			expect($rootScope.editText).toBe(true);
		});

	});

	describe('send', function() {

		it('shoud attach an open modal dialog to the scope', function() {
			$rootScope.send();
			expect(mocks.modal.open).toHaveBeenCalled();
		});

	});

	describe('favourite', function() {

		it('should call the add favourite method of the favourite service with the correct arguments', function() {
			$rootScope.favourite();
			expect(mocks.favouritesSvc.addFavourite).toHaveBeenCalledWith({
				favouriteText: '1234',
      	favouriteIntention: '5678',
      	favouriteArea: '9876',
      	favouriteDate: new Date()
			});

		});

	});
	

});