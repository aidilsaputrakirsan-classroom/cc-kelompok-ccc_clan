def test_register(client):

    response = client.post(
        "/auth/register",
        json={
            "email": "test@test.com",
            "name": "Tester",
            "password": "Password123!",
            "nim": "10231034",
            "prodi": "TI",
            "jurusan": "TI",
            "fakultas": "FTI",
            "angkatan": 2023
        }
    )

    assert response.status_code == 200


def test_login(client):

    client.post(
        "/auth/register",
        json={
            "email": "login@test.com",
            "name": "Tester",
            "password": "Password123!",
            "nim": "10231035",
            "prodi": "TI",
            "jurusan": "TI",
            "fakultas": "FTI",
            "angkatan": 2023
        }
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "login@test.com",
            "password": "Password123!"
        }
    )

    assert response.status_code == 200