
const SLACK_TOKEN = process.env.SLACK_TOKEN;


const currentListBlock = (currentList) => ({
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text": `*Current List:*\n ${currentList.map((n,idx) => `- ${n} ${idx == currentList.length-1 ? '(*Next Up*)':''}`).join('\n')}`
  } 
})

class SlackPublisher {
  constructor(publisher) {
    publisher.sub('register', this.onAdded.bind(this))
    publisher.sub('removed', this.onRemoved.bind(this))
    publisher.sub('assignment', this.onAssign.bind(this))
  }

  onAdded({ addedName, currentList }) {
    const blocks =  [
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
        currentListBlock(currentList)
      ]
    return this.dispatchPost(blocks);
  }

  onAssign({ assignedUser, assigned, currentList }) {
    const blocks = [
        { 
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*${assignedUser}* you're up!`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*Assigned MRs:*\n ${assigned.map(n => `- <${n}|${n}>`).join('\n')}`
          }
        },
        {
          "type": "divider"
        },
        currentListBlock(currentList)
      ]
    return this.dispatchPost(blocks);
  }

  async onRemoved({ removedName, currentList }) {
    const blocks = [
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
        currentListBlock(currentList)
      ]
    return this.dispatchPost(blocks);
  }

  async dispatchPost(blocks) {
    console.log('dispatch to slack', blocks)
    return fetch(SLACK_TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    }).then((response) => response.status);
  }
}
//DRAMATIC CHANGE!

module.exports = SlackPublisher;