DEFAULT_TARGET := help
.PHONY: help
help: ## Show this help info
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make <target>\n\nTargets:\n"} \
		/^[a-zA-Z_-]+:.*##/ { printf "  %-18s %s\n", $$1, $$2 } \
		/^##@/ { printf "\n%s\n", substr($$0, 4) }' $(MAKEFILE_LIST)

bootstrap: ## Install dependencies
	npm install

build: ## Build all workspaces
	npm run build -ws --if-present

clean: ## Remove node_modules and build artifacts
	rm -rf node_modules
	npm run clean -ws --if-present || true
	find packages -type d -name dist -prune -exec rm -rf {} +

test: ## Run tests in all workspaces
	npm run test -ws --if-present

lint: ## Lint all workspaces
	npm run lint -ws --if-present
