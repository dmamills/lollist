const { currentListToBlock, banner, markdownSection, divider } = require('../utils');
const SLACK_TOKEN = process.env.SLACK_TOKEN;

class SlackPublisher {
  constructor(publisher) {
    publisher.sub('register', this.onAdded.bind(this));
    publisher.sub('removed', this.onRemoved.bind(this));
    publisher.sub('assignment', this.onAssign.bind(this));
  }

  onAdded({ addedName, currentList }) {
    return this.dispatchPost([
      ...banner(),
      markdownSection(`*${addedName}* has been added to the rotation!`),
      divider(),
      currentListToBlock(currentList)
    ]);
  }

  onAssign({ assignedUser, assigned, currentList }) {
    const assignedStrings = assigned.map(link => `- <${link}|${link}>`).join('\n');
    const userName = assignedUser.slackName ? `@${assignedUser.slackName}` : assignedUser.name;

    return this.dispatchPost([
      ...banner(),
      markdownSection(`<${userName}> you're up`),
      markdownSection(`*Assigned MRs:*\n ${assignedStrings}`),
      divider(),
      currentListToBlock(currentList)
    ]);
  }

  async onRemoved({ removedName, currentList }) {
    return this.dispatchPost([
      ...banner(),
      markdownSection(`*${removedName}* has been removed from the rotation!`),
      divider(),
      currentListToBlock(currentList)
    ]);
  }

  async dispatchPost(blocks) {
    return fetch(SLACK_TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    }).then((response) => response.status);
  }
}

module.exports = SlackPublisher;