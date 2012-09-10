var http = require('http');
var port = process.env.port || 1337;
var azure = require('azure');
var fs = require('fs');
var blobService = azure.createBlobService();
var queueService = azure.createQueueService();
var tableService = azure.createTableService();
var queueName = 'taskqueue';
var newVar = 'value1';

http.createServer(function (req, res) {
    queueService.createQueueIfNotExists(queueName, null, queueCreatedOrExists); 
function queueCreatedOrExists(error) { 
  res.writeHead(200, { 'Content-Type': 'text/plain' });
 if(error === null){
     res.write('Using queue ' + queueName + '\r\n'); 
queueService.createMessage(queueName, "Hello world!", null, messageCreated);
} else { 
  res.end('Could not use queue: ' + error); 
} 
} 

function messageCreated(error, serverQueue) { 
  if(error === null&& serverQueue ) { 
    res.write("Successfully inserted message into queue " + serverQueue.queue+ '\r\n'); 
   queueService.peekMessages(queueName, null, messagePeeked);

  } else { 
    res.end('Could not insert message into queue: ' + error); 
  }
}

function messagePeeked(error, serverMessages) {
 if(error === null && serverMessages && serverMessages[0]){
   res.write('Successfully peeked message: ' + serverMessages[0].messagetext + ' \r\n'); 
   queueService.getMessages(queueName, null, messageGot);

} else { 
res.end('Could not peek into queue: ' + error); 
} } 

function messageGot(error, serverMessages) {
 if(error === null && serverMessages && serverMessages[0]){
 res.write('Successfully got message: ' + serverMessages[0].messagetext + ' \r\n');
 // Process the message in less than 30 seconds, and then delete it
 queueService.deleteMessage(queueName, serverMessages[0].messageid, serverMessages[0].popreceipt, null, messageDeleted);
 } else {
 res.end('Could not get message: ' + error); 
} } 
function messageDeleted(error) {
 if(error === null){
 res.end('Successfully deleted message from queue ' + queueName + ' \r\n');
 } else {
 res.end('Could not delete message: ' + error);
 } } 

}).listen(port);