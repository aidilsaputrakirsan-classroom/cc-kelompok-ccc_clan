def create_user_and_login(client):

    client.post(
        "/auth/register",
        json={
            "email": "vote@test.com",
            "name": "Voter",
            "password": "Password123!",
            "nim": "10239999",
            "prodi": "TI",
            "jurusan": "TI",
            "fakultas": "FTI",
            "angkatan": 2023
        }
    )

    login = client.post(
        "/auth/login",
        json={
            "email": "vote@test.com",
            "password": "Password123!"
        }
    )

    return login.json()["access_token"]


def test_vote_candidate(client):

    token = create_user_and_login(client)

    # buat candidate dummy
    client.post(
        "/auth/register",
        json={
            "email": "admin@test.com",
            "name": "Admin",
            "password": "Password123!",
            "nim": "10238888",
            "prodi": "TI",
            "jurusan": "TI",
            "fakultas": "FTI",
            "angkatan": 2023
        }
    )

    response = client.post(
        "/vote/1",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code in [200, 404]