import React from 'react';
import {Link, useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import { authService } from "@/services/api";

export default function Navbar() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate("/login")

    };
    return (
        <div className="flex justify-between items-center p-4 border-b shadow-sm">
            <Link to="/" className="text-xl font-bold text-primary">My Blog</Link>
            <div className="space-x-4">
                { user ? (//If user is exists, show the New Post + Logout buttons.
                    <><Button asChild><Link to="/create">New Post</Link></Button>
                    <Button variant="outline" onClick={handleLogout}>Logout</Button>
                    </>
                ):( 
                    <>
                    <Button asChild><Link to ="/login">Login</Link></Button>
                    <Button variant="outline" asChild><Link to="/signup">Signup</Link></Button>
                    </>
                )
                }
            </div>
        </div>
    );

}