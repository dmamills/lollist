const SLACK_TOKEN = process.env.SLACK_TOKEN;

const currentListToBlock = (currentList) => {
  const nameStrings = currentList.map((name, index) => {
    if(index === currentList.length - 1) {
      return `- ${name} (*Up Next!*)`;
    }

    return `- ${name}`;
  }).join('\n');

  return {
    "type": "section",
    "text": {
        "type": "mrkdwn",
        "text": `*Current List:*\n ${nameStrings}`
    } 
  }
};

const banner = () => {
  return [{
    type: 'divider'
  }, {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '*Pull Request Update!* \n'
    }
  }, {
    type: 'divider'
  }]
}

class SlackPublisher {
  constructor(publisher) {
    publisher.sub('register', this.onAdded.bind(this));
    publisher.sub('removed', this.onRemoved.bind(this));
    publisher.sub('assignment', this.onAssign.bind(this));
  }

  onAdded({ addedName, currentList }) {
    const blocks =  [
        ...banner(),
        { 
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*${addedName}* has been added to the rotation!`
          }
        },
        {
          "type": "divider"
        },
        currentListToBlock(currentList)
      ];
    return this.dispatchPost(blocks);
  }

  onAssign({ assignedUser, assigned, currentList }) {
    const assignedStrings = assigned.map(link => `- <${link}|${link}>`).join('\n');
    const userName = assignedUser.slackName ? `@${assignedUser.slackName}` : assignedUser.name;
    const blocks = [
        ...banner(),
        { 
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `<${userName}> you're up!`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*Assigned MRs:*\n ${assignedStrings}`
          }
        },
        {
          "type": "divider"
        },
        currentListToBlock(currentList)
      ];
    return this.dispatchPost(blocks);
  }

  async onRemoved({ removedName, currentList }) {
    const blocks = [
        ...banner(),
        { 
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*${removedName}* has been removed from the rotation!`
          }
        },
        {
          "type": "divider"
        },
        currentListToBlock(currentList)
      ];
    return this.dispatchPost(blocks);
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