const MongoClient = require("mongodb").MongoClient;
const uri = process.env.MONGODB_URI; // Asegúrate de tener tu URI de MongoDB en las variables de entorno

export async function mongodbUserFinder(email: string | null | undefined) {
  const client = new MongoClient(uri);

  try {
    // Conectar al cliente de MongoDB
    await client.connect();

    // Seleccionar la base de datos y la colección
    const collection = client.db("development").collection("users");

    // Buscar al usuario por email
    const user = await collection.findOne({ email: email });

    // Devolver el usuario si existe, o null si no existe
    return user;
  } catch (error) {
    console.error("Error al buscar el usuario en MongoDB:", error);
    throw error; // O manejar el error según sea necesario
  } finally {
    // Cerrar la conexión al cliente de MongoDB
    await client.close();
  }
}
