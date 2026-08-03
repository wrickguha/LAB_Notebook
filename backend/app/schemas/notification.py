from pydantic import BaseModel

class NotificationResponse(BaseModel):
    id: str
    message: str
    type: str
    read: bool
    timestamp: str

    class Config:
        from_attributes = True
