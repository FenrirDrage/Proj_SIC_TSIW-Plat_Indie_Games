const amqp = require("amqplib");

const QUEUE = "review_events";

async function start() {
  const connection = await amqp.connect("amqp://rabbitmq");
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE, { durable: false });

  console.log("📨 Notification Service à escuta de eventos...");

  channel.consume(QUEUE, (msg) => {
    if (msg !== null) {
      const event = JSON.parse(msg.content.toString());

      console.log("🔔 Nova review recebida:");
      console.log(`Jogo: ${event.gameId}`);
      console.log(`Rating: ${event.rating}`);
      console.log(`Comentário: ${event.comment}`);

      // Aqui futuramente: email, push, websocket, etc.
      channel.ack(msg);
    }
  });
}

start();
