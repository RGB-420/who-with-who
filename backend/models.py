from sqlalchemy import Column, ForeignKey, Float, Integer, String, UniqueConstraint

from database import Base


class Person(Base):
    __tablename__ = "persons"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    position_x = Column(Float, default=0)
    position_y = Column(Float, default=0)

class Relation(Base):
    __tablename__ = "relations"

    id = Column(Integer, primary_key=True, index=True)

    person1_id = Column(Integer, ForeignKey("persons.id"), nullable=False)
    person2_id = Column(Integer, ForeignKey("persons.id"), nullable=False)

    relation_type = Column(String, nullable=True)

    __table_args__ = (
        UniqueConstraint("person1_id", "person2_id", name="unique_relation"),
    )