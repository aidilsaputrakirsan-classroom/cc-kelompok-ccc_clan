from fastapi import HTTPException
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from academic_data import normalize_text, validate_academic_selection
from auth import hash_password, verify_password
from models import Candidate, Item, User, Vote
from schemas import CandidateCreate, CandidateUpdate, ItemCreate, ItemUpdate, UserCreate


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
                Item.description.ilike(f"%{search}%"),
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
    validate_academic_selection(
        fakultas=user_data.fakultas,
        jurusan=user_data.jurusan,
        prodi=user_data.prodi,
    )

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
    validate_academic_selection(
        fakultas=data.fakultas,
        jurusan=data.jurusan,
        prodi=data.prodi,
    )

    candidate = Candidate(**data.model_dump(), status="approved")

    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    return candidate


def get_candidates(db: Session, only_approved: bool = False):
    query = db.query(Candidate)

    if only_approved:
        query = query.filter(func.lower(Candidate.status).in_(["approved", "verified", "disetujui"]))

    return query.order_by(Candidate.created_at.desc()).all()


def get_candidate_by_id(db: Session, candidate_id: int):
    return db.query(Candidate).filter(Candidate.id == candidate_id).first()


def update_candidate(db: Session, candidate_id: int, data: CandidateUpdate):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()

    if not candidate:
        return None

    next_data = {
        **{
            "fakultas": candidate.fakultas,
            "jurusan": candidate.jurusan,
            "prodi": candidate.prodi,
        },
        **data.model_dump(exclude_unset=True),
    }

    validate_academic_selection(
        fakultas=next_data.get("fakultas"),
        jurusan=next_data.get("jurusan"),
        prodi=next_data.get("prodi"),
    )

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


# ================= VOTING HELPERS =================
def normalize_position(position: str | None) -> str:
    return normalize_text(position)


def is_approved_candidate(candidate: Candidate) -> bool:
    return normalize_text(candidate.status) in ["approved", "verified", "disetujui"]


def get_candidate_level(candidate: Candidate) -> str:
    position = normalize_position(candidate.posisi)

    if "km" in position:
        return "km"

    if "fakultas" in position:
        return "fakultas"

    if "jurusan" in position:
        return "jurusan"

    if "prodi" in position or "himpunan" in position or "program studi" in position:
        return "prodi"

    return "lainnya"


def get_candidate_scope_value(candidate: Candidate) -> str:
    level = get_candidate_level(candidate)

    if level == "km":
        return "KM"

    if level == "fakultas":
        return candidate.fakultas

    if level == "jurusan":
        return candidate.jurusan

    if level == "prodi":
        return candidate.prodi

    return candidate.posisi or "Lainnya"


def get_candidate_category_key(candidate: Candidate) -> str:
    position = normalize_position(candidate.posisi)
    level = get_candidate_level(candidate)
    scope = normalize_text(get_candidate_scope_value(candidate))
    return f"{position}::{level}::{scope}"


def get_candidate_category_label(candidate: Candidate) -> str:
    level = get_candidate_level(candidate)
    position = candidate.posisi or "Kategori Voting"

    if level == "km":
        return position

    return f"{position} - {get_candidate_scope_value(candidate)}"


def is_candidate_eligible_for_user(candidate: Candidate, user: User) -> bool:
    if not is_approved_candidate(candidate):
        return False

    level = get_candidate_level(candidate)

    if level == "km":
        return True

    if level == "fakultas":
        return normalize_text(candidate.fakultas) == normalize_text(user.fakultas)

    if level == "jurusan":
        return normalize_text(candidate.jurusan) == normalize_text(user.jurusan)

    if level == "prodi":
        return normalize_text(candidate.prodi) == normalize_text(user.prodi)

    return False


def get_eligible_candidates(db: Session, user: User):
    candidates = get_candidates(db, only_approved=True)
    return [candidate for candidate in candidates if is_candidate_eligible_for_user(candidate, user)]


def vote_candidate(db: Session, user: User, candidate_id: int):
    if user.role != "user":
        raise HTTPException(status_code=403, detail="Hanya pemilih yang dapat melakukan voting")

    if user.is_active is False:
        raise HTTPException(status_code=403, detail="Akun belum aktif untuk melakukan voting")

    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()

    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate tidak ditemukan")

    if not is_candidate_eligible_for_user(candidate, user):
        raise HTTPException(status_code=403, detail="Kandidat tidak sesuai dengan hak pilih user")

    category_key = get_candidate_category_key(candidate)

    existing_vote = (
        db.query(Vote)
        .filter(Vote.user_id == user.id, Vote.category_key == category_key)
        .first()
    )

    if existing_vote:
        raise HTTPException(status_code=400, detail="User sudah melakukan voting pada kategori ini")

    vote = Vote(user_id=user.id, candidate_id=candidate_id, category_key=category_key)

    db.add(vote)
    db.commit()
    db.refresh(vote)

    return {
        "message": "Voting berhasil",
        "candidate_id": candidate_id,
        "category_key": category_key,
    }


def get_vote_status(db: Session, user: User):
    votes = (
        db.query(Vote, Candidate)
        .join(Candidate, Vote.candidate_id == Candidate.id)
        .filter(Vote.user_id == user.id)
        .order_by(Vote.created_at.desc())
        .all()
    )

    items = []
    voted_categories = []

    for vote, candidate in votes:
        category_key = vote.category_key or get_candidate_category_key(candidate)
        voted_categories.append(category_key)
        items.append(
            {
                "category_key": category_key,
                "candidate_id": candidate.id,
                "candidate_name": candidate.nama,
                "posisi": candidate.posisi,
                "level": get_candidate_level(candidate),
                "scope": get_candidate_scope_value(candidate),
                "created_at": vote.created_at,
            }
        )

    return {
        "voted_categories": voted_categories,
        "votes": items,
    }


def get_vote_results(db: Session):
    vote_counts = dict(
        db.query(Vote.candidate_id, func.count(Vote.id))
        .group_by(Vote.candidate_id)
        .all()
    )

    candidates = get_candidates(db, only_approved=True)

    return [
        {
            "candidate_id": candidate.id,
            "candidate_name": candidate.nama,
            "posisi": candidate.posisi,
            "fakultas": candidate.fakultas,
            "jurusan": candidate.jurusan,
            "prodi": candidate.prodi,
            "category_key": get_candidate_category_key(candidate),
            "category_label": get_candidate_category_label(candidate),
            "level": get_candidate_level(candidate),
            "scope": get_candidate_scope_value(candidate),
            "total_votes": int(vote_counts.get(candidate.id, 0)),
        }
        for candidate in candidates
    ]
