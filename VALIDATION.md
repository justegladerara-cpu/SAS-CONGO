# Vérification du livrable

Les 74 pages françaises et anglaises ont été générées et contrôlées avec `scripts/check.py`. Les pages et assets locaux sont présents ; les titres et descriptions sont uniques et respectent les longueurs demandées ; chaque page comporte un H1 ; les formulaires disposent de labels ; les liens de langue pointent vers leurs équivalents.

Les parcours ont été testés dans Edge en mode invisible : navigation desktop et mobile, méga-menu et fermeture au clavier, filtres métiers et état sans résultat, présélection du service, progression et retour du devis, récapitulatif, validation, absence de confirmation mensongère en local, accord et retrait du consentement Google Maps, FAQ et anglais. L’affichage a été vérifié à 375, 480, 768, 1024 et 1280 px, sans débordement horizontal sur les parcours testés. Le mode animations réduites a été vérifié.

Le contrôle axe-core de huit pages représentatives ne relève aucune violation automatisée des règles WCAG 2.1 A/AA. Il ne remplace pas une vérification complète par technologies d’assistance.

Lighthouse, avec ses paramètres mobiles par défaut et un navigateur Chrome invisible, sur `http://127.0.0.1:4173/fr/` :

| Catégorie | Score local |
| --- | --- |
| Performance | 98 |
| Accessibilité | 100 |
| Bonnes pratiques | 100 |
| SEO | 100 |

LCP : 2,3 s. TBT : 0 ms. CLS : 0,001. Le rapport JSON complet est conservé dans `artifacts/lighthouse-mobile.json`. Refaire la mesure sur Netlify après configuration du domaine, des en-têtes, du cache et des formulaires.

Les offres fictives sont exclues du sitemap, en `noindex`, sans `JobPosting` et sans candidature possible à un poste inexistant. Les six idées d’articles sont signalées comme propositions, exclues de l’indexation et sans données structurées `Article` publiées. Les schémas correspondants sont prévus pour les informations réelles validées.

Les formulaires sont préparés pour Netlify Forms. Aucun envoi de données personnelles ou e-mail réel n’a été effectué pendant les tests. La collecte effective et les notifications nécessitent le déploiement et l’activation du service. Les textes légaux, la durée de conservation des CV, les références et les autres informations absentes restent des placeholders explicites.
