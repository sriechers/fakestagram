import { Scaffold } from "./Layout";
import { HeartIcon } from "@heroicons/react/solid";
function Footer() {
  return (
    <footer className="bg-white py-5">
      <Scaffold>
        <p className="flex justify-center items-center text-slate-400">
          coded with <HeartIcon className="h-5 w-5 text-rose-500 mx-1" /> by
          <a
            href="https://github.com/sriechers"
            title="visit my github profile"
            className="ml-1 tracking-wide font-medium"
          >
            Steven Riechers
          </a>
        </p>
      </Scaffold>
    </footer>
  );
}

export default Footer;
