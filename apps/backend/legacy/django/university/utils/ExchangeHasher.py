import hashlib
from typing import Any, Iterable

class ExchangeHasher:
    @staticmethod
    def hash(exchanges: Iterable[Any], username: str) -> str:
        serialized_request = '|'.join(map(
            lambda exchange: ExchangeHasher.serialize_exchange(exchange, username),
            sorted(exchanges, key=lambda x: x.get('courseUnitId', ''))  # sorted to ensure order between requests
        ))

        return hashlib.sha256(serialized_request.encode('utf8')).hexdigest()

    @staticmethod
    def serialize_exchange(exchange: Any, username: str) -> str:
        # This function depends on the schema of the `CreateRequestData` type in the frontend
        return (
            username
            + '+' + str(exchange.get('courseUnitId', ''))
            + '+' + exchange.get('courseUnitName', '')
            + '+' + exchange.get('classNameRequesterGoesFrom', '')
            + '+' + exchange.get('classNameRequesterGoesTo', '')
            + '+' + str((exchange['other_student'] or {}).get('mecNumber', ''))
        )