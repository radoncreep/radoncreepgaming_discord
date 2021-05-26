const server = require('express')();

server.all('/', (req, res) => {
    res.send('Janethe is live!')
});

const PORT = process.env.PORT || 3000;

const keepAlive = () => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    });
};

module.exports = keepAlive;
