#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'pedidos';

    channel.assertQueue(queue, {
      durable: false
    });

    channel.prefetch(1);

    console.log("esperando mensagens", queue);

    channel.consume(queue, function (msg) {
      var secs = msg.content.toString().split('.').length - 1;
      var pedido = msg.content.toString();

      var aprovado = Math.random() > 0.7;

      if (aprovado) {
        pedidoAprovado(channel, pedido);
      } else {
        pedidoNegado(channel, pedido);
      }

      setTimeout(function () {
        console.log("feito");
        channel.ack(msg);
      }, secs * 500);
    }, {
      noAck: false
    });
  });
});

function pedidoAprovado (channel, pedido) {
  var queue = 'aprovado';
  channel.assertQueue(queue, {
    durable: false
  });
  var msg = pedido;
  channel.sendToQueue(queue, Buffer.from(msg));
  console.log(" aprovado %s", msg);
}

function pedidoNegado (channel, pedido) {
  var queue = 'negado';
  channel.assertQueue(queue, {
    durable: false
  });
  var msg = pedido;
  channel.sendToQueue(queue, Buffer.from(msg));
  console.log(" [negado %s", msg);
}
