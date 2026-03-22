from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    secret_key: str = "dev-secret-key-change-in-prod"
    database_url: str = "sqlite:///./last_chapter.db"
    uploads_dir: str = "uploads"
    auth0_domain: str = ""
    auth0_client_id: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
