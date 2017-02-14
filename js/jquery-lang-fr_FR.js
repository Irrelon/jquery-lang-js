/*
 Licence MIT
 Copyright (c) 2014 Irrelon Software Limited
 http://www.irrelon.com
 L'autorisation est accordée, gracieusement, à toute personne acquérant une
 copie de cette bibliothèque et des fichiers de documentation associés (la "Bibliothèque"),
 de commercialiser la Bibliothèque sans restriction, notamment les droits d'utiliser,
 de copier, de modifier, de fusionner, de publier, de distribuer, de sous-licencier
 et / ou de vendre des copies de la Bibliothèque, ainsi que d'autoriser les personnes
 auxquelles la Bibliothèque est fournie à le faire, sous réserve des conditions suivantes :
 La déclaration de copyright ci-dessus et la présente autorisation doivent être incluses
 dans toutes copies ou parties substantielles de la Bibliothèque.
 LA BIBLIOTHÈQUE EST FOURNIE "TELLE QUELLE", SANS GARANTIE D'AUCUNE SORTE, EXPLICITE
 OU IMPLICITE, NOTAMMENT SANS GARANTIE DE QUALITÉ MARCHANDE, D’ADÉQUATION À UN USAGE
 PARTICULIER ET D'ABSENCE DE CONTREFAÇON. EN AUCUN CAS, LES AUTEURS OU TITULAIRES
 DU DROIT D'AUTEUR NE SERONT RESPONSABLES DE TOUT DOMMAGE, RÉCLAMATION OU AUTRE RESPONSABILITÉ,
 QUE CE SOIT DANS LE CADRE D'UN CONTRAT, D'UN DÉLIT OU AUTRE, EN PROVENANCE DE,
 CONSÉCUTIF À OU EN RELATION AVEC LA BIBLIOTHÈQUE OU SON UTILISATION,
 OU AVEC D'AUTRES ÉLÉMENTS DE LA BIBLIOTHÈQUE.
 Source: https://github.com/coolbloke1324/jquery-lang-js
 Changelog:
 Version 2.0.0 - Complete re-write.
 */
