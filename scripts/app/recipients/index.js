angular.module('app/recipients', [
  'app/recipients/currentRecipient',
	'app/recipients/recipientTypes',
  'app/recipients/recipientTypeHelperSvc',
	'app/recipients/likelyIntentionsForRecipientTypes',
	'app/recipients/subscribedRecipientTypes',
  'app/recipients/SelecteSingleRecipientTypeController',
  'app/recipients/SubscribedRecipientTypesController'
]);