from __future__ import annotations

import base64
import http.cookiejar
import json
import urllib.error
import urllib.parse
import urllib.request

from datetime import date
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
MOCK_DATA_PATH = REPO_ROOT / "django" / "mock-data.json"
ENV_DEV_PATH = REPO_ROOT / "django" / ".env.dev"


def load_env_config(path: Path) -> dict:
    config = {}
    if not path.exists():
        return config
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, value = line.partition("=")
            config[key.strip()] = value.strip()
    return config


CONFIG = load_env_config(ENV_DEV_PATH)


def get_academic_year() -> str:
    # Mirrors ScheduleController.get_academic_year(), honoring EXCHANGE_YEAR like SigarraController does.
    exchange_year = CONFIG.get("EXCHANGE_YEAR")
    if exchange_year:
        return str(exchange_year)
    currdate = date.today()
    return str(currdate.year - 1 if currdate.month < 8 else currdate.year)


def is_first_semester() -> bool:
    semester = CONFIG.get("EXCHANGE_SEMESTER")
    if semester:
        return int(semester) == 1
    currdate = date.today()
    return currdate.month >= 10 or currdate.month <= 1


def get_period() -> str:
    # Mirrors ScheduleController.get_period(): period N+1 maps to semester N.
    semester = CONFIG.get("EXCHANGE_SEMESTER")
    if semester:
        return f"{int(semester) + 1}"
    return "2" if is_first_semester() else "3"


def semester_weeks() -> tuple[str, str]:
    # Mirrors SigarraController.semester_weeks().
    year = get_academic_year()
    if is_first_semester():
        return (year + "1001", f"{int(year) + 1}0131")
    return (year + "0210", year + "0601")


SEMANA_INI, SEMANA_FIM = semester_weeks()
ACADEMIC_YEAR = get_academic_year()
PERIOD = get_period()


class HTTPResponse:
    def __init__(self, response):
        self._headers = response.headers
        self.status_code = getattr(response, "status", None) or response.code
        body = response.read()
        charset = response.headers.get_content_charset() or "utf-8"
        self.content = body
        self.text = body.decode(charset, errors="replace")

    @property
    def headers(self):
        return self._headers

    def raise_for_status(self):
        if self.status_code >= 400:
            snippet = self.text[:300].strip()
            raise RuntimeError(f"Request failed with status {self.status_code}: {snippet}")


class HTTPSession:
    """Minimal stdlib replacement for requests.Session: form posts + cookie persistence."""

    # Sigarra rejects default Python user-agents with 403.
    DEFAULT_HEADERS = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        "Accept": "text/html,application/json;q=0.9,*/*;q=0.8",
    }

    def __init__(self):
        cookie_jar = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cookie_jar))

    def get(self, url):
        request = urllib.request.Request(url, method="GET", headers=self.DEFAULT_HEADERS)
        return self._open(request)

    def post(self, url, data=None):
        body = urllib.parse.urlencode(data or {}).encode("utf-8")
        headers = {**self.DEFAULT_HEADERS, "Content-Type": "application/x-www-form-urlencoded"}
        request = urllib.request.Request(url, data=body, method="POST", headers=headers)
        return self._open(request)

    def _open(self, request):
        try:
            response = self.opener.open(request)
        except urllib.error.HTTPError as error:
            response = error
        return HTTPResponse(response)


students = [
    "202307365",
    "202303872",
    "202204914",
    "202304064",
    "202305033",
    "202307295",
    "202306618",
    "202306498",
    "202307321",
    "202304594",
]

course_units = [
    "560106",
    "560107",
    "560108",
    "560109",
    "560110",
    "560096"
]


