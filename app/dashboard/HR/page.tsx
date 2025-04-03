"use client"
import { useEffect, useState } from "react"
import style from "./page.module.css"
import ProfileModal from "@/components/ProfileModal"

export default function HRDashboard() {
    const [employees, setEmployees] = useState([])
    const [profileModal, setProfileModal] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    

    async function getAllEmployee(){
        try {
            const response = await fetch('/api/employee/all', {
                cache: 'no-store',
                headers: {
                    'pragma': 'no-cache',
                    'cache-control': 'no-cache'
                }
            })
            const data = await response.json()
            console.log("Fetched employee data:", data)
            setEmployees(data)
        } catch (error) {
            console.error("Error fetching employees:", error)
        }
    }

    useEffect(() => {
        getAllEmployee()
    }, [refreshTrigger])

    const handleOpenModal = (employee) => {
        setSelectedEmployee(employee)
        setProfileModal(true)
    }

    const handleCloseModal = (shouldRefresh = false) => {
        setProfileModal(false)
        setSelectedEmployee(null)
        
        if (shouldRefresh) {
            console.log("Triggering refresh after update")
            setRefreshTrigger(prev => prev + 1)
        }
    }

    return (
        <>
            <nav className={style.nav}>
                <h1>HR DASHBOARD</h1>
            </nav>
            <div className={style.employeesList}>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Employee Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Department
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Employee ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length>1 && employees.map((employee) => (
                                <tr key={employee.employeeId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {employee.fullName}
                                    </th>
                                    <td className="px-6 py-4">
                                        {employee.department}
                                    </td>
                                    <td className="px-6 py-4">
                                        {employee.employeeId}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleOpenModal(employee)}
                                            className="text-black p-2 cursor-pointer rounded-[8px] bg-[#f9fafb]">
                                            View Profile
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {profileModal && selectedEmployee && (
                <ProfileModal 
                    user={selectedEmployee} 
                    isOpen={profileModal} 
                    onClose={(shouldRefresh) => handleCloseModal(shouldRefresh)} 
                />
            )}
        </>
    )
}