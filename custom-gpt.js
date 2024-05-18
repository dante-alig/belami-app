import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // Charger les variables d'environnement à partir du fichier .env

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  try {
    // // Création de l'assistant
    // const assistant = await openai.beta.assistants.create({
    //   name: "Linguistix",
    //   instructions:
    //     "L'assistant est conçu pour traduire les phrases du français vers l'anglais",
    //   model: "gpt-4o",
    // });

    // Création d'un nouveau thread
    const thread = await openai.beta.threads.create();

    // Envoi d'un message utilisateur dans le thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: [
        { type: "text", text: "What’s in this image?" },
        {
          type: "image_url",
          image_url: {
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
          },
        },
      ],
    });

    // Exécution du thread avec les instructions spécifiques
    let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: process.env.BOT_IMG_CUSTOM_ID,
      instructions: "la langue à utiliser est le français",
    });

    console.log(run);

    // Vérification du statut du run et affichage des messages
    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      for (const message of messages.data.reverse()) {
        console.log(`${message.role} > ${message.content[0].text.value}`);
      }
    } else {
      console.log(run.status);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
