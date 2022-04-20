'use strict';
// Module to handle actions in POST method
const {
    DynamoDBClient,
    GetItemCommand,
    DescribeTableCommand,
    PutItemCommand,
    ScanCommand,
} = require('@aws-sdk/client-dynamodb');
const {marshall, unmarshall} = require('@aws-sdk/util-dynamodb');
const {
    UpdateCommand,
    DynamoDBDocumentClient,
} = require('@aws-sdk/lib-dynamodb');
const {httpError} = require('../utils/errors');

const client = new DynamoDBClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000/shell',
});
const marshallOptions = {
    convertClassInstanceToMap: true,
    removeUndefinedValues: true,
};
const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
};

const options = {marshallOptions, unmarshallOptions};
const dbClient = DynamoDBDocumentClient.from(client, options);

// Check if the counter-table has been initiated
const checkIfCounterTableEmpty = async (client) => {
    const params = {
        TableName: 'counter-table',
    };
    const command = new DescribeTableCommand(params);
    try {
        const data = await client.send(command);
        if (data.Table.ItemCount === 0) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
};

// Init the counter-table with key tableName = user-table to store and update the highest Id
const initCounter = async (client) => {
    const params = {
        TableName: 'counter-table',
        Item: {
            tableName: {S: 'user-table'},
            highestId: {N: 0},
        },
    };
    const command = new PutItemCommand(params);

    try {
        const data = await client.send(command);
        console.log('INIT COUNTER RESPONSE', data);
        return data;
    } catch (error) {
        console.log('INIT COUNTER ERROR', error);
    }

    return;
};

// Generate the next ID for the user put method
const incrementCounter = async (client) => {
    const currentHighestId = await getHighestUserId(client);
    console.log('CURRENT ID', currentHighestId);
    const nextId = parseInt(currentHighestId) + 1;
    console.log('NEXT ID', nextId);
    const params = {
        TableName: 'counter-table',
        Key: {
            tableName: 'user-table',
        },
        UpdateExpression: 'set highestId = :nextId',
        ExpressionAttributeValues: {':nextId': nextId},
        ReturnValues: 'UPDATED_NEW',
    };
    const command = new UpdateCommand(params);
    try {
        const data = await dbClient.send(command);
        //const data = await client.send(params);
        console.log('UPDATE COUNTER RESPONSE', data);
        return data;
    } catch (error) {
        console.log('UPDATE COUNTER ERROR', error);
    }
};

// Get the highest Id saved in counter-table
const getHighestUserId = async (client) => {
    const params = {
        TableName: 'counter-table',
        Key: marshall({
            tableName: 'user-table',
        }),
    };
    const command = new GetItemCommand(params);
    try {
        const data = await client.send(command);
        console.log('get highest ID:', data);
        return unmarshall(data.Item).highestId;
    } catch (error) {
        console.log('GET HIGHEST ID ERROR', error);
    }
};

// Function to check if the email string exists in the DB
const checkExistingEmail = async (emailString) => {
    const params = {
        TableName: 'user-table',
        ExpressionAttributeValues: marshall({':s': emailString}),
        FilterExpression: 'email = :s',
        ProjectionExpression: 'email',
    };
    const command = new ScanCommand(params);
    try {
        const data = await dbClient.send(command);
        if (data.Count > 0) {
            // console.log('CHECK EMAIL RESPONSE', data);
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
};

// Function to validate email address
const validateEmail = async (emailString) => {
    const emailExisted = await checkExistingEmail(emailString);
    if (emailExisted) {
        const err = httpError('Email already existed', 400);
        console.log('email existed');
        return err;
    } else {
        let regex = /^([a-zA-Z0-9/-_.]+@[a-zA-Z0-9/-_.]+.[a-z0-9]{2,3})$/;
        if (!regex.test(emailString)) {
            const err = httpError('Invalid email format', 400);
            console.log('email invalid');
            return err;
        } else {
            return true;
        }
    }
};

module.exports = {
    checkIfCounterTableEmpty,
    initCounter,
    incrementCounter,
    getHighestUserId,
    validateEmail,
};
