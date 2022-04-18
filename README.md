# MaaS Global Assignment

You have three options for how to do the assignment.

1. Use this boilerplate as a base for the assignment. This is the technology that we use in our backend.
2. Use any framework and modules you feel comfortable with to build the assignment API.
3. Show us something more incredible that you've built. Then, prepare to tell us more about the solution.

# Assignment API

The objective is to create a simple REST API that store user email address in the database. The programming language must be Node.js or TypeScript.

## POST /user

This endpoint creates a new user and stores the email address in the database. Email addresses should be unique, and creation should not overwrite existing users.

## GET /user/{id}

This endpoint returns the existing user's details: id, email, and user creation time.

# Tips and tricks

## Links

- [Serverless Framework Docs](https://www.serverless.com/framework/docs/providers/aws)
- [Serverless Offline Plugin](https://www.serverless.com/plugins/serverless-offline)
- [Serverless DynamoDB Local Plugin](https://www.serverless.com/plugins/serverless-dynamodb-local)

## Tips

- Error handling and response HTTP status codes
- Package.json contains some useful modules, but you can use whatever you need
- AWS SDK V3
  - Marshall and unmarshall DynamoDB payload
  - When using DynamoDB Local while developing, `accessKeyId` and `secretAccessKey` should be under `credentials`

### Local development environment

First, run

```shell
npm install
```

Then install the local DynamoDB

```shell
sls dynamodb install
```

Start the local DynamoDB

```shell
sls dynamodb start
```

And in a separate terminal window run

```shell
sls offline
```

The local API is served through port 3000
```
GET  | http://localhost:3000/user/{id}
POST | http://localhost:3000/user
```

## Bonus

We appreciate

- Clean code
- Unit tests

# Deliverable

Options 1. and 2., a private git repository in Github, Gitlab or Bitbucket. Share the repo with ["laardee"](https://github.com/laardee/) and ["hieuunguyeen"](https://github.com/hieuunguyeen/) Option 3. can be a public repository.
