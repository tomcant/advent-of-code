IMAGE = ghcr.io/astral-sh/uv:debian-slim
DOCKER = docker run --rm -w /app -v $(PWD):/app:rw,delegated -v $(PWD)/.uv/root-cache:/root/.cache -v $(PWD)/.uv/root-local:/root/.local
PYTHON = $(DOCKER) -it $(IMAGE) uv run --python 3.14 --with z3-solver

solve/%/test:
	@$(PYTHON) solve.py $* test.txt

solve/%:
	@$(PYTHON) solve.py $* input.txt

.PHONY: format
format:
	@$(DOCKER) $(IMAGE) uv format --preview-features format -- ./solutions

.PHONY: shell
shell:
	@$(DOCKER) -it $(IMAGE) sh
