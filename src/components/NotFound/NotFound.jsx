import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  function navigateToLogin() {
    navigate("/login");
  }
  return (
    <div className="text-white flex-column  d-flex justify-content-center align-items-center fs-1 mt-5 w-50 mx-auto">
      <p>الصفحة غيرموجودة </p>
      <button onClick={navigateToLogin} className="btn btn-secondary fs-3">
        عودة
      </button>
    </div>
  );
}
