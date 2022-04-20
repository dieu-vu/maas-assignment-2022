# MaaS Global Assignment

### Candidate name: Dieu Vu

Amongst the three options for how to do the assignment:

1. Use this boilerplate as a base for the assignment. This is the technology that we use in our backend.
2. Use any framework and modules you feel comfortable with to build the assignment API.
3. Show us something more incredible that you've built. Then, prepare to tell us more about the solution.

I tried to study use the technology suggested (dynamoDB and serverless) for the first time in my life. Before I only had chance to work with express. Due to the limited time for the assignment and lack of experience, the assignment may still have many flaws. I really appreciate constructive feedbacks from the hiring team.

Implementation includes:

-   The API is implemented with `Node.js`, `dynamoDB` and `serverless-offline`.
-   The unit test is implemented with `Jest`.
-   Error handling and response HTTP status codes
-   AWS SDK V3
    -   Marshall and unmarshall DynamoDB payload
    -   When using DynamoDB Local while developing, `accessKeyId` and `secretAccessKey` should be under `credentials`
-   I try to write the code as clean as I can but clean code will need endless improvement

# Assignment API

The objective is to create a simple REST API that store user email address in the database. The programming language must be Node.js or TypeScript.

## POST /user

This endpoint creates a new user and stores the email address in the database. Email addresses should be unique, and creation should not overwrite existing users.

## GET /user/{id}

This endpoint returns the existing user's details: id, email, and user creation time.

# Tips and tricks

## Links

-   [Serverless Framework Docs](https://www.serverless.com/framework/docs/providers/aws)
-   [Serverless Offline Plugin](https://www.serverless.com/plugins/serverless-offline)
-   [Serverless DynamoDB Local Plugin](https://www.serverless.com/plugins/serverless-dynamodb-local)

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

Run test with Jest

```
npm test --runInBand
```

# Deliverable

Options 1. and 2., a private git repository in Github, Gitlab or Bitbucket. Share the repo with ["laardee"](https://github.com/laardee/) and ["hieuunguyeen"](https://github.com/hieuunguyeen/) Option 3. can be a public repository.
