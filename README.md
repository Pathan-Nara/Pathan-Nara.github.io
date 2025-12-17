# Bonjour et bienvenue dans mon projet PokeSim !

- PokeSim est un jeu de simulation de capture de pokemon en reprenant le concept de la **Safari Zone** de pokemon rouge et bleu. Vous pouvez capturer des pokemon, gérer votre equipe, et gerer vos favoris ! (et bientot plus en dehors du projet)

- PokeSim est une Progressive Web App (PWA) construite avec React et TypeScript, utilisant la PokeAPI et Tyradex pour recuperer les donnees des pokemon. J'ai essayé de faire une application plus fidele aux jeux ainsi pour ce qui est du taux de captures je me suis basé sur les vraies formules de capture des jeux pokemon. Par ailleurs etant donné que c'est un Safari, j'ai mis par defaut le taux de capture des balles a celles des safari ball (150), mais si vous souhiatez rendre le jeu plus difficile vous pouvez changer les taux de capture et mettre celui des pokeballs classiques (250). (j'ai mis en commentaire)

[Voici la source pour la fonction de capture des pokemon](https://www.dragonflycave.com/mechanics/gen-i-capturing/)

## Installation

D'abord, clonez le depot :

```bash git clone https://github.com/Pathan-Nara/Pathan-Nara.github.io.git ```

Ensuite, installez les dependances :

```bash cd PokeSim npm install ```

Enfin, lancez le serveur de developpement :

```bash npm run dev ```

Et voila !

Sinon vous pouvez acceder a la version en ligne ici : https://pathan-nara.github.io/PokeSim/

## Difficultés

ALORS

- Bon gros probleme de notifs... normalement tout fonctionne bien par contre n'activez pas les notifications sur telephone car je ne sais pour quel raison mais ca fait crash litteralement l'appli (par contre ca affiche les notifs) mais en gros ca fait crash les animations et ca freeze l'app quand un nouveau pokemon apparait voilaaaaaa sinon sur pc ca fonctionne nikel bref have fun !