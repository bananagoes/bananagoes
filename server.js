const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/generate') {
    // parse the command from the request body
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const command = JSON.parse(body);
      // generate the client file
      generateClientFile(command, (err, file) => {
        if (err) {
          res.writeHead(500);
          res.end(err.message);
        } else {
          res.writeHead(200);
          res.end(file);
        }
      });
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

function generateClientFile(command, callback) {
  // create the client file
  const fileContent = `const http = require('http');

const client = http.request({
  host: 'localhost',
  port: 3000,
  method: 'POST',
}, (res) => {
  res.on('data', (chunk) => {
    console.log(chunk.toString());
  });
});

client.end(JSON.stringify({ command: '${command}' }));
`;
  fs.writeFile('client.js', fileContent, (err) => {
    callback(err, fileContent);
  });
}
