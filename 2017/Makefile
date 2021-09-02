DOCKER := docker run --rm -it -v $(PWD):/aoc:rw,delegated -w /aoc rust:1.54.0-alpine3.14

solve/%:
	@$(DOCKER) cargo run --release --quiet --manifest-path solutions/$*/Cargo.toml

.PHONY: shell
shell:
	@$(DOCKER) sh
