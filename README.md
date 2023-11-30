# Bug Tracker

## API Documentation
The Bug Tracker API offers all the same functionality provided through the web app. API usage examples are provided using [Axios](https://github.com/axios/axios)
### User requests
#### Create
New users can be created by sending a POST request to `https://bug-tracker.com/api/user/`. The post data should contain two strings, `username` and `password` that can either be JSON or URLEncoded.

It should be noted that all newly created users require email verification within 30 minutes or the user will be deleted.

```js
const data = { username: "new_username", password: "new_password" };
axios.post("https://bug-tracker.com/api/user", data);
```

**Output**: A JSON object containing `username` and `password` if the user was successfully created. `NULL` if the user could not be created for any reason. 

Example output:
```js
{username: "username", password: "password"}
```
#### Read
Users can be read by sending a GET request to `https://bug-tracker.com/api/user/`. The route expects a search parameter, `username`. **Reading a user requires authentication. Only the authenticated user can be read!**

```js
axios.get("https://bug-tracker.com/api/user/", {
    params: {
        username: "search_username"
    }
});
//OR
axios.get("https://bug-tracker.com/api/user/?username=search_username");
```

**Output**: A JSON object containing two strings `username`, `password`, and a list of project ID's `projects`. Returns `NULL` if the user could not be found. A 403 error will occur if you are not authorized or the username does not match the authenticated user.

Example output:
```js
{username: "username", password: "password", projects: ["6551a208c0fc06504e6dc5fe", ...]}
```

#### Update
#### Delete
