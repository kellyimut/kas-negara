import Link from "next/link";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-primary/10 md:grid-cols-2">
        {/* Panel branding */}
        <div className="relative hidden flex-col justify-between bg-gradient-to-br from-[#1d3a8f] via-[#1e40af] to-[#0b1c4d] p-10 md:flex">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 21h18" />
                <path d="M3 10h18" />
                <path d="M5 6l14 4" />
                <path d="M5 10v11" />
                <path d="M19 10v11" />
              </svg>
            </span>
            <div>
              <p className="font-sans text-lg font-semibold text-white">Kas Negara</p>
              <p className="text-xs text-white/60">Rumah keuangan pribadi</p>
            </div>
          </div>

          <div>
            <h2 className="font-sans text-2xl font-semibold leading-snug text-white">
              Kendalikan arus kasmu, satu transaksi setiap hari.
            </h2>
            <ul className="mt-6 flex flex-col gap-3 text-sm text-white/75">
              {[
                "Catat pemasukan & pengeluaran harian",
                "Pantau budget per kategori",
                "Lihat tren keuangan 6 bulan",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/40">Data kamu, milik kamu.</p>
        </div>

        {/* Panel form */}
        <div className="flex flex-col justify-center p-8 sm:p-10">
          <div className="mb-8 md:hidden">
            <p className="font-sans text-xl font-semibold">💰 Kas Negara</p>
          </div>
          <h1 className="font-sans text-2xl font-bold">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}
