# Calculate interest rate – GrandTotal Plugin

## Deutsch: Verzugszinsen berechnen – GrandTotal Plugin

Ein Plugin für GrandTotal, um die Verzugszinsen zu berechnen.

### Installieren und nutzen

1. Die [aktuelleste Version](https://github.com/jajoho/Calculate-Interest-GrandTotal-Plugin/releases), herunterladen, die Datei entpacken und <code>CalculateInterest.grandtotalplugin</code> nach <code>~/Library/Application Support/com.mediaatelier.GrandTotal3/Plugins/</code> verschieben.
2. GrandTotal öffnen, ein neues Dokument anlegen oder zu einem bestehenden eine neue Zeile hinzufügen.
3. Auf das Zahnradsymbol klicken und auf <code>Verzugszinsen berechnen</code>
4. Eigene Werte eintragen.

![Verzugszinsen berechnen](https://user-images.githubusercontent.com/15175599/152641374-c7db59d9-2bf1-45eb-ac41-897b7c4fdaa6.png)

#### Berechnungsmethode

- Die Zinsen werden nach der Effektivzinsmethode ([ICMA-Methode, früher ISMA-Methode)](https://de.wikipedia.org/wiki/Zinsberechnungsmethode#act/act_–_tagesgenaue_oder_Effektivzinsmethode_(ICMA-Methode,_früher_ISMA-Methode)) berechnet.
- Der erste und der letzte Tag werden gezählt.([§§ 187](https://www.gesetze-im-internet.de/bgb/__187.html), [188 BGB](https://www.gesetze-im-internet.de/bgb/__188.html)).
- Der Zinssatz wird anhand des aktuellen Basiszinssatzes von der Bundesbank berechnet.
- Die Berechnung ist nicht genau, wenn die Zinsenen über mehrere Jahre berechnet werden und eines der Jahre ein Schaltjahr ist (Issue [#3](https://github.com/jajoho/Calculate-Interest-GrandTotal-Plugin/issues/3)).

#### Mehr GrandTotal Plugins

Mehr Informationen zu Plugins gibt es hier: [GrandTotal-Plugins](https://github.com/mediaatelier/GrandTotal-Plugins). Und die Hilfe von [GrandTotal hier](https://www.mediaatelier.com/GrandTotal7/help/?lang=de).
Dieses Plugins basiert auf dem Area und Volume Plugin.

#### Haftungsausschluss

Ich übernehme keine Haftung für die Richtigkeit und Vollständigkeit des Plugins und der bereitgestellten Informationen.
Haftungsansprüche gegen mich, die sich auf Schäden materieller oder ideeller Art beziehen, welche durch die Nutzung des Plugins entstanden sind, sind ausgeschlossen, sofern kein nachweislich vorsätzliches oder grob fahrlässiges Verschulden vorliegt.

## English: Calculate interest rate – GrandTotal Plugin

A plugin for GranTotal to calculate interest rate.

### Hot to install and use it?

1. Dowload the [latest release](https://github.com/jajoho/Calculate-Interest-GrandTotal-Plugin/releases), unzip the file, and move <code>CalculateInterest.grandtotalplugin</code> to <code>~/Library/Application Support/com.mediaatelier.GrandTotal3/Plugins/</code>
2. Open GrandTotal, create a new document or add a line item to an existing document.
3. Click on the wheeel icon and on <code>Calculate interest</code>.
4. Insert your values.

![Calculate Interest Rate](https://user-images.githubusercontent.com/15175599/152641465-27db9988-ff97-467b-8806-22ad7a6018de.png)

#### Calculation method

- The interest rate is calculated using the effective interest method ([ICMA (ISMA)-Rule (act/act)](https://en.wikipedia.org/wiki/Day_count_convention#Actual_methods)).
- The first and the last day are counted ([§§ 187](https://www.gesetze-im-internet.de/bgb/__187.html), [188 BGB](https://www.gesetze-im-internet.de/bgb/__188.html)).
- The interest rate is calculated using the current prime rate from the Bundesbank.
- The calculation is not accurate if the interest is calculated over several years and one of the years is a leap year (Issue [#3](https://github.com/jajoho/Calculate-Interest-GrandTotal-Plugin/issues/3)).

#### Offical Plugin repository

For more information see [GrandTotal-Plugins](https://github.com/mediaatelier/GrandTotal-Plugins) and the [GrandTotal help page](https://www.mediaatelier.com/GrandTotal7/help/?lang=en).
This plugin is based on the Area and Volume Plugin.

#### Disclaimer

I assume no liability for the correctness and completeness of the plugin and the information provided.
Liability claims against me, which refer to damages of material or immaterial nature arising from the use of the plugin are excluded, unless a demonstrably intentional or grossly negligent fault.
