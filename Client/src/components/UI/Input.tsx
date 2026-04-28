import { useState } from "react";
import type { inputProps } from "../../types";

export const Input = ({
  text,
  type = "text",
  name,
  placeholder,
  required,
  icon,
  defaultValue,
  errors,
  register,
}: inputProps) => {
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [touched, setTouched] = useState<boolean>(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setTouched(password.length > 0);
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!#%*?&]{8,}$/;
    if (name === "repeatPassword") {
      const mainPassword = document.querySelector(
        'input[name="password"]',
      ) as HTMLInputElement | null;
      setValidPassword(mainPassword?.value === password);
    } else {
      setValidPassword(passwordRegex.test(password));
    }
  };

  return (
    <div className="p-1 w-full">
      <label className=" font-medium flex text-slate-300 items-center gap-2">
        {icon}
        {text}
      </label>
      <input
        {...register(name)}
        defaultValue={defaultValue}
        autoComplete={type === "password" ? "current-password" : "off"}
        onChange={type === "password" ? handlePasswordChange : undefined}
        type={type || "text"}
        name={name}
        placeholder={placeholder}
        className={`${
          type === "password" && touched
            ? validPassword
              ? "ring-green-400"
              : "ring-red-400"
            : "focus-visible:ring-emerald-400"
        } p-2.5 rounded-lg bg-gray-900 w-full border border-gray-600 transition-all duration-200 ease-in-out  focus-visible:ring-2 focus-visible:outline-none`}
        {...(required ? { required: true } : {})}
      />
      {errors && <p className="text-red-400">{errors}</p>}
    </div>
  );
};
