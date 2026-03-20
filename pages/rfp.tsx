import React, { useState } from "react";
import Head from "next/head";
import Link from "@components/Link";
import TextLink from "@components/TextLink";
import Button from "@components/Button";
import { Logomark } from "@components/Logo";
import ScrollEntrance from "@components/ScrollEntrance";
import cx from "classnames";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { fetchRfps, type RfpData } from "@/lib/rfps";

/* ─────────────────────── Header ─────────────────────────────── */

const SiteHeader = () => (
  <div className="sticky top-0 z-[11] h-0">
    <header className="main-header bg-bg h-header-height-expanded transition-all">
      <div className="px-margin grid grid-cols-2 gap-gutter items-center h-full">
        <div className="h-full flex items-center">
          <TextLink to="/" underlined={false}>
            Logos
          </TextLink>
        </div>
        <div className="flex items-center h-full justify-end">
          <div className="w-header-logo-width">
            <Link to="/" title="Go to homepage" className="block">
              <Logomark className="flex items-center" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  </div>
);

/* ───────────── RFP Grid Card ────────────────────────────────── */

const RfpCard = ({ rfp }: { rfp: RfpData }) => (
  <div>
    <Link
      to={rfp.githubUrl}
      target="_blank"
      className="p-gutter border rounded-[12px] h-full flex flex-col gap-gutter aspect-square transition-[background] hover:bg-main!"
    >
      <div className="w-full grow space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="body-tiny opacity-60">{rfp.number}</span>
          {rfp.status && (
            <span
              className={cx("body-tiny px-2 py-[2px] rounded-full", {
                "bg-green-100 text-green-800": rfp.status.toLowerCase().includes("open"),
                "bg-yellow-100 text-yellow-800": rfp.status.toLowerCase().includes("draft"),
                "bg-blue-100 text-blue-800": rfp.status.toLowerCase().includes("completed") || rfp.status.toLowerCase().includes("closed"),
              })}
            >
              {rfp.status}
            </span>
          )}
        </div>
        <p className="h5 sans text-balance max-w-[14em]">{rfp.title}</p>
        {rfp.category && (
          <span className="body-tiny opacity-60">{rfp.category}</span>
        )}
        <div className="mt-gutter">
          <Button as="span" className="secondary" arrow>
            Learn More
          </Button>
        </div>
      </div>
      {rfp.summary && (
        <div className="w-full flex items-end">
          <p className="body-tiny max-w-[26em]">{rfp.summary}</p>
        </div>
      )}
    </Link>
  </div>
);

/* ───────────── RFP List Row ─────────────────────────────────── */

const RfpRow = ({
  index,
  rfp,
}: {
  index: number;
  rfp: RfpData;
}) => (
  <li className={cx("theme-light-grey", { "bg-[#1525210D]!": index % 2 !== 0 })}>
    <div className="px-margin py-gutter flex gap-y-gutter flex-wrap lg:grid lg:grid-cols-12 lg:gap-x-gutter lg:min-h-[70px]">
      <div className="grow sm:grow-0 flex gap-1 items-baseline sm:w-[calc(50%-var(--spacing-gutter)/2)] sm:mr-gutter lg:col-span-1 lg:mr-0 lg:w-full">
        <span className="body grow-0 shrink-0 w-[2em]">
          {rfp.number.replace("RFP-", "")}
        </span>
      </div>
      <div className="grow sm:grow-0 flex gap-1 items-baseline lg:col-span-3 lg:w-full">
        <span className="body serif">{rfp.title}</span>
      </div>
      <div className="order-3 w-full lg:order-2 lg:col-span-4 sm:pl-[calc(50%+var(--spacing-gutter)/2)] lg:pl-0">
        <p className="text-balance body-tiny whitespace-pre-wrap max-w-[32em]">
          {rfp.summary}
        </p>
      </div>
      <div className="order-2 lg:order-3 lg:col-span-2">
        <div className="flex gap-2 flex-wrap">
          {rfp.category && (
            <span className="body-tiny opacity-60">{rfp.category}</span>
          )}
          {rfp.status && (
            <span className="body-tiny opacity-60">· {rfp.status}</span>
          )}
        </div>
      </div>
      <div className="order-4 lg:order-4 lg:col-span-2">
        <TextLink to={rfp.githubUrl} target="_blank" arrow>
          View RFP
        </TextLink>
      </div>
    </div>
  </li>
);

