const http = require('http');

test('server is listening on port 8000 and responds to /users/loggedIn', async () => {
    await new Promise((resolve, reject) => {
        const req = http.request('http://localhost:8000/users/loggedIn', res => {
            expect(res.statusCode).toBe(200);
            res.on('data', () => { });
            res.on('end', () => resolve());
        });

        req.end();
    });
});
