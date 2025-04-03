import React from 'react';
import WaitingApproval from "../../components/WaitingApproval";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from 'next/link';

export default async function Page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const fullName = user?.given_name + " " + user?.family_name;
  const email = user?.email;

  // Check employee status and get the status value
  const checkEmployeeStatus = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/employee/all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'email': email || '' 
        },
        cache: 'no-store' 
      });

      if (!response.ok) {
        return { exists: false, status: null };
      }

      const data = await response.json();
      return { 
        exists: data !== null, 
        status: data?.status || null,
        data: data
      };
    } catch (error) {
      console.error("Error checking employee status:", error);
      return { exists: false, status: null };
    }
  };

  // Request access if employee doesn't exist
  async function requestAccess() {
    try {
      const response = await fetch('http://localhost:3000/api/employee/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'email': email || '',
          "fullName": fullName || ""
        },
        cache: 'no-store'
      });
      
      return response.ok;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // Get employee data and status
  const employeeData = await checkEmployeeStatus();
  
  // Request access if employee doesn't exist
  if (!employeeData.exists && email && fullName) {
    await requestAccess();
  }

  // Determine if user should see waiting approval or authenticated content
  const isAuthenticated = employeeData.exists && employeeData.status === "approved";

  if (!isAuthenticated) {
    return <WaitingApproval name={fullName} email={email} />;
  }

  async function checkRole() {
    try {
      const res = await fetch('http://localhost:3000/api/role', {
        method: "GET",
        headers: {
          'email': email
        }
      });
      const data = await res.json();
      return data.role;
    } catch (error) {
      console.error("Error checking role:", error);
      return null;
    }
  }


  return (
    <>
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
  <div className="text-2xl font-semibold text-gray-800 mb-8 text-center">
    You Are Authenticated
  </div>
  <div className="navigation-options flex flex-col gap-4 w-full max-w-xs">
    <Link href="/dashboard/manageProfile">
      <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-600 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
        Go to Profile
      </button>
    </Link>
      <Link href="/dashboard/HR">
        <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-600 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
          Go to HR Dashboard
        </button>
      </Link>
      <Link href="/dashboard">
        <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-600 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
          Go to Dashboard
        </button>
      </Link>
  </div>
</div>
    </>
  );
}