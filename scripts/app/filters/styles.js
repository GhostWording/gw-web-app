angular.module('app/filters/styles', [])



.factory('StyleCollection', function() {
  function StyleCollection() {
    this.stylesList = [];
    this.stylesById = {};
    this.stylesByName = {};
  }
  StyleCollection.prototype.addStyle = function(style) {
    this.stylesList.push(style);
    this.stylesById[style.id] = style;
    this.stylesByName[style.name] = style;
  };
  StyleCollection.prototype.removeStyle = function(style) {
    var index = this.stylesList.indexOf(style);
    if ( index !== -1 ) {
      this.stylesList.splice(index,1);
      delete this.stylesById[style.id];
      delete this.stylesByName[style.name];
    }
  };
  StyleCollection.prototype.clear = function() {
    this.stylesList.length = 0;
    this.stylesById = {};
    this.stylesByName = {};
  };
  return StyleCollection;
})




.factory('contextsStyles', ['StyleCollection', function(StyleCollection) {
  var styles = new StyleCollection();

  styles.addStyle({ name: 'administrativeContext', id : '4A53D1', visible: true});
  styles.addStyle({ name: 'familialContext', id : '71185C', visible: true});
  styles.addStyle({ name: 'romanticContext', id : '7A55C6', visible: true});
  styles.addStyle({ name: 'datingContext', id : '37018A', visible: false});
  styles.addStyle({ name: 'coupleContext', id : 'AD9362', visible: false});
  styles.addStyle({ name: 'friendlyContext', id : 'E40677', visible: true});
  styles.addStyle({ name: 'professionalContext', id : '657D8E', visible: true});
// NEW !!!!!!!!!! Will use old one instead
// styles.addStyle({name: 'sentimentalContext', id: 'A6C9E6'});

  return styles;
}])



.factory('generalStyles', ['StyleCollection', function(StyleCollection) {
  var styles = new StyleCollection();

  styles.addStyle({name:'romantic', id:'CB38B9'});
  styles.addStyle({name:'effusive', id:'C91BCD'});
  styles.addStyle({name:'colloquial', id:'3337EE'});
  styles.addStyle({name:'racy', id:'1A2DD5'});
  styles.addStyle({name:'caustic', id:'2968CB'});
  styles.addStyle({name:'humorous', id:'43AC3B'});
  styles.addStyle({name:'eccentric', id:'57B018'});
  styles.addStyle({name:'simple', id:'FBC055'});
//styles.addStyle({name:'formal', id:'75190C'});
  styles.addStyle({name:'citation', id:'citationCode'});
  styles.addStyle({name:'imaginative', id:'8CC4E5'});
  styles.addStyle({name:'friendly', id:'5EDC19'});
  styles.addStyle({name:'poetic', id:'801BD9'});
  styles.addStyle({name:'melancholic', id:'13F241'});
}]);