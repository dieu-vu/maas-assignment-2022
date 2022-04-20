'use strict';

const {DynamoDBClient, GetItemCommand} = require('@aws-sdk/client-dynamodb');
const {marshall, unmarshall} = require('@aws-sdk/util-dynamodb');
const {httpError} = require('../utils/errors');

async function handler(event) {
    const userId = parseInt(event.pathParameters.id);
    const client = new DynamoDBClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000/shell',
    });
    const params = {
        TableName: 'user-table',
        Key: marshall({
            id: userId,
        }),
    };
    const command = new GetItemCommand(params);

    try {
        const data = await client.send(command);
        return unmarshall(data.Item);
    } catch (error) {
        if (error.message.toLowerCase().includes('no value defined')) {
            return httpError('User not found', 400);
        }
        return;
    }
    return;
}

module.exports = {
    handler,
};
