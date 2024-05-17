import React, { useEffect, useState } from "react";
import solidierImg from "../../images/solidierImg.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {DOMAIN , TOKEN}  from'../../config'



export default function Register() {
  const navigate = useNavigate();
  let [errorMsg, setErrorMsg] = useState("");
  let [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // Set a timer to clear the error message after 3 seconds
    const timer = setTimeout(() => {
      setErrorMsg("");
    }, 3000);
    // Clean up the timer when the component unmounts or when errorMsg changes
    return () => clearTimeout(timer);
  }, [errorMsg]);

  async function login(username, password, passwordAdmin) {
    const departments = ['amn' , 'motab3a' , 'takhteet' ,'tadreeb' , 'tasleeh' , 'afrad' , 'e_mahalya' ,'off_a' ,'it' , 'remaya', 'admin' ];
    if(departments.includes(username.split('@')[1])){
      try {
        let res = await axios.post(
          `${DOMAIN}/api/v1/auth/signup`,
          {
            user_name: username,
            password,
            password_admin: passwordAdmin,
          }
        );
  
        // If login is successful, navigate to the Archive component
  
        setTimeout(() => {
          navigate("/login");
        }, 500);
        setSuccessMsg("success");
        console.log("registered successfully");
      } catch (err) {
        let errorMessage = err.response.data;
        // if(err instanceof Error) errorMessage = 'يجب التسجيل تابع لقسم';
        console.log(username, password);
        console.log(err.response.data);
        setErrorMsg(errorMessage);
      }

    }else if(username){
      toast.error('اسم المستخدم غير مسجل لجهة')
    }
    else{
      toast.error('يرجي ادخال جميع الخانات')
    }
    
  }

  // creating validation regex using yup
  // const validationSchema = Yup.object().shape({
  //   username: Yup.string().required("   اسم المستخدم او كلمة المرور غير صحيحة"),
  //   password: Yup.string().required("اسم المستخدم او كلمة المرور غير صحيحة "),
  // });

  // setting up formik for the form below

  let formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      passwordAdmin: "",
    },

    // validationSchema,

    onSubmit: async (values) => {
      await login(values.username, values.password, values.passwordAdmin);
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
          <p className="img-description ">
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
            {successMsg && <div>تـم إنـــشـاء الحســاب</div>}

            {errorMsg && <div>حدث خطأ</div>}

            <h2 className="form-title text-center my-4">إنـــشـاء حســاب</h2>
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
            <input
              name="passwordAdmin"
              value={formik.values.passwordAdmin}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="password"
              placeholder=" كلمة المرور الرئيسية"
              className="mb-4 mt-3 form-control password"
            />
            <button type="submit" className="submit-btn btn  ">
              إنـــشـاء
            </button>
            <div className="loginNavigatorContainer d-flex  justify-content-start">
              <p>لديك حساب؟ </p>
              <Link className="loginNavigator" to="/">
                تسجيل دخول
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
