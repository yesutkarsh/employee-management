// app/api/admin/pending-users/route.js
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// GET route to fetch all pending users
export async function GET() {
  try {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
      await client.connect();
      const database = client.db("employee");
      const collection = database.collection("employees");

      // Find all users with pending status
      const pendingUsers = await collection.find({ status: "pending" }).toArray();
      
      return NextResponse.json(pendingUsers);
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { message: "Failed to fetch pending users", error: error.message },
        { status: 500 }
      );
    } finally {
      await client.close();
    }
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// POST route to approve a user and update their details
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, employeeId, department, role, status } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);

    try {
      await client.connect();
      const database = client.db("employee");
      const collection = database.collection("employees");

      // Create update object with only provided fields
      const updateData = {};
      if (employeeId !== undefined) updateData.employeeId = employeeId;
      if (department !== undefined) updateData.department = department;
      if (role !== undefined) updateData.role = role;
      if (status !== undefined) updateData.status = status;

      // Update the user
      const result = await collection.updateOne(
        { email },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "User updated successfully",
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      });
    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { message: "Failed to update user", error: error.message },
        { status: 500 }
      );
    } finally {
      await client.close();
    }
  } catch (err) {
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}