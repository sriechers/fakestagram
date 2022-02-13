import { useState } from "react";
import Head from "next/head";
import Layout, { Scaffold, Measure } from "../components/Layout";
import { getSession } from "next-auth/react";
import Searchbar, { SearchResults } from "../components/Searchbar";
function Search({ session }) {
  const [searchResults, setSearchResults] = useState();
  return (
    <>
      <Head>
        <title>Search</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Measure>
        <Scaffold>
          <h1>Search</h1>
          <section className="bg-white rounded-md px-6 py-4">
          <Searchbar
            placeholderText="search…"
            onSearch={(data) => setSearchResults(data)}
            showSuggestions={false}
          />
          <SearchResults searchResult={searchResults} />
          </section>
        </Scaffold>
      </Measure>
    </>
  );
}

Search.getLayout = function getLayout(page) {
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

export default Search;
