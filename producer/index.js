#!/usr/bin/env nodevar

amqp = require('amqplib/callback_api');
amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    console.error('error', error0);
    return;
  }

  console.log('sucesso');
  connection.createChannel(function (error1, channel) {
    if (error1) {
      console.error('error', error1);
      return;
      
    }
    console.log('sucesso');
    var queue = 'pedidos';
    channel.assertQueue(queue, {
      durable: false
    });

    setInterval(() => {
      var msg = {
        data: new Date().toISOString(),
        nome: "Rafael",
        servicos: [
          {
            nome: "X"
          },
          {
            nome: "Y"
          },
        ]
      };
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
      console.log(" enviando %s", msg);
    }, 1000);
  });
});
