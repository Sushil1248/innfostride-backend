const app = require('./app');
require('dotenv').config();
const tls = require('tls');
console.log(tls.TLSSocket.listenerCount('close'));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});