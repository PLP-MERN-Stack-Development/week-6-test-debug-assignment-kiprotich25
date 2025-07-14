import { useState } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState( { username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authService.signup(formData);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
      console.error(error.response?.data || error.message);

    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Signup</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="username" placeholder="Username" value={formData.username}
          onChange={handleChange} className="w-full border rounded p-2" required />
        <input type="email" name="email" placeholder="Email" value={formData.email}
          onChange={handleChange} className="w-full border rounded p-2" required />
        <input type="password" name="password" placeholder="Password" value={formData.password}
          onChange={handleChange} className="w-full border rounded p-2" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Signup</button>
      </form>
    </div>
  );
}

export default Signup;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import {authService} from "../services/api";
// import { Link } from "react-router-dom"


// export default function Signup() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSignup = async () => {
//     if (!username || !email || !password) return alert("All fields required");
//     setLoading(true);
//     try {
//       const res = await authService.signup({ username, email, password});//post("/auth/signup", { username, email, password });
//       navigate("/home");
//     } catch (err) {
//       alert(err.response?.data?.message || "Signup failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-900 px-4">
//       <Card className="w-full max-w-md shadow-xl animate-fade">
//         <CardHeader>
//           <CardTitle className="text-center text-2xl font-bold">Sign Up</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <Input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={e => setUsername(e.target.value)}
//           />
//           <Input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//           />
//           <Input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//           />
//         </CardContent>
//         <CardFooter>
//           <Button onClick={handleSignup} disabled={loading} className="w-full">
//             {loading ? "Signing up..." : "Sign Up"}
//           </Button>
//         </CardFooter>
//         <p className="text-sm text-center text-zinc-600 dark:text-zinc-300 mt-4">
//             Already have an account?{" "}
//             <Link to="/login" className="text-blue-600 hover:underline">
//                 Login
//             </Link>
//         </p>
//       </Card>
//     </div>
//   );
// }
