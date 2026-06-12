from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from models import Item, User, Candidate, Vote
from schemas import ItemCreate, ItemUpdate, UserCreate, CandidateCreate, CandidateUpdate
from auth import hash_password, verify_password
from fastapi import HTTPException


# ================= ITEM =================
def create_item(db: Session, item_data: ItemCreate) -> Item:
    db_item = Item(**item_data.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def get_items(db: Session, skip=0, limit=20, search=None, category=None):
    query = db.query(Item)

    if search:
        query = query.filter(
            or_(
                Item.name.ilike(f"%{search}%"),
                Item.description.ilike(f"%{search}%")
            )
        )

    if category:
        query = query.filter(Item.category.ilike(f"%{category}%"))

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
    existing_email = db.query(User).filter(User.email == user_data.email).first()

    if existing_email:
        return None

    existing_nim = db.query(User).filter(User.nim == user_data.nim).first()

    if existing_nim:
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
        role="user",
        is_active=True,
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
        db.refresh(user)

    return user


def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user


def get_users(
    db: Session,
    search: str | None = None,
    role: str | None = None,
    is_active: bool | None = None,
):
    query = db.query(User).order_by(User.created_at.desc())

    if search:
        keyword = f"%{search.lower()}%"
        query = query.filter(
            or_(
                User.name.ilike(keyword),
                User.email.ilike(keyword),
                User.nim.ilike(keyword),
                User.prodi.ilike(keyword),
                User.jurusan.ilike(keyword),
                User.fakultas.ilike(keyword),
            )
        )

    if role:
        query = query.filter(User.role == role)

    if is_active is not None:
        query = query.filter(User.is_active == is_active)

    return query.all()


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def update_user_verification(db: Session, user_id: int, is_active: bool):
    user = get_user_by_id(db, user_id)

    if not user:
        return None

    user.is_active = is_active
    db.commit()
    db.refresh(user)

    return user


def update_user_role(db: Session, user_id: int, role: str):
    user = get_user_by_id(db, user_id)

    if not user:
        return None

    user.role = role
    db.commit()
    db.refresh(user)

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


def get_candidate_by_id(db: Session, candidate_id: int):
    return db.query(Candidate).filter(Candidate.id == candidate_id).first()


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


# ================= VOTING =================
def vote_candidate(db: Session, user_id: int, candidate_id: int):
    existing_vote = db.query(Vote).filter(Vote.user_id == user_id).first()

    if existing_vote:
        raise HTTPException(
            status_code=400,
            detail="User sudah melakukan voting"
        )

    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate tidak ditemukan"
        )

    vote = Vote(
        user_id=user_id,
        candidate_id=candidate_id
    )

    db.add(vote)
    db.commit()

    return {"message": "Voting berhasil"}


def get_vote_results(db: Session):
    results = (
        db.query(
            Vote.candidate_id,
            func.count(Vote.id).label("total_votes")
        )
        .group_by(Vote.candidate_id)
        .all()
    )

    return results