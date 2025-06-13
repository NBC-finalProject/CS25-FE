# 멀티 스테이지 빌드
# 1단계: 빌드 스테이지
FROM node:20-alpine AS builder

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (빌드에 필요한 devDependencies 포함)
RUN npm ci

# 소스 코드 복사
COPY . .

# build-time ARG 정의
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Vite로 빌드
RUN echo "VITE_API_URL=$VITE_API_URL"
RUN npm run build

# 2단계: 프로덕션 스테이지
FROM nginx:alpine

# 기본 nginx 설정 제거
RUN rm /etc/nginx/conf.d/default.conf

# nginx 템플릿 복사
COPY nginx.conf.template /etc/nginx/templates/

# 빌드된 정적 파일 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 포트 80 노출
EXPOSE 80

# nginx 실행
CMD ["nginx", "-g", "daemon off;"]