import React from "react";

const RegisterPage = () => {
  return (
    <div className="border-2 border-mist-50 text-white flex justify-center flex-col h-1/2 w-1/4 rounded-2xl p-10">
      <h1 className="flex justify-center">Login Page</h1>

      <div>
        <form>
          <h2>Enter your username</h2>
          <input
            type="email"
            required="true"
            placeholder="Enter your username"
            className="border border-mist-50 rounded-xl"
          />  
          <h2>Enter your email address</h2>
          <input
            type="email"
            required="true"
            placeholder="Enter your email"
            className="border border-mist-50 rounded-xl"
          />

          <h2>Enter your password</h2>
          <input
            type="text"
            required="true"
            placeholder="Enter your password"
            className="border border-mist-50 rounded-xl"
          />

          <h2>Confirm password</h2>
          <input
            type="text"
            required="true"
            placeholder="Enter your password"
            className="border border-mist-50 rounded-xl"
          />

          <h3>Already have an account? <a>Login Now</a></h3>

          <button className="bg-gray-600 w-full p-2 rounded-2xl mt-3">
            Register & Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
