"use client";

import "../auth.css";
import { useEffect, memo, useState, useRef } from "react";
import { useRouter } from "@/hooks/useRouter";
import { useAuth } from "@/hooks/useAuth";
import { setUser } from "@/redux/slices/userSlice";
import { clearError } from "@/redux/slices/authSlice";
import { useFormik } from "formik";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import { FaUser, FaKeyboard } from "react-icons/fa";
import type { User } from '@/types/user'
import * as Yup from "yup";

export default memo(function Login() {
  const router = useRouter();
  const tabRefs = useRef<HTMLDivElement[]>([]);
  const { loading, error, login } = useAuth();
  const [loginOptionSelected, setLoginOptionSelected] = useState("login");
  const tabs = ["login", "guest"];
  const indicatorStyle = {
    transform: `${loginOptionSelected === "login" ? "translateX(0)" : "translateX(108.333%)"}`,
  };

  const initialValues = {
    userName: "",
    password: "",
  };

  /*useEffect(() => {
		if(isAuthenticated && !loading){
			router.push('/dashboard')
		}
	}, [isAuthenticated, loading])*/

  const validationSchema = () => {
    if (loginOptionSelected === "guest") {
      return Yup.object().shape({});
    }
    return Yup.object().shape({
      userName: Yup.string().required("Campo obligatorio"),
      password: Yup.string().required("Campo obligatorio"),
    });
  };

  const onSubmit = async (values: { userName: string, password: string}) => {
    try {
      const result = await
        login({
          userName:
            loginOptionSelected === "login" ? values.userName : "Invitado",
          password:
            loginOptionSelected === "login"
              ? values.password
              : "guestpassword123",
        }).unwrap();
      // Si el login es exitoso, también actualizar el user slice
      if (result.profile_icon) setUser(result);

      // Redirigir al dashboard
    } catch (error) {
      // El error ya está manejado por el slice
      console.error("Login failed:", error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const {
    handleChange,
    handleSubmit,
    /*errors,*/ handleBlur,
    /*touched,*/ values,
  } = formik;

  useEffect(() => {
    // Limpiar error cuando cambian los valores
    if (error) {
      clearError();
    }
  }, [values.password, values.userName, loginOptionSelected]);

  const isButtonDisabled =
    loginOptionSelected === "login" &&
    (loading || values.userName.trim() === "" || values.password.trim() === "");

  return (
    <div className="main-menu">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="logo-container">
          <Image
            className="riot-games-logo"
            src="/riot-games.png"
            width={200}
            height={60}
            alt="RiotGames logo"
          />
        </div>
        <div className="login-switch">
          {tabs.map((tab, index) => (
            <div
              key={tab}
              className={`switch-option ${loginOptionSelected === tab && "active"} ${loading ? "disabled" : ""}`}
              onClick={() => (!loading ? setLoginOptionSelected(tab) : null)}
              ref={(el) => {
                if(el === null) return
                tabRefs.current[index] = el
              }}
            >
              {tab === "login" && <FaKeyboard className="switch-option-icon" />}
              {tab === "guest" && <FaUser className="switch-option-icon" />}
              <span>{tab === "login" ? "Sign-in" : "Guest"}</span>
            </div>
          ))}
          <div className="active-indicator"><div style={indicatorStyle} className="active-indicator-inner"></div></div>
        </div>
        <div
          className="auth-loading-spinner"
          style={{ display: loading ? "block" : "none" }}
        >
          <img src="/red-loading-circle.png" alt="loading spinner" />
        </div>
        <section
          className="form-interface"
          style={{ display: loading ? "none" : "flex" }}
        >
          <div className="error-box" style={{ marginBottom: error ? "10px" : "0" }}>{error ? error : null}</div>
          <div
            className="form-inputs"
            style={{
              opacity: loginOptionSelected == "login" ? "1" : "0",
              pointerEvents: loginOptionSelected == "login" ? "auto" : "none",
            }}
          >
            <div
              className={`auth-input-wrapper ${error ? "errorMessage" : null}`}
            >
              <input
                name="userName"
                type="text"
                className="auth-input"
                id="userName"
                placeholder=" "
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <label className="label-placeholder" >
                username
              </label>
            </div>
            {/*errors.userName && touched.userName && <div className="error-text">{errors.userName}</div>*/}
            <div
              className={`auth-input-wrapper ${error ? "errorMessage" : null}`}
            >
              <input
                name="password"
                type="password"
                className="auth-input"
                id="password"
                placeholder=" "
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <label className="label-placeholder">
                password
              </label>
            </div>
          </div>
        </section>
        {/*errors.password && touched.password && <div className="error-text">{errors.password}</div>*/}
        <div className="actions-box">
          <button
            className={`login-button ${isButtonDisabled ? "disabled" : null}`}
            style={{ display: loading ? "none" : "flex" }}
            type="submit"
          >
            <FaArrowRight />
          </button>
          <a className="auth-link" onClick={() => router.push("/register", {})}>Create account</a>
          <div className="disclaimer">
            <span className="disclaimer-line">
              THIS APP IS PROTECTED BY HCAPCHA AND ITS
            </span>
            <span className="disclaimer-line">
              <a>PRIVACY POLICY</a> AND <a>TERMS OF SERVICE</a> APPLY.
            </span>
          </div>
        </div>
      </form>
    </div>
  );
});
