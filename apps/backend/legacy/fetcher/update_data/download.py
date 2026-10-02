"""Download Database Files

This script allows the user to download the files of the tts database 
and store it in the right repository. The URL where the information is 
stored must be known. 

This script requires that docker is installed in your computer. An
alternative is to use python locally and install the "requests" library. 

This must be executed from the up folder. 
"""


import requests 
import configparser 


def fetch_info(url: str, filename: str):
    """Fecths a file from the given url and stores in at the ../data/ folder.
    
    Parameters 
    ----------
    url: str
        The url where to fetch the data. 

    filename: str
        Name of the file to be stored. The extension must also be provided. 

    """ 
    headers = {}
    r = requests.get(url, headers=headers)
    open("./data/{0}".format(filename), "wb").write(r.content)


def fetch_all_files(config: configparser.ConfigParser):
    """Downloads all the files described in the ../config.cfg file in the [urls] section. 
    
    Parameters
    ----------
    config: ConfigParser
        The config parser object containing the files and urls to be downloaded.
    """
    for file in config["urls"].keys():
        url = config["urls"][file]
        filename = "{}.sql".format(file)
        fetch_info(url, filename)   


if __name__ == '__main__': 
    config = configparser.ConfigParser()
    config.read("./config.cfg")
    fetch_all_files(config)
