# MR shuffle

## TF? 

Small API for rotating whose up next for MRs. This is purely a back end implementation.
You can call this thru curl, postman, or make yr own react/nextjs/laravel/hotreloading desires.

but the api exists simply to do a few things:

- Have a secret code word
- Be able to add people to the list
- Be able to remove people from the list
- Be able to tell you whose up next, and move them to the back of the list

## the goods

built very slim:

- express & family
- redis
- node-fetch

## API

All POST requests all require `Content-Type: application/json` 

- `GET /` returns the current list
- `POST /register`

[Slack Id?](#what-the-slack-id)
```
 {
    "name": "username",
    "slackName": "slack USER ID: See Section about determining yours",
    "githubName": "username to be assigned to MRs with"
  }
```

- `POST /remove`
```
{
  "name": "name to remove"
}
```
- `POST /assign` requires an array of URLS as a `link` property, returns the name of the person assigned to the MRs provided. It's up to the webhook implementation to inform them.
```
{
  "links": [
    "https://github.com/dmamills/lollist/pull/1",
    "https://github.com/dmamills/lollist/pull/2"
  ]
}
```

## Publisher

You can implement a publisher that will listen to the events of API calls. The available events are:

- `register` => emitted when a user is added to the list, returns `{ addedName, currentList }`
- `removed` => emitted when a user is removed from the list, returns `{ removedName, currentList }`
- `assignment` => emitted when a user is assigned a set of MRs, returns ` { assignedUser, assigned: [list of urls], currentList }`


## Using Publishers 

With these publishers you can do what you want from log to console see `noop-publisher` to tell slack, github, yr grandma about it. If you need more details in the events emitted MRs welcome.


## What the slack id?

- Click on your profile in Slack
- Beside `Set A Status` and `View as` click the hamburger menu
- Select `Copy member ID`
- Thats wut u wanna provide for `slackName` with `POST /register`