'use strict';

const {DynamoDBClient, PutItemCommand} = require('@aws-sdk/client-dynamodb');
const {marshall} = require('@aws-sdk/util-dynamodb');

// TODO: add creation time
// TODO: query counter-table to calculate id
// TODO: query user table to check email

async function handler(event) {
    const client = new DynamoDBClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000/shell',
    });
    const params = {
        TableName: 'user-table',
        Item: {
            id: {N: 1},
            email: {S: 'test email'},
        },
    };
    // const command = new ListTablesCommand();
    const command = new PutItemCommand(params);
    try {
        const data = await client.send(command);
        data.$metadata.statusCode = data.$metadata.httpStatusCode;
        console.log('Read data:');
        console.log(data);
        console.log(data.$metadata);
        return data;
    } catch (error) {
        console.log(error);
    }
    //console.log(data);
    return;
}

module.exports = {
    handler,
};
