"use client"
import Link from "next/link";
import { useState } from "react";
import styles from "./navbar.module.css";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>EmployeeApp</div>
      <button className={styles.menuButton} onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <ul className={`${styles.navLinks} ${isOpen ? styles.show : ""}`}>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/dashboard/manageProfile">Profile</Link></li>
        <li><Link href="/dashboard/HR/approve">Approve Employee</Link></li>
        <li><Link href="/dashboard/HR">Manage Employee</Link></li>
        <LogoutLink><li>Log Out</li></LogoutLink>
      </ul>
    </nav>
  );
};

export default Navbar;
