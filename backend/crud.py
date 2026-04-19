from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Item, User, Candidate
from schemas import ItemCreate, ItemUpdate, UserCreate, CandidateCreate, CandidateUpdate
from auth import hash_password, verify_password


# ================= ITEM =================
def create_item(db: Session, item_data: ItemCreate) -> Item:
    db_item = Item(**item_data.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_items(db: Session, skip=0, limit=20, search=None):
    query = db.query(Item)

    if search:
        query = query.filter(
            or_(
                Item.name.ilike(f"%{search}%"),
                Item.description.ilike(f"%{search}%")
            )
        )

    total = query.count()
    items = query.order_by(Item.created_at.desc()).offset(skip).limit(limit).all()

    return {"total": total, "items": items}


def get_item(db: Session, item_id: int):
    return db.query(Item).filter(Item.id == item_id).first()


def update_item(db: Session, item_id: int, item_data: ItemUpdate):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if not db_item:
        return None

    for key, value in item_data.model_dump(exclude_unset=True).items():
        setattr(db_item, key, value)

    db.commit()
    db.refresh(db_item)
    return db_item


def delete_item(db: Session, item_id: int):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if not db_item:
        return False

    db.delete(db_item)
    db.commit()
    return True


# ================= USER =================
def create_user(db: Session, user_data: UserCreate):
    if db.query(User).filter(User.email == user_data.email).first():
        return None

    user = User(
        email=user_data.email,
        name=user_data.name,
        nim=user_data.nim,
        prodi=user_data.prodi,
        jurusan=user_data.jurusan,
        fakultas=user_data.fakultas,
        angkatan=user_data.angkatan,
        hashed_password=hash_password(user_data.password),
        role="user"
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_admin(db: Session, user_data: UserCreate):
    user = create_user(db, user_data)
    if user:
        user.role = "admin"
        db.commit()
    return user


def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


# ================= CANDIDATE =================
def create_candidate(db: Session, data: CandidateCreate):
    candidate = Candidate(**data.model_dump(), status="approved")
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate


def get_candidates(db: Session):
    return db.query(Candidate).order_by(Candidate.created_at.desc()).all()


def update_candidate(db: Session, candidate_id: int, data: CandidateUpdate):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        return None

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(candidate, key, value)

    db.commit()
    db.refresh(candidate)
    return candidate


def delete_candidate(db: Session, candidate_id: int):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        return False

    db.delete(candidate)
    db.commit()
    return True