/* ──────────────────────── Page ──────────────────────────────── */

export default function RfpPage({
  rfps,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <>
      <Head>
        <title>RFPs | Logos Builders Hub</title>
        <meta name="description" content="Apply for funded proposals. The Logos RFP Program backs developers building on the decentralized tech stack." />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="RFPs | Logos Builders Hub" />
        <meta property="og:description" content="Apply for funded proposals. The Logos RFP Program backs developers building on the decentralized tech stack." />
        <meta property="og:url" content="https://build.logos.co/rfp" />
        <meta property="og:image" content="https://build.logos.co/og.jpeg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Logos_network" />
        <meta name="twitter:title" content="RFPs | Logos Builders Hub" />
        <meta name="twitter:description" content="Apply for funded proposals. The Logos RFP Program backs developers building on the stack." />
        <link rel="canonical" href="https://build.logos.co/rfp" />
      </Head>
      <div id="Layout">
        <SiteHeader />

        <main
          id="content"
          className="flex w-full"
          style={{
            paddingTop:
              "calc(var(--spacing-header-height-expanded) + var(--spacing-gutter))",
          }}
        >
          <div className="grow w-full">
            {/* ── Back Link ── */}
            <section className="theme-default">
              <div className="mx-auto px-margin max-w-site-max-w-margin">
                <TextLink to="/" arrow arrowPosition="left" underlined={false}>
                  BUILDERS HUB
                </TextLink>
              </div>
            </section>

            {/* ── Page Header ── */}
            <section className="pt-v-space-sm pb-half-v-space theme-default">
              <div className="mx-auto px-margin max-w-site-max-w-margin">
                <ScrollEntrance className="grid gap-gutter grid-cols-12">
                  <div className="col-span-5">
                    <h1 className="h2 text-balance flex items-center gap-3">
                      <img src="/mark.svg" alt="" className="h-[0.8em]" />
                      RFPs
                    </h1>
                  </div>
                  <div className="col-span-4 flex items-center">
                    <p className="body-tiny max-w-[26em] text-balance">
                      The Logos RFP Program funds developers to build
                      applications on the Logos Stack. Browse all open requests
                      for proposals below.
                    </p>
                  </div>
                  <div className="col-span-3 flex items-center justify-end">
                    <Button
                      to="https://github.com/logos-co/rfp"
                      target="_blank"
                      arrow
                    >
                      View the Repo
                    </Button>
                  </div>
                </ScrollEntrance>

                {/* ── View Toggle ── */}
                <div className="mt-v-space-sm flex items-center gap-3">
                  <button
                    onClick={() => setView("grid")}
                    className={cx("h6 cursor-pointer pb-1", {
                      "animate-underline underlined": view === "grid",
                      "opacity-50": view !== "grid",
                    })}
                  >
                    GRID
                  </button>
                  <span className="h6 opacity-30">/</span>
                  <button
                    onClick={() => setView("list")}
                    className={cx("h6 cursor-pointer pb-1", {
                      "animate-underline underlined": view === "list",
                      "opacity-50": view !== "list",
                    })}
                  >
                    List
                  </button>
                </div>
              </div>
            </section>

            {/* ── RFP Content ── */}
            <section className="pb-v-space theme-default">
              {view === "grid" ? (
                <div className="mx-auto px-margin max-w-site-max-w-margin">
                  <ScrollEntrance className="grid gap-x-gutter gap-y-v-space-sm grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                    {rfps.map((rfp) => (
                      <RfpCard key={rfp.number} rfp={rfp} />
                    ))}
                  </ScrollEntrance>
                </div>
              ) : (
                <ScrollEntrance>
                  <ol>
                    {rfps.map((rfp, i) => (
                      <RfpRow key={rfp.number} index={i} rfp={rfp} />
                    ))}
                  </ol>
                </ScrollEntrance>
              )}
              {rfps.length === 0 && (
                <div className="px-margin py-v-space text-center">
                  <p className="body-tiny opacity-60">No RFPs found.</p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

/* ─────────────── Fetch RFPs from GitHub at build time ────────── */

export const getStaticProps: GetStaticProps<{ rfps: RfpData[] }> = async () => {
  try {
    const rfps = await fetchRfps();
    return { props: { rfps }, revalidate: 3600 };
  } catch (err) {
    console.error("Failed to fetch RFPs:", err);
    return { props: { rfps: [] }, revalidate: 60 };
  }
};
