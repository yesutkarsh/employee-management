import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
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
    const parameter = headerList.get('parameter');

    if (parameter === "delete") {
      const deleteResult = await collection.deleteOne({ email });
      if (deleteResult.deletedCount === 0) {
        return NextResponse.json({ message: "Employee not found!" }, { status: 404 });
      }
      return NextResponse.json({ message: "Employee deleted successfully!" });
    }

    if (parameter === "update") {
      const dataHeader = headerList.get("data");
      if (!dataHeader) {
        return NextResponse.json({ message: "Data is required for update" }, { status: 400 });
      }

      let data;
      try {
        data = JSON.parse(dataHeader);
      } catch (e) {
        return NextResponse.json({ message: "Invalid data format" }, { status: 400 });
      }

      const updateResult = await collection.updateOne(
        { email },
        { $set: data },
        { upsert: false }
      );

      if (updateResult.matchedCount === 0) {
        return NextResponse.json({ message: "Employee not found!" }, { status: 404 });
      }
      
      // Return the updated data along with success message
      const updatedDoc = await collection.findOne({ email });
      return NextResponse.json({ 
        message: "Employee updated successfully!",
        data: updatedDoc
      });
    }

    return NextResponse.json({ message: "Invalid parameter" }, { status: 400 });

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