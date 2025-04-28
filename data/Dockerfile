# model/Dockerfile

FROM python:3.10-slim


# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN apt-get update && apt-get install -y git libjpeg-dev zlib1g-dev libfreetype6-dev liblcms2-dev libopenjpeg-dev
RUN pip install --no-cache-dir --default-timeout=100 -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt


# Copy source code
COPY . .

# Expose FastAPI default port
EXPOSE 8000

# Start FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
