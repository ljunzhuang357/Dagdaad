import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacybeleid",
  description: "Privacybeleid van Dagdaad — hoe wij omgaan met jouw gegevens.",
  robots: { index: false },
  alternates: { canonical: "https://dagdaad.nl/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="flex-1 px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Privacybeleid</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-8">
        Laatst bijgewerkt: 2 juni 2026
      </p>

      <section className="space-y-6 text-sm leading-relaxed text-[var(--text-secondary)]">
        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">
            1. Wie wij zijn
          </h2>
          <p>
            Dagdaad (dagdaad.nl) is een webapplicatie waarmee je dagelijks
            goede daden kunt noteren. Bij vragen kun je ons bereiken via{" "}
            <a href="mailto:support@dagdaad.nl" className="underline">
              support@dagdaad.nl
            </a>.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">
            2. Welke gegevens wij verzamelen
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>E-mailadres (voor inloggen via e-mailcode of Google)</li>
            <li>Naam (via Google-login, indien verstrekt)</li>
            <li>
              Door jou ingevoerde goede daden (beschrijving, stemming, impact)
            </li>
            <li>Betalingsgegevens (verwerkt via Creem.io — wij slaan geen betaalgegevens op)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">
            3. Hoe wij gegevens gebruiken
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Om je te kunnen laten inloggen en je account te beheren</li>
            <li>Om je goede daden veilig op te slaan en weer te geven</li>
            <li>Om betalingen te verwerken (via Creem.io)</li>
            <li>Om je te kunnen e-mailen over je account (bijv. verificatiecodes)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">
            4. Gegevensdeling
          </h2>
          <p>
            Wij verkopen jouw gegevens niet aan derden. Voor betalingsverwerking
            maken wij gebruik van{" "}
            <a href="https://creem.io" className="underline" target="_blank" rel="noopener noreferrer">
              Creem.io
            </a>, die zich houden aan de AVG. Jouw goede daden zijn privé en
            worden nooit gedeeld met andere gebruikers.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">
            5. Bewaartermijn
          </h2>
          <p>
            Je gegevens worden bewaard zolang je account actief is. Als je je
            account verwijdert, worden al je gegevens binnen 30 dagen
            verwijderd.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">
            6. Jouw rechten (AVG)
          </h2>
          <p>
            Je hebt het recht om je gegevens in te zien, te corrigeren of te
            laten verwijderen. Neem hiervoor contact op via{" "}
            <a href="mailto:support@dagdaad.nl" className="underline">
              support@dagdaad.nl
            </a>.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">
            7. Cookies
          </h2>
          <p>
            Dagdaad gebruikt alleen functionele cookies die nodig zijn voor de
            werking van de inlogfunctionaliteit. Wij gebruiken geen
            trackingcookies of analytics van derden.
          </p>
        </div>
      </section>

      <div className="mt-10 pt-6 border-t border-[#E8E0D0]">
        <Link href="/" className="btn-primary inline-block">
          ← Terug naar Dagdaad
        </Link>
      </div>
    </main>
  );
}
