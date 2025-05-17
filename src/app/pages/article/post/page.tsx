"use client";
import Footer from "@/components/pages/components/Footer";
import Header from "@/components/pages/components/Header";
import TemuCerita from "@/components/pages/components/TemuCeritaEditor";
import Head from "next/head";

export default function EditorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Head>
        <title>TemuCerita -</title>
        <meta
          name="description"
          content={`Discover stories and articles on TemuCerita`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow flex items-center justify-center px-4">
        <TemuCerita />
      </main>

      <Footer />
    </div>
  );
}
