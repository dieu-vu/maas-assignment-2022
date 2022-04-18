'use strict';

const {
    DynamoDBClient,
    GetItemCommand,
    DescribeTableCommand,
    ListTablesCommand,
    DeleteTableCommand,
} = require('@aws-sdk/client-dynamodb');
const {marshall, unmarshall} = require('@aws-sdk/util-dynamodb');

async function handler(event) {
    const client = new DynamoDBClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000/shell',
    });
    const params = {
        TableName: 'user-table',
        Key: {
            id: {N: 1},
        },
    };
    const command = new GetItemCommand(params);
    // const command = new DescribeTableCommand(params);
    // const command = new ListTablesCommand({});
    // const command = new DeleteTableCommand(params);

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
