# MR shuffle

## TF? 

Small API for rotating whose up next for MRs. This is purely a back end implementation.
You can call this thru curl, postman, or make yr own react/nextjs/laravel/hotreloading desires.

but the api exists simply to do a few things:

- Have a secret code word
- Be able to add people to the list
- Be able to remove people from the list
- Be able to tell you whose up next, and move them to the back of the list

## API

All POST requests all require `Content-Type: application/json` 

- `GET /` returns the current list
- `POST /register`
  - ```
  {
    name: "username",
    slackName: "username to be @'d at",
    githubName: "username to be assigned to MRs with"
  }
  ```
- `POST /remove` accepts a name and removes it entirely from the list, will throw 400 if name not provided
- `POST /assign` requires an array of URLS as a `link` property, returns the name of the person assigned to the MRs provided. It's up to the webhook implementation to inform them.

## Publisher

You can implement a publisher that will listen to the events of API calls. The available events are:

- `register` => emitted when a user is added to the list, returns `{ addedName, currentList }`
- `removed` => emitted when a user is removed from the list, returns `{ removedName, currentList }`
- `assignment` => emitted when a user is assigned a set of MRs, returns ` { assignedUser, assigned: [list of urls], currentList }`


## Using Publishers 

With these publishers you can do what you want from log to console see `noop-publisher` to tell slack, github, yr grandma about it. If you need more details in the events emitted MRs welcome.
