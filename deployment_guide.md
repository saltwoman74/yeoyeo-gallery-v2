# YEOYEO Gallery Deployment & Optimization Guide

이 가이드는 현재 개발된 앱을 **최적화**하고, **GitHub에 저장**하며, **AWS S3 서버에 연결**하는 과정을 쉽고 순서대로 설명합니다.

---

## 1. 앱 최적화 (Optimization)

앱을 더 빠르고 부드럽게 만들기 위한 최적화 작업을 이미 적용 중입니다. 확인 및 추가할 사항은 다음과 같습니다.

### ✅ 이미지 최적화 (Lazy Loading)
- 갤러리 로딩 속도를 위해 화면에 보이지 않는 이미지는 나중에 로딩하는 기술을 적용해야 합니다.
- **적용 방법**: `src/components/gallery/PhotoGrid.jsx`에서 `loading="lazy"` 속성이 이미지 태그에 있는지 확인하세요. (이미 적용되어 있습니다)

### ✅ 코드 분할 (Code Splitting)
- 초기 로딩 속도를 줄이기 위해 페이지별로 코드를 나눕니다.
- **적용 방법**: `src/App.jsx`에서 `React.lazy`를 사용하여 페이지를 불러옵니다.

### ✅ PWA 설정 (모바일 앱처럼 만들기)
- 스마트폰 홈 화면에 추가했을 때 앱처럼 보이게 하는 설정입니다.
- **적용 방법**: `vite.config.js`에 PWA 플러그인이 잘 설정되어 있는지 확인합니다.

---

## 2. GitHub에 저장하기 (Backup)

현재 코드를 안전하게 저장하고 관리하기 위해 GitHub를 사용합니다.

**1단계: GitHub 저장소 만들기**
1. [GitHub](https://github.com)에 로그인합니다.
2. 우측 상단 `+` 버튼 -> **New repository** 클릭.
3. 저장소 이름(예: `yeoyeo-gallery`) 입력 후 **Create repository** 클릭.
4. 생성된 주소(예: `https://github.com/username/yeoyeo-gallery.git`) 복사.

**2단계: 내 컴퓨터에서 업로드**
터미널(명령 프롬프트)에 다음 명령어를 순서대로 입력하세요.

```bash
# 1. 깃 시작하기
git init

# 2. 모든 파일 담기
git add .

# 3. 설명 적어서 포장하기
git commit -m "First commit: Luxury Gallery App"

# 4. 내 저장소 연결하기 (주소는 본인 것으로 바꿔주세요!)
git remote add origin https://github.com/username/yeoyeo-gallery.git

# 5. 밀어 올리기
git push -u origin main
```

---

## 3. AWS S3 서버 연결하기 (Storage)

사진과 영상을 영구적으로 저장하기 위해 AWS S3(아마존 클라우드)를 연결합니다.

**1단계: AWS S3 버킷 만들기**
1. [AWS 콘솔](https://aws.amazon.com/console) 로그인 -> **S3** 검색.
2. **버킷 만들기** 클릭.
3. 버킷 이름 입력 (예: `yeoyeo-gallery-storage`).
4. **"모든 퍼블릭 액세스 차단"** 체크 해제 (이미지를 웹에서 봐야 하므로).
5. **버킷 만들기** 완료.

**2단계: 권한 설정 (CORS)**
1. 생성된 버킷 클릭 -> **권한(Permissions)** 탭.
2. 하단 **CORS(Cross-origin resource sharing)** 편집.
3. 아래 내용 붙여넣기:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": []
    }
]
```

**3단계: 키 발급 받기 (IAM)**
1. AWS 콘솔에서 **IAM** 검색.
2. **사용자** -> **사용자 생성**.
3. 이름 입력 -> **직접 정책 연결** -> **AmazonS3FullAccess** 검색 후 체크.
4. 사용자 생성 완료 후 해당 사용자 클릭 -> **보안 자격 증명** 탭.
5. **액세스 키 만들기** -> **AWS 외부에서 실행되는 애플리케이션** 선택.
6. **Access Key**와 **Secret Key**를 복사해둡니다. (비밀키는 다시 볼 수 없으니 꼭 적어두세요!)

**4단계: 앱에 키 연결하기**
프로젝트 폴더 최상단에 `.env` 파일을 만들고 아래 내용을 채워넣으세요.

```env
VITE_AWS_REGION=ap-northeast-2
VITE_AWS_ACCESS_KEY_ID=여기에_액세스키_붙여넣기
VITE_AWS_SECRET_ACCESS_KEY=여기에_시크릿키_붙여넣기
VITE_AWS_BUCKET_NAME=버킷이름 (예: yeoyeo-gallery-storage)
```

---

## 4. 최종 마무리

이제 앱은 실제 서버와 연결되어 사진을 업로드하고 삭제할 수 있게 됩니다.
모든 설정이 끝나면 터미널에서 `npm run build`를 통해 배포용 파일을 만들 수 있습니다.
