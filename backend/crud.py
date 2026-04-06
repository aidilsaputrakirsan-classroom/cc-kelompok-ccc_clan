from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Item, User, Candidate
from schemas import ItemCreate, ItemUpdate, UserCreate, CandidateCreate
from auth import hash_password, verify_password


# ==================== ITEM CRUD ====================

def create_item(db: Session, item_data: ItemCreate) -> Item:
    db_item = Item(**item_data.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_items(db: Session, skip: int = 0, limit: int = 20, search: str = None):
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


def get_item(db: Session, item_id: int) -> Item | None:
    return db.query(Item).filter(Item.id == item_id).first()


def update_item(db: Session, item_id: int, item_data: ItemUpdate) -> Item | None:
    db_item = db.query(Item).filter(Item.id == item_id).first()

    if not db_item:
        return None

    update_data = item_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_item, field, value)

    db.commit()
    db.refresh(db_item)
    return db_item


def delete_item(db: Session, item_id: int) -> bool:
    db_item = db.query(Item).filter(Item.id == item_id).first()

    if not db_item:
        return False

    db.delete(db_item)
    db.commit()
    return True


# ==================== USER CRUD ====================

def create_user(db: Session, user_data: UserCreate) -> User:
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        return None

    db_user = User(
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

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_admin(db: Session, user_data: UserCreate) -> User:
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        return None

    db_user = User(
        email=user_data.email,
        name=user_data.name,
        nim=user_data.nim,
        prodi=user_data.prodi,
        jurusan=user_data.jurusan,
        fakultas=user_data.fakultas,
        angkatan=user_data.angkatan,
        hashed_password=hash_password(user_data.password),
        role="admin"
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


# ==================== CANDIDATE ====================

def register_candidate(db: Session, user_id: int, data: CandidateCreate):
    candidate = Candidate(
        user_id=user_id,
        posisi=data.posisi,
        visi=data.visi,
        misi=data.misi,
        inovasi=data.inovasi,
        status="pending"
    )

    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate


def get_candidates(db: Session):
    return db.query(Candidate).all()


def approve_candidate(db: Session, candidate_id: int):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()

    if not candidate:
        return None

    candidate.status = "approved"
    db.commit()
    db.refresh(candidate)
    return candidate


def reject_candidate(db: Session, candidate_id: int):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()

    if not candidate:
        return None

    candidate.status = "rejected"
    db.commit()
    db.refresh(candidate)
    return candidate