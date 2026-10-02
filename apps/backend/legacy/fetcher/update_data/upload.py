from distutils.command.config import config
import requests 
import configparser 
from os import listdir


def upload_files(config: configparser.ConfigParser):
    url = config["upload"]["url"]
    param_name = config["upload"]["param_name"]
    path = config["upload"]["path"]
    files = [f for f in listdir(path)]
    for f in files: 
        filepath = "{}/{}".format(path, f)
        files = {param_name: open(filepath, "rb")}
        r = requests.post(url, files=files)
        print(r.text)
        


config = configparser.ConfigParser()
config.read("./config.cfg") 
upload_files(config)


