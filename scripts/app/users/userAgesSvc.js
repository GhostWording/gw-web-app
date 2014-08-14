angular.module('app/users/userAges', [])
.value('userAges', {
  under18: 'under18',
  between18and39: 'between18and39',
  between40and64: 'between40and64',
  from65ToInfinity: 'from65ToInfinity'
});
