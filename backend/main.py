from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from database import Base, SessionLocal, engine
from models import Person, Relation
from schemas import (
    PersonCreate,
    PersonResponse,
    RelationCreate,
    RelationResponse,
    Position
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="People Relations API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "People relations API running"}


@app.get("/persons", response_model=list[PersonResponse])
def get_persons(db: Session = Depends(get_db)):
    return db.query(Person).all()


@app.post("/persons", response_model=PersonResponse)
def create_person(person: PersonCreate, db: Session = Depends(get_db)):
    new_person = Person(
        name=person.name,
        position_x=person.position_x,
        position_y=person.position_y,
    )

    db.add(new_person)
    db.commit()
    db.refresh(new_person)

    return new_person

@app.put("/persons/{id}", response_model=PersonResponse)
def update_person(id: int, person: PersonCreate, db: Session = Depends(get_db)):
    db_person = db.query(Person).filter(Person.id == id).first()

    if not db_person:
        raise HTTPException(status_code=404, detail="Person not found")

    db_person.name = person.name

    db.commit()
    db.refresh(db_person)

    return db_person

@app.delete("/persons/{id}")
def delete_person(id: int, db: Session = Depends(get_db)):
    person = db.query(Person).filter(Person.id == id).first()

    if not person:
        raise HTTPException(status_code=404, detail="Person not found")

    db.query(Relation).filter(
        (Relation.person1_id == id) | (Relation.person2_id == id)
    ).delete(synchronize_session=False)

    db.delete(person)
    db.commit()

    return {"ok": True}

@app.put("/persons/{id}/position")
def update_position(id: int, position: Position, db: Session = Depends(get_db)):
    person = db.query(Person).filter(Person.id == id).first()

    if not person:
        raise HTTPException(status_code=404, detail="Person not found")

    person.position_x = position.x
    person.position_y = position.y

    db.commit()

    return {"ok": True}

@app.get("/relations", response_model=list[RelationResponse])
def get_relations(db: Session = Depends(get_db)):
    return db.query(Relation).all()


@app.post("/relations", response_model=RelationResponse)
def create_relation(relation: RelationCreate, db: Session = Depends(get_db)):
    if relation.person1_id == relation.person2_id:
        raise HTTPException(
            status_code=400,
            detail="A person cannot be related to themselves",
        )

    person1_id = min(relation.person1_id, relation.person2_id)
    person2_id = max(relation.person1_id, relation.person2_id)

    person1 = db.query(Person).filter(Person.id == person1_id).first()
    person2 = db.query(Person).filter(Person.id == person2_id).first()

    if not person1 or not person2:
        raise HTTPException(
            status_code=404,
            detail="One or both persons do not exist",
        )

    existing_relation = (
        db.query(Relation)
        .filter(
            Relation.person1_id == person1_id,
            Relation.person2_id == person2_id,
        )
        .first()
    )

    if existing_relation:
        raise HTTPException(
            status_code=400,
            detail="Relation already exists",
        )

    new_relation = Relation(
        person1_id=person1_id,
        person2_id=person2_id,
        relation_type=relation.relation_type,
    )

    db.add(new_relation)
    db.commit()
    db.refresh(new_relation)

    return new_relation

@app.delete("/relations/{id}")
def delete_relation(id: int, db: Session = Depends(get_db)):
    relation = db.query(Relation).filter(Relation.id == id).first()

    if not relation:
        raise HTTPException(status_code=404, detail="Relation not found")

    db.delete(relation)
    db.commit()

    return {"ok": True}