const sendError = (status, error, res) => {
  return res.status(status).json({
    error
  });
};

const divider = () => ({ type: 'divider' });

const markdownSection = (text) => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text
  }
});

const currentListToBlock = (currentList) => {
  const nameStrings = currentList.map((name, index) => {
    if(index === currentList.length - 1) {
      return `- ${name} (*Up Next!*)`;
    }

    return `- ${name}`;
  }).join('\n');

  return markdownSection(`*Current List:*\n ${nameStrings}`)
};

const banner = () => {
  return [
    divider(),
    markdownSection('*PR Bot Update!* \n'),
    divider()
  ]
}

module.exports = {
  sendError,
  currentListToBlock,
  markdownSection,
  divider,
  banner
};