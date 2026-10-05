# SAS Congo — site corporate bilingue

Site statique HTML5, CSS et JavaScript vanilla. Le logo officiel fourni est conservé en bordeaux. Les 74 pages FR/EN sont déjà générées dans `dist/`, sans framework côté navigateur.

## Prévisualiser et reconstruire

Depuis le dépôt, avec Python 3.12 ou supérieur (Netlify utilise Python 3.13) :

```powershell
python scripts/build.py
python scripts/check.py
python -m http.server 4173 --directory dist
```

Ouvrir `http://localhost:4173/fr/` ou `http://localhost:4173/en/`. Utiliser un serveur HTTP : les chemins absolus et le chargement JSON ne sont pas conçus pour `file://`.

Les sources à modifier :

- `src/content.json` : prestations, bureaux, offres et idées d’articles bilingues.
- `scripts/build.py` : textes éditoriaux, pages, composants header/footer, métadonnées et schémas.
- `src/style.css` : design system et responsive.
- `src/app.js` : navigation, filtres, consentement, formulaires et devis.
- `src/fonts.css` : polices WOFF2 locales. Les licences accompagnent les polices.
- `dist/assets/img/` : photographies WebP, logo officiel et favicon.

Après toute modification de source, lancer `python scripts/build.py`, puis `python scripts/check.py`. Les fichiers HTML de `dist/` sont les livrables complets, mais une modification directe sera écrasée lors de la reconstruction.

## Ajouter une offre

Dans `src/content.json`, ajouter une entrée à `jobs` en suivant les trois exemples présents. Fournir un `id` unique sans espaces, `title` et `description` sous forme `[français, anglais]`, `location`, `sector`, `contract`, `remote`, `missions` et `profile`. Les textes doivent provenir d’une offre réellement validée.

Les secteurs disponibles sont `oil`, `services`, `industry`, `maritime`. Les contrats sont `cdi`, `cdd`, `freelance`, `fulltime`, `parttime`, `internship`, `temporary`, `offshore`.

Pour une vraie offre, mettre `example: false`, renseigner `publishedAt`, `validThrough` avec des dates ISO vérifiées et `countryCode` avec le pays réel. Fournir `schemaEmploymentType` parmi les valeurs Schema.org applicables. Compléter les avantages et les modalités réelles dans le modèle `job_page` avant publication. Recompiler : la page et les liens de candidature sont créés automatiquement. Les candidatures réelles sont orientées vers le formulaire avec le poste présélectionné.

Les offres marquées `example: true` affichent « EXEMPLE », restent en `noindex`, ne portent aucun schéma `JobPosting` et leur bouton de candidature est désactivé. Aucun chiffre ni aucune date fictive n’est nécessaire. Pour retirer définitivement une ancienne offre, supprimer son objet ET son ancien dossier généré après vérification du chemin ; la reconstruction ne supprime pas automatiquement des pages existantes.

Les offres sont chargées depuis `dist/assets/data/jobs.json` pour le filtrage, et présentes dans le HTML pour une lecture sans JavaScript. Modifier uniquement le JSON généré ne crée pas de nouvelle fiche : modifier la source puis reconstruire.

## Ajouter ou publier un article

Ajouter une entrée dans `articles`, avec `id`, `title: [fr, en]`, `category` (`law`, `recruitment`, `oil`, `company`, `candidates`) et `published: false` pour un sujet en préparation. Une page modèle est générée, signalée comme non publiée et exclue de l’indexation.

Après validation du texte et des sources, définir `published: true` et ajouter :

```json
{
  "publishedAt": "DATE ISO VALIDÉE",
  "author": "NOM VALIDÉ",
  "summary": ["Résumé français validé", "Approved English summary"],
  "readingTime": ["Durée calculée pour le texte FR", "Reading time calculated for EN"],
  "sections": [
    {
      "heading": ["Intertitre français", "English heading"],
      "paragraphs": [["Paragraphe français validé"], ["Approved English paragraph"]]
    }
  ]
}
```

Remplacer chaque indication par des informations exactes, puis reconstruire. Le texte est échappé pour éviter d’injecter du HTML. Le schéma `Article` est généré seulement pour un article publié avec auteur et date. Les six sujets livrés sont des idées SEO, pas des articles juridiques inventés.

## Changer une photo

Remplacer le WebP correspondant dans `dist/assets/img/` : `offshore.webp`, `office.webp` ou `team.webp`. Conserver les noms, ou modifier les appels `image()` et les chemins CSS. Fournir un texte alternatif fidèle au visuel. Utiliser une largeur adaptée, une compression raisonnable et des photos dont les droits sont vérifiés. Le visuel hero est chargé en priorité ; les autres images sont différées. Les images actuelles sont des illustrations et ne sont pas présentées comme les locaux, équipes ou opérations de SAS Congo.

