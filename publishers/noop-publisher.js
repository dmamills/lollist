
class NoopPublisher {
  constructor(publisher) {
    publisher.sub('register', (data) => console.log('register', data));
    publisher.sub('removed', (data) => console.log('removed', data));
    publisher.sub('assignment', (data) => console.log('assignment', data));
  }
}

module.exports = NoopPublisher;