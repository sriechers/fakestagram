import Head from "next/head";
import Layout, { Scaffold, Measure } from "../../components/Layout";
import { useLocalStorage } from "../../util/hooks";
import Select from "../../components/forms/Select";
import { ClockIcon } from "@heroicons/react/outline";
import { getSession } from "next-auth/react";
function Settings({ session }) {
  const [settings, setSetting] = useLocalStorage("fakestagram:user:settings", {
    timezone: ["Europe/Berlin", "America/Chicago"],
  });

  const returnSettings = (_settings, onSelect) => {
    for (const key in _settings) {
      let Icon = <></>;
      switch (key) {
        case "timezone":
          Icon = (
            <ClockIcon className="h-9 w-9 basis-5 grow-0 shrink-0 text-slate-800" />
          );
          break;
      }

      return (
        <li className="flex items-center justify-between flex-wrap">
          <div className="flex items-center">
            {Icon}
            <h2 className="capitalize text-slate-800 md:text-xl text-base md:ml-3 ml-2 mb-[2px] font-normal leading-tight">
              {key}
            </h2>
          </div>
          <Select
            onSelect={(value) => onSelect(value)}
            title={_settings[key][0]}
            value={_settings[key]}
          />
        </li>
      );
    }
  };

  return (
    <>
      <Head>
        <title>Settings</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Measure>
        <Scaffold>
          <h1>Settings</h1>
          <ul className="md:max-w-md mt-8 border-2 border-slate-200 rounded-lg px-4 py-3">
            {returnSettings(settings, (value) => {
              setSetting((prev) => ({ ...prev, value }));
            })}
          </ul>
        </Scaffold>
      </Measure>
    </>
  );
}

Settings.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default Settings;
