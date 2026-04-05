import React from "react";
import Authlayout from "./Authlayout.jsx";
import Authcard from "./Authcard.jsx";
import AuthHeader from "./AuthHeader.jsx";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

export default function Setpass() {
  const navigate = useNavigate();
  let newpass = {
    password: "",
    confirmPassword: "",
  };
  function setpass() {
    navigate("/Passsuccess");
  }
  const login = useFormik({
    initialValues: newpass,
    onSubmit: setpass,
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
  });

  return (
    <Authlayout>
      <Authcard width="546px" height="332px">
        <AuthHeader
          title="Set new password"
          subtitle="Your new password must be different from previous used passwords"
        />
        <form
          onSubmit={login.handleSubmit}
          style={{
            width: "388px",
            height: "255px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <input
            name="password"
            value={login.values.password}
            onChange={login.handleChange}
            onBlur={login.handleBlur}
            className="auth-input"
            type="password"
            placeholder="password"
          />
          {login.touched.password && login.errors.password && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {login.errors.password}
            </div>
          )}

          <input
            name="confirmPassword"
            value={login.values.confirmPassword}
            onChange={login.handleChange}
            onBlur={login.handleBlur}
            className="auth-input"
            type="password"
            placeholder="confirm password"
          />
          {login.touched.confirmPassword && login.errors.confirmPassword && (
            <div style={{ color: "red", fontSize: "12px" }}>
              {login.errors.confirmPassword}
            </div>
          )}
          <button type="submit" className="auth-button">
            Reset password
          </button>
        </form>
      </Authcard>
     
    </Authlayout>
  );
}
