import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden",
  description: "Algemene voorwaarden van Dagdaad — jouw rechten en plichten.",
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <main className="flex-1 px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Algemene Voorwaarden</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-8">
        Laatst bijgewerkt: 2 juni 2026
      </p>

      <section className="space-y-6 text-sm leading-relaxed text-[var(--text-secondary)]">
        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">
            1. Algemeen
          </h2>
          <p>
            Dagdaad (dagdaad.nl) is een webapplicatie waarmee gebruikers
            dagelijks goede daden kunnen noteren en hun vriendelijkheids-patronen
            kunnen ontdekken. Door gebruik te maken van Dagdaad ga je akkoord
            met deze voorwaarden.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">
            2. Account
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Je moet 16 jaar of ouder zijn om een account aan te maken</li>
            <li>Je bent zelf verantwoordelijk voor de vertrouwelijkheid van je account</li>
            <li>Je mag één account aanmaken</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">
            3. Abonnementen en betalingen
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Het gratis abonnement omvat 30 goede daden per maand</li>
            <li>Pro-abonnement: €3,99/maand of €29/jaar (via Creem.io)</li>
            <li>Betalen gaat veilig via Creem.io — wij slaan geen betaalgegevens op</li>
            <li>Opzeggen kan altijd. Je blijft toegang houden tot het einde van de betaalde periode</li>
            <li>
              Bij jaarlijkse abonnementen wordt het volledige bedrag in één keer
              in rekening gebracht en is restitutie naar rato niet mogelijk
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">
            4. Gebruik
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Je goede daden zijn privé en worden niet gedeeld met andere gebruikers</li>
            <li>Het is niet toegestaan om Dagdaad te gebruiken voor illegale doeleinden</li>
            <li>Wij behouden ons het recht voor om accounts te blokkeren bij misbruik</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">
            5. Aansprakelijkheid
          </h2>
          <p>
            Dagdaad wordt aangeboden zoals het is. Wij garanderen niet dat de
            dienst altijd beschikbaar is zonder onderbrekingen of fouten. Wij
            zijn niet aansprakelijk voor schade voortvloeiend uit het gebruik
            van de dienst, voor zover toegestaan onder de Nederlandse wet.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">
            6. Wijzigingen
          </h2>
          <p>
            Wij kunnen deze voorwaarden wijzigen. Bij belangrijke wijzigingen
            stellen wij je hiervan op de hoogte per e-mail. Als je het niet
            eens bent met de wijzigingen, kun je je account verwijderen.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-[var(--text-primary)] mb-2">
            7. Contact
          </h2>
          <p>
            Heb je vragen of klachten? Neem contact op via{" "}
            <a href="mailto:support@dagdaad.nl" className="underline">
              support@dagdaad.nl
            </a>.
          </p>
        </div>
      </section>

      <div className="mt-10 pt-6 border-t border-[#E8E0D0] flex gap-3 flex-wrap">
        <Link href="/privacy" className="btn-ghost border border-[#E8E0D0]">
          📋 Privacybeleid
        </Link>
        <Link href="/" className="btn-primary">
          ← Terug naar Dagdaad
        </Link>
      </div>
    </main>
  );
}
