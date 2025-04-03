"use client"
import React from 'react'

import { useEffect, useState, useRef } from "react"
import { ArrowRight, ChevronRight, Printer, Zap, CreditCard, CheckCircle, Star, Users, Award } from "lucide-react"
import Link from 'next/link'
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs'
export default function page() {
  return (
    <>
       <section className="relative h-screen overflow-hidden py-20 md:py-28 ">
        {/* Background gradient and shapes */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-80 -right-24 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-24 left-1/2 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-poppins text-5xl md:text-6xl lg:text-7xl text-gray-900 font-bold mb-6 leading-tight">
              Manage Your Organization <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Quickly</span>{" "}
              and{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                Easily
              </span>
            </h1>
            <p className="font-inter text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
              Keep Track of Every Thing at ease
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
           
           <RegisterLink className="relative group bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-inter text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <span className="relative z-10">SIGN UP</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
           </RegisterLink>
              
              <LoginLink className="relative overflow-hidden bg-white border-2 border-blue-400 text-blue-500 font-inter text-lg px-8 py-4 rounded-xl hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <span className="relative z-10">LOG IN</span>
                <div className="absolute inset-0 bg-blue-400 transform -translate-y-full hover:translate-y-0 transition-transform duration-300"></div>
                </LoginLink>
            </div>
          </div>

          {/* 3D-like floating elements */}
          <div className="hidden md:block">
            <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-lg shadow-xl transform rotate-12 animate-float"></div>
            <div className="absolute bottom-20 right-10 w-16 h-16 bg-blue-400 rounded-full shadow-xl animate-float animation-delay-1000"></div>
            <div className="absolute top-40 right-20 w-12 h-12 bg-purple-400 rounded-lg shadow-xl transform -rotate-12 animate-float animation-delay-2000"></div>
          </div>
        </div>
      </section>

    </>
  )
}
