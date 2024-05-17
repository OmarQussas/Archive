import React, { useContext, useEffect, useState } from "react";
import solidierImg from "../../images/solidierImg.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { DOMAIN } from "../../config";
import { TokenContext } from "../../context/TokenContext";

export default function Login() {
  const navigate = useNavigate();
  let [errorMsg, setErrorMsg] = useState("");

  let { token, setToken, removeToken } = useContext(TokenContext);

  async function saveTokenToLocalStorage(token) {
    await localStorage.setItem("token", token);
  }

  async function login(username, password) {
    console.log("login working");
    console.log(username);
    console.log(password);
    try {
      let res = await axios.post(`${DOMAIN}/api/v1/auth/login`, {
        user_name: username,
        password,
      });

      // Save the token to localStorage or sessionStorage
      saveTokenToLocalStorage(res.data.token);
      setToken(res.data.token);

      // or sessionStorage.setItem('token', res.data.token);
      console.log("login  successfull");

      // If login is successful, navigate to the Archive component
      navigate("/archive");
    } catch (err) {
      console.log(username, password);
      console.log(err.response.data);
      setErrorMsg(err.response.data);
    }
  }

  // creating validation regex using yup
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("   اسم المستخدم او كلمة المرور غير صحيحة"),
    password: Yup.string().required("اسم المستخدم او كلمة المرور غير صحيحة "),
  });

  // setting up formik for the form below

  let formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },

    validationSchema,

    onSubmit: async (values) => {
      await login(values.username, values.password);
    },
  });

  return (
    <div className="">
      <div className=" signin-container ">
        {/* img container */}
        <div className="img-container  ">
          <img
            className="solidier-img  "
            src={solidierImg}
            alt="Description of the image"
          />
          <p className="img-description">
            تصميم و تنفيذ فرع نظم المعلومات إدارة المشاة
          </p>
        </div>

        {/* form container */}
        <div className="form-container">
          <form className="form" onSubmit={formik.handleSubmit}>
            {formik.errors.password &&
              formik.touched.password &&
              formik.errors.username &&
              formik.touched.username && (
                <div className="alert py-1 alert-secondary">
                  {formik.errors.password}
                </div>
              )}
            {errorMsg && (
              <div className="alert alert-secondary py-2">
                {" "}
                الاسم او كلمة المرور غير صحيحة
              </div>
            )}
            <h2 className="form-title text-center my-4">تسجيــل الدخـول</h2>
            <input
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              className="mt-4 mb-2 form-control user-name"
              placeholder="اسم المستخدم"
            />
            <input
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="password"
              placeholder="كلمة المرور"
              className="mb-4 mt-3 form-control password"
            />
            <button type="submit" className="submit-btn btn  ">
              دخــول
            </button>
            <div className="loginNavigatorContainer d-flex justify-content-start">
              <p>ليس لديك حساب؟ </p>
              <Link className="loginNavigator" to="/register">
                إنشاء حساب
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
