import { Button } from "../UI/Button";
import { Logo } from "../UI/Logo";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 w-full mt-16 px-10">
      <div className="max-w-6xl w-full mx-auto flex flex-col items-center justify-center pt-10">
        <article className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Logo />
            <div>
              <h6 className="font-semibold">Made by Walter Carrazana</h6>
              <p className="text-gray-400">Full Stack Developer</p>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-col md:flex-row">
            <a
              href="https://github.com/warxx-dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                text="GitHub"
                icon={
                  <FaGithub
                    size={16}
                    className="text-gray-400 group-hover:text-white"
                  />
                }
                gradient={false}
                hiddenText={true}
              />
            </a>
            <a
              href="https://www.linkedin.com/in/walter-carrazana-03091335a/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                text="LinkedIn"
                icon={
                  <FaLinkedin
                    size={16}
                    className="text-gray-400 group-hover:text-blue-500"
                  />
                }
                gradient={false}
                hiddenText={true}
              />
            </a>
          </div>
        </article>
        <hr className="text-gray-600 w-full mt-6" />
        <p className="text-gray-400 py-8 px-14">
          © {new Date().getFullYear()} Kwik-it. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
