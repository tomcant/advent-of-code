DOCKER := docker run --rm -it -v $(PWD):/aoc:rw,delegated -w /aoc rust:1.51.0-alpine3.13

solve/%:
	@$(DOCKER) cargo run --quiet --manifest-path solutions/$*/Cargo.toml

.PHONY: shell
shell:
	@$(DOCKER) sh
