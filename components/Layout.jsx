import AppBar from "./AppBar";
import NavBar from "./NavBar";
import LoadingScreen from "./LoadingScreen";
import Footer from "./Footer";

export function Measure(props) {
  return (
    <div
      {...props}
      className={`${
        props.className ? props.className : ""
      } mx-auto max-w-screen-2xl`}
    >
      {props.children}
    </div>
  );
}

export function Scaffold(props) {
  return (
    <div
      {...props}
      className={`${
        props.className ? props.className : ""
      } px-8 md:px-10 lg:px-16`}
    >
      {props.children}
    </div>
  );
}

export const LayoutOnlyNav = ({ children }) => {
  return (
    <>
      <AppBar />
      <LoadingScreen />
      {children}
      <NavBar />
    </>
  );
};

export default function Layout({ children }) {
  return (
    <>
      <AppBar />
      <LoadingScreen />
      <main className="pt-10 pb-12 bg-slate-50 min-h-screen">{children}</main>
      <Footer />
      <NavBar />
    </>
  );
}
