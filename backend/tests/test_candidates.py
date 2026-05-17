def test_get_candidates(client):

    response = client.get("/candidates")

    assert response.status_code == 200