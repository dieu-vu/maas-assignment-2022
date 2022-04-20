'use strict';

const {
    DynamoDBClient,
    GetItemCommand,
    DescribeTableCommand,
    PutItemCommand,
    ScanCommand,
} = require('@aws-sdk/client-dynamodb');
const {marshall, unmarshall} = require('@aws-sdk/util-dynamodb');
const {
    QueryCommand,
    UpdateCommand,
    DynamoDBDocumentClient,
} = require('@aws-sdk/lib-dynamodb');

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
    //const aws = require('aws-sdk');
    //const docClient = new aws.DynamoDB.DocumentClient();
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
            console.log('CHECK EMAIL RESPONSE', data);
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    checkIfCounterTableEmpty,
    initCounter,
    checkExistingEmail,
    incrementCounter,
    getHighestUserId,
};
