# 모여방 포팅메뉴얼

# 1. 개요

---

## 1-1. 프로젝트 개요

- 모임 통장과 여행을 한 번에 해결할 수 있도록 사용자가 구글 맵 기반으로 여행 계획을 세울 수 있게 합니다.
- 여행 중 남은 돈은 개인에게 자동으로 환불되며, 여행 계획 수립 시 예산 예측 기능을 제공합니다.

## 1-2. 개발 환경

### Backend

- Java : Oracle Open JDK 17
- Spring Boot : 3.3.3
- JPA : Hibernate-core-6.5.2
- DB : MySQL, H2, ElasticSearch

### Frontend

- React : 18.3.1
- TypeScript : 5.5.3
- Axios : 1.7.7
- Emotion : 11.13.3
- Tanstack Router : 1.56.1
- React Query : 5.55.0

## 1-3. 프로젝트 사용 도구

- 이슈 / 형상 관리 : Gitlab
- 코드 리뷰 : Gitlab
- CI / CD : Jenkins
- Design : Figma
- 커뮤니케이션, 일정 관리 : Notion, Jira

## 1-4. 외부 API

- Naver CLOVA OCR
- Kakao OAuth
- Google OAuth
- Google Map API
- SSAFY 금융망 API

# 2. 설정 파일

---

## 2-1. Backend

### 2-1-1. application.yml

```yaml
spring:
  profiles:
    default: local
  config:
    import: classpath:secret/application-secret.yml

  datasource:
    url: jdbc:h2:mem:~/MoYeoBangApplication
    username: sa
    password:

  jpa:
    hibernate:
      ddl-auto: none
    properties:
      hibernate:
        default_batch_fetch_size: 100

  batch:
    job:
      enabled: false
    jdbc:
      initialize-schema: always

  data:
    redis:
      host: 127.0.0.1
      port: 6379

  elasticsearch:
    uris: localhost:9200

cloud:
  aws:
    credentials:
      accessKey: AKIAVVZON63HMZBYSHXO
      secretKey: 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
    s3:
      bucket: moyeobang-ssafy

pg:
  api:
    url: http://localhost:8082/pg/payment

---
spring:
  config:
    activate:
      on-profile: local

  jpa:
    hibernate:
      ddl-auto: create
    show-sql: true
    properties:
      hibernate:
        format_sql: true
    defer-datasource-initialization: true

  batch:
    job:
      enabled: false
    jdbc:
      initialize-schema: always

  h2:
    console:
      enabled: true

---
spring:
  config:
    activate:
      on-profile: test

  jpa:
    hibernate:
      ddl-auto: create
    show-sql: true
    properties:
      hibernate:
        format_sql: true

  sql:
    init:
      mode: never

---
spring:
  config:
    activate:
      on-profile: deploy

  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

  datasource:
    url: jdbc:mysql://j11c102.p.ssafy.io:3306/moyeobang?serverTimezone=UTC&characterEncoding=UTF-8
    username: c102
    password: 123456789

  batch:
    job:
      enabled: false
    jdbc:
      initialize-schema: always

  elasticsearch:
    uris: http://j11c102.p.ssafy.io:9200

  jpa:
    hibernate:
      ddl-auto: none

logging:
  level:
    root: info

pg:
  api:
    url: https://j11c102.p.ssafy.io/pg/payment
```

### 2-1-2. application-secret.yml

```yaml
spring:
  jwt:
    secret: rlagnsalsrhkmoyeobang
    issuer: moyeobang

  security:
    oauth2:
      client:
        registration:
          kakao:
            client-id: ${client-kakao-id}
            client-secret: ${client-kakao-secret}
            redirect-uri: ${client-kakao-id}
            authorization-grant-type: authorization_code
            client-authentication-method: client_secret_post
            scope:
              - profile_nickname
              - profile_image
              - account_email
          google:
            client-name: google
            client-id: ${client-google-id}
            client-secret: ${client-google-secret}
            redirect-uri: https://j11c102.p.ssafy.io/api/login/oauth2/code/google
            authorization-grant-type: authorization_code
            scope:
              - profile
              - email
        provider:
          kakao:
            authorization-uri: https://kauth.kakao.com/oauth/authorize
            token-uri: https://kauth.kakao.com/oauth/token
            user-info-uri: https://kapi.kakao.com/v2/user/me
            user-name-attribute: id
```

## 2-2. Frontend

