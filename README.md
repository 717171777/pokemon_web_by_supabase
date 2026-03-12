# Supabase MCP Server Configuration

이 저장소는 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)를 사용하여 Supabase 프로젝트와 AI 어시스턴트(Gemini Code Assist 등)를 연결하기 위한 설정을 담고 있습니다.

## 프로젝트 개요

이 설정은 `@supabase/mcp-server-supabase` 패키지를 `npx`로 실행하여, 지정된 Supabase 프로젝트의 데이터베이스 및 기능을 MCP 도구로 사용할 수 있게 합니다.

## 주요 설정 정보

- **MCP 서버 패키지**: `@supabase/mcp-server-supabase@latest`
- **대상 Supabase 프로젝트 ID**: `lomhzndxsbbdthecpjan`

## 설정 파일 구조

MCP 서버 설정은 `.gemini/settings.json` 파일에 정의되어 있습니다.

```json
{
    "mcpServers": {
        "supabase": {
            "command": "npx",
            "args": [
                "-y",
                "@supabase/mcp-server-supabase@latest",
                "--project-ref=lomhzndxsbbdthecpjan"
            ],
            "env": {
                "SUPABASE_ACCESS_TOKEN": "..."
            }
        }
    }
}
```

## 보안 및 주의사항

`.gemini/settings.json` 파일에는 민감한 **Supabase Access Token**이 포함되어 있습니다. 따라서 `.gitignore` 파일을 통해 `.gemini/` 폴더가 Git 버전에 포함되지 않도록 설정되어 있습니다.
