def build_error_dict(msg: str) -> dict:
    return {"error: ": msg}

def course_unit_not_found_error(id: int) -> dict:
    return build_error_dict(f"A course unit with id {id} was not found")
