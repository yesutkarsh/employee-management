import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";




//  request for employee signup
export async function POST() {
    try{
        const headerList = await headers()
        const email = headerList.get('email')
        const fullName = headerList.get('fullName')

        if(!email || !fullName){
            return NextResponse.json({
                message:"email or fullname is missing"
            },{status:400})
        }


        const docToInster ={
            email,
            fullName,
            employeeId:"",
            department:"",
            role:"",
            profileImage:"",
            status:"pending"
        }



        const uri = process.env.MONGODB_URI; 
        const client = new MongoClient(uri);

        try{
            await client.connect()
            console.log("Connected To Mongo DB")

            const database = client.db("employee")
            const collection = database.collection("employees");
            const res = await collection.insertOne(docToInster)
            console.log("Insert Result", res)

            return NextResponse.json({
                message:"Data inserted successfully",
                data:docToInster,
                insertId:res.insertedId
            })

        }catch(dbError){
            console.log("Database Error", dbError)
            return NextResponse.json({
                message:"Database Error",
                error:dbError
            },{status:500})
        }finally{
            await client.close()
            console.log("MongoDB connection close")
        }
    }catch(err){
        console.log(err)
        return NextResponse.json({
            message:"Something went wrong",
            err
        },{status:500})
    }
}