describe('TextDetailController', function() {

beforeEach(module('app/texts/TextDetailController'));

	var $rootScope, mocks;

	beforeEach(inject(function (_$rootScope_, $controller, $q) {
		mocks = {
			currentArea: {
				AreaId: '123',
				Name: 'mockCurrentArea'
			},
			currentIntention: {
				IntentionId: '456',
				Label: 'mockCurrentIntention'
			},
			currentText: {
				TextId: '789',
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
		expect($rootScope.currentArea).toEqual({AreaId: '123', Name: 'mockCurrentArea'});
		expect($rootScope.currentIntention).toEqual({IntentionId: '456',Label: 'mockCurrentIntention'});
		expect($rootScope.currentText).toEqual({TextId: '789', Content: 'mockCurrentText'});
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
				textId: '789',
	      intentionId: '456',
	      areaId: '123',
	      favouriteText: 'mockCurrentText',
	      favouriteIntention: 'mockCurrentIntention',
	      favouriteArea: 'mockCurrentArea',
	      favouriteDate: new Date()
			});

		});

	});
	

});