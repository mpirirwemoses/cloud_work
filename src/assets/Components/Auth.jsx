import { useState } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password || (!isLogin && !form.username)) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const url = isLogin ? "/login" : "/signup";

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

      if (res.ok) {
        if (data.token) {
          localStorage.setItem("token", data.token);
          alert("✅ Login successful");
        } else {
          alert("✅ Account created");
          setIsLogin(true);
        }

        // Reset form
        setForm({
          username: "",
          email: "",
          password: ""
        });

      } else {
        alert(data.message || "Something went wrong");
      }

    } catch (err) {
      console.error(err);
      alert("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 to-orange-400">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[360px]">

        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h2>

        {/* Username (Signup only) */}
        {!isLogin && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
        )}

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
        </button>

        {/* Toggle */}
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
};

export default Auth;