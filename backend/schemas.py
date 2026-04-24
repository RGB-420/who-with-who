from pydantic import BaseModel


class PersonCreate(BaseModel):
    name: str
    position_x: float = 0
    position_y: float = 0

class PersonResponse(BaseModel):
    id: int
    name: str
    position_x: float
    position_y: float

    class Config:
        from_attributes = True

class Position(BaseModel):
    x: float
    y: float

class RelationCreate(BaseModel):
    person1_id: int
    person2_id: int
    relation_type: str | None = None


class RelationResponse(BaseModel):
    id: int
    person1_id: int
    person2_id: int
    relation_type: str | None = None

    class Config:
        from_attributes = True