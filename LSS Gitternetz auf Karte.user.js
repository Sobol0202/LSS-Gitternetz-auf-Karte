// ==UserScript==
// @name         LSS Gitternetz
// @namespace    www.leitstellenspiel.de
// @version      1.0
// @description  Fügt ein Gitternetz zur Karte hinzu
// @author       MissSobol
// @match        https://www.leitstellenspiel.de/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

        initializeMap();

    // Funktion zur Initialisierung der Karte
    function initializeMap() {
        //console.log('Initialisiere die Karte...');

        // Überprüfen, ob der Kartencontainer bereits existiert
        if (document.getElementById('map') && !window.map) {

            // Basiskartenschicht hinzufügen (URL je nach Bedarf anpassen)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(window.map);
        } else {
            //console.log('Karte existiert bereits oder Kartencontainer nicht gefunden.');
        }

        // Button zum Hinzufügen des Gitternetzes erstellen
        createGridButton();
    }

    // Funktion zum Erstellen und Anhängen des Gitternetz-Buttons
    function createGridButton() {
        //console.log('Erstelle den Gitternetz-Button...');

        var buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'absolute'; // Absolute Positionierung
        buttonContainer.style.bottom = '10px'; // Unten positionieren
        buttonContainer.style.left = '50%'; // Horizontal zentrieren
        buttonContainer.style.transform = 'translateX(-50%)'; // Horizontal zentrieren
        buttonContainer.style.zIndex = '1000'; // Stellt sicher, dass der Button über der Karte liegt

        var gridButton = document.createElement('button');
        gridButton.textContent = 'Gitternetz einfügen';
        gridButton.className = 'btn btn-xs btn-default'; // Klasse hinzufügen
        gridButton.addEventListener('click', function() {
            //console.log('Button geklickt! Füge Gitternetz ein...');
            removeGridFromExistingMap();
            addGridToExistingMap();
        });

        buttonContainer.appendChild(gridButton);
        document.getElementById('map').appendChild(buttonContainer); // An das Karten-Element anhängen

        //console.log('Gitternetz-Button erstellt und angehängt.');
    }

    // Funktion zum Hinzufügen des Gitternetzes zur vorhandenen Karte
    function addGridToExistingMap() {
        //console.log('Füge Gitternetz zur Karte hinzu...');

        if (typeof L === 'undefined' || typeof window.map === 'undefined') {
            console.error('Leaflet oder Karte nicht gefunden');
            return;
        }

        const existingMap = window.map;

        const gridSizeLat = 0.009; // 0,0009=100m|0,004=500m|0,009=1km|0,018=2km|0,045=5km
        const gridSizeLng = gridSizeLat / Math.cos((existingMap.getCenter().lat * Math.PI) / 180);

        const bounds = existingMap.getBounds();
        const startLat = Math.floor(bounds.getSouth() / gridSizeLat) * gridSizeLat;
        const startLng = Math.floor(bounds.getWest() / gridSizeLng) * gridSizeLng;

        // Quadrate für den sichtbaren Kartenausschnitt zeichnen
        for (let lat = startLat; lat <= bounds.getNorth(); lat += gridSizeLat) {
            for (let lng = startLng; lng <= bounds.getEast(); lng += gridSizeLng) {
                L.polygon([
                    [lat, lng],
                    [lat + gridSizeLat, lng],
                    [lat + gridSizeLat, lng + gridSizeLng],
                    [lat, lng + gridSizeLng]
                ], { color: 'red', weight: 1, fill: false }).addTo(existingMap);
            }
        }

        //console.log('Gitternetz zur Karte hinzugefügt.');
    }

    // Funktion zum Entfernen des vorhandenen Gitternetzes von der Karte
    function removeGridFromExistingMap() {
        //console.log('Entferne vorhandenes Gitternetz von der Karte...');

        if (typeof L === 'undefined' || typeof window.map === 'undefined') {
            console.error('Leaflet oder Karte nicht gefunden');
            return;
        }

        const existingMap = window.map;

        // Alle Layer von der Karte entfernen (Gitter löschen)
        existingMap.eachLayer(function(layer) {
            if (layer instanceof L.Polygon) {
                existingMap.removeLayer(layer);
            }
        });

        //console.log('Vorhandenes Gitternetz von der Karte entfernt.');
    }

    // Funktion zum Laden des Skripts
    function loadScript(url, callback) {
        //console.log('Lade Skript...');
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    }
})();
