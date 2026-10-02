FROM python:3.10-slim-bullseye

WORKDIR /fetcher/
RUN pip install --upgrade pip

# Install the requirements
COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt 


