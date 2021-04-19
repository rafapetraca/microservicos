#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var nodemailer = require('nodemailer');


amqp.connect('amqp://localhost', function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    findAprovado(channel);
    findRejeitado(channel);
  });
});

function findAprovado (channel) {
  channel.prefetch(1);

  let queue = 'aprovado';
  channel.consume(queue, function (msg) {
    var secs = msg.content.toString().split('.').length - 1;
    var pedido = JSON.parse(msg.content.toString());

    emailSend(queue, pedido)

    setTimeout(function () {
      console.log("aprovados");
      channel.ack(msg);
    }, secs * 1000);
  }, {
    noAck: false
  });
}

function findRejeitado (channel) {
  channel.prefetch(1);

  let queue = 'rejeitado';
  channel.consume(queue, function (msg) {
    var secs = msg.content.toString().split('.').length - 1;
    var pedido = JSON.parse(msg.content.toString());

    emailSend(queue, pedido)

    setTimeout(function () {
      console.log("rejeitados");
      channel.ack(msg);
    }, secs * 1000);
  }, {
    noAck: false
  });
}

function emailSend (pedido) {

  var estrutura = pedido
  var corpo = nodemailer.createTransport({
    host: process.env.MAILHOG_HOST,
    port: '1025',
    auth: null
  });

  corpo.emailSend({
    from: '<email@gmail.com>',
    to: '<email1@gmail.com>',
    subject: 'pedido',
    html: estrutura.toString()
  })
  .then((d) => console.log('enviado'))
  .catch((e) => console.log({e}));

  console.log({estrutura });
}
