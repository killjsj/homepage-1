# Go 代码规范

> 本页面由 AI 生成，并已经过人工修改和审核。

<!-- Reviewers: RhenCloud, wyf9 -->

本文档用于统一 Go 项目的代码风格、工具链和提交流程，降低协作成本并提升可维护性。

## 目标

- 可读性优先，遵循 Go 官方惯例。
- 自动化优先，尽量通过工具而不是人工争论风格问题。
- 本地与 CI 使用同一套检查标准。

## 推荐工具链

- Go: `1.24+`
- 格式化: `gofmt`（基准） + `gofumpt`（更严格）
- import 排序: `gci`
- 静态检查聚合: `golangci-lint`
- 重点规则: `staticcheck`、`govet`、`errcheck`、`ineffassign`
- 漏洞扫描: `govulncheck`
- 测试: `go test`（可选 `gotestsum` 提升输出可读性）
- 提交前钩子: `lefthook`

## 目录与命名建议

- 包名使用简短小写单词，例如 `service`、`handler`。
- 文件名使用小写加下划线，例如 `user_service.go`。
- 导出符号使用 `PascalCase`，非导出符号使用 `camelCase`。
- 接口命名优先行为语义，例如 `Reader`、`UserStore`。

## 语言级约束

- 错误必须显式处理，禁止吞错。
- 优先返回具体错误并用 `fmt.Errorf("...: %w", err)` 包装上下文。
- 不要滥用 `panic`，仅用于不可恢复的初始化失败。
- 避免不必要的指针与共享可变状态，默认值语义优先。
- 上下文传递使用 `context.Context` 且放在参数第一位。

## 格式化与静态检查

统一流程建议为：`gofmt -> gofumpt -> gci -> golangci-lint`。

### 常用命令

```bash
gofmt -w .
gofumpt -w .
gci write .
golangci-lint run ./...
go test ./...
govulncheck ./...
```

- `gofmt` 是格式化基准，不应与其冲突。
- `gofumpt` 在 `gofmt` 兼容基础上增加更严格约束。
- `gci` 统一 import 分组与排序。

## go.mod 建议

- 使用明确 Go 版本，例如 `go 1.24`。
- 依赖版本固定在可复现状态，升级通过 PR 单独进行。
- 禁止手工编辑 `go.sum` 中与本次变更无关的大量噪声。

## .golangci.yml 示例

```yaml
run:
  timeout: 5m

linters:
  enable:
    - errcheck
    - govet
    - ineffassign
    - staticcheck
    - unused
    - revive

linters-settings:
  revive:
    rules:
      - name: var-naming
      - name: exported
      - name: package-comments

issues:
  max-issues-per-linter: 0
  max-same-issues: 0
```

## 测试规范

- 测试框架默认使用 Go 标准测试。
- 测试文件命名：`*_test.go`。
- 一个测试只验证一个主要行为。
- 回归修复必须补充测试。

常用命令：

```bash
go test ./...
go test -race ./...
go test -cover ./...
```

## 提交前检查流程

建议在本地执行以下顺序：

```bash
gofmt -w .
gofumpt -w .
gci write .
golangci-lint run ./...
go test ./...
govulncheck ./...
```

## Makefile 示例

```makefile
.PHONY: fmt lint test vuln check

fmt:
	gofmt -w .
	gofumpt -w .
	gci write .

lint:
	golangci-lint run ./...

test:
	go test ./...

vuln:
	govulncheck ./...

check: lint test vuln
```

## 例外与扩展

- 历史项目可先落地 `gofmt + golangci-lint + go test`，再逐步引入 `gofumpt`、`gci` 与 `govulncheck`。
- 对自动生成代码目录（如 `generated`）可在 lint 中排除，但必须在配置中明确声明。
- 对性能敏感模块可放宽个别规则，但必须在 PR 中说明理由与影响范围。
