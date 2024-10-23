from flask import Flask, request, jsonify, render_template
import user_functions

app = Flask(__name__)

expected_ids = {
    'winter': {
        'nothing': ['warm_jacket'],
        'skiing': ['skis', 'warm_jacket'],
        'skating': ['skates', 'warm_jacket']
    },
    'summer': {
        'nothing': ['football_suit'],
        'swimming': ['swimming_suit', 'swimming_equipment'], 
        'football': ['football_suit','ball']
    },
    'spring': {
        'nothing': ['raincoat_suit'],
        'launch_paper_boats': ['raincoat_suit', 'boat'],
        'go_fishing': ['raincoat_suit','fishing_rod']
    },
    'autumn': {
        'nothing': ['raincoat_suit'],
        'walk_in_the_rain': ['raincoat_suit', 'umbrella'],
        'go_to_school': ['school_suit', 'backpack']
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run', methods=['POST'])
def run_code():
    data = request.json
    code = data.get('code', '')
    season = data.get('season', '')
    activity = data.get('activity', '')
    frontend_command = []

    # Глобальные переменные для хранения команд
    globals_dict = {
        'take_skis': user_functions.take_skis,
        'wear_winter_suit': user_functions.wear_winter_suit,
        'take_ball': user_functions.take_ball,
        'wear_raincoat_suit': user_functions.wear_raincoat_suit,
        'wear_school_suit': user_functions.wear_school_suit,
        'wear_football_suit': user_functions.wear_football_suit,
        'wear_swimming_suit': user_functions.wear_swimming_suit,
        'take_swimming_equipment':user_functions.take_swimming_equipment,
        'take_skates':user_functions.take_skates,
        'take_umbrella': user_functions.take_umbrella,
        'take_boat': user_functions.take_boat,
        'take_fishing_rod': user_functions.take_fishing_rod, 
        'take_backpack': user_functions.take_backpack, 
        'season': season,
        'activity': activity,
        'frontend_command': frontend_command
    }

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

    # Заворачиваем функции
    globals_dict['take_skis'] = command_wrapper(user_functions.take_skis)
    globals_dict['wear_winter_suit'] = command_wrapper(user_functions.wear_winter_suit)
    globals_dict['wear_raincoat_suit'] = command_wrapper(user_functions.wear_raincoat_suit)
    globals_dict['wear_football_suit'] = command_wrapper(user_functions.wear_football_suit)
    globals_dict['take_umbrella'] = command_wrapper(user_functions.take_umbrella)
    globals_dict['take_boat'] = command_wrapper(user_functions.take_boat)
    globals_dict['take_fishing_rod'] = command_wrapper(user_functions.take_fishing_rod)
    globals_dict['take_backpack'] = command_wrapper(user_functions.take_backpack)
    globals_dict['wear_swimming_suit'] = command_wrapper(user_functions.wear_swimming_suit)
    globals_dict['wear_school_suit'] = command_wrapper(user_functions.wear_school_suit)
    globals_dict['take_ball'] = command_wrapper(user_functions.take_ball)
    globals_dict['take_swimming_equipment'] = command_wrapper(user_functions.take_swimming_equipment)
    globals_dict['take_skates'] = command_wrapper(user_functions.take_skates)
    try:
        # Выполняем код
        exec(code, globals_dict)
        
        # Преобразуем frontend_command в плоский список
        flat_command_list = [item for sublist in frontend_command for item in (sublist if isinstance(sublist, list) else [sublist])]

        print(f"Список команд: {flat_command_list}")
        expected_commands = expected_ids.get(season, {}).get(activity, [])
        print(f"Правильные команды для {season} и {activity}: {expected_commands}")

        # Проверяем, совпадают ли команды
        if set(flat_command_list) == set(expected_commands):
            result_image = 'correct.png'
        else:
            result_image = 'sad_vitya.png'
            
    except Exception as e:
        return jsonify({'result': str(e), 'command': []})

    return jsonify({'result': "Код выполнен", 'command': flat_command_list, 'image': result_image})

if __name__ == '__main__':
    app.run(debug=True)
