document.addEventListener('DOMContentLoaded', function () {
    const seasonSelect = document.getElementById('season-select');
    const activitySelect = document.getElementById('activity-select');

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
            { name: 'take_swimming_equipment', doc: 'Взять снаряжение для плавания' },
            { name: 'take_skates', doc: 'Взять коньки' },
            { name: 'take_umbrella', doc: 'Взять зонт' },
            { name: 'take_boat', doc: 'Взять кораблик' },
            { name: 'take_fishing_rod', doc: 'Взять удочку' },
            { name: 'take_backpack', doc: 'Взять рюкзак' }
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
                return {
                    suggestions: availableFunctions.map(function (fn) {
                        return {
                            label: fn.name,
                            kind: monaco.languages.CompletionItemKind.Function,
                            insertText: fn.name + '()',
                            detail: fn.doc,
                            documentation: fn.doc,
                            range: range
                        };
                    })
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

    function updateActivities(season) {
        activitySelect.innerHTML = '';
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
            body: JSON.stringify({ code: codeInput, season: season, activity: activity })
        })
        .then(response => response.json())
        .then(result => {
            const imageContainer = document.getElementById('image-container');
            imageContainer.innerHTML = '';

            if (result.image) {
                const checkImage = document.createElement('img');
                checkImage.src = `/static/${result.image}`;
                checkImage.alt = 'Результат проверки';
                checkImage.className = 'image-size result-image';
                imageContainer.appendChild(checkImage);
            }

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

    const initialSeason = seasonSelect.value || 'nothing'; // Устанавливаем значение по умолчанию
    updateActivities(initialSeason);
    updateBackgroundImage(initialSeason);


});
