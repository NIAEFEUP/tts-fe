# How to test



The easiest way to test TTS is to use mock data. To do this, set the following in your `.env` file:

```env
EXCHANGE_SEMESTER=1
EXCHANGE_YEAR=2025
MOCK_SIGARRA=1
```

After that, run the `make_mock.py` script, which generates a `mock-data.json` file. If you want to add more users or courses to the mock data, you can modify this script.

**Note:** running `make_mock.py` is optional. When `MOCK_SIGARRA=1`, any URL without a captured entry is fetched live from Sigarra, using the `SIGARRA_USERNAME`/`SIGARRA_PASSWORD` credentials configured in your env file. Use the script only if you want fully offline mock data.

When using mock Sigarra, you only have data for the following users and courses:

### Students

| UP Number   | Name            | Class     |
| :---------- | :-------------- | :-------- |
| `202307365` | Alice Oliveira  | `3LEIC01` |
| `202303872` | Bruno Silva     | `3LEIC02` |
| `202204914` | Carla Mendes    | `3LEIC03` |
| `202304064` | Daniel Costa    | `3LEIC05` |
| `202305033` | Eva Ferreira    | `3LEIC06` |
| `202307295` | Filipe Rocha    | `3LEIC10` |
| `202306618` | Gabriela Lima   | `3LEIC11` |
| `202306498` | Hugo Fernandes  | `3LEIC12` |
| `202307321` | Inês Gomes      | `3LEIC13` |
| `202304594` | João Marques    | `3LEIC14` |

### Available Course Units (3rd Year)

| Code     | Name                                           | Acronym |
| :------- | :--------------------------------------------- | :------ |
| `560106` | Fundamentos de Segurança Informática           | FSI     |
| `560107` | Interação Pessoa Computador                    | IPC     |
| `560108` | Laboratório de Bases de Dados e Aplicações Web | LBAW    |
| `560109` | Programação Funcional e em Lógica              | PFL     |
| `560110` | Redes de Computadores                          | RC      |

---

## Performing Actions

First, log in normally with your own account.

### Impersonate a User

To perform actions on behalf of another user, run the `change_login_with_name.sh` script.

**Usage:**

```sh
./change_login_with_name.sh <your_up> <target_up> <target_first_name> <target_last_name>
```

**Example:**

This command changes your login to João Marques, allowing you to act as him. For context, my UP is `202208817`.

```sh
./change_login_with_name.sh 202208817 202304594 João Marques
```

### Make a User a Superuser

To grant superuser privileges to a user, run the `make_super.sh` script.

**Usage:**

```sh
./make_super.sh <target_up>
```
