# Direction artistique et architecture

Identité : corporate international, ancrage Pointe-Noire et industries Oil & Gas. Logo officiel conservé. Les photographies sont illustratives et devront être remplacées par les images autorisées de SAS Congo.

| Usage | Couleur |
| --- | --- |
| Signature, CTA, liens | Bordeaux `#930529` |
| Structure, hero, présence internationale | Marine `#102c39` |
| Footer et fond profond | `#0b202b` |
| Accent sur fond sombre | Doré `#d9b37a` |
| Titres et texte | `#1b303b` |
| Texte secondaire | `#53656e` |
| Fond alterné | Ivoire `#f7f6f2` |
| Surfaces | Blanc `#ffffff` |

Titres : Manrope. Texte et interface : Inter. Polices variables WOFF2 hébergées localement, avec `font-display: swap`. Titres fluides en `clamp`, corps lisible, lignes courtes. Maximum de contenu : 1240 px. Grilles mobiles, puis points de rupture 480 / 768 / 1024 / 1280 px. Espacements généreux, coins peu arrondis, bordures fines.

Composants communs : barre contacts/langue, header sticky transparent sur le hero puis blanc au scroll, navigation mobile, méga-menu natif `details`, fil d’Ariane, cinq cartes solutions, tuiles secteurs, cartes bureaux, carte réseau interactive schématique, étapes, FAQ, formulaires accessibles, bannière de consentement, newsletter et footer quatre colonnes. Icônes SVG fines sans bibliothèque chargée. Transitions sobres et respect de `prefers-reduced-motion`.

## Arborescence (miroir FR/EN)

- Accueil : `/fr/`, `/en/`
- L’entreprise : `/fr/entreprise/`, `/en/company/`
- Solutions RH : `/fr/solutions-rh/`, `/en/hr-solutions/`
  - Mise à disposition : `mise-a-disposition-personnel`, `staffing`
  - Sourcing : `sourcing-recrutement`, `recruitment`
  - Audits : `audits-rh`, `hr-audits`
  - Outils : `outils-procedures`, `hr-tools-procedures`
  - DRH partagé : `drh-temps-partage`, `fractional-hr-director`
  - Droit social : `conseil-droit-social`, `employment-law-support`
  - Accompagnement : `accompagnement-managers`, `on-site-hr-coaching`
- Formations : `/fr/formations/`, `/en/training/`
- Représentation : `/fr/representation-commerciale/`, `/en/commercial-representation/`
- Technique : `/fr/assistance-technique-oil-gas/`, `/en/oil-gas-technical-support/`
- Assainissement : `/fr/assainissement/`, `/en/sanitation/`
- Secteurs : `/fr/secteurs/`, `/en/sectors/`
- International : `/fr/presence-internationale/`, `/en/international-presence/`
- Références : `/fr/references/`, `/en/references/`
- Carrières : `/fr/carrieres/`, `/en/careers/`
  - Trois fiches « EXEMPLE » sous ces répertoires
- Candidature : `/fr/candidature/`, `/en/apply/`
- Événements : `/fr/evenements-rh/`, `/en/hr-events/`
- Actualités : `/fr/actualites/`, `/en/insights/`
  - Six modèles d’articles correspondant aux idées éditoriales
- Contact : `/fr/contact/`, `/en/contact/`
- Devis : `/fr/demande-de-devis/`, `/en/request-a-quote/`
- Mentions légales : `/fr/mentions-legales/`, `/en/legal-notice/`
- Données : `/fr/confidentialite/`, `/en/privacy/`
- Cookies : `/fr/cookies/`, `/en/cookies/`
- Confirmation : `/fr/merci/`, `/en/thank-you/`
- 404 : `/fr/404/`, `/en/404/`, `dist/404.html`

Les textes FR d’accueil et d’entreprise sont intégrés dans les fichiers HTML complets générés. Leur version EN est rédigée séparément dans le générateur. Aucune boutique ni aucun compte e-commerce.