var Lang = (function ()
{
    var Lang = function (defaultLang, currentLang, allowCookieOverride)
    {
        var self = this, cookieLang;
        // Active la détection d'évènements
        this._fireEvents = true;
        // Permet le stockage des chemins d'accès des packs linguistiques chargés dynamiquement
        this._dynamic = {};
        // Stocke les méthodes de transformation existantes pour permettre l'exécution automatique
        // des traductions lorsque de nouvelles données sont ajoutées par jQuery dans la page
        this._mutationCopies = {
            append: $.fn.append,
            appendTo: $.fn.appendTo,
            prepend: $.fn.prepend,
            before: $.fn.before,
            after: $.fn.after,
            html: $.fn.html
        };
        // A présent on surcharge les méthodes de transformation de jQuery avec celles de notre objet Lang
        // $.fn est l'objet prototype jQuery contenant les méthodes originales
        // this représente à chaque fois l'objet DOM sur lequel la fonction est appelée
        $.fn.append = function ()
        {
            return self._mutation(this, 'append', arguments)
        };
        $.fn.appendTo = function ()
        {
            return self._mutation(this, 'appendTo', arguments)
        };
        $.fn.prepend = function ()
        {
            return self._mutation(this, 'prepend', arguments)
        };
        $.fn.before = function ()
        {
            return self._mutation(this, 'before', arguments)
        };
        $.fn.after = function ()
        {
            return self._mutation(this, 'after', arguments)
        };
        $.fn.html = function ()
        {
            return self._mutation(this, 'html', arguments)
        };
        // Initialise le langage courant et le langage par défaut pour démarrer avec
        this.defaultLang = defaultLang || 'en';
        this.currentLang = defaultLang || 'en';
        // Vérifie si le plugin jquery.cookie est installé lorsque aucune langue par défaut n'est spécifiée
        if ((allowCookieOverride || !currentLang) && $.cookie) {
            // Vérifie si un cookie langue est présent
            cookieLang = $.cookie('langCookie');
            if (cookieLang) {
                // Si le cookie est présent on initialise la langue courante
                currentLang = cookieLang;
            }
        }
        $(function ()
        {
            // Initialise l'enregistrement des contenus en langue par défaut des balises à traduire
            self._start();
            // Vérifie si la langue courante est différente de la langue par défaut
            if (currentLang && currentLang !== self.defaultLang) {
                // Si oui on bascule sur la langue courante
                self.change(currentLang);
            }
        })
    };
    /*
     * Objet contenant le pack liguistique.
     * @type {{}}
     */
    Lang.prototype.pack = {};
    /*
     * Tableau des attributs qui peuvent être traduits à rechercher dans les éléments du DOM
     * @type {string[]}
     */
    Lang.prototype.attrList = ['title', 'alt', 'placeholder'];
    /*
     * Définit un pack linguistique pouvant être chargé dynamiquement et le path à utiliser pour y accéder
     * @param {String} lang La langue à utiliser (code iso sur deux lettres minuscules).
     * @param {String} path Le chemin d'accès au pack linguistique.
     */
    Lang.prototype.dynamic = function (lang, path)
    {
        if (lang !== undefined && path !== undefined) {
            this._dynamic[lang] = path;
        }
    };
    /*
     * Charge le pack langage de la langue spécifiée.
     * @param {string} lang La langue choisie.
     * @param {Function=} callback Fonction à appeler une fois le pack ligusitique chargé.
     */
    Lang.prototype.loadPack = function (lang, callback)
    {
        var self = this;
        if (lang && self._dynamic[lang]) {
            $.ajax({
                dataType: "json",
                url: self._dynamic[lang],
                success: function (data) {
                    self.pack[lang] = data;
                    // Explore l'objet regex du pack linguistique
                    if (self.pack[lang].regex) {
                        var packRegex = self.pack[lang].regex;
                        var regex, i;
                        for (i = 0; i < packRegex.length; i++) {
                            regex = packRegex[i];
                            if (regex.length === 2) {
                                // Chaîne, valeur
                                regex[0] = new RegExp(regex[0]);
                            } else if (regex.length === 3) {
                                // Chaîne, modificateur, valeur
                                regex[0] = new RegExp(regex[0], regex[1]);
                                // Retire le modificateur
                                regex.splice(1, 1);
                            }
                        }
                    }
                    console.log('Le pack linguistique: ' + self._dynamic[lang] + ' a été chargé.');
                    if (callback) callback(false, lang, self._dynamic[lang]);
                },
                error: function () {
                    console.log('Erreur de chargement du pack linguistique ' + self._dynamic[lang]);
                    if (callback) callback(true, lang, self._dynamic[lang]);
                }
            });
        } else {
            throw('Impossible de charger le pack linguistique, pas de chemin d\'accès spécifié !');
        }
    };
    /*
     * Parcourt le DOM à la recherche d'éléments ayant l'attribut 'lang'
     * et enregistre les données traduisibles pour leur utilisation ultérieure
     * Méthode privée
     */
    Lang.prototype._start = function (selector)
    {
        // Récupère les tags HTML concernés
        var arr = selector !== undefined ? $(selector).find('[lang]') : $(':not(html)[lang]');
        var arrCount = arr.length, elem;
        // Procède à l'enregistrement dans l'objet data() associé à chaque élément
        while (arrCount--) {
            elem = $(arr[arrCount]);
            this._processElement(elem);
        }
    };
    /*
     * Enregistre dans l'objet data() associé à l'élément les valeurs d'attributs ou les contenus traduisibles
     * @param {type} elem
     * Méthode privée
     */
    Lang.prototype._processElement = function (elem)
    {
        // Si l'élément est dans la langue par défaut on enregistre son contenu dans l'objet data() associé
        if (elem.attr('lang') === this.defaultLang) {
            // Enregistrement des attributs traduisibles
            this._storeAttribs(elem);
            // Enregistrement des contenus traduisibles
            this._storeContent(elem);
        }
    };
    /*
     * Stocke les valeurs des attributs traduisibles dans la langue par défaut
     * @param {object} L'élément jQuery sélectionné.
     * Méthode privée
     */
    Lang.prototype._storeAttribs = function (elem)
    {
        var attrIndex, attr, attrObj;
        for (attrIndex = 0; attrIndex < this.attrList.length; attrIndex++) {
            attr = this.attrList[attrIndex];
            // On cherche si l'élément possède l'un des attributs traduisibles
            if (elem.attr(attr)) {
                // Récupère l'objet stocké dans la propriété 'lang-attr' de l'objet jQuery data() associé à l'élément
                // ou crée un nouvel objet vide
                attrObj = elem.data('lang-attr') || {};
                // Ajoute l'attribut comme propriété de cet objet et initialise sa valeur 
                attrObj[attr] = elem.attr(attr);
                // On stocke la paire 'lang-attr': {attribut: valeur de l'attribut} dans l'objet data() de l'élément
                elem.data('lang-attr', attrObj);
            }
        }
    };
    /*
     * Lit le contenu existant de l'élément et le stocke dans l'objet data() pour une traduction ultérieure
     * @param elem
     * Méthode privée
     */
    Lang.prototype._storeContent = function (elem) {
        // Vérifie si l'élément est un tag 'input'
        if (elem.is('input')) {
            switch (elem.attr('type')) {
                case 'button':
                case 'submit':
                case 'reset':
                    elem.data('lang-val', elem.val());
                    break;
            }
        } else {
            // Pour les autres tags, récupère le tableau des noeuds texte et le stocke dans l'objet data() associé
            var nodes = this._getTextNodes(elem);
            if (nodes) elem.data('lang-text', nodes);
        }
    };
    /*
     * Trouve les noeuds texte d'un élément et retourne un tableau d'objets :
     * [{node: objet noeud texte, langDefaultText: valeur du noeud texte}, {...}, ...]
     * @param elem
     * @returns {Array|*}
     * Méthode privée
     */
    Lang.prototype._getTextNodes = function (elem)
    {
        var nodes = elem.contents(), nodeObjArray = [], nodeObj = {};
        $.each(nodes, function (index, node) {
            if (node.nodeType !== 3) {
                return;
            }
            nodeObj = {
                node: node,
                langDefaultText: node.data
            };
            nodeObjArray.push(nodeObj);
        });
        return nodeObjArray;
    };
    /*
     * Traduit les noeuds de texte de l'élément et les met à jour
     * @param elem
     * @param Array tableau d'objets [{objet noeud texte: valeur en langue par défaut}, {}, ...] retourné par _getTextNodes
     * @param lang
     * Méthode privée
     */
    Lang.prototype._setTextNodes = function (elem, nodes, lang)
    {
        var index, textNode, defaultText, translation;
        var langNotDefault = lang !== this.defaultLang;
        for (index = 0; index < nodes.length; index++) {
            textNode = nodes[index];
            if (langNotDefault) {
                defaultText = $.trim(textNode.langDefaultText);
                if (defaultText) {
                    // Traduit le texte en langue par défaut dans la langue spécifiée
                    translation = this.translate(defaultText, lang);
                    if (translation) {
                        try {
                            // Remplace le texte initial par sa traduction
                            textNode.node.data = textNode.node.data.split($.trim(textNode.node.data)).join(translation);
                        } catch (e) {
                        }
                    } else {
                        console.log('Traduction pour "' + defaultText + '" non trouvée !');
                    }
                }
            } else {
                // Réinitialise la valeur au texte original
                try {
                    textNode.node.data = textNode.langDefaultText;
                } catch (e) {
                }
            }
        }
    };
    /*
     * Traduit les attributs de l'élément dans la langue spécifiée.
     * @param elem
     * @param lang
     * Méthode privée
     */
    Lang.prototype._translateAttribs = function (elem, lang)
    {
        var attr, translation;
        var attrObj = elem.data('lang-attr') || {};
        for (attr in attrObj) {
            // On s'assure que l'attribut n'est pas hérité
            if (attrObj.hasOwnProperty(attr)) {
                // Vérifie que l'élément possède bien cet attribut
                if (elem.attr(attr)) {
                    if (lang !== this.defaultLang) {
                        // Récupère la traduction dans la langue spécifiée
                        translation = this.translate(attrObj[attr], lang);
                        // Vérifie qu'il y a effectivement une traduction disponible
                        if (translation) {
                            // Si oui met l'attribut à jour
                            elem.attr(attr, translation);
                        }
                    } else {
                        // Réinitialise l'attribut à sa valeur dans la langue par défaut
                        elem.attr(attr, attrObj[attr]);
                    }
                }
            }
        }
    };
    /*
     * Traduit le contenu d'un élément dans la langue spécifiée et le met à jour
     * @param elem
     * @param lang
     * Méthode privée
     */
    Lang.prototype._translateContent = function (elem, lang)
    {
        var langNotDefault = lang !== this.defaultLang;
        var translation, nodes;
        // Vérifie si l'élément est une balise 'input'
        if (elem.is('input')) {
            switch (elem.attr('type')) {
                case 'button':
                case 'submit':
                case 'reset':
                    if (langNotDefault) {
                        // Récupère la traduction
                        translation = this.translate(elem.data('lang-val'), lang);
                        // Vérifie l'exitence de la traduction
                        if (translation) {
                            // Si oui, met à jour le contenu
                            elem.val(translation);
                        }
                    } else {
                        // Réinitialise le contenu à sa valeur dans la langue par défaut
                        elem.val(elem.data('lang-val'));
                    }
                    break;
            }
        } else {
            // Pour les autres balises, actualise le noeud texte avec la traduction
            nodes = elem.data('lang-text');
            if (nodes) this._setTextNodes(elem, nodes, lang);
        }
    };
    /*
     * Appeler cette fonction pour changer la langue de la page.
     * @param {String} lang La nouvelle langue à appliquer (code iso sur 2 lettres).
     * @param {String=} selector Selecteur optionnel pour charcher les balises à traduire (toutes par défaut)
     * @param {Function=} callback Fonction de rappel optionnelle appelée une fois la traduction réussie
     * Particulièrement utile lors du chargement dynamique de packs linguistiques
     * car appelée une fois le chargement et la traduction effectués avec succès.
     * La fonction reçoit 3 paramètres : un booléen (true si erreur rencontrée)
     * une 1ère string (le code de la langue choisie), une 2ème string (le sélecteur utilisé dans l'appel de 'change')
     */
    Lang.prototype.change = function (lang, selector, callback)
    {
        var self = this;
        if (lang === this.defaultLang || this.pack[lang] || this._dynamic[lang]) {
            // Vérifie si le pack linguistique est couramment chargé
            if (lang !== this.defaultLang) {
                if (!this.pack[lang] && this._dynamic[lang]) {
                    // Le pack languistique doit d'abord être chargé
                    console.log('Le chargement dynamique du pack ' + this._dynamic[lang] + ' est en cours...');
                    this.loadPack(lang, function (err, loadingLang, fromUrl) {
                        if (!err) {
                            // Applique le changement de langue demandé
                            self.change.call(self, lang, selector, callback);
                        } else {
                            // En cas d'erreur, appelle la fonction de rappel
                            if (callback) callback('Le chargement du pack depuis ' + fromUrl + ' a échoué.', lang, selector);
                        }
                    });
                    return;
                } else if (!this.pack[lang] && !this._dynamic[lang]) {
                    // Pack linguistique non chargé et absent de la liste des chargements dynamiques
                    console.log('Impossible de changer de langue pour ' + lang + ' car il n\'y a pas de pack pour cette langue !');
                    if (callback) callback('Aucun pack linguistique défini pour: ' + lang, lang, selector);
                }
            }
            var fireAfterUpdate = false, currLang = this.currentLang;
            if (this.currentLang != lang) {
                this.beforeUpdate(currLang, lang);
                fireAfterUpdate = true;
            }
            this.currentLang = lang;
            // Récupère les tags HTML concernés
            var arr = selector !== undefined ? $(selector).find('[lang]') : $(':not(html)[lang]');
            var arrCount = arr.length, elem;
            while (arrCount--) {
                elem = $(arr[arrCount]);
                if (elem.attr('lang') !== lang) {
                    this._translateElement(elem, lang);
                }
            }
            if (fireAfterUpdate) {
                this.afterUpdate(currLang, lang);
            }
            // Vérifie la présence du plugin jquery.cookie
            if ($.cookie) {
                // Place un cookie pour retenir la langue courante (durée de vie 1 an)
                $.cookie('langCookie', lang, {expires: 365, path: '/'});
            }
            if (callback) callback(false, lang, selector);
        } else {
            console.log('Tentative de changement de langue pour "' + lang + '" mais aucun pack n\'est chargé pour cette langue!');
            if (callback) callback('Aucun pack linguistique défini pour: ' + lang, lang, selector);
        }
    };
    /*
     * Traduit les attributs et le contenu de l'élément dans la langue spécifiée
     * @param {type} elem
     * @param {type} lang
     */
    Lang.prototype._translateElement = function (elem, lang)
    {
        // Traduction des attributs
        this._translateAttribs(elem, lang);
        // Traduction du contenu
        if (elem.attr('data-lang-content') != 'false') {
            this._translateContent(elem, lang);
        }
        // Mise à jour de la langue courante de l'élément
        elem.attr('lang', lang);
    };
    /*
     * Traduit un texte de la langue par défaut à la langue spécifiée.
     * @param {String} text Le texte à traduire.
     * @param {String} lang Le code (iso 2 lettres) de la langue de traduction spécifiée.
     * @returns {*}
     */
    Lang.prototype.translate = function (text, lang)
    {
        lang = lang || this.currentLang;
        if (this.pack[lang]) {
            var translation = '';
            if (lang != this.defaultLang) {
                // Vérifie la présence d'une traduction du texte recherché
                translation = this.pack[lang].token[text];
                if (!translation) {
                    // Pas de traduction existante, on cherche la correspondance avec le masque regex
                    translation = this._regexMatch(text, lang);
                }
                if (!translation) {
                    console.log('Traduction pour "' + text + '" non trouvée dans le pack linguistique: ' + lang);
                }
                return translation || text;
            } else return text;
        } else return text;
    };
    /*
     * Teste les masques regex sur le texte passé en argument
     * si le masque réussit, fournit la traduxtion associée
     * @param {String} text Le texte à évaluer avec les masques regex.
     * @param {String} lang Le code iso (2 lettres) de la langue passée en argument.
     * @returns {string}
     * Méthode privée
     */
    Lang.prototype._regexMatch = function (text, lang)
    {
        // Boucle sur le tableau 'regex' et teste les différents masques sur le texte envoyé
        var arr, arrCount, arrIndex, item, regex, expressionResult;
        arr = this.pack[lang].regex;
        if (arr) {
            arrCount = arr.length;
            for (arrIndex = 0; arrIndex < arrCount; arrIndex++) {
                item = arr[arrIndex];
                regex = item[0];
                // Teste l'expression régulière
                expressionResult = regex.exec(text);
                if (expressionResult && expressionResult[0]) {
                    return text.split(expressionResult[0]).join(item[1]);
                }
            }
        }
        return '';
    };
    /*
     * Ecouteur pour contrôler le comportement par défaut de l'évènement onbeforeupdate (IE)
     * @param {type} currentLang
     * @param {type} newLang
     */
    Lang.prototype.beforeUpdate = function (currentLang, newLang)
    {
        if (this._fireEvents) {
            $(this).triggerHandler('beforeUpdate', [currentLang, newLang, this.pack[currentLang], this.pack[newLang]]);
        }
    };
    /*
     * Ecouteur pour contrôler le comportement par défaut de l'évènement onafterupdate (IE)
     * @param {type} currentLang
     * @param {type} newLang
     */
    Lang.prototype.afterUpdate = function (currentLang, newLang)
    {
        if (this._fireEvents) {
            $(this).triggerHandler('afterUpdate', [currentLang, newLang, this.pack[currentLang], this.pack[newLang]]);
        }
    };
    /*
     * Rafraîchit la page dans la langue courante
     */
    Lang.prototype.refresh = function ()
    {
        this._fireEvents = false;
        this.change(this.currentLang);
        this._fireEvents = true;
    };

    /*-----SURCHARGE DES METHODES JQUERY DE TRANSFORMATION DE CONTENU-----*/

    /*
     * Applique la méthode jQuery appelée et traduit au passage le contenu de l'élément cible
     * Méthode privée
     */
    Lang.prototype._mutation = function (context, method, args)
    {
        var result = this._mutationCopies[method].apply(context, args);
        var currLang = this.currentLang;
        var rootElem = $(context);
        if (rootElem.attr('lang')) {
            // Désactive provisoirement la détection d'évènements
            this._fireEvents = false;
            //Traduit l'élément cible de la méthode appelée, en langue par défaut
            this._translateElement(rootElem, this.defaultLang);
            this.change(this.defaultLang, rootElem);
            // L'appel de la méthode 'change' modifie la globale 'currentLang'. La traduction ne concernant
            // que l'élément ciblé par la méthode, on rétablit la globale à sa valeur initiale
            this.currentLang = currLang;
            // Enregistre les données de l'élément, en langue par défaut, dans l'objet data() associé
            this._processElement(rootElem);
            // Traduit l'élément cible
            this._translateElement(rootElem, this.currentLang);
            //}
        }
        // Enregistre les données des enfants du noeud cible
        this._start(rootElem);
        // Traduit tous les descendants du noeud cible
        this.change(this.currentLang, rootElem);
        // Réactive la détection d'évènements
        this._fireEvents = true;
        return result;
    };
    return Lang;
})();