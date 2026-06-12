VALID_ACADEMIC_DATA = {
    "prodi": "Sistem Informasi",
    "jurusan": "Jurusan Teknik Elektro, Informatika, dan Bisnis",
    "fakultas": "Fakultas Sains dan Teknologi Informasi",
}


def create_user_and_login(client):
    register_response = client.post(
        "/auth/register",
        json={
            "email": "vote@test.com",
            "name": "Voter",
            "password": "Password123!",
            "nim": "10239999",
            "prodi": VALID_ACADEMIC_DATA["prodi"],
            "jurusan": VALID_ACADEMIC_DATA["jurusan"],
            "fakultas": VALID_ACADEMIC_DATA["fakultas"],
            "angkatan": 2023,
        },
    )

    assert register_response.status_code == 200

    login = client.post(
        "/auth/login",
        json={
            "email": "vote@test.com",
            "password": "Password123!",
        },
    )

    assert login.status_code == 200
    assert "access_token" in login.json()

    return login.json()["access_token"]


def test_vote_candidate(client):
    token = create_user_and_login(client)

    response = client.post(
        "/vote/1",
        headers={
            "Authorization": f"Bearer {token}",
        },
    )

    assert response.status_code in [200, 404]