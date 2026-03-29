import { useContext, useState } from "react";
import { AlertContext } from "../../context/alertContext";
import { Input } from "../UI/Input";
import { Button } from "../UI/Button";
import { LinkIcon, ScissorsIcon } from "lucide-react";
import { FormWarning } from "./FormWarning";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
const apiUrl = import.meta.env.VITE_API_URL;

export const Form = () => {
  const { showAlert } = useContext(AlertContext);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const originalLink = formData.get("originalUrl")?.toString() ?? "";
    const customName = formData.get("customName")?.toString() ?? "";

    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalLink,
          code: customName,
          email: user?.email,
        }),
      });

      if (res.ok) {
        showAlert({
          type: "success",
          title: "Link Created",
          message: "Your shortened link has been created successfully.",
        });
        form.reset();
        setLoading(false);
      } else {
        const errorData = await res.json();
        showAlert({
          type: "error",
          title: "Error Creating Link",
          message: errorData.message || "There was an error creating the link.",
        });
        form.reset();
        setLoading(false);
      }
    } catch (error) {
      showAlert({
        type: "error",
        title: "Error Creating Link",
        message:
          (error as Error).message || "There was an error creating the link.",
      });
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, transform: "translateY(-20px)" }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      exit={{ opacity: 0, transform: "translateY(20px)" }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="mx-2 bg-gray-700/30 w-full max-w-2xl flex flex-col items-start p-8 rounded-2xl gap-2.5"
    >
      <div className="flex items-center gap-2 pb-2.5">
        <LinkIcon className="text-emerald-400" />
        <h2 className="text-2xl font-bold">Shorten URL</h2>
      </div>
      {!user && <FormWarning />}

      <Input
        required
        placeholder="https:/example.com/a-very-long-link"
        name="originalUrl"
        text="Original URL"
        type="url"
      ></Input>
      <Input
        placeholder="my-custom-code"
        name="customName"
        text="Custom name (optional)"
      ></Input>

      <p className="text-gray-400 pb-2">
        *If you do not specify a name, it will be generated automatically.
      </p>

      <Button
        text={loading ? "Creating..." : "Shorten link"}
        type="submit"
        icon={<ScissorsIcon size={16}></ScissorsIcon>}
        className="w-full"
      />
    </motion.form>
  );
};
