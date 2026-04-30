"use client";

import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import { useRouter } from "@/hooks/useRouter";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/slices/authSlice.js";
import { FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import "../auth.css";

export default function Register() {
  const [errorMessage, setErrorMessage] = useState();
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const initialValues = {
    userName: "",
    password: "",
  };

  const validationSchema = () =>
    Yup.object().shape({
      userName: Yup.string("Formato incorrecto")
        .required("Campo obligatorio")
        .min(6, "Debe tener al menos 6 caracteres"),
      password: Yup.string().required("Campo obligatorio"),
    });

  const onSubmit = async (values) => {
    setErrorMessage(null);
    const body = {
      userName: values.userName,
      password: values.password,
      id: uuidv4(),
      alias: values.userName,
      tag: "LAS",
      title: "Novice",
      champions: [],
      skins: [],
      messages: [],
      level: 1,
      EXP: 0,
      BE: 2000000,
      RP: 300000,
      rank: {
        name: "Bronze",
        level: 4,
        points: 100,
      },
      profileIcon: "5909",
      background: "Aatrox_30",
      settings: {
        language: "es",
        sound: {
          master: { volume: 1, muted: false },
          sfx: { volume: 2, muted: false },
          music: { volume: 0.5, muted: false },
        },
        theme: "dark",
      },
    };
    dispatch(registerUser(body));
    // Redirigir al dashboard
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
      setErrorMessage(null);
    }
  }, [values.password, values.userName]);

  return (
    <div className="main-menu register">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="logo-container">
          <Image
            className="riot-games-logo"
            src="/riot-games.png"
            width={200}
            height={60}
          />
        </div>
        <div className="register-header">
          <h2 className="register-title">Register</h2>
          <div className="active-indicator"></div>
        </div>
        <div
          className="loading-spinner"
          style={{ display: loading ? "block" : "none" }}
        >
          <img src="/red-loading-circle.png" alt="loading spinner" />
        </div>

        <section
          className="form-interface"
          style={{ display: loading ? "none" : "flex" }}
        >
          <div className="error-box">{errorMessage ? errorMessage : null}</div>
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
            <label className="label-placeholder" for="userName">
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
            <label className="label-placeholder" for="password">
              password
            </label>
          </div>
          {/*errors.password && touched.password && <div className="error-message">{errors.password}</div>*/}
        </section>
        <div className="actions-box">
          <button
            type="submit"
            disabled={!values.password || !values.userName || loading}
            className={`login-button ${!values.userName || !values.password || loading ? "disabled" : null}`}
            style={{ display: loading ? "none" : "flex" }}
          >
            <FaArrowRight />
          </button>
          <a onClick={() => router.push("/login")}>Iniciar Sesión</a>
          <div className="disclaimer">
            <span className="disclaimer-line">
              THIS APP IS PROTECTED BY HCAPCHA AND ITS
            </span>
            <span className="disclaimer-line">
              <a>PRIVACY POLICY</a> AND <a>TERMS OF SERVICE</a> APPLY.
            </span>
          </div>
        </div>

        {/*<svg
          style={{
            color: "#d53235",
            height: "45px",
            width: "45px",
            marginTop: "10vh",
            display: !loading ? "none" : null,
          }}
          fill="#d53235"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke="#d53235"
            styles={{ stroke: "#d53235" }}
            d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
            opacity=".25"
          />
          <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
            <animateTransform
              attributeName="transform"
              type="rotate"
              dur="0.75s"
              values="0 12 12;360 12 12"
              repeatCount="indefinite"
            />
          </path>
          </svg>*/}
      </form>
    </div>
  );
}
