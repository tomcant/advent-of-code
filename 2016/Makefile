YARN = docker run --rm -it -v $(PWD):/app:rw,delegated -w /app node:15.5.0-alpine3.10 yarn

.PHONY: install
install:
	$(YARN) install --immutable

.PHONY: solve/%
solve/%:
	@$(YARN) --silent solve $*
