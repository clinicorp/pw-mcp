const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Carrega e parseia o arquivo urls.yaml
 * @returns {Object} Objeto com as URLs mapeadas
 */
function loadUrls() {
  const urlsPath = path.join(__dirname, '..', 'urls.yaml');
  const fileContents = fs.readFileSync(urlsPath, 'utf8');
  const urls = yaml.load(fileContents);
  return urls;
}

/**
 * Obtém uma URL específica pelo nome
 * @param {string} name - Nome da URL (ex: 'login', 'lista-produtos')
 * @returns {string} URL completa
 */
function getUrl(name) {
  const urls = loadUrls();
  return urls[name];
}

module.exports = {
  loadUrls,
  getUrl,
  urls: loadUrls()
};

