document.addEventListener('DOMContentLoaded', function () {
    const seasonSelect = document.getElementById('season-select');
    const activitySelect = document.getElementById('activity-select');
    const activityField = document.getElementById('activity-field');

    // Режим платформы: 'full' — сезон + занятие, 'seasons' — только сезоны (упрощённая версия)
    let currentMode = document.body.dataset.mode === 'seasons' ? 'seasons' : 'full';

    // Команды, которые нужны в упрощённой версии (по одной на каждый сезон)
    const seasonsModeFunctions = ['wear_winter_suit', 'wear_raincoat_suit', 'wear_summer_suit', 'wear_school_suit'];

    // Инициализация редактора кода Monaco (тот же движок, что и в VS Code)
    let codeEditor;
    require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs' } });
    require(['vs/editor/editor.main'], function () {
        // Список функций-команд, доступных ребёнку, с подсказками на русском
        const availableFunctions = [
            { name: 'take_skis', doc: 'Взять лыжи' },
            { name: 'take_ball', doc: 'Взять мяч' },
            { name: 'wear_winter_suit', doc: 'Надеть тёплую куртку' },
            { name: 'wear_raincoat_suit', doc: 'Надеть непромокаемый костюм' },
            { name: 'wear_school_suit', doc: 'Надеть школьную форму' },
            { name: 'wear_swimming_suit', doc: 'Надеть купальный костюм' },
            { name: 'wear_football_suit', doc: 'Надеть футбольную форму' },
            { name: 'wear_summer_suit', doc: 'Надеть летнюю одежду: футболку и шорты' },
            { name: 'take_swimming_equipment', doc: 'Взять снаряжение для плавания' },
            { name: 'take_skates', doc: 'Взять коньки' },
            { name: 'take_umbrella', doc: 'Взять зонт' },
            { name: 'take_boat', doc: 'Взять кораблик' },
            { name: 'take_fishing_rod', doc: 'Взять удочку' },
            { name: 'take_backpack', doc: 'Взять рюкзак' }
        ];

        // Значения season/activity, которые сравниваются в if/elif, с подсказками на русском
        const availableValues = [
            { value: 'winter', doc: 'Время года: зима' },
            { value: 'spring', doc: 'Время года: весна' },
            { value: 'summer', doc: 'Время года: лето' },
            { value: 'autumn', doc: 'Время года: осень' },
            { value: 'nothing', doc: 'Занятие: просто погулять, без особого занятия' },
            { value: 'skiing', doc: 'Занятие: покататься на лыжах (зима)' },
            { value: 'skating', doc: 'Занятие: покататься на коньках (зима)' },
            { value: 'launch_paper_boats', doc: 'Занятие: запускать бумажные кораблики (весна)' },
            { value: 'go_fishing', doc: 'Занятие: пойти на рыбалку (весна)' },
            { value: 'swimming', doc: 'Занятие: плавать в речке (лето)' },
            { value: 'football', doc: 'Занятие: играть в футбол (лето)' },
            { value: 'walk_in_the_rain', doc: 'Занятие: гулять под дождём (осень)' },
            { value: 'go_to_school', doc: 'Занятие: пойти в школу (осень)' }
        ];

        monaco.languages.registerCompletionItemProvider('python', {
            provideCompletionItems: function (model, position) {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn
                };
                const isSeasonsMode = currentMode === 'seasons';
                const visibleFunctions = availableFunctions.filter(function (fn) {
                    return !isSeasonsMode || seasonsModeFunctions.includes(fn.name);
                });
                const visibleValues = availableValues.filter(function (item) {
                    return !isSeasonsMode || item.doc.startsWith('Время года');
                });
                const functionSuggestions = visibleFunctions.map(function (fn) {
                    return {
                        label: fn.name,
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: fn.name + '()',
                        detail: fn.doc,
                        documentation: fn.doc,
                        range: range
                    };
                });
                const valueSuggestions = visibleValues.map(function (item) {
                    return {
                        label: item.value,
                        kind: monaco.languages.CompletionItemKind.Value,
                        insertText: "'" + item.value + "'",
                        detail: item.doc,
                        documentation: item.doc,
                        range: range
                    };
                });
                return {
                    suggestions: functionSuggestions.concat(valueSuggestions)
                };
            }
        });

        monaco.editor.defineTheme('warm-light', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#FBF6EC',
                'editor.lineHighlightBackground': '#F3EADA',
                'editorLineNumber.foreground': '#B8A98C',
                'editorLineNumber.activeForeground': '#4CAF50',
                'editorCursor.foreground': '#4CAF50',
                'editorIndentGuide.background': '#E8DEC8',
                'editor.selectionBackground': '#D9EAD3'
            }
        });
        codeEditor = monaco.editor.create(document.getElementById('code-input-container'), {
            value: '',
            language: 'python',
            theme: 'warm-light',
            fontSize: 20,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false
        });
    });

    // Объект с фоновыми изображениями для каждого сезона
    const backgroundImages = {
        nothing: '/static/images/home_bg.png',
        winter: '/static/images/winter_bg.png',
        spring: '/static/images/spring_bg.png',
        summer: '/static/images/summer_bg.png',
        autumn: '/static/images/autumn_bg.png'
    };

    const activities = {
        winter: [
            { value: 'nothing', text: ' ' },
            { value: 'skiing', text: 'Покататься на лыжах' },
            { value: 'skating', text: 'Покататься на коньках' }
        ],
        spring: [
            { value: 'nothing', text: ' ' },
            { value: 'launch_paper_boats', text: 'Запускать бумажные кораблики' },
            { value: 'go_fishing', text: 'Пойти на рыбалку' }
        ],
        summer: [
            { value: 'nothing', text: ' ' },
            { value: 'swimming', text: 'Плавать в речке' },
            { value: 'football', text: 'Играть в футбол' }
        ],
        autumn: [
            { value: 'nothing', text: ' ' },
            { value: 'walk_in_the_rain', text: 'Гулять под дождем' },
            { value: 'go_to_school', text: 'Пойти в школу' }
        ]
    };

    const seasonLabels = {
        winter: 'Зима',
        spring: 'Весна',
        summer: 'Лето',
        autumn: 'Осень'
    };

    // Список сценариев для кнопки "Проверить всё" — зависит от режима
    function buildTestScenarios() {
        const scenarios = [];
        Object.keys(activities).forEach(season => {
            if (currentMode === 'seasons') {
                scenarios.push({ season: season, activity: 'nothing', label: seasonLabels[season] });
                return;
            }
            activities[season].forEach(activity => {
                const activityLabel = activity.value === 'nothing' ? 'просто погулять' : activity.text;
                scenarios.push({
                    season: season,
                    activity: activity.value,
                    label: `${seasonLabels[season]} — ${activityLabel}`
                });
            });
        });
        return scenarios;
    }

    function updateActivities(season) {
        activitySelect.innerHTML = '';
        if (currentMode === 'seasons') {
            const option = document.createElement('option');
            option.value = 'nothing';
            activitySelect.appendChild(option);
            return;
        }
        if (activities[season]) {
            activities[season].forEach(activity => {
                const option = document.createElement('option');
                option.value = activity.value;
                option.textContent = activity.text;
                activitySelect.appendChild(option);
            });
        }
    }

    function updateBackgroundImage(season) {
        if (backgroundImages[season]) {
            document.body.style.backgroundImage = `url(${backgroundImages[season]})`;
        }
    }

    seasonSelect.addEventListener('change', function () {
        const selectedSeason = seasonSelect.value;
        updateActivities(selectedSeason);
        updateBackgroundImage(selectedSeason);
    });

    document.getElementById('run-code-button').addEventListener('click', function () {
        const codeInput = codeEditor ? codeEditor.getValue() : '';
        const season = seasonSelect.value;
        const activity = activitySelect.value;

        fetch('/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: codeInput, season: season, activity: activity, mode: currentMode })
        })
        .then(response => response.json())
        .then(result => {
            const imageContainer = document.getElementById('image-container');
            imageContainer.innerHTML = '';

            const checkImage = document.createElement('img');
            checkImage.src = result.image ? `/static/${result.image}` : '/static/images/vitya.png';
            checkImage.alt = result.image ? 'Результат проверки' : 'Витя';
            checkImage.className = 'image-size result-image';
            imageContainer.appendChild(checkImage);

            if (result.command) {
                const images = {
                    'vitya': '/static/images/vitya.png',
                    'skis': '/static/images/skis.png',
                    'ball': '/static/images/ball.png',
                    'warm_jacket': '/static/images/warm_jacket.png',
                    'raincoat_suit': '/static/images/raincoat_suit.png',
                    'school_suit': 'static/images/school_suit.png',
                    'skates': '/static/images/skates.png',
                    'swimming_suit': 'static/images/swimming_suit.png',
                    'swimming_equipment':'static/images/swimming_equipment.png',
                    'football_suit': 'static/images/football_suit.png',
                    'skates':'static/images/skates.png',
                    'umbrella': 'static/images/umbrella.png',
                    'boat': 'static/images/boat.png',
                    'fishing_rod': 'static/images/fishing_rod.png',
                    'backpack': 'static/images/backpack.png'
                };

                result.command.forEach(id => {
                    if (images[id]) {
                        const img = document.createElement('img');
                        img.src = images[id];
                        img.alt = id;
                        img.className = 'image-size layer-image';
                        imageContainer.appendChild(img);
                    }
                });
            }

        })
        .catch(error => console.error('Ошибка:', error));
    });

    async function runTestCase(code, season, activity) {
        const response = await fetch('/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: code, season: season, activity: activity, mode: currentMode })
        });
        const result = await response.json();
        return {
            success: result.image === 'correct.png',
            errorMessage: result.image ? null : result.result
        };
    }

    function showSuccessOverlay() {
        const overlay = document.getElementById('success-overlay');
        overlay.classList.add('visible');
        setTimeout(() => overlay.classList.remove('visible'), 4000);
    }

    document.getElementById('success-overlay').addEventListener('click', function () {
        this.classList.remove('visible');
    });

    function launchConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');
        const colors = ['#4CAF50', '#FFC107', '#2196F3', '#E91E63', '#FF5722', '#9C27B0'];
        const pieces = [];
        const pieceCount = 150;

        for (let i = 0; i < pieceCount; i++) {
            pieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * -canvas.height,
                size: 6 + Math.random() * 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: 2 + Math.random() * 3,
                speedX: -2 + Math.random() * 4,
                rotation: Math.random() * 360,
                rotationSpeed: -6 + Math.random() * 12
            });
        }

        const duration = 4000;
        const startTime = performance.now();

        function frame(now) {
            const elapsed = now - startTime;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotationSpeed;
                if (p.y > canvas.height) {
                    p.y = -10;
                    p.x = Math.random() * canvas.width;
                }
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });
            if (elapsed < duration) {
                requestAnimationFrame(frame);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        requestAnimationFrame(frame);
    }

    document.getElementById('test-code-button').addEventListener('click', async function () {
        if (!codeEditor) return;

        const code = codeEditor.getValue();
        const runButton = document.getElementById('run-code-button');
        const testButton = document.getElementById('test-code-button');
        const testStatus = document.getElementById('test-status');

        runButton.disabled = true;
        testButton.disabled = true;
        testStatus.innerHTML = '';

        const failures = [];
        let networkError = null;

        try {
            for (const scenario of buildTestScenarios()) {
                testStatus.textContent = `Проверяю: ${scenario.label}...`;
                const outcome = await runTestCase(code, scenario.season, scenario.activity);
                if (!outcome.success) {
                    failures.push({ label: scenario.label, error: outcome.errorMessage });
                }
            }
        } catch (error) {
            networkError = error;
            console.error('Ошибка при проверке:', error);
        } finally {
            runButton.disabled = false;
            testButton.disabled = false;
            testStatus.innerHTML = '';
        }

        if (networkError) {
            const errorBox = document.createElement('div');
            errorBox.id = 'test-errors';
            errorBox.textContent = 'Не удалось связаться с сервером. Проверь подключение и попробуй снова.';
            testStatus.appendChild(errorBox);
            return;
        }

        if (failures.length === 0) {
            launchConfetti();
            showSuccessOverlay();
        } else {
            const errorBox = document.createElement('div');
            errorBox.id = 'test-errors';

            const title = document.createElement('strong');
            title.textContent = 'Не всё получилось, но ты почти у цели! Проверь эти случаи:';
            errorBox.appendChild(title);

            const list = document.createElement('ul');
            failures.forEach(f => {
                const li = document.createElement('li');
                li.textContent = f.error
                    ? `${f.label} — ошибка в коде: ${f.error}`
                    : `${f.label} — Витя одет неправильно`;
                list.appendChild(li);
            });
            errorBox.appendChild(list);

            testStatus.appendChild(errorBox);
        }
    });

    function applyMode(mode) {
        currentMode = mode;
        document.body.dataset.mode = mode;
        activityField.hidden = mode === 'seasons';
        document.querySelectorAll('.mode-button').forEach(button => {
            const isActive = button.dataset.mode === mode;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
        updateActivities(seasonSelect.value);
        document.getElementById('test-status').innerHTML = '';

        // Запоминаем режим в адресе страницы, чтобы он сохранялся при перезагрузке
        const url = new URL(window.location.href);
        url.searchParams.set('mode', mode);
        window.history.replaceState(null, '', url);
    }

    document.querySelectorAll('.mode-button').forEach(button => {
        button.addEventListener('click', () => applyMode(button.dataset.mode));
    });

    const initialSeason = seasonSelect.value || 'nothing'; // Устанавливаем значение по умолчанию
    applyMode(currentMode);
    updateBackgroundImage(initialSeason);


});