- 루트 디렉토리내에서 `npm install` 후 `npm run build`를 통해 `/dist` 폴더에 만들어지는 `index.js` 파일을 통해 확인 및 배포 가능
- .env 설정 후 배포
- `npm run dev` 를 통해 개발 서버를 실행

### 2-2-1. vite.config.ts —Vite의 설정 파일

```jsx
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // emotion 설정
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    // TanStack 설정
    TanStackRouterVite(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // @를 src로 설정
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // 확장자 인식
  },
  server: {
    // TODO : 배포 후 https: false 로 변경!
    // https: {
    //   key: fs.readFileSync('key.pem'),
    //   cert: fs.readFileSync('cert.pem'),
    // },
    proxy: {
      '/api': {
        target: 'https://vu6tvl2vzm.apigw.ntruss.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
        secure: false, // HTTPS 검증 비활성화
      },
    },
  },
});

```

### 2-2-2. tsconfig.json  —TypeScript 설정 파일

```jsx
{
  "compilerOptions": {
    "baseUrl": "./src", // 경로 기본 설정
    "paths": {
      "@/*": ["*"]
    }, // 경로 별칭 설정
    "typeRoots": [
      "./node_modules/@types",
      "./src/@types",
      "@emotion/react/types/css-prop"
    ], // 타입 루트 경로 설정
    "jsx": "react-jsx", // JSX 처리
    "jsxImportSource": "@emotion/react", // Emotion에서 JSX 처리
    "target": "ES2020", // ES2020 타겟
    "useDefineForClassFields": true, // 클래스 필드 사용 설정
    "lib": ["ES2020", "DOM", "DOM.Iterable"], // 라이브러리 설정
    "module": "ESNext", // ESNext 모듈 시스템 설정
    "skipLibCheck": false, // 모든 타입 정의 파일 검사
    "esModuleInterop": true, // ESModule과 CommonJS 호환성 끔
    "moduleResolution": "Node", // Node 방식의 모듈 해석
    "allowSyntheticDefaultImports": true, // 기본 import 허용
    "allowImportingTsExtensions": true, // .ts 확장자 import 허용
    "isolatedModules": true, // 각 모듈을 독립적으로 처리
    "moduleDetection": "force", // 강제 모듈 탐지
    "noEmit": true, // 컴파일 후 파일을 출력하지 않음
    "outDir": "./dist", // 출력 디렉토리 설정
    "resolveJsonModule": true,

    /* Linting 설정 */
    "strict": true, // 엄격한 타입 체크
    "noUnusedLocals": false, // 사용하지 않는 로컬 변수를 허용하지 않음
    "noUnusedParameters": false, // 사용하지 않는 파라미터를 허용하지 않음
    "noFallthroughCasesInSwitch": true // Switch 문에서 fallthrough 허용하지 않음
  },
  "include": ["src"], // 포함 경로 설정
  "exclude": ["node_modules", "dist"] // 제외 경로 설정
}

```

### 2-2-3. package.json

