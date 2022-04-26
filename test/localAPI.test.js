'use strict';
jest.setTimeout(60000);

require('isomorphic-fetch');

const baseUrl = 'http://localhost:3000';

const fetchData = async (endpoint, options) => {
    try {
        const respData = await fetch(endpoint, options);
        const data = await respData.json();
        return data;
    } catch (error) {
        console.log(error.errorMessage);
    }
};

test('Test fetch API first time should return not found error', async () => {
    const expectedOutput = {
        errorMessage: 'User not found',
        status: 502,
    };
    let options = {};
    const data = await fetchData(baseUrl + '/user/1', options);
    expect(data.status).toBe(expectedOutput.status);
    expect(data.errorMessage).toBe(expectedOutput.errorMessage);
});

test('Test Create User API with valid email', async () => {
    let body = JSON.stringify({email: 'test@email.com'});
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length,
        },
        body: body,
    };
    const expectedOutput = 'User created successfully';

    const data = await fetchData(baseUrl + '/user/', options);
    expect(data.statusText).toBe(expectedOutput);
});

test('Test Create User with invalid email format', async () => {
    let body = JSON.stringify({email: 'test_invalid_email'});
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length,
        },
        body: body,
    };
    const expectedOutput = {
        errorMessage: 'Invalid email format',
        status: 502,
    };
    const data = await fetchData(baseUrl + '/user/', options);
    expect(data).toStrictEqual(expectedOutput);
});

test('Test check existing email in user fetch', async () => {
    let body = JSON.stringify({email: 'test@email.com'});
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length,
        },
        body: body,
    };
    const expectedOutput = {
        errorMessage: 'Email already existed',
        status: 502,
    };
    const data = await fetchData(baseUrl + '/user/', options);
    expect(data).toStrictEqual(expectedOutput);
});
