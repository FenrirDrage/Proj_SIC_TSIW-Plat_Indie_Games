const amqp = require("amqplib");

const RABBIT_URL = "amqp://rabbitmq:5672";
const QUEUE = "review_events";

// Retry connection (obrigatório em Docker)
async function connectRabbit(retries = 10) {
  try {
    const conn = await amqp.connect(RABBIT_URL);
    console.log("✅ Conectado ao RabbitMQ");
    return conn;
  } catch (err) {
    console.log("⏳ RabbitMQ ainda não está pronto, retry...");
    if (retries === 0) throw err;
    await new Promise(resolve => setTimeout(resolve, 3000));
    return connectRabbit(retries - 1);
  }
}

async function start() {
  try {
    const connection = await connectRabbit();
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE, { durable: false });

    console.log("📨 Notification Service à escuta de eventos...");

    channel.consume(QUEUE, (msg) => {
      if (!msg) return;

      try {
        const event = JSON.parse(msg.content.toString());

        console.log("🔔 Nova review recebida:");
        console.log(`Jogo: ${event.gameId}`);
        console.log(`Rating: ${event.rating}`);
        console.log(`Comentário: ${event.comment}`);

        // Futuro: email, push, websocket, etc.
        channel.ack(msg);
      } catch (err) {
        console.error("Erro a processar mensagem", err.message);
        channel.nack(msg, false, false); // descarta mensagem inválida
      }
    });

  } catch (err) {
    console.error("Notification Service falhou ao arrancar:", err.message);
    process.exit(1);
  }
}

start();
