import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";



// Bring all approved employees only
export async function GET() {
    try {
      const uri = process.env.MONGODB_URI;
      const client = new MongoClient(uri);
  
      try {
        await client.connect();
        const database = client.db("employee");
        const collection = database.collection("employees");
  
        // Find all users with pending status
        const pendingUsers = await collection.find({ status: "approved" }).toArray();
        
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

  

export async function POST(){
    try{
        const headerList = await headers()
        const email = await headerList.get('email')
        if (!email) {
            return NextResponse.json({ 
                message: "Email header is missing!" 
            }, { status: 400 });
        }

        const uri = process.env.MONGODB_URI;
        const client = new MongoClient(uri);

        try {
            await client.connect();
            console.log("Connected to MongoDB");

            const database = client.db("employee")
            const collection = database.collection("employees")

            const res = await collection.findOne({email})
            console.log(res)
            return NextResponse.json(res)
        } catch (error) {
            console.log(error)
            return NextResponse.json({
                message:"DB Error",
                error
            },{status:500})
        }finally{
            await client.close()
            console.log("MongoDB close")
        }
       
    }catch(err){
        return NextResponse.json(
            { message: "Failed to fetch user", error: err.message },
            { status: 500 }
        );
    }
}