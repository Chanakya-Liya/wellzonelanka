import { MongoClient, type Db } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  // Use the environment variable for MongoDB connection
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable")
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  try {
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db("wellzone")

    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw new Error("Could not connect to database")
  }
}

// Helper function to convert MongoDB documents to JSON
export function convertDocToJSON(doc: any) {
  return JSON.parse(JSON.stringify(doc))
}

export async function ensureCollections() {
  try {
    const { db } = await connectToDatabase()

    // Check if collections exist, if not create them
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    if (!collectionNames.includes("users")) {
      await db.createCollection("users")
      // Create indexes for users collection
      await db.collection("users").createIndex({ email: 1 }, { unique: true })
    }

    if (!collectionNames.includes("appointments")) {
      await db.createCollection("appointments")
      // Create indexes for appointments collection
      await db.collection("appointments").createIndex({ email: 1 })
      await db.collection("appointments").createIndex({ trainerId: 1 })
    }
    if (!collectionNames.includes("doctorAppointments")) {
      console.log("Creating doctorAppointments collection")
      await db.createCollection("doctorAppointments")
      // Create indexes for doctorAppointments collection
      await db.collection("doctorAppointments").createIndex({ email: 1 })
      await db.collection("doctorAppointments").createIndex({ doctorId: 1 })
    }

    if (!collectionNames.includes("videoSessions")) {
      await db.createCollection("videoSessions")
    }

    return true
  } catch (error) {
    console.error("Error ensuring collections:", error)
    return false
  }
}

