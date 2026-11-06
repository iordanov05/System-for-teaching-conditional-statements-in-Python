## Веб-платформа для обучения детей условным операторам на Python

Эта инновационная веб-платформа создана с целью обучения детей основам программирования на Python, с акцентом на условные операторы. Платформа предлагает интерактивный и увлекательный подход к обучению, позволяя юным программистам развивать логическое мышление и навыки решения задач через игровую механику.

## Запуск

### Вариант 1: обычный Python

Требуется Python 3.10+.

```bash
pip install -r requirements.txt
python app.py
```

Платформа откроется на [http://127.0.0.1:5000](http://127.0.0.1:5000).

### Вариант 2: Docker

```bash
docker build -t vitya-platform .
docker run --rm -p 5000:5000 vitya-platform
```

Платформа будет доступна на [http://localhost:5000](http://localhost:5000).

## Школы и режимы

Платформа используется на мастер-классах двух школ. Школа и режим выбираются параметрами в адресе страницы:

| Адрес | Что открывается |
| --- | --- |
| `http://127.0.0.1:5000/` | ШЦТ, полная версия (сезон + занятие) |
| `http://127.0.0.1:5000/?school=mastersam` | Мастерсам, полная версия |
| `http://127.0.0.1:5000/?school=mastersam&mode=seasons` | Мастерсам, упрощённая версия (только сезоны) |
| `http://127.0.0.1:5000/?mode=seasons` | ШЦТ, упрощённая версия |

Режим можно переключать и прямо на странице кнопками «Сезон + занятие» / «Только сезоны». Значения по умолчанию задаются переменными окружения `SCHOOL` (`shct` | `mastersam`) и `MODE` (`full` | `seasons`), например:

```bash
SCHOOL=mastersam MODE=seasons python app.py
# или
docker run --rm -p 5000:5000 -e SCHOOL=mastersam -e MODE=seasons vitya-platform
```

Конспекты мастер-класса: [для ШЦТ](master-class-plan.md) и [для Мастерсам](master-class-plan-mastersam.md). Презентация для Мастерсам — в Figma: [https://www.figma.com/slides/KvMF78Em5ekHpaLCVbefN8](https://www.figma.com/slides/KvMF78Em5ekHpaLCVbefN8), PDF-версия: [Python Мастер-класс Мастерсам.pdf](<Python Мастер-класс Мастерсам.pdf>).

### Упрощённая версия: только сезоны

Выбора занятия нет, Витя одевается только по времени года. Каждому сезону соответствует одна команда:

| Время года | Команда | Что надевает Витя |
| --- | --- | --- |
| `'winter'` | `wear_winter_suit()` | Тёплая куртка |
| `'spring'` | `wear_raincoat_suit()` | Дождевик |
| `'summer'` | `wear_summer_suit()` | Летняя одежда (футболка и шорты) |
| `'autumn'` | `wear_school_suit()` | Школьная форма |

Правильный код для упрощённой версии:

```python
if season == 'winter':
    wear_winter_suit()
elif season == 'spring':
    wear_raincoat_suit()
elif season == 'summer':
    wear_summer_suit()
elif season == 'autumn':
    wear_school_suit()
```

## Доступные функции

Ребёнок описывает поведение персонажа Вити через `if`/`elif`, вызывая в теле условий готовые функции-команды. Каждая функция ничего не делает сама по себе — она лишь сообщает платформе, какой предмет одежды или снаряжения надеть/взять на персонажа:

| Функция | Что делает |
| --- | --- |
| `wear_winter_suit()` | Надеть тёплую зимнюю куртку |
| `take_skis()` | Взять лыжи |
| `take_skates()` | Взять коньки |
| `wear_raincoat_suit()` | Надеть непромокаемый костюм (для дождя) |
| `take_boat()` | Взять бумажный кораблик |
| `take_fishing_rod()` | Взять удочку |
| `take_umbrella()` | Взять зонт |
| `wear_swimming_suit()` | Надеть купальный костюм |
| `take_swimming_equipment()` | Взять снаряжение для плавания |
| `wear_football_suit()` | Надеть футбольную форму |
| `wear_summer_suit()` | Надеть летнюю одежду (для упрощённой версии) |
| `take_ball()` | Взять мяч |
| `wear_school_suit()` | Надеть школьную форму |
| `take_backpack()` | Взять рюкзак |

## Пример кода (полная версия)

Ниже — рабочий пример, который платформа засчитывает как правильный для всех времён года и занятий в полной версии:

```python
if season == 'winter':
    wear_winter_suit()
    if activity == 'skiing':
        take_skis()
    elif activity == 'skating':
        take_skates()
elif season == 'spring':
    wear_raincoat_suit()
    if activity == 'launch_paper_boats':
        take_boat()
    elif activity == 'go_fishing':
        take_fishing_rod()
elif season == 'summer':
    if activity == 'swimming':
        wear_swimming_suit()
        take_swimming_equipment()
    elif activity == 'football':
        wear_football_suit()
        take_ball()
elif season == 'autumn':
    if activity == 'walk_in_the_rain':
        wear_raincoat_suit()
        take_umbrella()
    elif activity == 'go_to_school':
        wear_school_suit()
        take_backpack()
```

