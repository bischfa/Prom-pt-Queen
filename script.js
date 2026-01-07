document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTE HOLEN ---
    const menuItems = Array.from(document.querySelectorAll('.category-menu li'));
    const contentSections = document.querySelectorAll('.category-content');
    const enhancerForm = document.getElementById('enhancer-form');
    const basePromptInput = document.getElementById('base-prompt');
    const finalPromptOutput = document.getElementById('final-prompt');
    const copyButton = document.getElementById('copy-button');
    const themeToggle = document.getElementById('theme-toggle-switch');

    // --- FUNKTION: Kategorie wechseln ---
    function activateCategory(index) {
        if (index < 0) index = menuItems.length - 1;
        if (index >= menuItems.length) index = 0;

        menuItems.forEach(i => i.classList.remove('active'));
        menuItems[index].classList.add('active');

        contentSections.forEach(sec => sec.classList.remove('active'));
        const targetId = menuItems[index].getAttribute('data-target');
        document.getElementById(targetId)?.classList.add('active');

        menuItems[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // --- FUNKTION: Menü-Indikatoren aktualisieren ---
    function updateMenuIndicators() {
        menuItems.forEach(item => {
            const targetId = item.getAttribute('data-target');
            const content = document.getElementById(targetId);
            if (content) {
                // Prüfen, ob IRGENDEINE Checkbox in diesem Container angehakt ist
                const hasCheckedInput = content.querySelector('input[type="checkbox"]:checked');
                
                if (hasCheckedInput) {
                    item.classList.add('has-selection');
                } else {
                    item.classList.remove('has-selection');
                }
            }
        });
    }

    // --- 1. MENÜ-LOGIK ---
    menuItems.forEach((item, index) => {
        item.addEventListener('click', () => activateCategory(index));
    });

    document.querySelectorAll('.prev-cat').forEach(arrow => {
        arrow.addEventListener('click', () => {
            const currentIndex = menuItems.findIndex(item => item.classList.contains('active'));
            activateCategory(currentIndex - 1);
        });
    });

    document.querySelectorAll('.next-cat').forEach(arrow => {
        arrow.addEventListener('click', () => {
            const currentIndex = menuItems.findIndex(item => item.classList.contains('active'));
            activateCategory(currentIndex + 1);
        });
    });

    // --- 2. PROMPT-GENERATOR ---
    const getVal = (id) => document.getElementById(id)?.value.trim() || '';
    const isChecked = (id) => document.getElementById(id)?.checked;

    function updatePreview() {
        if (!basePromptInput || !finalPromptOutput) return;

        let text = basePromptInput.value.trim();
        let enhancements = [];

        // --- Alle Kategorien durchgehen ---
        if (isChecked('role-check')) enhancements.push(`Du bist ein ${getVal('role-input') || 'Experte'}.`);
        if (isChecked('context-check')) enhancements.push(`Kontext: "${getVal('context-input')}"`);
        if (isChecked('branche-check')) enhancements.push(`Fokus auf Branche: ${getVal('branche-input')}`);
        if (isChecked('format-markdown')) enhancements.push('Nutze Markdown (Fettungen, Listen).');
        if (isChecked('format-json')) enhancements.push('Antworte NUR im validen JSON-Format.');
        if (isChecked('format-table')) enhancements.push('Stelle die Daten als Tabelle dar.');
        if (isChecked('format-code')) enhancements.push('Gib nur den reinen Code aus.');
        if (isChecked('format-custom-check')) enhancements.push(`Format: ${getVal('format-custom-input')}`);
        if (isChecked('fewshot-check')) enhancements.push(`Orientiere dich an: "${getVal('fewshot-input')}"`);
        if (isChecked('belege-beispiel')) enhancements.push('Füge Praxisbeispiele hinzu.');
        if (isChecked('belege-fakten')) enhancements.push('Nutze Zahlen, Daten und Fakten.');
        if (isChecked('cot-check')) enhancements.push('Denke Schritt für Schritt nach (Chain-of-Thought).');
        if (isChecked('ton-pro')) enhancements.push('Ton: Professionell & sachlich.');
        if (isChecked('ton-locker')) enhancements.push('Ton: Locker & freundlich.');
        if (isChecked('ton-knapp')) enhancements.push('Fasse dich extrem kurz.');
        if (isChecked('ton-detail')) enhancements.push('Sei sehr detailliert und ausführlich.');
        if (isChecked('emo-empathie')) enhancements.push('Reagiere empathisch.');
        if (isChecked('emo-motivation')) enhancements.push('Sei motivierend.');
        if (isChecked('rules-check')) enhancements.push(`WICHTIG: ${getVal('rules-input')}`);
        if (isChecked('rules-tabu-check')) enhancements.push(`VERBOTE (Vermeide dies): ${getVal('rules-tabu-input')}`);
        if (isChecked('audience-check')) enhancements.push(`Zielgruppe: ${getVal('audience-input')}`);
        if (isChecked('lang-simple')) enhancements.push('Erkläre es sehr einfach (wie für ein Kind/Laien).');
        if (isChecked('lang-metapher')) enhancements.push('Nutze viele Metaphern.');
        if (isChecked('creative-on')) enhancements.push('Sei maximal kreativ und unkonventionell.');
        if (isChecked('creative-off')) enhancements.push('Bleibe bei bewährten Standardlösungen.');
        if (isChecked('persp-multi')) enhancements.push('Betrachte es aus verschiedenen Blickwinkeln.');
        if (isChecked('persp-kritisch')) enhancements.push('Sei kritisch und hinterfrage Annahmen (Advocatus Diaboli).');
        if (isChecked('prio-check')) enhancements.push('Sortiere nach Wichtigkeit (Priorität).');
        if (isChecked('zeit-check')) enhancements.push('Ordne zeitlich ein (kurz-/langfristig).');
        if (isChecked('praxis-brainstorm')) enhancements.push('Brainstorming: Liste mindestens 10 Ideen auf.');
        if (isChecked('praxis-schritte')) enhancements.push('Erstelle eine konkrete Schritt-für-Schritt-Anleitung.');
        if (isChecked('praxis-tools')) enhancements.push('Nenne nützliche Tools & Ressourcen.');
        if (isChecked('praxis-fehler')) enhancements.push('Warne vor typischen Anfängerfehlern.');
        if (isChecked('compare-proscons')) enhancements.push('Erstelle eine Pro- & Contra-Liste.');
        if (isChecked('compare-alt')) enhancements.push('Nenne alternative Lösungswege.');
        if (isChecked('lern-check')) enhancements.push('Stelle am Ende 2 Verständnisfragen.');
        if (isChecked('lern-summary')) enhancements.push('Fasse das Wichtigste am Ende kurz zusammen (TL;DR).');
        
        // ÄNDERUNG HIER: Umfang angepasst und erweitert
        if (isChecked('len-kurz')) enhancements.push('Maximale Länge: Sehr kurz (z.B. Tweet-Länge).');
        if (isChecked('len-mittel')) enhancements.push('Umfang: Mittel (2-3 prägnante Absätze).');
        if (isChecked('len-lang')) enhancements.push('Umfang: Lang (Ausführlicher Essay oder Artikel).');
        if (isChecked('len-extrem')) enhancements.push('Umfang: Extrem (Erstelle eine umfassende, detaillierte Recherchedokumentation mit allen verfügbaren Details).');
        
        if (isChecked('inter-ask')) enhancements.push('Stelle Rückfragen, falls dir Infos fehlen.');
        if (isChecked('inter-next')) enhancements.push('Schlage 3 mögliche nächste Prompts vor.');

        if (enhancements.length > 0) {
            text += "\n\n--- ANWEISUNGEN ---\n" + enhancements.map(e => "- " + e).join("\n");
        }
        finalPromptOutput.value = text;

        // Indikatoren aktualisieren
        updateMenuIndicators();
    }

    enhancerForm.addEventListener('input', updatePreview);
    basePromptInput.addEventListener('input', updatePreview);

    // --- 3. KOPIEREN, THEME & RESET ---
    copyButton.addEventListener('click', () => {
        finalPromptOutput.select();
        navigator.clipboard.writeText(finalPromptOutput.value).then(() => {
            copyButton.classList.add('copied');
            setTimeout(() => copyButton.classList.remove('copied'), 1500);
        });
    });

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeToggle.classList.toggle('active');
    });

    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            if (confirm('Möchtest du wirklich ALLES zurücksetzen?')) {
                if (basePromptInput) basePromptInput.value = '';
                document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
                document.querySelectorAll('.category-content input[type="text"], .category-content textarea').forEach(input => input.value = '');
                updatePreview();
                activateCategory(0);
            }
        });
    }

    updatePreview();
});