sigarra_requests = {
    "login": {
        "method": "POST",
        "url": "https://sigarra.up.pt/feup/pt/vld_validacao.validacao"
    },
    "student_photo": {
        "method": "GET",
        "url": lambda nmec: f"https://sigarra.up.pt/feup/pt/fotografias_service.foto?pct_cod={nmec}"
    },
    "student_profile": {
        "method": "GET",
        "url": lambda nmec: f"https://sigarra.up.pt/feup/pt/mob_fest_geral.perfil?pv_codigo={nmec}"
    },
    "student_schedule": {
        "method": "GET",
        "url": lambda nmec, semana_ini=SEMANA_INI, semana_fim=SEMANA_FIM: (
            f"https://sigarra.up.pt/feup/pt/mob_hor_geral.estudante?pv_codigo={nmec}&pv_semana_ini={semana_ini}&pv_semana_fim={semana_fim}"
        )
    },
    "course_unit_schedule": {
        "method": "GET",
        "url": lambda ocorrencia_id, semana_ini=SEMANA_INI, semana_fim=SEMANA_FIM, faculty="feup": (
            f"https://sigarra.up.pt/{faculty}/pt/mob_hor_geral.ucurr?pv_ocorrencia_id={ocorrencia_id}&pv_semana_ini={semana_ini}&pv_semana_fim={semana_fim}"
        )
    },
    "course_unit_schedule_new": {
        "method": "GET",
        "url": lambda faculty="feup", course_unit_id=None, year=ACADEMIC_YEAR, period=PERIOD: ( # period N+1 means semester N
            f"https://sigarra.up.pt/calendarios-api/api/v1/events/{faculty}/uc/{course_unit_id}/?academic_year={year}&period={period}"
        )
    },
    "course_unit_classes": {
        "method": "GET",
        "url": lambda course_unit_id: f"https://sigarra.up.pt/feup/pt/mob_ucurr_geral.uc_inscritos?pv_ocorrencia_id={course_unit_id}"
    }
}

def load_mock_store() -> dict:
    if MOCK_DATA_PATH.exists():
        with MOCK_DATA_PATH.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    return {"get": {}, "post": {}}


def data_uri(content_type: str, payload: bytes) -> str:
    encoded = base64.b64encode(payload).decode("ascii")
    return f"data:{content_type};base64,{encoded}"


def serialize_response(method: str, url: str, response: HTTPResponse, store: dict) -> None:
    bucket = store.setdefault(method.lower(), {})
    entry: dict = {"status_code": response.status_code}

    if method.upper() == "POST":
        entry["cookies"] = {} # Not gonna store actual credentials
    else:
        content_type = response.headers.get("Content-Type", "")
        if content_type.startswith("image/"):
            entry["data"] = data_uri(content_type.split(";")[0], response.content)
        else:
            entry["data"] = response.text

    bucket[url] = entry


def ensure_session() -> tuple[HTTPSession, HTTPResponse]:
    username = input("SIGARRA username: ")
    password = input("SIGARRA password: ")

    session = HTTPSession()
    login_url = sigarra_requests["login"]["url"]
    response = session.post(login_url, data={"p_user": username, "p_pass": password})
    response.raise_for_status()
    return session, response


def fetch_all(session: HTTPSession, store: dict, login_response: HTTPResponse) -> None:
    serialize_response(
        "POST",
        sigarra_requests["login"]["url"],
        login_response,
        store,
    )

    for nmec in students:
        photo_url = sigarra_requests["student_photo"]["url"](nmec)
        photo_resp = session.get(photo_url)
        photo_resp.raise_for_status()
        serialize_response("GET", photo_url, photo_resp, store)

        profile_url = sigarra_requests["student_profile"]["url"](nmec)
        profile_resp = session.get(profile_url)
        profile_resp.raise_for_status()
        serialize_response("GET", profile_url, profile_resp, store)

        schedule_url = sigarra_requests["student_schedule"]["url"](nmec)
        schedule_resp = session.get(schedule_url)
        schedule_resp.raise_for_status()
        serialize_response("GET", schedule_url, schedule_resp, store)

    for course_unit in course_units:
        classes_url = sigarra_requests["course_unit_classes"]["url"](course_unit)
        classes_resp = session.get(classes_url)
        classes_resp.raise_for_status()
        serialize_response("GET", classes_url, classes_resp, store)

        schedule_url = sigarra_requests["course_unit_schedule"]["url"](course_unit)
        schedule_resp = session.get(schedule_url)
        schedule_resp.raise_for_status()
        serialize_response("GET", schedule_url, schedule_resp, store)

        new_schedule_url = sigarra_requests["course_unit_schedule_new"]["url"](course_unit_id=course_unit)
        new_schedule_resp = session.get(new_schedule_url)
        new_schedule_resp.raise_for_status()
        serialize_response("GET", new_schedule_url, new_schedule_resp, store)


def main() -> None:
    store = load_mock_store()
    session, login_response = ensure_session()
    fetch_all(session, store, login_response)

    with MOCK_DATA_PATH.open("w", encoding="utf-8") as handle:
        json.dump(store, handle, indent=4, sort_keys=True, ensure_ascii=False)



if __name__ == "__main__":
    main()
