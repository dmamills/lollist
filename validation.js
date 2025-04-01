const validateName = (req, res, next) => {
  if(!req.body?.name) {
    res.status(400).json({ error: 'missing name' });
    return;
  }
  next();
}

const isValidGitHubLink = (url) => /^https?:\/\/(www\.)?github\.com\/[\w-]+(\/[\w-]+)?(\/.*)?$/.test(url);
const areAllGitHubLinks = (arr) => arr.every(isValidGitHubLink);

const validateLinks = (req, res, next) => {
  const links = req.body?.links
  if(!links) {
    res.status(400).json({ error: 'missing links' });
    return;
  }

  if(!Array.isArray(links)) {
    res.status(400).json({error: 'links must be array of strings'})
    return;
  }

  if(!areAllGitHubLinks(links)) {
    res.status(400).json({ error: `Found invalid link to github in: ${links.join(',')}`})
    return;
  }

  next();
}

module.exports = {
  validateLinks,
  validateName
};