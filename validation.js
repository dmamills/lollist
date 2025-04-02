const { userExists } = require('./listService');
const { sendError } = require('./utils');
const isValidGitHubLink = (url) => /^https?:\/\/(www\.)?github\.com\/[\w-]+(\/[\w-]+)?(\/.*)?$/.test(url);
const areAllGitHubLinks = (arr) => arr.every(isValidGitHubLink);

const validateNameInRequest = (req, res, next) => {
  if(!req.body?.name) {
    sendError(400, 'missing name');
    return;
  }
  next();
}

const validateNameUnique = async (req, res, next) => {
  const usernameExists = await userExists(req.body.name);

  if(usernameExists) {
    sendError(400, 'name already in list', res);
    return;
  }

  next();
}

const validateLinks = (req, res, next) => {
  const links = req.body?.links
  if(!links) {
    sendError(400, 'missing links', res);
    return;
  }

  if(!Array.isArray(links)) {
    sendError(400, 'links must be an array of strings', res);
    return;
  }

  if(!areAllGitHubLinks(links)) {
    sendError(400, `Found invalid link to github in: ${links.join(',')}`, res);
    return;
  }

  next();
}

module.exports = {
  validateLinks,
  validateNameInRequest,
  validateNameUnique
};