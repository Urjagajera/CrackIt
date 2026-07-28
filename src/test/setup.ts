import '@testing-library/jest-dom';

// Mock scrollIntoView for jsdom environment
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
