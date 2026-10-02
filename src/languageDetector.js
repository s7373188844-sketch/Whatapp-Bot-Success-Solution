const TAMIL_CHARS = /[஀-௿]/;

function isTamil(text) {
  return TAMIL_CHARS.test(text);
}

function getLanguage(text) {
  return isTamil(text) ? 'ta' : 'en';
}

module.exports = { isTamil, getLanguage };
