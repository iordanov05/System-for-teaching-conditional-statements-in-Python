import os

from flask import Flask, request, jsonify, render_template
import user_functions

app = Flask(__name__)

# Школы, для которых проводится мастер-класс. Выбирается через ?school=...
# или переменную окружения SCHOOL (по умолчанию — ШЦТ).
SCHOOLS = {
    'shct': {
        'name': 'ШЦТ',
        'logo': 'images/digit_school_logo.png',
    },
    'mastersam': {
        'name': 'Мастерсам',
        'logo': 'images/mastersam_logo.svg',
    },
}
DEFAULT_SCHOOL = os.environ.get('SCHOOL', 'shct')

# Режимы платформы. Выбирается через ?mode=... или переменную окружения MODE.
#   full    — время года + занятие (полная версия);
#   seasons — только время года (упрощённая версия).
MODES = ('full', 'seasons')
DEFAULT_MODE = os.environ.get('MODE', 'full')

# Полная версия: что должно оказаться на Вите для каждой пары «сезон + занятие».
expected_ids = {
    'winter': {
        'nothing': ['warm_jacket'],
        'skiing': ['skis', 'warm_jacket'],
        'skating': ['skates', 'warm_jacket']
    },
    'summer': {
        'nothing': [],
        'swimming': ['swimming_suit', 'swimming_equipment'],
        'football': ['football_suit','ball']
    },
    'spring': {
        'nothing': ['raincoat_suit'],
        'launch_paper_boats': ['raincoat_suit', 'boat'],
        'go_fishing': ['raincoat_suit','fishing_rod']
    },
    'autumn': {
        'nothing': [],
        'walk_in_the_rain': ['raincoat_suit', 'umbrella'],
        'go_to_school': ['school_suit', 'backpack']
    }
}

# Упрощённая версия: только время года, по одной команде на каждый сезон.
#   зима  -> wear_winter_suit()
#   весна -> wear_raincoat_suit()
#   лето  -> wear_summer_suit()
#   осень -> wear_school_suit()
expected_ids_seasons = {
    'winter': ['warm_jacket'],
    'spring': ['raincoat_suit'],
    'summer': ['football_suit'],
    'autumn': ['school_suit'],
}

# Функции-команды, которые ребёнок может вызывать в своём коде.
COMMAND_NAMES = [
    'take_skis',
    'take_ball',
    'wear_winter_suit',
    'wear_raincoat_suit',
    'wear_school_suit',
    'wear_swimming_suit',
    'wear_football_suit',
    'wear_summer_suit',
    'take_swimming_equipment',
    'take_skates',
    'take_umbrella',
    'take_boat',
    'take_fishing_rod',
    'take_backpack',
]


def resolve_choice(value, allowed, default):
    return value if value in allowed else default


@app.route('/')
def index():
    school_key = resolve_choice(request.args.get('school'), SCHOOLS, DEFAULT_SCHOOL)
    mode = resolve_choice(request.args.get('mode'), MODES, DEFAULT_MODE)
    return render_template(
        'index.html',
        school_key=school_key,
        school=SCHOOLS.get(school_key, SCHOOLS['shct']),
        mode=mode,
    )


def get_expected(mode, season, activity):
    if mode == 'seasons':
        return expected_ids_seasons.get(season, [])
    return expected_ids.get(season, {}).get(activity, [])


@app.route('/run', methods=['POST'])
def run_code():
    data = request.json
    code = data.get('code', '')
    season = data.get('season', '')
    mode = resolve_choice(data.get('mode'), MODES, 'full')
    # В упрощённой версии занятия нет — Витя просто выходит на улицу.
    activity = 'nothing' if mode == 'seasons' else data.get('activity', '')
    frontend_command = []

    # Простая обертка для захвата команд
    def command_wrapper(func):
        def wrapper():
            command = func()
            if command:
                print(f"Выполнена команда: {command}")  # Отладочный вывод
                if isinstance(command, list):
                    frontend_command.extend(command)  # Разворачиваем список команд
                else:
                    frontend_command.append(command)
            return command
        return wrapper

    globals_dict = {
        name: command_wrapper(getattr(user_functions, name)) for name in COMMAND_NAMES
    }
    globals_dict.update({
        'season': season,
        'activity': activity,
        'frontend_command': frontend_command,
    })

    try:
        # Выполняем код
        exec(code, globals_dict)

        # Преобразуем frontend_command в плоский список
        flat_command_list = [item for sublist in frontend_command for item in (sublist if isinstance(sublist, list) else [sublist])]

        print(f"Список команд: {flat_command_list}")
        expected_commands = get_expected(mode, season, activity)
        print(f"Правильные команды для {season} и {activity} ({mode}): {expected_commands}")

        # Проверяем, совпадают ли команды
        if set(flat_command_list) == set(expected_commands):
            result_image = 'correct.png'
        else:
            result_image = 'sad_vitya.png'

    except Exception as e:
        return jsonify({'result': str(e), 'command': [], 'image': 'sad_vitya.png'})

    return jsonify({'result': "Код выполнен", 'command': flat_command_list, 'image': result_image})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
