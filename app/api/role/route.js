import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const headerList = await headers();
  const email = headerList.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("employee");
    const collection = database.collection("employees");

    // Find user by email and only return the role field
    const user = await collection.findOne(
      {email},
      { projection: { role: 1, _id: 0 } }
    );


    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Role retrieved successfully",
      role: user.role || "Not assigned"
    });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { message: "Database error", error: error.message },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}