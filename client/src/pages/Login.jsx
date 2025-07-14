import { useState } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authService.login(credentials);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" name="email" placeholder="Email" value={credentials.email}
          onChange={handleChange} className="w-full border rounded p-2" required />
        <input type="password" name="password" placeholder="Password" value={credentials.password}
          onChange={handleChange} className="w-full border rounded p-2" required />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">Login</button>
      </form>
    </div>
  );
}

// export default Login;
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import {authService}  from "../services/api";
// import { Link } from "react-router-dom"

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     if (!email || !password) return alert("All fields required");
//     setLoading(true);
//     try {
//       const res = await authService.login({ credentials});
//       localStorage.setItem("token", res.data.token);
//       navigate("/home");
//       if (!res.data?.token){
//         alert("Login failed: Not Token");
//         return;
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-900 px-4">
//       <Card className="w-full max-w-md shadow-xl animate-fade">
//         <CardHeader>
//           <CardTitle className="text-center text-2xl font-bold">Log In</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
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
//         <CardFooter className="flex justify-between">
//           <Button onClick={handleLogin} disabled={loading} className="w-full">
//             {loading ? "Logging in..." : "Log In"}
//           </Button>
//         </CardFooter>

//         <p className="text-sm text-center text-zinc-600 dark:text-zinc-300 mt-4">
//             Don't have an account?{" "}
//             <Link to="/signup" className="text-blue-600 hover:underline">
//                 Sign Up 
//             </Link>
//         </p>
//       </Card>
//     </div>
//   );
// }

