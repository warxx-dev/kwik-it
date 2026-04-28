import { Button } from "../UI/Button";
import { Input } from "../UI/Input";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { XIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useState, useContext } from "react";
import { ModalContext } from "../../context/modalContext";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import {
  useForm,
  type FieldValues,
  type SubmitHandler,
  type UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginSchema,
  SigninSchema,
  type LoginData,
  type SigninData,
} from "../../schema/auth-schema";

export const LogInModal = () => {
  const { setLoginModal } = useContext(ModalContext);

  const { login, googleLogin, signin, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
  });
  const signupForm = useForm<SigninData>({
    resolver: zodResolver(SigninSchema),
  });

  const handleSubmitLogIn: SubmitHandler<LoginData> = async (
    data: LoginData,
  ) => {
    await login(data.email, data.password);
    setLoginModal(false);
  };

  const handleSubmitSignIn: SubmitHandler<SigninData> = async (
    data: SigninData,
  ) => {
    const success = await signin(data.name, data.email, data.password);

    if (success) {
      setLoginModal(false);
    }
  };

  const handleClick = () => {
    setIsLogin(!isLogin);
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    const token = credentialResponse.credential;

    await googleLogin(token);

    setLoginModal(false);
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed");
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0, y: "-20px" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "-20px" }}
      transition={{ duration: 0.25 }}
      onClick={(e) => e.stopPropagation()}
      className={`w-full max-w-xs flex-col gap-4 p-6 border border-gray-600 rounded-lg bg-gray-700/30 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 sm:max-w-md `}
    >
      <div className="flex justify-between">
        <h2 className="text-2xl">LogIn</h2>
        <button
          className="hover:cursor-pointer hover:bg-gray-900 rounded-lg p-1"
          onClick={() => setLoginModal(false)}
        >
          <XIcon />
        </button>
      </div>
      <form
        noValidate
        onSubmit={
          isLogin
            ? loginForm.handleSubmit(handleSubmitLogIn)
            : signupForm.handleSubmit(handleSubmitSignIn)
        }
        className="flex flex-col gap-1"
      >
        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-1 overflow-hidden"
            >
              <Input
                errors={signupForm.formState.errors.name?.message}
                register={signupForm.register as UseFormRegister<FieldValues>}
                placeholder="Jhon Doe"
                text="Full Name"
                name="name"
                type="text"
                required={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <Input
          errors={
            isLogin
              ? loginForm.formState.errors.email?.message
              : signupForm.formState.errors.email?.message
          }
          register={
            (isLogin
              ? loginForm.register
              : signupForm.register) as UseFormRegister<FieldValues>
          }
          placeholder="example@email.com"
          text="Email"
          name="email"
          type="email"
          required={true}
        />
        <Input
          errors={
            isLogin
              ? loginForm.formState.errors.password?.message
              : signupForm.formState.errors.password?.message
          }
          register={
            (isLogin
              ? loginForm.register
              : signupForm.register) as UseFormRegister<FieldValues>
          }
          placeholder="••••••••"
          text="Password"
          name="password"
          type="password"
          required={true}
        />
        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-1 overflow-hidden"
            >
              <Input
                errors={signupForm.formState.errors.repeatPassword?.message}
                register={signupForm.register as UseFormRegister<FieldValues>}
                placeholder="••••••••"
                text="Repeat password"
                name="repeatPassword"
                type="password"
                required={true}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          text={loading ? "Loading..." : isLogin ? "Log in" : "Sign up"}
          className="my-4"
          disabled={loading}
        />
      </form>
      <p>
        {isLogin ? "Haven't you registered yet? " : "Already have an account? "}
        <a
          onClick={handleClick}
          className="text-emerald-400 hover:text-emerald-200 cursor-pointer"
        >
          {isLogin ? "Sign up" : "Log in"}
        </a>
      </p>
      <div className="flex items-center gap-2">
        <hr className="flex-1 border-gray-600" />
        <span className="text-xs text-gray-400">O</span>
        <hr className="flex-1 border-gray-600" />
      </div>
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="filled_black"
          size="large"
          text="signin_with"
          shape="rectangular"
        />
      </div>
    </motion.div>,
    document.body,
  );
};
