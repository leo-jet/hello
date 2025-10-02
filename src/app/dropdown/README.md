# DropdownComponent

Documentation (FR) du composant `DropdownComponent` utilisé dans ce projet.

Résumé
------
- Composant Angular standalone configurable via `@Input()`.
- Affiche une liste d'options ({ value, label, icon?, img_path? }).
- Émet un événement `selection` quand l'utilisateur choisit une option.
- Positionne le menu en `fixed` pour éviter le clipping par des parents overflow.

API
---

Inputs
- `options: Array<{ value: unknown; label: string; icon?: string; img_path?: string }>` (default: `[]`)
  - Liste des éléments affichés dans le dropdown.
  - `value`: identifiant ou payload minimal.
  - `label`: texte affiché.
  - `icon` (optionnel): petite chaîne (par ex. emoji) affichée si fournie et si `img_path` absent.
  - `img_path` (optionnel): chemin vers une image (ex: `/assets/...`) utilisée à la place de `icon`.

- `hostClass: string` (default: `''`)
  - Classe(s) CSS supplémentaires appliquées au conteneur racine. Permet de surcharger le style depuis le parent.

- `buttonClass: string` (default: `''`)
  - Classe(s) CSS supplémentaires appliquées au bouton déclencheur.

- `menuClass: string` (default: `''`)
  - Classe(s) CSS supplémentaires appliquées à la liste déroulante (menu).

- `itemClass: string` (default: `''`)
  - Classe(s) CSS supplémentaires appliquées à chaque item (bouton) du menu.

- `returnObject: boolean` (default: `false`)
  - Si `false`, l'événement `selection` émet la `value` (comportement par défaut).
  - Si `true`, l'événement `selection` émet l'objet complet `{ value, label, ... }`.

Outputs
- `selection: EventEmitter<unknown>`
  - Emis lors du clic sur un item. Le contenu dépend de `returnObject`.

Comportement & accessibilité
----------------------------
- Le bouton expose `aria-haspopup="true"` et `aria-expanded` (lié à l'état d'ouverture).
- Prise en charge clavier minimale :
  - `Escape` ferme le menu.
  - `ArrowDown` ouvre le menu et tente de fokusser le premier item.
- Le menu est positionné en `position: fixed` et utilise la bounding box du bouton pour calculer `top`/`left`.
  - Le composant tente d'empêcher le débordement à droite en recalculant `left` si nécessaire.
  - `minWidth` est défini en fonction de la largeur du bouton déclencheur pour éviter les sauts visuels.

Personnaliser le rendu (icons/images)
-------------------------------------
- Si une option possède `img_path`, le composant affiche une `<img src="...">` avant le label.
- Sinon si `icon` est présent, il affiche la chaîne `icon` (utile pour emoji ou icônes textuelles).

Exemples d'utilisation
-----------------------

1) Usage basique (retourne la `value` par défaut)

app.component.ts

```ts
dropdownOptions = [
  { value: 'apple', label: 'Apple', img_path: '/assets/apple.png' },
  { value: 'banana', label: 'Banana', icon: '🍌' },
  { value: 'cherry', label: 'Cherry' },
];

selectedFromDropdown: unknown | null = null;

onDropdownSelect(value: unknown) {
  this.selectedFromDropdown = value; // here value is 'apple'|'banana'|...
}
```

app.component.html

```html
<app-dropdown [options]="dropdownOptions" (selection)="onDropdownSelect($event)"></app-dropdown>
```

2) Retourner l'objet complet

```html
<app-dropdown [options]="dropdownOptions" [returnObject]="true" (selection)="onDropdownSelectObject($event)"></app-dropdown>
```

```ts
onDropdownSelectObject(obj: unknown) {
  // obj === { value, label, icon?, img_path? }
}
```

3) Surcharger les classes CSS

Le composant expose 4 `@Input()` pour injecter des classes : `hostClass`, `buttonClass`, `menuClass`, `itemClass`.

```html
<app-dropdown
  [options]="dropdownOptions"
  buttonClass="bg-red-600 hover:bg-red-700 text-white"
  itemClass="text-sm text-indigo-700"
  (selection)="onDropdownSelect($event)">
</app-dropdown>
```

Notes d'intégration
-------------------
- Ce composant suppose que l'application a été configurée pour utiliser Tailwind/utilities si tu utilises des classes d'utilitaires dans le template.
- Les images utilisées via `img_path` doivent être accessibles (par exemple placées dans `src/assets` et servies par Angular CLI).
- Le composant est autonome (standalone) et peut être importé dans les `imports` d'un composant hôte.

Dépannage rapide
----------------
- Si rien ne s'affiche : vérifie que `options` n'est pas vide.
- Si l'image n'apparaît pas : vérifie le chemin (inspecter dans l'onglet Réseau du navigateur).
- Si tu veux des styles CSS locaux, tu peux recréer `dropdown.component.css` et y ajouter des règles, puis remettre `styleUrls` dans le décorateur `@Component`.

Améliorations possibles
-----------------------
- Navigation clavier complète (ArrowUp/ArrowDown focus management, Enter pour sélectionner).
- Option pour contrôler l'alignement (left/right) et des heuristiques de flip.
- Options d'animation (fade/translate) configurables.

Licence & Contrib
-----------------
- Fichiers fournis dans ce dossier sont destinés à l'usage dans ce projet; adapte et améliore selon tes besoins.

Captures d'écran (placeholders)
-------------------------------
Tu peux ajouter des captures d'écran pour documenter le rendu visuel du composant. Place les images dans `src/assets` (ou un dossier `docs/images`) et référence-les ici.

Exemples (placeholders) :

```md
![Dropdown - fermé](/assets/dropdown-closed.png "Dropdown fermé - 360×80")

![Dropdown - ouvert](/assets/dropdown-open.png "Dropdown ouvert - 360×220")
```

Conseils :
- Nom de fichier recommandé : `dropdown-closed.png`, `dropdown-open.png`.
- Taille suggérée : 360×80 pour l'état bouton, 360×220 pour l'état ouvert (ou adaptez selon votre layout).
- Format : PNG ou JPG. Pour screenshots d'UI, PNG conserve mieux la netteté.

