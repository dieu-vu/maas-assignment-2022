'use strict';

const {
    DynamoDBClient,
    PutItemCommand,
    GetItemCommand,
} = require('@aws-sdk/client-dynamodb');
const {marshall, marshallOptions} = require('@aws-sdk/util-dynamodb');
const {httpError} = require('../utils/errors');
const utils = require('../utils/utils');
const {PutCommand, DynamoDBDocumentClient} = require('@aws-sdk/lib-dynamodb');

async function handler(event) {
    const requestBody = JSON.parse(event.body);
    const userEmail = requestBody.email;
    console.log('BODY', userEmail);
    const aws = require('aws-sdk');
    const marshallOptions = {
        convertClassInstanceToMap: true,
        removeUndefinedValues: true,
    };
    const unmarshallOptions = {
        // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
        wrapNumbers: false, // false, by default.
    };
    const options = {marshallOptions, unmarshallOptions};
    const docClient = new DynamoDBClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000/shell',
    });
    const client = DynamoDBDocumentClient.from(docClient, options);

    // Get current date
    var current = new Date().toISOString();

    // Check if email exists in user-table
    const emailExisted = await utils.checkExistingEmail(userEmail);
    if (emailExisted) {
        const err = httpError('Email already existed', 400);
        console.log('email existed');
        return err;
    } else {
        // Generate Id:
        // Check if the counter-table is empty
        const counterTableIsEmpty = await utils.checkIfCounterTableEmpty(
            client
        );
        console.log('counter table is empty', counterTableIsEmpty);
        // if yes then init the highest Id as 0
        if (counterTableIsEmpty) {
            await utils.initCounter(client);
        }
        // if no then increment the current saved highest Id
        await utils.incrementCounter(client);

        // Get the highestId from the counter-table
        const nextValidUserId = await utils.getHighestUserId(client);
        console.log('CREATED ID', nextValidUserId);
        // Create POST request
        const params = {
            TableName: 'user-table',
            Item: {
                id: nextValidUserId,
                email: userEmail,
                creationTime: current,
            },
        };

        const command = new PutItemCommand(params);
        try {
            console.log('PARAMS', params);
            const data = await client.send(new PutCommand(params));
            console.log('Read data:');
            console.log(data);
            console.log(data.$metadata);
            return data;
        } catch (error) {
            console.log(error);
        }
        return;
    }
}

module.exports = {
    handler,
};
