'use strict';

var e2eUtil = require('./e2eutil');

function getEnglish() {
  browser.get('http://localhost:3000/en/area/General/recipient/none/intention/hello-fr/text');
}

function getFrench() {
  browser.get('http://localhost:3000/fr/area/General/recipient/none/intention/hello-fr/text');
}

function getFrenchClearCookies() {
  getFrench();
  browser.manage().deleteAllCookies();
  getFrench();
}

function expandFilters() {
  element(by.css('.accordion-toggle')).click();
}

describe('textlist', function() {

  // Stop the app from reporting actions
  e2eUtil.disablePostActions();

  // TextList element finder
  var textList = element.all(by.repeater('txt in filteredList'));

  it('should have the correct number of english texts with no filters', function() {
    getEnglish();
    expect(textList.count()).toEqual(79);
  });

  it('should have the correct number of french texts with no filters', function() {
    getFrench();
    expect(textList.count()).toEqual(123);
  });

  it('should have the correct number of french texts with male recipent filter', function() {
    getFrench();
    expandFilters();
    element(by.css('.filter-rg-male')).click();
    expect(textList.count()).toEqual(95);
  });

  it('should have the correct number of french texts with female recipent filter', function() {
    getFrench();
    expandFilters();
    element(by.css('.filter-rg-female')).click();
    expect(textList.count()).toEqual(103);
  });

  it('should have the correct number of french texts with mixed recipent filter', function() {
    getFrench();
    expandFilters();
    element(by.css('.filter-rg-mixed')).click();
    expect(textList.count()).toEqual(7);
  });

  it('should have the correct number of french texts with close yes filter', function() {
    getFrench();
    expandFilters();
    element(by.css('.filter-cl-yes')).click();
    expect(textList.count()).toEqual(63);
  });

  it('should have the correct number of french texts with close no filter', function() {
    getFrench();
    expandFilters();
    element(by.css('.filter-cl-no')).click();
    expect(textList.count()).toEqual(68);
  });

  it('should have the correct number of french texts with close ish filter', function() {
    getFrench();
    expandFilters();
    element(by.css('.filter-cl-ish')).click();
    expect(textList.count()).toEqual(123);
  });

  it('should have the correct number of french texts with tu filter', function() {
    getFrench();
    expandFilters();
    element(by.css('.filter-tv-tu')).click();
    expect(textList.count()).toEqual(67);
  });

  it('should have the correct number of french texts with vous filter', function() {
    getFrench();
    expandFilters();
    element(by.css('.filter-tv-vous')).click();
    expect(textList.count()).toEqual(74);
  });

  it('should have the correct number of french texts with style poetic yes filter', function() {
    getFrench();
    expandFilters();
    browser.sleep(1000);
    element(by.css('.filter-st-poetic-yes')).click();
    expect(textList.count()).toEqual(123);
  });

  it('should have the correct number of french texts with style poetic no filter', function() {
    getFrench();
    expandFilters();
    browser.sleep(1000);
    element(by.css('.filter-st-poetic-no')).click();
    expect(textList.count()).toEqual(103);
  });

  it('should have the correct number of french texts with style poetic maybe filter', function() {
    getFrench();
    expandFilters();
    browser.sleep(1000);
    element(by.css('.filter-st-poetic-maybe')).click();
    expect(textList.count()).toEqual(123);
  });

  it('should have the correct number of french texts with style imaginative yes filter', function() {
    getFrench();
    expandFilters();
    browser.sleep(1000);
    element(by.css('.filter-st-imaginative-yes')).click();
    expect(textList.count()).toEqual(123);
  });

  it('should have the correct number of french texts with style imaginative no filter', function() {
    getFrench();
    expandFilters();
    browser.sleep(1000);
    element(by.css('.filter-st-imaginative-no')).click();
    expect(textList.count()).toEqual(108);
  });

  it('should have the correct number of french texts with style imaginative maybe filter', function() {
    getFrench();
    expandFilters();
    browser.sleep(1000);
    element(by.css('.filter-st-imaginative-maybe')).click();
    expect(textList.count()).toEqual(123);
  });

  // The next two tests must be last as they set cookies

  it('should have the correct number of french texts with male user filter', function() {
    getFrenchClearCookies();
    expandFilters();
    element(by.css('.filter-ug-male')).click();
    expect(textList.count()).toEqual(108);
  });

  it('should have the correct number of french texts with female user filter', function() {
    getFrenchClearCookies();
    expandFilters();
    element(by.css('.filter-ug-female')).click();
    expect(textList.count()).toEqual(103);
  });

});