Le fichier `logo-officiel.png` est l’original fourni. `logo.webp` est une version destinée à l’affichage, recadrée sur le dessin et réduite sans recoloration ni déformation. Pour remplacer le logo, préserver ses proportions.

## Déployer sur Netlify

Le fichier `netlify.toml` configure `python scripts/build.py`, le dossier publié `dist`, les 404 FR/EN, le cache et les en-têtes de sécurité. On peut également déployer le dossier `dist` déjà construit, ou l’archive `SAS-Congo-Netlify.zip`. Les fichiers `_headers` et `_redirects` sont générés pour conserver cette configuration lors d’un dépôt manuel. Le générateur utilise `SITE_URL` si configuré, puis la variable Netlify `URL`, puis `siteUrl` dans `src/content.json`.

[À COMPLÉTER : confirmer le domaine public canonique ; https://www.sascongo.com est actuellement un réglage provisoire à vérifier]. Pour un domaine personnalisé, configurer `SITE_URL` ou modifier `siteUrl` avant reconstruction ; contrôler canonical, hreflang, sitemap et liens de partage.

Activer la détection Netlify Forms, puis vérifier les formulaires dans le tableau de bord après déploiement. Les formulaires sont présents dans le HTML au build, portent `data-netlify`, un nom unique et un honeypot. Les champs CV utilisent `multipart/form-data`, PDF/DOCX et une limite applicative de 5 Mo. Netlify est le traitement serveur : le site seul ne stocke pas les dossiers.

Configurer les destinataires, notifications, accès et conservation des données dans Netlify. La validation navigateur n’est pas un contrôle antivirus ou une validation de fichier côté serveur. Ne pas prétendre qu’un dépôt a été traité si le service serveur n’a pas été activé et testé. La prévisualisation locale signale explicitement qu’aucun envoi n’a eu lieu.

Documentation de référence : [configuration des formulaires](https://docs.netlify.com/manage/forms/setup/), [soumissions et fichiers](https://docs.netlify.com/manage/forms/submissions/), [antispam](https://docs.netlify.com/manage/forms/spam-filters/).

## Informations à compléter

`PLACEHOLDERS.md` contient l’inventaire exhaustif des placeholders visibles générés, avec les pages concernées, en français et anglais. Il est régénéré à chaque build. Compléter notamment : historique, chiffres, direction, équipe, engagements, catalogue, assainissement, références et permissions, horaires, adresses secondaires, WhatsApp, réseaux sociaux, événements, textes d’articles, identité légale, conservation des CV et politique de confidentialité.

Les valeurs et la vision de l’entreprise sont explicitement proposées pour validation. Les références non autorisées ne sont jamais affichées comme clients. Aberdeen est identifié comme lieu de partenaires techniques, pas comme bureau SAS. La carte réseau est schématique. La carte Google du siège utilise l’emplacement approximatif fourni et se charge uniquement après consentement.

## Vérifications

`scripts/check.py` contrôle toutes les pages : H1 unique, langue, titres et descriptions uniques et de longueur conforme, liens locaux, alternatives FR/EN, labels, images, formulaires et protection des offres fictives.

`scripts/browser-check.cjs` teste les parcours dans Playwright : menus, filtres, devis en quatre étapes, présélection, récapitulatif, erreurs d’envoi local, consentement carte, FAQ, anglais et cinq largeurs (375, 480, 768, 1024, 1280). Playwright n’est nécessaire qu’aux tests, jamais au site. Définir `PLAYWRIGHT_PATH` si le paquet n’est pas installé localement. Edge doit être disponible.

L’audit Lighthouse mobile local de l’accueil atteint **98 en performance, 100 en accessibilité, 100 en bonnes pratiques et 100 en SEO**. Le rapport est conservé dans `artifacts/lighthouse-mobile.json` ; LCP mesuré : 2,3 s, TBT : 0 ms, CLS : 0,001. Ces résultats concernent la simulation locale et devront être confirmés sur le déploiement définitif. Ils ne constituent ni une certification WCAG, ni un test d’envoi réel sur Netlify. La publication publique et la configuration du compte Netlify ne sont pas effectuées par ce dépôt.

`scripts/accessibility-check.cjs` exécute axe-core sur huit pages représentatives en visant les règles WCAG 2.1 A/AA. Il utilise `artifacts/axe.min.js`, un outil de test séparé du site livré. Le rapport est écrit dans `artifacts/accessibility.json`. Compléter cette vérification automatisée par une revue clavier et des tests avec technologies d’assistance avant de revendiquer une conformité.
