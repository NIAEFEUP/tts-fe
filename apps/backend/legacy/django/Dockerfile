# deps
FROM python:3.11-slim AS deps

WORKDIR /usr/src/django/ 

# Get's the output from the django in realtime. 
ENV PYTHONUNBUFFERED=1

# Copy requirements 
COPY ./requirements.txt ./requirements.txt 

# Dependencies for building the requirements
RUN apt-get update
RUN apt-get -y install build-essential

# Install postgres dependencies (pgsql client and development files)
COPY ./etc/pgdg.sh /tmp/pgdg.sh
RUN /tmp/pgdg.sh

RUN apt -y install libpq-dev postgresql-client-16
RUN apt -y clean && rm -rf /var/lib/apt/lists/*

# Install the requirements
RUN pip install -r requirements.txt

EXPOSE 8000

FROM deps AS dev

COPY tts_be/ ./tts_be
COPY university/ ./university
COPY exchange ./exchange
COPY manage.py tasks.py ./

COPY ./entrypoint.sh ./entrypoint.sh  
ENTRYPOINT ["/usr/src/django/entrypoint.sh"]

# Create a fallback mock data file if none was provided at build time
RUN if [ ! -f "mock-data.json" ]; then echo "{}" > mock-data.json; fi

# prod
FROM deps AS prod

COPY tts_be/ ./tts_be
COPY university/ ./university
COPY exchange ./exchange
COPY manage.py tasks.py ./

COPY ./entrypoint_prod.sh ./entrypoint_prod.sh
ENTRYPOINT ["/usr/src/django/entrypoint_prod.sh"]
