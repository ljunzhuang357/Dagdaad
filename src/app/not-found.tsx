import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 text-center">
      <div>
        <span className="text-6xl block mb-6">🔍</span>
        <h1 className="text-3xl font-bold mb-3">Pagina niet gevonden</h1>
        <p className="text-[var(--text-secondary)] mb-8 max-w-sm mx-auto">
          De pagina die je zoekt bestaat niet. Misschien is de link verkeerd,
          of de pagina is verplaatst.
        </p>
        <Link href="/" className="btn-primary inline-block">
          ← Terug naar huis
        </Link>
      </div>
    </div>
  );
}
