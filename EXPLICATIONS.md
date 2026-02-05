# Guide de Fonctionnement & Comparatifs Complets : Login

## 1. Comparatif exhaustif de `login.php`

Voici pourquoi chaque ligne de ton backend est écrite ainsi, plutôt qu'autrement :

| Élément du code | Alternative technique | Pourquoi ce choix ? (Avantage) | Risque de l'alternative |
| :--- | :--- | :--- | :--- |
| **Headers CORS** (`Access-Control-Allow-Origin`) | Ne rien mettre | Autorise Angular à communiquer avec PHP alors qu'ils ne sont pas sur le même port. | Le navigateur bloque la requête par défaut (Erreur CORS). |
| **`file_get_contents('php://input')`** | `$_POST['email']` | Permet de lire les données envoyées en JSON par Angular. | `$_POST` reste vide car il ne comprend que les formulaires HTML classiques. |
| **`json_decode($content, true)`** | Parser le texte à la main | Transforme le JSON reçu en un tableau PHP propre et facile à manipuler. | Trop complexe, lent et source d'erreurs de syntaxe. |
| **`UserManager` (Objet)** | Code SQL direct dans le fichier | Centralise la logique. Si on change la structure de la BDD, on ne modifie qu'un seul fichier. | Code "spaghetti" difficile à maintenir et à corriger. |
| **`findUserByEmail` (Prepared Statements)** | `query("SELECT...WHERE email='$email'")` | Protège contre les **Injections SQL** en séparant la requête des données utilisateur. | Un pirate pourrait vider ou voler ta base de données via le champ email. |
| **`password_verify()`** | `if ($pass == $hash)` ou `md5($pass)` | Vérifie un mot de passe haché de manière sécurisée (standard actuel). | Stocker en clair ou utiliser MD5 permet de voler les mots de passe très facilement en cas de fuite. |
| **`bin2hex(random_bytes(32))`** | `uniqid()` ou `time()` | Génère un token (jeton) cryptographiquement sûr et impossible à deviner. | Un token prévisible (comme l'heure) permet à un pirate d'usurper l'identité d'un client. |
| **`updateToken`** | `$_SESSION['user'] = ...` | Architecture "Stateless" : le serveur n'a pas besoin de mémoriser qui est qui, le token suffit. | Les sessions expirent vite et posent problème si on a plusieurs serveurs ou une appli mobile. |
| **`http_response_code(401/200)`** | Toujours renvoyer 200 | Indique à Angular le statut exact (Erreur, Succès, Mauvais accès) via les standards HTTP. | Angular pensera que tout va bien même si la connexion a échoué (difficile à debugger). |
| **`json_encode(['success' => ...])`** | `echo "success=true"` | Format standard universel compris par tous les langages (Angular, Swift, Android). | Difficile pour Angular de découper une simple chaîne de texte sans erreurs. |

---

## 2. Fonctionnement de la Page d'Accueil (`HomeComponent`)

La page d'accueil est une vitrine dynamique. Elle ne contient pas de données "en dur", elle les demande au fur et à mesure.

### A. Cycle de vie : `ngOnInit`
Dès que la page s'affiche, Angular lance automatiquement la fonction `ngOnInit`. C'est le signal pour aller chercher les données sans attendre que l'utilisateur clique.

### B. Le Service : `RestApiService`
Le composant ne parle pas directement au PHP. Il demande au "Service" de faire le travail. Cela permet de réutiliser le code ailleurs si on a besoin de voir les nouveautés sur une autre page.

### C. Récupération des données (Double appel)
La page fait deux demandes distinctes :
1.  **Les Nouveautés :** Appelle `getNouveautes.php` pour récupérer les 3 derniers sushis ajoutés.
2.  **Les Best-Sellers :** Appelle `bestsellers.php` pour récupérer les produits les plus populaires.

### D. Affichage Dynamique
Les données reçues sont stockées dans des listes (`boxes`). Le fichier HTML utilise ensuite une boucle `*ngFor` pour générer automatiquement les cartes de sushis à l'écran. Si tu ajoutes un sushi en BDD, il apparaîtra tout seul à l'accueil !
