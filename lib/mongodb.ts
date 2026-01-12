import mongoose from "mongoose";

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

const URL = `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`;

// Variable para trackear el estado de la conexión
let isConnected = false;

export const connectMongoDB = async () => {
  // Si ya está conectado, reutilizar la conexión
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(URL);
    isConnected = true;
    console.log("Connected to MONGODB");
  } catch (error) {
    console.log("Error connecting to database: ", error);
    isConnected = false;
  }
};
