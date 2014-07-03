angular.module('app/filters/styles', [])


// A collection of styles, which can be accessed by index, id or name
.factory('StyleCollection', function() {
  function StyleCollection() {
    this.stylesList = [];
    this.stylesById = {};
    this.stylesByName = {};
  }
  StyleCollection.prototype.addStyle = function(style) {
    if ( this.stylesById[style.id] ) {
      console.log(style.name + " already there !!!!!!!!!!!!!!!!!!!");
      return;
    }
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

  // Creates a new style collection with all styles that intersect idCollection
  StyleCollection.prototype.filterStyles = function(idCollection) {
    var that = this;
    var filteredStyles = new StyleCollection();
    angular.forEach(idCollection, function(id) {
      var style = that.stylesById[id];
      if ( style ) {
        filteredStyles.addStyle(style);
      }
    });
    return filteredStyles;
  };

  // Creates a new style collection with all styles that intersect idCollection
  StyleCollection.prototype.filterIds = function(idCollection) {
    var that = this;
    var filteredIds = [];
    angular.forEach(idCollection, function(id) {
      var style = that.stylesById[id];
      if ( style ) {
        filteredIds.push(id);
      }
    });
    return filteredIds;
  };


  return StyleCollection;
})


// The standard set of "context" styles to match against
.factory('contextStyles', ['StyleCollection', function(StyleCollection) {
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


// The standard set of general styles that can go in the preferred or excluded filters
.factory('generalStyles', ['StyleCollection', function(StyleCollection) {
  var styles = new StyleCollection();

  styles.addStyle({name:'humorous', id:'43AC3B', visible: true});
  styles.addStyle({name:'romantic', id:'CB38B9', visible: false});
  styles.addStyle({name:'effusive', id:'C91BCD', visible: false});
  styles.addStyle({name:'colloquial', id:'3337EE', visible: true});
  styles.addStyle({name:'racy', id:'1A2DD5', visible: false});
  styles.addStyle({name:'caustic', id:'2968CB', visible: false});
	styles.addStyle({name:'poetic', id:'801BD9', visible: true});
	styles.addStyle({name:'eccentric', id:'57B018', visible: false});
  styles.addStyle({name:'simple', id:'FBC055', visible: false});
//styles.addStyle({name:'formal', id:'75190C', visible: false});
  styles.addStyle({name:'imaginative', id:'8CC4E5', visible: true});
  styles.addStyle({name:'melancholic', id:'13F241', visible: false});
//  styles.addStyle({name:'friendly', id:'5EDC19', visible: false});
	styles.addStyle({name:'warm', id:'5EDC19', visible: false});
//  styles.addStyle({name:'citation', id:'citationCode', visible: true}); // BA46D4
  styles.addStyle({name:'citation', id:'BA46D4', visible: true});

  return styles;
}]);