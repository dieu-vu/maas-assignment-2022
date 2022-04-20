'use strict';
jest.setTimeout(60000);

const req = require('request');
const request = require('request-promise');

test('Test fetch API first time should return not found error', (done) => {
    // Arrange
    const apiURL = 'http://localhost:3000/user/1';
    const expectedOutput = JSON.stringify({
        errorMessage: 'User not found',
        status: 400,
    });

    // Act
    request.get(apiURL).then((data) => {
        // Assert
        expect(data).toBe(expectedOutput);
        done();
    });
});

test('Test Create API first time', () => {
    let body = JSON.stringify({email: 'test1@email.com'});
    return request
        .post('http://localhost:3000/user', body)
        .then((data) => {
            return expect(data.statusText).toBe('User created successfully');
        })
        .catch((err) => {
            console.log('test create user first time error', err);
        });
});

test('Test Create User with invalid email format', () => {
    let body = JSON.stringify({email: 'testemail.com'});
    const expectedOutput = JSON.stringify({
        errorMessage: 'Invalid email format',
        status: 400,
    });
    return request
        .post('http://localhost:3000/user', body)
        .then((data) => {
            return expect(data).toBe(expectedOutput);
        })
        .catch((err) => {
            console.log(
                'test create user with invalid email format error',
                err
            );
        });
});

// test('Test fetch API after creating one', (done) => {
//     // Arrange
//     const apiURL = 'http://localhost:3000/user/1';
//     const expectedOutput = 1;

//     // Act
//     let body = JSON.stringify({email: 'test@email.com'});
//     request
//         .post('http://localhost:3000/user', body)
//         .then((data) => {
//             request.get(apiURL).then((data) => {
//                 // Assert
//                 console.log(data);
//                 expect(data.id).toBe(1);
//                 done();
//             });
//             return expect(data.statusText).toBe('User created successfully');
//         })
//         .catch((err) => {
//             console.log('test create user first time error', err);
//         });
// });