```jsx
{
  "name": "moyeobang",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "preview": "vite preview"
  },
  "dependencies": {
    "@babel/preset-react": "^7.24.7",
    "@emotion/babel-preset-css-prop": "^11.12.0",
    "@googlemaps/react-wrapper": "^1.1.42",
    "@react-google-maps/api": "^2.19.3",
    "@tanstack/react-query": "^5.55.0",
    "@tanstack/react-query-devtools": "^5.55.0",
    "@tanstack/react-router": "^1.56.1",
    "@types/google.maps": "^3.58.1",
    "@vitejs/plugin-react": "^4.3.1",
    "axios": "^1.7.7",
    "browser-image-compression": "^2.0.2",
    "chart.js": "^4.4.4",
    "chartjs-plugin-datalabels": "^2.2.0",
    "date-fns": "^3.6.0",
    "dayjs": "^1.11.13",
    "event-source-polyfill": "^1.0.31",
    "firebase": "^10.13.2",
    "fs": "^0.0.1-security",
    "js-confetti": "^0.12.0",
    "js-cookie": "^3.0.5",
    "lodash": "^4.17.21",
    "openai": "^4.61.0",
    "qr-scanner": "^1.4.2",
    "qrcode.react": "^4.0.1",
    "react": "^18.3.1",
    "react-beautiful-dnd": "^13.1.1",
    "react-chartjs-2": "^5.2.0",
    "react-datepicker": "^7.3.0",
    "react-dom": "^18.3.1",
    "react-modal": "^3.16.1",
    "react-qr-code": "^2.0.15",
    "react-spring": "^9.7.4",
    "react-swipeable": "^7.0.1",
    "react-webcam": "^7.2.0",
    "recharts": "^2.12.7",
    "uuid": "^10.0.0",
    "zustand": "^4.5.5"
  },
  "devDependencies": {
    "@emotion/babel-plugin": "^11.12.0",
    "@emotion/eslint-plugin": "^11.12.0",
    "@emotion/react": "^11.13.3",
    "@emotion/styled": "^11.13.0",
    "@eslint/js": "^9.10.0",
    "@tanstack/eslint-plugin-query": "^5.53.0",
    "@tanstack/router-devtools": "^1.56.3",
    "@tanstack/router-plugin": "^1.56.2",
    "@tanstack/router-vite-plugin": "^1.56.2",
    "@types/event-source-polyfill": "^1.0.5",
    "@types/lodash": "^4.17.10",
    "@types/react": "^18.3.5",
    "@types/react-beautiful-dnd": "^13.1.8",
    "@types/react-dom": "^18.3.0",
    "@types/supercluster": "^7.1.3",
    "@types/uuid": "^10.0.0",
    "@typescript-eslint/eslint-plugin": "^8.4.0",
    "@typescript-eslint/parser": "^8.4.0",
    "eslint": "^8.57.0",
    "eslint-config-airbnb": "^19.0.4",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-import": "^2.30.0",
    "eslint-plugin-jsx-a11y": "^6.10.0",
    "eslint-plugin-prettier": "^5.2.1",
    "eslint-plugin-react": "^7.35.2",
    "eslint-plugin-react-hooks": "^4.6.2",
    "globals": "^15.9.0",
    "prettier": "^3.3.3",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.4.0",
    "vite": "^5.4.1"
  }
}

```

### 2-2-4. .eslintrc.json

```jsx
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended", // 기본 ESLint 추천 규칙
    "plugin:@typescript-eslint/recommended", // TypeScript 추천 규칙
    "plugin:react/recommended", // React 추천 규칙
    "plugin:prettier/recommended" // Prettier와 통합
  ],
  "parser": "@typescript-eslint/parser", // TypeScript 파서 사용
  "parserOptions": {
    "ecmaVersion": "latest", // 최신 ECMAScript 문법 사용
    "sourceType": "module", // ES 모듈 사용
    "ecmaFeatures": {
      "jsx": true // JSX 지원 (React)
    },
    "project": "./tsconfig.json" // TypeScript 설정 파일 경로
  },
  "plugins": [
    "react", // React 관련 ESLint 규칙
    "@typescript-eslint", // TypeScript 관련 ESLint 규칙
    "prettier", // Prettier 통합
    "@emotion", // Emotion 플러그인 추가
    "@tanstack/query"
  ],
  "rules": {
    // css 오류 무시
    "no-unused-vars": ["off"],
    "react/no-unknown-property": ["error", {"ignore": ["css"]}],
    "prettier/prettier": "error", // Prettier 규칙 위반 시 오류 표시
    "react/react-in-jsx-scope": "off", // React 17+에서는 React import 필요 없음
    "react/jsx-uses-react": "off", // React 17+에서 불필요한 경고 방지
    "react/prop-types": "off", // TypeScript 사용 시 PropTypes 사용 안 함
    "@typescript-eslint/no-unused-vars": ["error"], // 사용되지 않는 변수 오류
    "import/prefer-default-export": "off", // 기본 export 대신 named export 허용
    "no-console": "warn", // console.log 사용 시 경고
    "no-use-before-define": "off", // 정의 전에 변수 사용 허용
    "@typescript-eslint/no-use-before-define": ["error"], // 정의 전에 변수 사용 금지
    "@emotion/pkg-renaming": "error", // Emotion 패키지 이름 규칙 위반 시 오류
    "@tanstack/query/exhaustive-deps": "error",
    "@tanstack/query/no-deprecated-options": "error",
    "@tanstack/query/prefer-query-object-syntax": "error",
    "@tanstack/query/stable-query-client": "error",
  },
  "settings": {
    "react": {
      "version": "detect" // 설치된 React 버전을 자동으로 감지
    }
  }
}
```

### 2-2-5. .prettierrc.js

```jsx
export default {
  arrowParens: "avoid",
  bracketSpacing: false,
  endOfLine: "auto",
  printWidth: 80,
  quoteProps: "as-needed",
  trailingComma: "es5",
  semi: true,
  singleQuote: true,
  tabWidth: 2,
};

```

# 3. 배포

---

