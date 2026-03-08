@app.get("/items/stats")
def items_stats(db: Session = Depends(get_db)):
    """Statistik inventory."""
    items = db.query(Item).all()
    if not items:
        return {"total_items": 0, "total_value": 0, "most_expensive": None, "cheapest": None}
    
    return {
        "total_items": len(items),
        "total_value": sum(i.price * i.quantity for i in items),
        "most_expensive": {"name": max(items, key=lambda x: x.price).name, 
                          "price": max(items, key=lambda x: x.price).price},
        "cheapest": {"name": min(items, key=lambda x: x.price).name,
                    "price": min(items, key=lambda x: x.price).price},
    }