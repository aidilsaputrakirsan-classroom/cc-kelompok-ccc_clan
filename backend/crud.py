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
        is_active=False,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def create_admin(db: Session, user_data: UserCreate):
    user = create_user(db, user_data)

    if user:
        user.role = "admin"
        user.is_active = True
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
    candidate = Candidate(**data.model_dump(), status="pending")

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

    vote_count = db.query(Vote).filter(Vote.candidate_id == candidate_id).count()

    if vote_count > 0:
        raise HTTPException(
            status_code=400,
            detail=(
                "Kandidat tidak dapat dihapus karena sudah memiliki suara. "
                "Ubah status kandidat jika ingin menyembunyikannya dari proses voting."
            ),
        )

    db.delete(candidate)
    db.commit()

    return True


# ================= ELIGIBLE CANDIDATES =================
def _normalize_eligible_text(value: str | None):
    return (value or "").strip().lower()


def get_candidate_scope(candidate: Candidate):
    posisi = _normalize_eligible_text(candidate.posisi)

    # KM bisa dipilih semua user
    if "km" in posisi:
        return "km"

    # Fakultas hanya untuk fakultas yang sama
    if "fakultas" in posisi:
        return "fakultas"

    # Jurusan hanya untuk jurusan yang sama
    if "jurusan" in posisi:
        return "jurusan"

    # Prodi / himpunan hanya untuk prodi yang sama
    if "prodi" in posisi or "himpunan" in posisi or "hima" in posisi:
        return "prodi"

    # Default aman: dianggap prodi agar tidak terlalu luas
    return "prodi"


def get_candidate_category_key(candidate: Candidate):
    """Membuat key kategori voting.

    Key ini dipakai agar 1 user hanya bisa voting 1 kali pada kategori yang sama,
    tetapi tetap bisa voting pada kategori lain.
    """
    scope = get_candidate_scope(candidate)
    posisi = _normalize_eligible_text(candidate.posisi)
    fakultas = _normalize_eligible_text(candidate.fakultas)
    jurusan = _normalize_eligible_text(candidate.jurusan)
    prodi = _normalize_eligible_text(candidate.prodi)

    if scope == "km":
        return f"km:{posisi}"

    if scope == "fakultas":
        return f"fakultas:{posisi}:{fakultas}"

    if scope == "jurusan":
        return f"jurusan:{posisi}:{jurusan}"

    if scope == "prodi":
        return f"prodi:{posisi}:{prodi}"

    return f"lainnya:{posisi}"


def is_candidate_eligible_for_user(candidate: Candidate, user: User):
    if candidate.status != "approved":
        return False

    scope = get_candidate_scope(candidate)

    if scope == "km":
        return True

    if scope == "fakultas":
        return _normalize_eligible_text(candidate.fakultas) == _normalize_eligible_text(user.fakultas)

    if scope == "jurusan":
        return _normalize_eligible_text(candidate.jurusan) == _normalize_eligible_text(user.jurusan)

    if scope == "prodi":
        return _normalize_eligible_text(candidate.prodi) == _normalize_eligible_text(user.prodi)

    return False


def get_eligible_candidates(db: Session, user: User):
    if user.role != "user":
        return []

    candidates = (
        db.query(Candidate)
        .filter(Candidate.status == "approved")
        .order_by(Candidate.created_at.desc())
        .all()
    )

    return [
        candidate
        for candidate in candidates
        if is_candidate_eligible_for_user(candidate, user)
    ]


# ================= VOTING =================
def vote_candidate(db: Session, user_id: int, candidate_id: int):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Kandidat tidak ditemukan"
        )

    if candidate.status != "approved":
        raise HTTPException(
            status_code=400,
            detail="Kandidat belum diverifikasi"
        )

    category_key = get_candidate_category_key(candidate)

    existing_vote = (
        db.query(Vote)
        .filter(
            Vote.user_id == user_id,
            Vote.kategori == category_key,
        )
        .first()
    )

    if existing_vote:
        raise HTTPException(
            status_code=400,
            detail="User sudah melakukan voting pada kategori ini"
        )

    vote = Vote(
        user_id=user_id,
        candidate_id=candidate_id,
        kategori=category_key,
        category_key=category_key,
    )

    db.add(vote)
    db.commit()
    db.refresh(vote)

    return {
        "message": "Voting berhasil",
        "vote_id": vote.id,
        "candidate_id": candidate_id,
        "kategori": category_key,
        "category_key": category_key,
    }


def get_my_vote_status(db: Session, user_id: int):
    votes = (
        db.query(Vote)
        .filter(Vote.user_id == user_id)
        .order_by(Vote.created_at.desc())
        .all()
    )

    return {
        "total_votes": len(votes),
        "voted_categories": [vote.kategori for vote in votes],
        "category_keys": [vote.category_key or vote.kategori for vote in votes],
        "votes": [
            {
                "id": vote.id,
                "candidate_id": vote.candidate_id,
                "kategori": vote.kategori,
                "category_key": vote.category_key or vote.kategori,
                "created_at": vote.created_at,
            }
            for vote in votes
        ],
    }


def _normalize_vote_result_text(value: str | None):
    return (value or "").strip().lower()


def _get_vote_result_level(posisi: str | None):
    posisi_normalized = _normalize_vote_result_text(posisi)

    if "km" in posisi_normalized:
        return "km"

    if "fakultas" in posisi_normalized:
        return "fakultas"

    if "jurusan" in posisi_normalized:
        return "jurusan"

    if (
        "prodi" in posisi_normalized
        or "himpunan" in posisi_normalized
        or "hima" in posisi_normalized
    ):
        return "prodi"

    return "lainnya"


def _get_vote_result_category(level, posisi, prodi, jurusan, fakultas):
    if level == "km":
        return "KM"

    if level == "fakultas":
        return fakultas or "Fakultas"

    if level == "jurusan":
        return jurusan or "Jurusan"

    if level == "prodi":
        return prodi or "Prodi"

    return posisi or "Lainnya"


def get_vote_results(db: Session):
    results = (
        db.query(
            Candidate.id.label("candidate_id"),
            Candidate.nama.label("nama"),
            Candidate.posisi.label("posisi"),
            Candidate.prodi.label("prodi"),
            Candidate.jurusan.label("jurusan"),
            Candidate.fakultas.label("fakultas"),
            Candidate.status.label("status"),
            func.count(Vote.id).label("total_votes"),
        )
        .outerjoin(Vote, Vote.candidate_id == Candidate.id)
        .filter(Candidate.status == "approved")
        .group_by(
            Candidate.id,
            Candidate.nama,
            Candidate.posisi,
            Candidate.prodi,
            Candidate.jurusan,
            Candidate.fakultas,
            Candidate.status,
        )
        .all()
    )

    vote_results = []

    for row in results:
        level = _get_vote_result_level(row.posisi)
        category = _get_vote_result_category(
            level=level,
            posisi=row.posisi,
            prodi=row.prodi,
            jurusan=row.jurusan,
            fakultas=row.fakultas,
        )

        total_votes = int(row.total_votes or 0)

        vote_results.append(
            {
                "candidate_id": row.candidate_id,
                "nama": row.nama,
                "candidate_name": row.nama,
                "posisi": row.posisi,
                "prodi": row.prodi,
                "jurusan": row.jurusan,
                "fakultas": row.fakultas,
                "status": row.status,
                "level": level,
                "category": category,
                "category_name": category,
                "total_votes": total_votes,
                "votes": total_votes,
            }
        )

    return vote_results