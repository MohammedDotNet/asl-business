"use client";

import { useState, type FormEvent } from "react";

const gridTiles = Array.from({ length: 24 }, (_, index) => index);
const highlightedTiles = new Set([1, 4, 6, 9, 14, 17, 19, 21]);

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(
      "لم يتم ربط تسجيل الدخول بخدمة مصادقة بعد. لم تُرسل بياناتك.",
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden lg:flex-row">
      <main className="z-10 flex w-full flex-col justify-between bg-white px-6 py-8 sm:px-12 md:px-16 lg:w-[58%] lg:px-20 xl:px-24">
        <header className="flex w-full items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="flex size-10 items-center justify-center rounded-lg bg-brand-900 text-white shadow-sm ring-1 ring-black/5"
            >
              <span className="font-cairo text-xl leading-none font-bold">
                أ
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg leading-snug font-bold tracking-tight text-slate-900">
                أصل
              </span>
              <span
                dir="ltr"
                className="font-latin text-xs font-medium tracking-wide text-slate-400"
              >
                ASL Business Wholesale
              </span>
            </div>
          </div>
          <span className="rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-xs text-slate-500">
            واجهة أولية
          </span>
        </header>

        <div className="mx-auto w-full max-w-[440px] py-10 lg:py-12">
          <div className="mb-8">
            <h1 className="mb-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              مرحبًا بعودتك
            </h1>
            <p className="text-sm leading-relaxed font-normal text-slate-500 sm:text-base">
              سجّل الدخول للمتابعة إلى نظام إدارة الأعمال
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                اسم المستخدم أو البريد الإلكتروني
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-slate-400"
                >
                  <svg
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  dir="auto"
                  autoComplete="username"
                  placeholder="name@company.com أو اسم المستخدم"
                  className="block min-h-11 w-full rounded-lg border border-slate-300 bg-white py-2.5 pe-4 ps-11 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus-visible:border-brand-900 focus-visible:ring-2 focus-visible:ring-brand-900/20"
                  required
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  كلمة المرور
                </label>
                <button
                  type="button"
                  onClick={() => setNotice("استعادة كلمة المرور غير متاحة بعد.")}
                  className="rounded text-xs font-semibold text-brand-700 transition-colors hover:text-brand-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-900 focus-visible:ring-offset-2"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
              <div className="relative rounded-lg shadow-sm">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-slate-400"
                >
                  <svg
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="block min-h-11 w-full rounded-lg border border-slate-300 bg-white py-2.5 pe-11 ps-11 font-latin text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus-visible:border-brand-900 focus-visible:ring-2 focus-visible:ring-brand-900/20"
                  required
                />
                <button
                  type="button"
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 end-0 flex min-w-11 items-center justify-center pe-3.5 text-slate-400 transition-colors hover:text-slate-600 focus-visible:outline-none focus-visible:text-brand-900"
                >
                  <svg
                    aria-hidden="true"
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M3 3l18 18M10.585 10.587a2 2 0 002.828 2.828"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M9.88 5.09A10.94 10.94 0 0112 4.9c4.478 0 8.268 2.943 9.542 7a10.97 10.97 0 01-4.042 5.37M6.228 6.23A11.04 11.04 0 002.458 12c1.274 4.057 5.064 7 9.542 7 1.153 0 2.258-.2 3.284-.568"
                        />
                      </>
                    ) : (
                      <>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center pt-0.5">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="size-4 cursor-pointer rounded border-slate-300 accent-brand-900 focus-visible:ring-2 focus-visible:ring-brand-900/30"
              />
              <label
                htmlFor="remember_me"
                className="ms-2.5 block cursor-pointer select-none text-sm text-slate-700"
              >
                تذكرني
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 active:scale-[0.99]"
              >
                <span>تسجيل الدخول</span>
                <svg
                  aria-hidden="true"
                  className="size-4 rtl:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </form>

          {notice && (
            <p
              role="status"
              aria-live="polite"
              className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm leading-relaxed text-amber-900"
            >
              {notice}
            </p>
          )}

          <div className="mt-8 flex items-start gap-3 border-t border-slate-100 pt-6 text-slate-500">
            <svg
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M12 3l8 3v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3z"
              />
            </svg>
            <p className="text-xs leading-relaxed text-slate-500">
              هذه واجهة أولية فقط. لم يتم ربط المصادقة أو استعادة كلمة المرور
              أو حفظ الجلسات، ولا تُرسل بيانات تسجيل الدخول.
            </p>
          </div>
        </div>

        <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row">
          <p className="font-normal font-latin">
            &copy; ASL Business &mdash;{" "}
            <span className="font-cairo">جميع الحقوق محفوظة</span>
          </p>
          <span>واجهة تسجيل دخول غير مرتبطة بخدمة مصادقة</span>
        </footer>
      </main>

      <aside className="bg-weave-pattern relative hidden w-full flex-col justify-between overflow-hidden border-s-slate-800/80 p-12 text-white lg:flex lg:w-[42%] xl:p-16">
        <div
          aria-hidden="true"
          className="fabric-grid-overlay pointer-events-none"
        />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-slate-400/80" />
            <span
              dir="ltr"
              className="font-latin text-xs font-medium tracking-widest text-slate-300 uppercase"
            >
              Enterprise ERP Suite
            </span>
          </div>
          <span className="rounded border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-400">
            واجهة أولية
          </span>
        </div>

        <div className="relative z-10 my-auto py-8">
          <div className="relative mb-10">
            <div className="relative aspect-[4/3] w-full max-w-[340px] overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/60 to-slate-900/90 p-6 shadow-2xl backdrop-blur-md">
              <div
                aria-hidden="true"
                className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-2 p-5 opacity-25"
              >
                {gridTiles.map((tile) => (
                  <div
                    key={tile}
                    className={`rounded-sm border border-slate-400/40 ${
                      highlightedTiles.has(tile) ? "bg-white/10" : ""
                    }`}
                  />
                ))}
              </div>

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-slate-400" />
                    <span className="text-xs font-semibold text-slate-200">
                      أصل للأعمال
                    </span>
                  </div>
                  <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] text-slate-300">
                    تصميم الواجهة
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="mb-2 text-[11px] font-medium text-slate-400">
                      عمليات الأعمال
                    </div>
                    <div className="h-1.5 w-3/4 rounded-full bg-slate-400/40" />
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="mb-2 text-[11px] font-medium text-slate-400">
                      تجارة الجملة
                    </div>
                    <div className="h-1.5 w-2/3 rounded-full bg-slate-400/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="mb-3 text-xl leading-snug font-bold text-white xl:text-2xl">
            إدارة سلاسل إمداد الملابس وتجارة الجملة
          </h2>
          <p className="max-w-[420px] text-sm leading-relaxed font-normal text-slate-300/90">
            أصل للأعمال، واجهة عربية لتنظيم وإدارة أعمال تجارة الجملة.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-6 text-xs text-slate-400">
          <span>منظومة أصل لإدارة المنشآت</span>
          <span
            dir="ltr"
            className="font-latin text-[11px] text-slate-500"
          >
            B2B Wholesale
          </span>
        </div>
      </aside>
    </div>
  );
}
