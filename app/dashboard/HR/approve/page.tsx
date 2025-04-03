"use client"
// app/admin/pending-users/page.js
import UserApprovalModal from "./ApproveCard";
import { useEffect, useState } from "react";

export default function page() {
 
const [pendingUsers, setPendingUse] = useState([])
const [showModal, setshowMoadl] = useState(false)

function closeModal(){
  setshowMoadl(!showModal)
}


  
async function fetchAllPedningUsers() {
  try{
    const data = await fetch('http://localhost:3000/api/employee/pending')
    const response = await data.json()
    setPendingUse(response)
  }catch(err){
    console.log(err)
  }
}

useEffect(()=>{
fetchAllPedningUsers()
},[])


  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Pending Users
        </h1>

        {pendingUsers.length === 0 ? (
          <p className="text-gray-600 text-center">No pending users found.</p>
        ) : (
          <div className="space-y-4">
            {pendingUsers.length>0 && pendingUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between bg-indigo-50 rounded-lg p-4 hover:bg-indigo-100 transition-colors duration-200"
              >
                <div>
                  <p className="text-indigo-700 font-medium">{user.fullName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-sm text-gray-500">Status: <span className="font-semibold">{user.status}</span></p>
                </div>
                  <button onClick={()=>{
                    setshowMoadl(!showModal)
                  }}
                  className="py-2 px-4 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200">
                    Approve
                  </button>
                {!showModal ? <UserApprovalModal onClose={closeModal} isOpen={false} user={user} /> : <UserApprovalModal isOpen={true} onClose={closeModal} user={user} />}


                
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}