def test_register_success(client):

    response = client.post(
        "/auth/register",
        json={
            "email": "userbaru@example.com",
            "password": "Password123!",
            "name": "User Baru",
            "nim": "10231111",
            "prodi": "SI",
            "jurusan": "TI",
            "fakultas": "FTIK",
            "angkatan": 2023
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["email"] == "userbaru@example.com"
    assert data["name"] == "User Baru"


def test_login_success(client):

    client.post(
        "/auth/register",
        json={
            "email": "login@example.com",
            "password": "Password123!",
            "name": "Login User",
            "nim": "10232222",
            "prodi": "SI",
            "jurusan": "TI",
            "fakultas": "FTIK",
            "angkatan": 2023
        }
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "login@example.com",
            "password": "Password123!"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):

    client.post(
        "/auth/register",
        json={
            "email": "wrong@example.com",
            "password": "Password123!",
            "name": "Wrong User",
            "nim": "10233333",
            "prodi": "SI",
            "jurusan": "TI",
            "fakultas": "FTIK",
            "angkatan": 2023
        }
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "wrong@example.com",
            "password": "SALAH"
        }
    )

    assert response.status_code == 401