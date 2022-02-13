import { useState } from "react";
import { signIn, getProviders, getSession } from "next-auth/react";
import Button from "../components/Button";
import Image from "next/image";
import LoadingSpinner from "../components/LoadingSpinner";
function Login({ providers }) {
  const [loading, setLoading] = useState(false);
  const handleSignIn = (providerId) => {
    setLoading(true);
    signIn(providerId);
  };

  return (
    <div className="flex lg:justify-between justify-center items-center h-screen bg-gray-100">
      <div className="lg:relative lg:w-1/2 fixed w-screen h-screen z-0">
        <Image
          priority
          src="/img/mountains.png"
          alt="mountains background"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="z-10 mx-auto -mt-5 flex flex-col w-full md:max-w-md sm:max-w-sm max-w-[80vw] px-4 py-8 bg-white rounded-lg shadow-2xl shadow-blue-100 sm:px-6 md:px-8 lg:px-10">
        <h1 className="text-center mb-6 text-xl font-bold text-slate-600 sm:text-2xl">
          Welcome to Fakestagram!
        </h1>
        <div className="flex items-center justify-center w-full">
          {Object.values(providers).map((provider) => (
            <div key={provider.name} className="flex justify-center">
              <Button
                disabled={loading}
                className={`${loading ? "opacity-80" : ""} relative`}
                onClick={() => handleSignIn(provider.id)}
              >
                Sign in with {provider.name} {loading && <LoadingSpinner />}
              </Button>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-10 px-6 max-w-lg">
          DISCLAIMER: Since this project is a prototype, I have not optimized
          every little thing for speed and performance. In addition, the
          database and the hasura server run as a free tier and therefore the
          performance can vary greatly.
        </p>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      providers: await getProviders(),
    },
  };
}

export default Login;
