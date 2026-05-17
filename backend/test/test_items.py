def test_create_item(client, auth_headers):

    response = client.post(
        "/items",
        json={
            "name": "Laptop",
            "description": "Gaming",
            "price": 15000000,
            "quantity": 5
        },
        headers=auth_headers
    )

    assert response.status_code == 200

    data = response.json()

    assert data["name"] == "Laptop"
    assert data["quantity"] == 5


def test_get_items(client, auth_headers):

    client.post(
        "/items",
        json={
            "name": "Mouse",
            "description": "Wireless",
            "price": 200000,
            "quantity": 10
        },
        headers=auth_headers
    )

    response = client.get(
        "/items",
        headers=auth_headers
    )

    assert response.status_code == 200

    data = response.json()

    assert "items" in data
    assert data["total"] >= 1


def test_get_single_item(client, auth_headers):

    create = client.post(
        "/items",
        json={
            "name": "Keyboard",
            "description": "Mechanical",
            "price": 500000,
            "quantity": 3
        },
        headers=auth_headers
    )

    item_id = create.json()["id"]

    response = client.get(
        f"/items/{item_id}",
        headers=auth_headers
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Keyboard"


def test_update_item(client, auth_headers):

    create = client.post(
        "/items",
        json={
            "name": "Monitor",
            "description": "24 inch",
            "price": 2000000,
            "quantity": 2
        },
        headers=auth_headers
    )

    item_id = create.json()["id"]

    response = client.put(
        f"/items/{item_id}",
        json={
            "price": 1800000
        },
        headers=auth_headers
    )

    assert response.status_code == 200
    assert response.json()["price"] == 1800000


def test_delete_item(client, auth_headers):

    create = client.post(
        "/items",
        json={
            "name": "Delete Test",
            "description": "Delete",
            "price": 1000,
            "quantity": 1
        },
        headers=auth_headers
    )

    item_id = create.json()["id"]

    response = client.delete(
        f"/items/{item_id}",
        headers=auth_headers
    )

    assert response.status_code == 200


def test_item_not_found(client, auth_headers):

    response = client.get(
        "/items/99999",
        headers=auth_headers
    )

    assert response.status_code == 404