import React from "react";
import cx from "classnames";

const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-current/[0.04] before:to-transparent";

export function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "h-3 rounded-full bg-current/[0.06]",
        shimmer,
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="p-gutter border rounded-[12px] aspect-square flex flex-col gap-gutter animate-pulse">
      <div className="flex items-baseline justify-between">
        <div className="h-3 w-12 rounded-full bg-current/[0.06]" />
        <div className="h-4 w-14 rounded-full bg-current/[0.06]" />
      </div>
      <div className="space-y-2 mt-2">
        <div className="h-5 w-3/4 rounded bg-current/[0.06]" />
        <div className="h-5 w-1/2 rounded bg-current/[0.06]" />
      </div>
      <div className="h-3 w-20 rounded-full bg-current/[0.06] mt-2" />
      <div className="mt-auto">
        <div className="h-8 w-28 rounded-full bg-current/[0.06]" />
      </div>
      <div className="space-y-1.5 mt-auto">
        <div className="h-2.5 w-full rounded-full bg-current/[0.06]" />
        <div className="h-2.5 w-4/5 rounded-full bg-current/[0.06]" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <li className="animate-pulse">
      <div className="px-margin py-gutter flex gap-y-gutter flex-wrap lg:grid lg:grid-cols-12 lg:gap-x-gutter lg:min-h-[70px]">
        <div className="lg:col-span-1">
          <div className="h-4 w-8 rounded bg-current/[0.06]" />
        </div>
        <div className="lg:col-span-3">
          <div className="h-4 w-32 rounded bg-current/[0.06]" />
        </div>
        <div className="lg:col-span-4">
          <div className="space-y-1.5">
            <div className="h-3 w-full rounded-full bg-current/[0.06]" />
            <div className="h-3 w-3/4 rounded-full bg-current/[0.06]" />
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="h-3 w-16 rounded-full bg-current/[0.06]" />
        </div>
        <div className="lg:col-span-2">
          <div className="h-3 w-16 rounded-full bg-current/[0.06]" />
        </div>
      </div>
    </li>
  );
}

export function SkeletonIssueRow() {
  return (
    <li className="border-b last:border-b-0 animate-pulse">
      <div className="flex items-start gap-3 px-gutter py-3">
        <div className="mt-0.5 shrink-0 w-3.5 h-3.5 rounded-full bg-current/[0.06]" />
        <div className="flex-1 min-w-0">
          <div className="h-4 w-3/4 rounded bg-current/[0.06]" />
          <div className="flex items-center gap-3 mt-2">
            <div className="h-2.5 w-16 rounded-full bg-current/[0.06]" />
            <div className="h-2.5 w-20 rounded-full bg-current/[0.06]" />
            <div className="h-2.5 w-14 rounded-full bg-current/[0.06]" />
          </div>
        </div>
      </div>
    </li>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-x-gutter gap-y-v-space-sm grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 6 }: { count?: number }) {
  return (
    <ol>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </ol>
  );
}

export function SkeletonIssueList({ count = 8 }: { count?: number }) {
  return (
    <ul>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonIssueRow key={i} />
      ))}
    </ul>
  );
}
