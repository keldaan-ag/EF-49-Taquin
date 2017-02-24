

#Micro-Projet Webmapping et données distantes 


##ING2 2016/2017

##EF49
Enseignant : E. Fritsch (ENSG/DCAIG)

##Titre : jeu de taquin - intégration


###Contexte
Le jeu de taquin a été pris pour sujet de projet depuis plusieurs années. A partir de solutions presque finalisées et de projet ayant travaillé des points techniques très particuliers, il est temps d'essayer de présenter une intégration des différents projets.


###Objectif
L’objectif du présent projet est de mettre en place un jeu de taquin à partir des choix techniques optimaux détectés lors des précédents projets.  

Dans les jeux mis en place jusqu’ici, les 15 images des 15 pions en jeu étaient 15 vignettes reçues du serveur, selon des requêtes conçues pour que les images résultantes soient bien raccordées. Ce système est parfois pris en défaut, et il semble plus efficace de télécharger une image complète, dont on extraira 15 portions pour les 15 pions à placer.


###Cahier des charges
+ Les quinze imagettes constituant les 15 pions seront construites à partir d'une même image source (obtenue par un web service cartographique), mais chaque imagette sera le résultat d'un filtre css cropant les limites de l'imagette de manière différente à chaque fois, et assurant le bon raccordement des imagettes lorsque le puzzle est en place.
+ Un callback sur un événement « clic » assurera le mouvement d'un ou de plusieurs pions en direction de la case vide, si et seulement si le pion cliqué se trouve sur la même ligne ou la même colonne que la case vide.
+ Un mécanisme de mélange des pions sera mis en place. Une procédure de mélange garantissant une solution au puzzle n'est pas obligatoire, mais constituera un plus.
+ Un mécanisme de détection de la fin de partie n'est pas requise.

###Livrable
Tout doit fonctionner sur le poste client, sans autre accès que l’invocation de l’image tuilée.

###Marge de manœuvre 
 on pourra relâcher dans un premier temps la contrainte sur le web service cartographique, et travailler avec une image fixe.
