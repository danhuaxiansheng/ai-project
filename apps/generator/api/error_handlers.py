from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse


async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.status_code, "message": exc.detail, "success": False},
    )


# 在 main.py 中注册错误处理器
app.add_exception_handler(HTTPException, http_exception_handler)
