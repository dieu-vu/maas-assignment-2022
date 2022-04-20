'use strict';
jest.setTimeout(60000);

const http = require('http');

test('Test fetch API first time should return not found error', (done) => {
    const expectedOutput = {
        errorMessage: 'User not found',
        status: 400,
    };
    let options = {
        hostname: 'localhost',
        path: '/user/2',
        port: 3000,
        method: 'GET',
    };
    const req = http
        .request(options, (res) => {
            console.log(`statusCode: ${res.statusCode}`);
            res.on('data', (chunk) => {
                console.log(chunk);
                console.log('Body:', JSON.parse(chunk));
                expect(JSON.parse(chunk).status).toBe(expectedOutput.status);
                expect(JSON.parse(chunk).errorMessage).toBe(
                    expectedOutput.errorMessage
                );
                done();
            });
        })
        .on('error', (err) => {
            console.log('test create user first time error', err);
        })
        .end();
});

test('Test Create User API with valid email', () => {
    let body = JSON.stringify({email: 'test2@email.com'});
    let options = {
        hostname: 'localhost',
        path: '/user',
        port: 3000,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length,
        },
        body: body,
    };
    const expectedOutput = 'User created successfully';

    const req = http
        .request(options, (res) => {
            console.log(`statusCode: ${res.statusCode}`);
            res.on('data', (chunk) => {
                console.log(chunk);
                data += chunk;
            });
            res.on('end', () => {
                console.log('Body:', JSON.parse(data));
                expect(data.statusText).toBe(expectedOutput);
            });
        })
        .on('error', (err) => {
            console.log('test create user with valid email error', err);
        });
    req.end();
});

test('Test Create User with invalid email format', () => {
    let body = JSON.stringify({email: 'test_invalid_email'});
    let options = {
        hostname: 'localhost',
        path: '/user',
        port: 3000,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length,
        },
        body: body,
    };
    const expectedOutput = JSON.stringify({
        errorMessage: 'Invalid email format',
        status: 400,
    });
    const req = http
        .request(options, (res) => {
            console.log(`statusCode: ${res.statusCode}`);
            res.on('data', (chunk) => {
                console.log(chunk);
                data += chunk;
            });
            res.on('end', () => {
                console.log('Body:', JSON.parse(data));
                expect(data).toBe(expectedOutput);
            });
        })
        .on('error', (err) => {
            console.log(
                'test create user with invalid email format error',
                err
            );
        })
        .end();
});

test('Test check existing email in user fetch', () => {
    let body = JSON.stringify({email: 'test@email.com'});
    let options = {
        hostname: 'localhost',
        path: '/user',
        port: 3000,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length,
        },
        body: body,
    };
    const expectedOutput = JSON.stringify({
        errorMessage: 'Email already existed',
        status: 400,
    });
    const req = http
        .request(options, (res) => {
            console.log(`statusCode: ${res.statusCode}`);
            res.on('data', (chunk) => {
                console.log(chunk);
                data += chunk;
            });
            res.on('end', () => {
                console.log('Body:', JSON.parse(data));
                expect(data).toBe(expectedOutput);
            });
        })
        .on('error', (err) => {
            console.log(
                'test create user with invalid email format error',
                err
            );
        })
        .end();
});
