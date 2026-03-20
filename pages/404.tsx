import React from "react";
import Head from "next/head";
import Button from "@components/Button";
import SiteLayout from "@components/SiteLayout";

export default function Custom404() {
  return (
    <SiteLayout>
      <Head>
        <title>404 — Page Not Found | Logos</title>
      </Head>

      <section className="py-v-space theme-default">
        <div className="mx-auto px-margin max-w-site-max-w-margin text-center">
          <span className="font-mono text-[6rem] md:text-[10rem] leading-none font-light opacity-[0.07] select-none block">
            404
          </span>
          <h1 className="h3 mt-4">Page not found</h1>
          <p className="body-tiny opacity-60 mt-4 max-w-[28em] mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-v-space-sm">
            <Button to="/" arrow>
              Back to Builder Hub
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
