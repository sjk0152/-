# 유선 자문단 건의함 배포 가이드 (Vercel + Supabase)

## 1) Supabase 테이블 생성

Supabase SQL Editor에서 아래 SQL을 실행하세요.

```sql
create table if not exists public.suggestions (
  id bigint generated always as identity primary key,
  category text not null,
  content text not null,
  compare_content text not null,
  areas text,
  created_at timestamptz not null default now()
);
```

## 2) Vercel 프로젝트 연결

1. 이 폴더를 GitHub에 업로드
2. Vercel에서 `New Project` -> 해당 GitHub repo 선택
3. Framework Preset은 `Other` 그대로 배포

## 3) Vercel 환경변수 설정

Vercel Project Settings -> Environment Variables

- `SUPABASE_URL` = `https://<프로젝트레퍼런스>.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = Supabase `service_role` 키
- `ADMIN_PASSWORD` = `1234` (원하면 변경)
- `ADMIN_SESSION_TOKEN` = 임의 긴 문자열 (예: 랜덤 32자)

변수 저장 후 `Redeploy` 하세요.

## 4) 사용 URL

- 사용자 건의 페이지: `https://<배포도메인>/`
- 관리자 페이지: `https://<배포도메인>/admin`

## 5) 관리자 기능

- 비밀번호로 로그인
- 목록 조회
- `엑셀 추출(CSV)` 버튼으로 다운로드

## 보안 주의

- 운영 전 `ADMIN_PASSWORD`는 반드시 복잡한 값으로 변경하세요.
- `SUPABASE_SERVICE_ROLE_KEY`는 절대 프론트 코드에 직접 넣지 마세요.
