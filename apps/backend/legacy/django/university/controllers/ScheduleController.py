from tts_be.settings import CONFIG
from datetime import date

class ScheduleController:
    def __init__(self):
        self.weekday_to_day = {
            "Segunda-feira": 0,
            "Terça-feira": 1,
            "Quarta-feira": 2,
            "Quinta-feira": 3,
            "Sexta-feira": 4,
            "Sábado": 5,
            "Domingo": 6
        }

    def get_academic_year(self):
        currdate = date.today()

        return currdate.year -  1 if currdate.month < 8 else currdate.year

    def get_period(self):
        if int(CONFIG["EXCHANGE_SEMESTER"]) != None:
            return f"{int(CONFIG['EXCHANGE_SEMESTER']) + 1}"
        else:
            currdate = date.today()
            year = str(currdate.year)

            return "2" if currdate.month >= 10 or currdate.month <= 1 else "3"

    def from_sigarra_day(self, day: int):
        return day - 1

    def day_from_sigarra_week_day(self, day: str):
        return self.weekday_to_day[day]

    def calendarios_api(self, faculty: str, course_unit_id: int, year: int, semester: int):
        return f"https://sigarra.up.pt/calendarios-api/api/v1/events/{faculty}/uc/{course_unit_id}/?academic_year={year}&period={self.get_period()}"