## 3-1. 준비 사항

- `/home/ubuntu` 에서 `demo/pg/backend` 와 `demo/van/backend` 서버를 실행시킵니다.
- `docker`를 이용하여 `MySQL`과 `ElasticSearch`를 실행합니다.

### 3-1-1. Docker-Compose.yml

- `Docker-compose`를 이용하여 SSL 인증서와 `ngnix`를 실행합니다.

```yaml
version: '3'
services:
  nginx:
    container_name: nginx
    image: nginx:latest
    volumes:
      - ./conf/nginx.conf:/etc/nginx/nginx.conf
      - ./data/dist:/usr/share/nginx/html
      - ./data/certbot/conf:/etc/letsencrypt
      - ./data/certbot/www:/var/www/certbot
    ports:
      - 80:80
      - 443:443
    command: "/bin/sh -c 'while :; do sleep 6h & wait $${!}; nginx -s reload; done & nginx -g \"daemon off;\"'"

  certbot:
    image: certbot/certbot
    volumes:
      - ./data/certbot/conf:/etc/letsencrypt
      - ./data/certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

### 3-1-2. Jenkins Pipeline (Backend)

```yaml
pipeline {
    agent any
    
    tools {
        jdk 'jdk17'
    }
    
    stages {
        
        stage('Git Clone'){
            steps {
                git branch: 'backend', credentialsId: 'GITLAB_USER', url: 'https://lab.ssafy.com/s11-fintech-finance-sub1/S11P21C102.git'
            }
            post {
                failure {
                  echo 'Repository clone failure !'
                }
                success {
                  echo 'Repository clone success !'
                }
            }
        }
        
        stage('Insert FCM Config File') {
            steps {
                script {
                    // 디렉토리 생성
                    sh 'mkdir -p ./backend/src/main/resources/firebase'
            
                    // 파일 복사
                    sh 'cp /moyeobang-d1dec-firebase-adminsdk-6uakm-bf0a8d2044.json ./backend/src/main/resources/firebase/moyeobang-d1dec-firebase-adminsdk-6uakm-bf0a8d2044.json'
            
                    echo 'File has been inserted successfully!'
                }
            }
        }

        stage('Build') {
            steps {
                // 프로젝트 권한 변경
                sh 'chmod +x ./backend/gradlew'
                
                // 프로젝트 빌드
                sh 'cd ./backend && ./gradlew build --exclude-task test'
            }
        }
        
        stage('Docker Hub Login'){
            steps{
                withCredentials([usernamePassword(credentialsId: 'DOCKER_USER', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh 'echo "$DOCKER_PASSWORD" | docker login -u $DOCKER_USERNAME --password-stdin'
                }
            }
        }
        
        stage('Docker Build and Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'DOCKER_REPO', passwordVariable: 'DOCKER_PROJECT', usernameVariable: 'DOCKER_REPO')]) {
                    sh 'cd ./backend && docker build -f Dockerfile -t $DOCKER_REPO/$DOCKER_PROJECT .'
                    sh 'cd ./backend && docker push $DOCKER_REPO/$DOCKER_PROJECT'
                    echo 'docker push Success!!'
                }
                echo 'docker push Success!!'
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // SSH 명령어를 사용할 때 문제가 발생할 수 있으니, `sshagent`를 사용하여 SSH 명령어 실행
                    sshagent(credentials: ['SSH-CREDENTIALS']) {
                        withCredentials([usernamePassword(credentialsId: 'DOCKER_REPO', passwordVariable: 'DOCKER_PROJECT', usernameVariable: 'DOCKER_REPO')]) {
                            // SSH 접속을 테스트하고 필요한 경우 SSH 접속을 시도하는 명령어
                            sh 'ssh -o StrictHostKeyChecking=no ubuntu@j11c102.p.ssafy.io "echo SSH connection successful"'
                        
                            sh 'ssh -o StrictHostKeyChecking=no ubuntu@j11c102.p.ssafy.io "sudo docker rm -f backend"'
                            // 도커 컨테이너 실행
                            sh """
                                ssh -o StrictHostKeyChecking=no ubuntu@j11c102.p.ssafy.io \\
                                'sudo docker pull $DOCKER_REPO/$DOCKER_PROJECT && \\
                                sudo docker run -d \\
                                    --name backend \\
                                    -p 8080:8080 \\
                                    $DOCKER_REPO/$DOCKER_PROJECT'
                            """
                        
                            // 사용하지 않는 Docker Image 정리
                            sh 'docker image prune -f'
                        }
                    }
                }
            }
        }
    }
}

