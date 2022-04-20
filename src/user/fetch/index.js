'use strict';

const {
    DynamoDBClient,
    GetItemCommand,
    DescribeTableCommand,
    DeleteTableCommand,
} = require('@aws-sdk/client-dynamodb');
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
        // TableName: 'counter-table',
        Key: marshall({
            id: userId,
        }),
        // Key: marshall({
        //     tableName: 'user-table',
        // }),
    };
    const command = new GetItemCommand(params);
    // const command = new DescribeTableCommand(params);
    // const command = new ListTablesCommand({});
    // const command = new DeleteTableCommand(params);

    try {
        const data = await client.send(command);
        // data.$metadata.statusCode = data.$metadata.httpStatusCode;
        // console.log('Read data:', data.Table.ItemCount);
        // return data;
        return unmarshall(data.Item);
    } catch (error) {
        console.log('ERROR MESSAGE', typeof error.message);
        if (error.message.toLowerCase().includes('no value defined')) {
            return httpError('User not found', 400);
        }
        return;
    }
    //console.log(data);
    return;
}

module.exports = {
    handler,
};
