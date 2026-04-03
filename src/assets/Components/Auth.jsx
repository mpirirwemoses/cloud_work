import { useState } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const url = isLogin
      ? "http://localhost:5000/login"
      : "http://localhost:5000/signup";

    const body = isLogin
      ? { email: form.email, password: form.password }
      : form;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (isLogin && data.token) {
        localStorage.setItem("token", data.token);
        alert("Login successful");
      } else {
        alert(data.message || "Success");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-orange-400">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[350px]">
        
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        {!isLogin && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="text-center mt-4 text-sm text-gray-600 cursor-pointer hover:underline"
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}
export default Auth;