```

### 3-1-3. Jenkins Pipeline (Frontend)

```yaml
pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS_22'
    }
    
    stages {
        
        stage('Git Clone'){
            steps {
                git branch: 'frontend', credentialsId: 'GITLAB_USER', url: 'https://lab.ssafy.com/s11-fintech-finance-sub1/S11P21C102.git'
            }
            post {
                failure {
                  echo 'Repository clone failure !'
                }
                success {
                  echo 'Repository clone success !'
                }
            }
        }

        stage('Build') {
            steps {
                // React 애플리케이션 빌드
                sh 'cd ./frontend/moyeobang && npm install'
                sh 'cd ./frontend/moyeobang && npm run build'
            }
        }
        
        stage('Clean Target Directory') {
            steps {
                script {
                    sshagent(credentials: ['SSH-CREDENTIALS']) {
                        // 기존 파일들 삭제
                        sh 'ssh -o StrictHostKeyChecking=no ubuntu@j11c102.p.ssafy.io "rm -rf /home/ubuntu/compose/data/dist/*"'
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    sshagent(credentials: ['SSH-CREDENTIALS']) {
                        // 빌드된 파일을 서버로 전송
                        sh """
                        rsync -avz -e "ssh -o StrictHostKeyChecking=no" ./frontend/moyeobang/dist/ ubuntu@j11c102.p.ssafy.io:/home/ubuntu/compose/data/dist/
                        """
                    }
                }
            }
        }
        
        stage('Reload Nginx') {
            steps {
                script {
                    sshagent(credentials: ['SSH-CREDENTIALS']) {
                        // Nginx 재시작
                        sh 'ssh -o StrictHostKeyChecking=no ubuntu@j11c102.p.ssafy.io "cd /home/ubuntu/compose/ && sudo docker compose restart"'
                    }
                }
            }
        }
    }
}

```

### 3-1-4. Nginx 설정

```yaml
events {
    worker_connections  1024;
}

http {

    include /etc/nginx/mime.types;

    server {
        listen 80;

        server_name j11c102.p.ssafy.io;

	location / {
    	    root /usr/share/nginx/html;
	    index index.html;
	    try_files $uri $uri/ /index.html;
	}

        location /.well-known/acme-challenge/ {
            allow all;
            root /var/www/certbot;
        }
    }

    server {
        listen 443 ssl;

        server_name j11c102.p.ssafy.io;

        ssl_certificate /etc/letsencrypt/live/j11c102.p.ssafy.io/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/j11c102.p.ssafy.io/privkey.pem;
        include /etc/letsencrypt/options-ssl-nginx.conf;
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

	client_max_body_size 10M;

	location / {
	    proxy_pass http://j11c102.p.ssafy.io:80;
	    proxy_set_header    Host                $http_host;
            proxy_set_header    X-Real-IP           $remote_addr;
            proxy_set_header    X-Forwarded-For     $proxy_add_x_forwarded_for;
	}

        location /api {
            proxy_pass  http://j11c102.p.ssafy.io:8080;
            proxy_set_header    Host                $http_host;
            proxy_set_header    X-Real-IP           $remote_addr;
            proxy_set_header    X-Forwarded-For     $proxy_add_x_forwarded_for;

	    # SSE
	    proxy_buffering off;
	    proxy_cache off;

	    proxy_read_timeout 300s;
	    proxy_send_timeout 300s;

        }

        location /van {
            proxy_pass  http://j11c102.p.ssafy.io:8081;
            proxy_set_header    Host                $http_host;
            proxy_set_header    X-Real-IP           $remote_addr;
            proxy_set_header    X-Forwarded-For     $proxy_add_x_forwarded_for;

            # SSE
	    proxy_buffering off;
            proxy_cache off;

	    proxy_read_timeout 300s;
	    proxy_send_timeout 300s;
	}

        location /pg {
            proxy_pass  http://j11c102.p.ssafy.io:8082;
            proxy_set_header    Host                $http_host;
            proxy_set_header    X-Real-IP           $remote_addr;
            proxy_set_header    X-Forwarded-For     $proxy_add_x_forwarded_for;

            # SSE
            proxy_buffering off;
            proxy_cache off;

            proxy_read_timeout 300s;
            proxy_send_timeout 300s;
        }
    }
}
```

- `/home/ubuntu/compose/conf` 에 위 파일을 위치시키고 `docker-compose.yml` 을 실행시킵니다.