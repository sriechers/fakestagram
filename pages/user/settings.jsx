import Head from "next/head";
import Layout, { Scaffold, Measure } from "../../components/Layout";
import Select from "../../components/forms/Select";
import { ClockIcon } from "@heroicons/react/outline";
import { getSession } from "next-auth/react";
import { useQuery, useMutation } from "@apollo/client";
import { USER_SETTING, UPDATE_USER_SETTINGS } from "../../db/queries";
function Settings({ session }) {
  const defaultValues = {
    timezone: ["Europe/Berlin", "America/Chicago"],
  };

  const { data, loading, error } = useQuery(USER_SETTING, {
    variables: {
      userId: session?.user?.id,
    },
    context: {
      headers: {
        authorization: session?.hasuraToken
          ? `Bearer ${session.hasuraToken}`
          : "",
      },
    },
  });

  const [
    updateSettings,
    { error: updateSettingsError, loading: loadingUpdate },
  ] = useMutation(UPDATE_USER_SETTINGS, {
    variables: {
      userId: session?.user?.id,
    },
    context: {
      headers: {
        authorization: session?.hasuraToken
          ? `Bearer ${session.hasuraToken}`
          : "",
      },
    },
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

  console.log(data);

  if (error) {
    console.error("[ERROR FETCHING SETTINGS]", error);
    return (
      <p className="text-rose-500 tracking-wide px-3 text-center">
        There was an error loading your settings!
      </p>
    );
  }

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
            {returnSettings(defaultValues, (value) => {
              updateSettings({
                variables: {
                  userId: session.user.id,
                  timezone: value,
                },
              });
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
