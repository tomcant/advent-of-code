IMAGE = node:24-alpine
DOCKER = docker run --rm -v $(PWD):/app:rw,delegated -w /app
NODE = $(DOCKER) $(IMAGE) node

solve/%:
	@$(NODE) solve.js $*

.PHONY: shell
shell:
	@$(DOCKER) -it $(IMAGE) sh
