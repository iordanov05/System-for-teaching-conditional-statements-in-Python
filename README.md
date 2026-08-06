## Веб-платформа для обучения детей условным операторам на Python

Эта инновационная веб-платформа создана с целью обучения детей основам программирования на Python, с акцентом на условные операторы. Платформа предлагает интерактивный и увлекательный подход к обучению, позволяя юным программистам развивать логическое мышление и навыки решения задач через игровую механику.

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
| `take_ball()` | Взять мяч |
| `wear_school_suit()` | Надеть школьную форму |
| `take_backpack()` | Взять рюкзак |

## Пример кода

Ниже — рабочий пример, который платформа засчитывает как правильный для всех времён года и занятий:

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

